package com.digitalcertificate.controller;

import com.digitalcertificate.dto.CertificateTypeRequest;
import com.digitalcertificate.dto.CertificateTypeResponse;
import com.digitalcertificate.service.CertificateTypeService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/certificate-types")
public class CertificateTypeController {

    private final CertificateTypeService certificateTypeService;

    public CertificateTypeController(CertificateTypeService certificateTypeService) {
        this.certificateTypeService = certificateTypeService;
    }

    @GetMapping
    public ResponseEntity<List<CertificateTypeResponse>> getActiveCertificateTypes() {
        return ResponseEntity.ok(certificateTypeService.getActiveTypes());
    }

    @GetMapping("/all")
    @PreAuthorize("hasRole('SYSTEM_ADMIN')")
    public ResponseEntity<List<CertificateTypeResponse>> getAllCertificateTypes() {
        return ResponseEntity.ok(certificateTypeService.getAllTypes());
    }

    @GetMapping("/{id}")
    public ResponseEntity<CertificateTypeResponse> getCertificateTypeById(@PathVariable Long id) {
        return ResponseEntity.ok(certificateTypeService.getTypeById(id));
    }

    @PostMapping
    @PreAuthorize("hasRole('SYSTEM_ADMIN')")
    public ResponseEntity<CertificateTypeResponse> createCertificateType(
            @Valid @RequestBody CertificateTypeRequest request
    ) {
        CertificateTypeResponse response = certificateTypeService.createType(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }
}
