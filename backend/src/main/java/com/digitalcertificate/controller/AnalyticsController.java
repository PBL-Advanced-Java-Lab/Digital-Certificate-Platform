package com.digitalcertificate.controller;

import com.digitalcertificate.dto.AnalyticsOverviewResponse;
import com.digitalcertificate.entity.*;
import com.digitalcertificate.service.FraudDetectionService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/analytics")
@PreAuthorize("hasRole('SYSTEM_ADMIN')")
public class AnalyticsController {

    private final CertificateRepository certificateRepository;
    private final VerificationLogRepository verificationLogRepository;
    private final FraudAlertRepository fraudAlertRepository;
    private final FraudDetectionService fraudDetectionService;

    public AnalyticsController(
            CertificateRepository certificateRepository,
            VerificationLogRepository verificationLogRepository,
            FraudAlertRepository fraudAlertRepository,
            FraudDetectionService fraudDetectionService
    ) {
        this.certificateRepository = certificateRepository;
        this.verificationLogRepository = verificationLogRepository;
        this.fraudAlertRepository = fraudAlertRepository;
        this.fraudDetectionService = fraudDetectionService;
    }

    @GetMapping("/overview")
    public ResponseEntity<AnalyticsOverviewResponse> getOverview() {
        AnalyticsOverviewResponse res = new AnalyticsOverviewResponse();

        long totalIssued = certificateRepository.count();
        long activeCount = certificateRepository.findAll().stream()
                .filter(c -> c.getStatus() == CertificateStatus.ACTIVE)
                .count();
        long revokedCount = certificateRepository.findAll().stream()
                .filter(c -> c.getStatus() == CertificateStatus.REVOKED)
                .count();

        long totalVerifications = verificationLogRepository.count();
        long verified = verificationLogRepository.countByVerificationStatus("VERIFIED");
        long revokedScans = verificationLogRepository.countByVerificationStatus("REVOKED");
        long notFoundScans = verificationLogRepository.countByVerificationStatus("NOT_FOUND");
        long activeAlerts = fraudAlertRepository.countByResolvedFalse();

        double successRate = totalVerifications > 0
                ? Math.round(((double) verified / totalVerifications) * 1000.0) / 10.0
                : 100.0;

        res.setTotalCertificatesIssued(totalIssued);
        res.setActiveCertificates(activeCount);
        res.setRevokedCertificates(revokedCount);
        res.setTotalVerifications(totalVerifications);
        res.setVerifiedCount(verified);
        res.setRevokedScanCount(revokedScans);
        res.setInvalidNotFoundCount(notFoundScans);
        res.setActiveFraudAlerts(activeAlerts);
        res.setSuccessRate(successRate);
        res.setRecentAlerts(fraudAlertRepository.findTop20ByResolvedFalseOrderByCreatedAtDesc());
        res.setRecentLogs(verificationLogRepository.findTop50ByOrderByTimestampDesc());

        return ResponseEntity.ok(res);
    }

    @GetMapping("/fraud-alerts")
    public ResponseEntity<List<FraudAlert>> getFraudAlerts(@RequestParam(required = false, defaultValue = "false") boolean unresolvedOnly) {
        List<FraudAlert> alerts = unresolvedOnly
                ? fraudAlertRepository.findTop20ByResolvedFalseOrderByCreatedAtDesc()
                : fraudAlertRepository.findByOrderByCreatedAtDesc();
        return ResponseEntity.ok(alerts);
    }

    @PutMapping("/fraud-alerts/{id}/resolve")
    public ResponseEntity<FraudAlert> resolveFraudAlert(@PathVariable Long id, Authentication authentication) {
        FraudAlert resolved = fraudDetectionService.resolveAlert(id, authentication.getName());
        return ResponseEntity.ok(resolved);
    }

    @GetMapping("/logs")
    public ResponseEntity<List<VerificationLog>> getVerificationLogs() {
        return ResponseEntity.ok(verificationLogRepository.findTop50ByOrderByTimestampDesc());
    }
}
