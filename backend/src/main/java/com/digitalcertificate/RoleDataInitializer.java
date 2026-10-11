
package com.digitalcertificate;

import com.digitalcertificate.entity.Role;
import com.digitalcertificate.entity.RoleRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class RoleDataInitializer {

    @Bean
    CommandLineRunner initializeRoles(RoleRepository roleRepository) {
        return args -> {
            addRoleIfMissing(
                roleRepository,
                "SYSTEM_ADMIN",
                "Manages the platform and its users"
            );

            addRoleIfMissing(
                roleRepository,
                "VERIFIED_ISSUER",
                "Can issue and manage authorized certificates"
            );

            addRoleIfMissing(
                roleRepository,
                "CERTIFICATE_HOLDER",
                "Can access and manage their certificates"
            );

            System.out.println("Initial roles verified successfully.");
        };
    }

    private void addRoleIfMissing(
            RoleRepository repository,
            String name,
            String description) {

        if (repository.findByName(name).isEmpty()) {
            repository.save(new Role(name, description));
            System.out.println("Created role: " + name);
        }
    }
}
