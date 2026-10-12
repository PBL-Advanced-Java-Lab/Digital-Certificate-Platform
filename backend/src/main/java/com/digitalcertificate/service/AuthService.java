package com.digitalcertificate.service;

import com.digitalcertificate.dto.AuthResponse;
import com.digitalcertificate.dto.LoginRequest;
import com.digitalcertificate.dto.RegisterRequest;
import com.digitalcertificate.dto.UserProfileResponse;
import com.digitalcertificate.entity.Role;
import com.digitalcertificate.entity.RoleRepository;
import com.digitalcertificate.entity.User;
import com.digitalcertificate.entity.UserRepository;
import com.digitalcertificate.security.CustomUserDetails;
import com.digitalcertificate.security.JwtService;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@Transactional
public class AuthService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    public AuthService(
            UserRepository userRepository,
            RoleRepository roleRepository,
            PasswordEncoder passwordEncoder,
            JwtService jwtService,
            AuthenticationManager authenticationManager
    ) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
        this.authenticationManager = authenticationManager;
    }

    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException("An account with email " + request.getEmail() + " already exists.");
        }

        User user = new User();
        user.setFullName(request.getFullName().trim());
        user.setEmail(request.getEmail().trim().toLowerCase());
        user.setPasswordHash(passwordEncoder.encode(request.getPassword()));
        user.setActive(true);

        Role defaultRole = roleRepository.findByName("CERTIFICATE_HOLDER")
                .orElseGet(() -> roleRepository.save(new Role("CERTIFICATE_HOLDER", "Default role for certificate recipients and holders")));
        user.getRoles().add(defaultRole);

        User savedUser = userRepository.save(user);

        CustomUserDetails userDetails = new CustomUserDetails(savedUser);
        Map<String, Object> extraClaims = buildClaims(savedUser);
        String token = jwtService.generateToken(userDetails, extraClaims);

        Set<String> roleNames = savedUser.getRoles().stream()
                .map(Role::getName)
                .collect(Collectors.toSet());

        return new AuthResponse(token, savedUser.getId(), savedUser.getFullName(), savedUser.getEmail(), roleNames);
    }

    public AuthResponse login(LoginRequest request) {
        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            request.getEmail().trim().toLowerCase(),
                            request.getPassword()
                    )
            );
        } catch (BadCredentialsException ex) {
            throw new BadCredentialsException("Invalid email or password.");
        }

        User user = userRepository.findByEmail(request.getEmail().trim().toLowerCase())
                .orElseThrow(() -> new IllegalArgumentException("User not found with email: " + request.getEmail()));

        if (!user.isActive()) {
            throw new IllegalStateException("Your account has been deactivated. Please contact support.");
        }

        CustomUserDetails userDetails = new CustomUserDetails(user);
        Map<String, Object> extraClaims = buildClaims(user);
        String token = jwtService.generateToken(userDetails, extraClaims);

        Set<String> roleNames = user.getRoles().stream()
                .map(Role::getName)
                .collect(Collectors.toSet());

        return new AuthResponse(token, user.getId(), user.getFullName(), user.getEmail(), roleNames);
    }

    @Transactional(readOnly = true)
    public UserProfileResponse getProfile(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("User not found with email: " + email));

        Set<String> roleNames = user.getRoles().stream()
                .map(Role::getName)
                .collect(Collectors.toSet());

        return new UserProfileResponse(
                user.getId(),
                user.getFullName(),
                user.getEmail(),
                roleNames,
                user.isActive(),
                user.getCreatedAt()
        );
    }

    private Map<String, Object> buildClaims(User user) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("userId", user.getId());
        claims.put("fullName", user.getFullName());
        claims.put("roles", user.getRoles().stream().map(Role::getName).collect(Collectors.toList()));
        return claims;
    }
}
