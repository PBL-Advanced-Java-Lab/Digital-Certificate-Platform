package com.digitalcertificate.entity;

import org.springframework.data.jpa.repository.JpaRepository;
import java.time.LocalDateTime;
import java.util.List;

public interface VerificationLogRepository extends JpaRepository<VerificationLog, Long> {

    List<VerificationLog> findTop50ByOrderByTimestampDesc();

    long countByVerificationStatus(String verificationStatus);

    long countByTimestampAfter(LocalDateTime after);

    long countByCertificateIdAndTimestampAfter(String certificateId, LocalDateTime after);

    long countByClientIpAndTimestampAfter(String clientIp, LocalDateTime after);
}
