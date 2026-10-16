package com.digitalcertificate.controller;

import com.digitalcertificate.dto.CertificateIssueRequest;
import com.digitalcertificate.dto.CertificateResponse;
import com.digitalcertificate.dto.RevokeCertificateRequest;
import com.digitalcertificate.service.CertificateService;
import jakarta.validation.Valid;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/certificates")
public class CertificateController {

    private final CertificateService certificateService;

    public CertificateController(CertificateService certificateService) {
        this.certificateService = certificateService;
    }

    @PostMapping("/issue")
    @PreAuthorize("hasRole('VERIFIED_ISSUER')")
    public ResponseEntity<CertificateResponse> issueCertificate(
            @Valid @RequestBody CertificateIssueRequest request,
            Authentication authentication
    ) {
        CertificateResponse response = certificateService.issueCertificate(request, authentication.getName());
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping
    public ResponseEntity<List<CertificateResponse>> getAllCertificates() {
        List<CertificateResponse> certificates = certificateService.getAllCertificates();
        return ResponseEntity.ok(certificates);
    }

    @GetMapping("/{certificateId}")
    public ResponseEntity<CertificateResponse> getCertificateById(@PathVariable String certificateId) {
        CertificateResponse response = certificateService.getCertificateById(certificateId);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{certificateId}/pdf")
    public ResponseEntity<byte[]> downloadCertificatePdf(@PathVariable String certificateId) {
        byte[] pdfBytes = certificateService.generateCertificatePdf(certificateId);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_PDF);
        headers.setContentDispositionFormData("inline", certificateId + ".pdf");
        headers.setContentLength(pdfBytes.length);

        return new ResponseEntity<>(pdfBytes, headers, HttpStatus.OK);
    }

    @PutMapping("/{certificateId}/revoke")
    @PreAuthorize("hasAnyRole('VERIFIED_ISSUER', 'SYSTEM_ADMIN')")
    public ResponseEntity<CertificateResponse> revokeCertificate(
            @PathVariable String certificateId,
            @Valid @RequestBody RevokeCertificateRequest request,
            Authentication authentication
    ) {
        boolean isAdmin = authentication.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_SYSTEM_ADMIN") || a.getAuthority().equals("SYSTEM_ADMIN"));

        CertificateResponse response = certificateService.revokeCertificate(
                certificateId,
                request.getReason(),
                authentication.getName(),
                isAdmin
        );
        return ResponseEntity.ok(response);
    }

    @GetMapping("/my-issued")
    @PreAuthorize("hasRole('VERIFIED_ISSUER')")
    public ResponseEntity<List<CertificateResponse>> getMyIssuedCertificates(Authentication authentication) {
        List<CertificateResponse> certificates = certificateService.getCertificatesByIssuer(authentication.getName());
        return ResponseEntity.ok(certificates);
    }

    @GetMapping("/my-received")
    public ResponseEntity<List<CertificateResponse>> getMyReceivedCertificates(Authentication authentication) {
        List<CertificateResponse> certificates = certificateService.getCertificatesByRecipient(authentication.getName());
        return ResponseEntity.ok(certificates);
    }
}
