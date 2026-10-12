package com.digitalcertificate.service;

import com.digitalcertificate.dto.IssuerRegistrationRequest;
import com.digitalcertificate.dto.IssuerResponse;
import com.digitalcertificate.entity.Issuer;
import com.digitalcertificate.entity.IssuerRepository;
import com.digitalcertificate.entity.IssuerStatus;
import com.digitalcertificate.entity.Role;
import com.digitalcertificate.entity.RoleRepository;
import com.digitalcertificate.entity.User;
import com.digitalcertificate.entity.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@Transactional
public class IssuerService {

    private final IssuerRepository issuerRepository;
    private final UserRepository userRepository;
    private final RoleRepository roleRepository;

    public IssuerService(
            IssuerRepository issuerRepository,
            UserRepository userRepository,
            RoleRepository roleRepository
    ) {
        this.issuerRepository = issuerRepository;
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
    }

    public IssuerResponse registerIssuerForUser(IssuerRegistrationRequest request, String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new IllegalArgumentException("User not found with email: " + userEmail));

        Issuer issuer = registerIssuer(
                request.getOrganizationName().trim(),
                request.getRegistrationNumber().trim(),
                request.getContactEmail().trim().toLowerCase(),
                request.getAddress() != null ? request.getAddress().trim() : null,
                user
        );

        return new IssuerResponse(issuer);
    }

    public Issuer registerIssuer(
            String organizationName,
            String registrationNumber,
            String contactEmail,
            String address,
            User user) {

        if (issuerRepository.findByRegistrationNumber(registrationNumber).isPresent()) {
            throw new IllegalArgumentException(
                    "An issuer with this registration number already exists."
            );
        }

        if (issuerRepository.findByUserId(user.getId()).isPresent()) {
            throw new IllegalArgumentException(
                    "This user already has an issuer profile."
            );
        }

        Issuer issuer = new Issuer();
        issuer.setOrganizationName(organizationName);
        issuer.setRegistrationNumber(registrationNumber);
        issuer.setContactEmail(contactEmail);
        issuer.setAddress(address);
        issuer.setUser(user);
        issuer.setStatus(IssuerStatus.PENDING);

        return issuerRepository.save(issuer);
    }

    @Transactional(readOnly = true)
    public List<IssuerResponse> getAllIssuers() {
        return issuerRepository.findAll().stream()
                .map(IssuerResponse::new)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public Optional<IssuerResponse> getIssuerById(Long id) {
        return issuerRepository.findById(id).map(IssuerResponse::new);
    }

    @Transactional(readOnly = true)
    public List<IssuerResponse> getIssuersByStatus(IssuerStatus status) {
        return issuerRepository.findByStatus(status).stream()
                .map(IssuerResponse::new)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public Optional<IssuerResponse> getIssuerByUserId(Long userId) {
        return issuerRepository.findByUserId(userId).map(IssuerResponse::new);
    }

    @Transactional(readOnly = true)
    public Optional<IssuerResponse> getIssuerByUserEmail(String email) {
        User user = userRepository.findByEmail(email).orElse(null);
        if (user == null) {
            return Optional.empty();
        }
        return issuerRepository.findByUserId(user.getId()).map(IssuerResponse::new);
    }

    public IssuerResponse approveIssuer(Long id) {
        Issuer issuer = issuerRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Issuer not found with ID: " + id));

        issuer.setStatus(IssuerStatus.APPROVED);

        User user = issuer.getUser();
        Role issuerRole = roleRepository.findByName("VERIFIED_ISSUER")
                .orElseGet(() -> roleRepository.save(new Role("VERIFIED_ISSUER", "Can issue and manage authorized certificates")));

        user.getRoles().add(issuerRole);
        userRepository.save(user);

        Issuer saved = issuerRepository.save(issuer);
        return new IssuerResponse(saved);
    }

    public IssuerResponse rejectIssuer(Long id) {
        Issuer issuer = issuerRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Issuer not found with ID: " + id));

        issuer.setStatus(IssuerStatus.REJECTED);
        Issuer saved = issuerRepository.save(issuer);
        return new IssuerResponse(saved);
    }
}
