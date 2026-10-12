
package com.digitalcertificate.entity;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface IssuerRepository extends JpaRepository<Issuer, Long> {

    Optional<Issuer> findByRegistrationNumber(String registrationNumber);

    List<Issuer> findByStatus(IssuerStatus status);

    Optional<Issuer> findByUserId(Long userId);
}
