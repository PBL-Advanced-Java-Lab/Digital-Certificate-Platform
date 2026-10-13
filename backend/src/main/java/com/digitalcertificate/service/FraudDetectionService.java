package com.digitalcertificate.service;

import com.digitalcertificate.entity.FraudAlert;
import com.digitalcertificate.entity.FraudAlertRepository;
import com.digitalcertificate.entity.VerificationLog;
import com.digitalcertificate.entity.VerificationLogRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@Transactional
public class FraudDetectionService {

    private final VerificationLogRepository verificationLogRepository;
    private final FraudAlertRepository fraudAlertRepository;

    public FraudDetectionService(
            VerificationLogRepository verificationLogRepository,
            FraudAlertRepository fraudAlertRepository
    ) {
        this.verificationLogRepository = verificationLogRepository;
        this.fraudAlertRepository = fraudAlertRepository;
    }

    public VerificationLog logAndAnalyze(String certificateId, String status, String clientIp, String userAgent) {
        boolean isSuccess = "VERIFIED".equalsIgnoreCase(status);
        VerificationLog log = new VerificationLog(certificateId, status, clientIp, userAgent, isSuccess);
        VerificationLog savedLog = verificationLogRepository.save(log);

        // Run Rule-Based Anomaly Checks
        analyzeForAnomalies(certificateId, status, clientIp);

        return savedLog;
    }

    private void analyzeForAnomalies(String certificateId, String status, String clientIp) {
        LocalDateTime twoMinutesAgo = LocalDateTime.now().minusMinutes(2);
        LocalDateTime fiveMinutesAgo = LocalDateTime.now().minusMinutes(5);

        // Rule 1: Access of Revoked Certificate
        if ("REVOKED".equalsIgnoreCase(status)) {
            fraudAlertRepository.save(new FraudAlert(
                    "REVOKED_CERTIFICATE_ACCESSED",
                    "HIGH",
                    certificateId,
                    clientIp,
                    "Public lookup attempted on revoked certificate '" + certificateId + "'. Potential unauthorized credential usage."
            ));
        }

        // Rule 2: Signature or Canonical Digest Mismatch
        if ("TAMPERED".equalsIgnoreCase(status)) {
            fraudAlertRepository.save(new FraudAlert(
                    "SIGNATURE_MISMATCH_ATTEMPT",
                    "CRITICAL",
                    certificateId,
                    clientIp,
                    "Cryptographic signature mismatch on certificate '" + certificateId + "'. Potential document forgery or payload tampering."
            ));
        }

        // Rule 3: High-frequency scanning from single IP (Anti-scraping)
        if (clientIp != null && !clientIp.isBlank()) {
            long recentIpRequests = verificationLogRepository.countByClientIpAndTimestampAfter(clientIp, twoMinutesAgo);
            if (recentIpRequests >= 8) {
                fraudAlertRepository.save(new FraudAlert(
                        "RAPID_SCAN_DETECTED",
                        "MEDIUM",
                        certificateId,
                        clientIp,
                        "High frequency verification volume (" + recentIpRequests + " lookups in 2 minutes) from IP address " + clientIp + "."
                ));
            }
        }

        // Rule 4: Repeated invalid ID lookups (Enumeration attack)
        if ("NOT_FOUND".equalsIgnoreCase(status) && clientIp != null) {
            long recentLookups = verificationLogRepository.countByClientIpAndTimestampAfter(clientIp, fiveMinutesAgo);
            if (recentLookups >= 5) {
                fraudAlertRepository.save(new FraudAlert(
                        "INVALID_LOOKUP_SPIKE",
                        "HIGH",
                        certificateId,
                        clientIp,
                        "Repeated non-existent credential lookups from IP " + clientIp + ". Possible credential identifier guessing or enumeration."
                ));
            }
        }
    }

    public List<FraudAlert> getAllAlerts() {
        return fraudAlertRepository.findByOrderByCreatedAtDesc();
    }

    public List<FraudAlert> getUnresolvedAlerts() {
        return fraudAlertRepository.findTop20ByResolvedFalseOrderByCreatedAtDesc();
    }

    public FraudAlert resolveAlert(Long alertId, String adminEmail) {
        FraudAlert alert = fraudAlertRepository.findById(alertId)
                .orElseThrow(() -> new IllegalArgumentException("Fraud alert not found with ID: " + alertId));

        alert.setResolved(true);
        alert.setResolvedAt(LocalDateTime.now());
        alert.setResolvedBy(adminEmail);

        return fraudAlertRepository.save(alert);
    }
}
