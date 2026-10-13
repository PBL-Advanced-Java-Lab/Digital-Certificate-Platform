package com.digitalcertificate.controller;

import com.digitalcertificate.dto.PublicVerificationResponse;
import com.digitalcertificate.exception.ResourceNotFoundException;
import com.digitalcertificate.service.CertificateService;
import com.digitalcertificate.service.FraudDetectionService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/public")
public class PublicVerificationController {

    private final CertificateService certificateService;
    private final FraudDetectionService fraudDetectionService;

    public PublicVerificationController(
            CertificateService certificateService,
            FraudDetectionService fraudDetectionService
    ) {
        this.certificateService = certificateService;
        this.fraudDetectionService = fraudDetectionService;
    }

    @GetMapping("/verify/{certificateId}")
    public ResponseEntity<PublicVerificationResponse> verifyCertificate(
            @PathVariable String certificateId,
            HttpServletRequest request
    ) {
        String clientIp = extractClientIp(request);
        String userAgent = request.getHeader("User-Agent");

        try {
            PublicVerificationResponse response = certificateService.verifyCertificatePublic(certificateId);
            fraudDetectionService.logAndAnalyze(certificateId, response.getVerificationStatus(), clientIp, userAgent);
            return ResponseEntity.ok(response);
        } catch (ResourceNotFoundException e) {
            fraudDetectionService.logAndAnalyze(certificateId, "NOT_FOUND", clientIp, userAgent);
            throw e;
        } catch (Exception e) {
            fraudDetectionService.logAndAnalyze(certificateId, "ERROR", clientIp, userAgent);
            throw e;
        }
    }

    private String extractClientIp(HttpServletRequest request) {
        String xf = request.getHeader("X-Forwarded-For");
        if (xf != null && !xf.isBlank()) {
            return xf.split(",")[0].trim();
        }
        return request.getRemoteAddr();
    }
}
