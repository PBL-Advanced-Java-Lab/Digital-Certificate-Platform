package com.digitalcertificate.entity;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface FraudAlertRepository extends JpaRepository<FraudAlert, Long> {

    List<FraudAlert> findByOrderByCreatedAtDesc();

    List<FraudAlert> findTop20ByResolvedFalseOrderByCreatedAtDesc();

    long countByResolvedFalse();
}
