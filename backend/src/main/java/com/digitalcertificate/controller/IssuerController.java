package com.digitalcertificate.controller;

import com.digitalcertificate.dto.IssuerRegistrationRequest;
import com.digitalcertificate.dto.IssuerResponse;
import com.digitalcertificate.entity.IssuerStatus;
import com.digitalcertificate.service.IssuerService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/issuers")
public class IssuerController {

    private final IssuerService issuerService;

    public IssuerController(IssuerService issuerService) {
        this.issuerService = issuerService;
    }

    @PostMapping("/register")
    public ResponseEntity<IssuerResponse> registerIssuer(
            @Valid @RequestBody IssuerRegistrationRequest request,
            Authentication authentication
    ) {
        IssuerResponse response = issuerService.registerIssuerForUser(request, authentication.getName());
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/my-profile")
    public ResponseEntity<IssuerResponse> getMyIssuerProfile(Authentication authentication) {
        return issuerService.getIssuerByUserEmail(authentication.getName())
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND).build());
    }

    @GetMapping("/directory")
    public ResponseEntity<List<IssuerResponse>> getApprovedIssuerDirectory() {
        List<IssuerResponse> issuers = issuerService.getIssuersByStatus(IssuerStatus.APPROVED);
        return ResponseEntity.ok(issuers);
    }

    @GetMapping
    @PreAuthorize("hasRole('SYSTEM_ADMIN')")
    public ResponseEntity<List<IssuerResponse>> getAllIssuers(
            @RequestParam(required = false) IssuerStatus status
    ) {
        List<IssuerResponse> issuers = (status != null)
                ? issuerService.getIssuersByStatus(status)
                : issuerService.getAllIssuers();
        return ResponseEntity.ok(issuers);
    }

    @GetMapping("/{id}")
    public ResponseEntity<IssuerResponse> getIssuerById(@PathVariable Long id) {
        return issuerService.getIssuerById(id)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND).build());
    }

    @PutMapping("/{id}/approve")
    @PreAuthorize("hasRole('SYSTEM_ADMIN')")
    public ResponseEntity<IssuerResponse> approveIssuer(@PathVariable Long id) {
        IssuerResponse response = issuerService.approveIssuer(id);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{id}/reject")
    @PreAuthorize("hasRole('SYSTEM_ADMIN')")
    public ResponseEntity<IssuerResponse> rejectIssuer(@PathVariable Long id) {
        IssuerResponse response = issuerService.rejectIssuer(id);
        return ResponseEntity.ok(response);
    }
}
