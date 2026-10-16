package com.digitalcertificate.dto;

import com.digitalcertificate.entity.Certificate;
import com.digitalcertificate.entity.CertificateStatus;

import java.time.LocalDate;
import java.time.LocalDateTime;

public class CertificateResponse {

    private Long id;
    private String certificateId;
    private String recipientName;
    private String recipientEmail;
    private String courseOrTitle;
    private Long certificateTypeId;
    private String certificateTypeName;
    private String certificateTypeCode;
    private Long issuerId;
    private String issuerOrganizationName;
    private String issuerRegistrationNumber;
    private LocalDate issueDate;
    private LocalDate expiryDate;
    private CertificateStatus status;
    private String sha256Hash;
    private String digitalSignature;
    private String qrCodeBase64;
    private String revocationReason;
    private LocalDateTime revokedAt;
    private LocalDateTime createdAt;

    public CertificateResponse() {
    }

    public CertificateResponse(Certificate certificate) {
        this.id = certificate.getId();
        this.certificateId = certificate.getCertificateId();
        this.recipientName = certificate.getRecipientName();
        this.recipientEmail = certificate.getRecipientEmail();
        this.courseOrTitle = certificate.getCourseOrTitle();
        if (certificate.getCertificateType() != null) {
            this.certificateTypeId = certificate.getCertificateType().getId();
            this.certificateTypeName = certificate.getCertificateType().getName();
            this.certificateTypeCode = certificate.getCertificateType().getCode();
        }
        if (certificate.getIssuer() != null) {
            this.issuerId = certificate.getIssuer().getId();
            this.issuerOrganizationName = certificate.getIssuer().getOrganizationName();
            this.issuerRegistrationNumber = certificate.getIssuer().getRegistrationNumber();
        }
        this.issueDate = certificate.getIssueDate();
        this.expiryDate = certificate.getExpiryDate();
        this.status = certificate.getStatus();
        this.sha256Hash = certificate.getSha256Hash();
        this.digitalSignature = certificate.getDigitalSignature();
        this.qrCodeBase64 = certificate.getQrCodeBase64();
        this.revocationReason = certificate.getRevocationReason();
        this.revokedAt = certificate.getRevokedAt();
        this.createdAt = certificate.getCreatedAt();
    }

    public Long getId() {
        return id;
    }

    public String getCertificateId() {
        return certificateId;
    }

    public String getRecipientName() {
        return recipientName;
    }

    public String getRecipientEmail() {
        return recipientEmail;
    }

    public String getCourseOrTitle() {
        return courseOrTitle;
    }

    public Long getCertificateTypeId() {
        return certificateTypeId;
    }

    public String getCertificateTypeName() {
        return certificateTypeName;
    }

    public String getCertificateTypeCode() {
        return certificateTypeCode;
    }

    public Long getIssuerId() {
        return issuerId;
    }

    public String getIssuerOrganizationName() {
        return issuerOrganizationName;
    }

    public String getIssuerRegistrationNumber() {
        return issuerRegistrationNumber;
    }

    public LocalDate getIssueDate() {
        return issueDate;
    }

    public LocalDate getExpiryDate() {
        return expiryDate;
    }

    public CertificateStatus getStatus() {
        return status;
    }

    public String getSha256Hash() {
        return sha256Hash;
    }

    public String getDigitalSignature() {
        return digitalSignature;
    }

    public String getQrCodeBase64() {
        return qrCodeBase64;
    }

    public String getRevocationReason() {
        return revocationReason;
    }

    public LocalDateTime getRevokedAt() {
        return revokedAt;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
}
