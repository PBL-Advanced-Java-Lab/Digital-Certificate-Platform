package com.digitalcertificate.entity;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface CertificateRepository extends JpaRepository<Certificate, Long> {

    Optional<Certificate> findByCertificateId(String certificateId);

    List<Certificate> findByIssuerIdOrderByCreatedAtDesc(Long issuerId);

    List<Certificate> findByRecipientEmailIgnoreCaseOrderByCreatedAtDesc(String recipientEmail);

    List<Certificate> findAllByOrderByCreatedAtDesc();

    boolean existsByCertificateId(String certificateId);
}
