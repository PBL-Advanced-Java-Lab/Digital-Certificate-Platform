package com.digitalcertificate.entity;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface CertificateTypeRepository extends JpaRepository<CertificateType, Long> {

    Optional<CertificateType> findByCode(String code);

    List<CertificateType> findByActiveTrue();

    boolean existsByCode(String code);
}
