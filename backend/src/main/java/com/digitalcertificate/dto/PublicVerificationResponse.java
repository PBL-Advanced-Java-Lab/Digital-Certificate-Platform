package com.digitalcertificate.dto;

import com.digitalcertificate.entity.CertificateStatus;

import java.time.LocalDate;
import java.time.LocalDateTime;

public class PublicVerificationResponse {
    private String certificateId;
    private String recipientName;
    private String maskedRecipientEmail;
    private String courseOrTitle;
    private String certificateTypeName;
    private String certificateTypeCode;
    private String issuerOrganizationName;
    private String issuerRegistrationNumber;
    private String issuerPublicKey;
    private LocalDate issueDate;
    private LocalDate expiryDate;
    private CertificateStatus status;
    private String verificationStatus; // "VERIFIED", "EXPIRED", "REVOKED", "TAMPERED"
    private String sha256Hash;
    private String digitalSignature;
    private boolean signatureValid;
    private boolean hashValid;
    private String revocationReason;
    private LocalDateTime revokedAt;
    private LocalDateTime verifiedAt;

    public PublicVerificationResponse() {
    }

    public String getCertificateId() {
        return certificateId;
    }

    public void setCertificateId(String certificateId) {
        this.certificateId = certificateId;
    }

    public String getRecipientName() {
        return recipientName;
    }

    public void setRecipientName(String recipientName) {
        this.recipientName = recipientName;
    }

    public String getMaskedRecipientEmail() {
        return maskedRecipientEmail;
    }

    public void setMaskedRecipientEmail(String maskedRecipientEmail) {
        this.maskedRecipientEmail = maskedRecipientEmail;
    }

    public String getCourseOrTitle() {
        return courseOrTitle;
    }

    public void setCourseOrTitle(String courseOrTitle) {
        this.courseOrTitle = courseOrTitle;
    }

    public String getCertificateTypeName() {
        return certificateTypeName;
    }

    public void setCertificateTypeName(String certificateTypeName) {
        this.certificateTypeName = certificateTypeName;
    }

    public String getCertificateTypeCode() {
        return certificateTypeCode;
    }

    public void setCertificateTypeCode(String certificateTypeCode) {
        this.certificateTypeCode = certificateTypeCode;
    }

    public String getIssuerOrganizationName() {
        return issuerOrganizationName;
    }

    public void setIssuerOrganizationName(String issuerOrganizationName) {
        this.issuerOrganizationName = issuerOrganizationName;
    }

    public String getIssuerRegistrationNumber() {
        return issuerRegistrationNumber;
    }

    public void setIssuerRegistrationNumber(String issuerRegistrationNumber) {
        this.issuerRegistrationNumber = issuerRegistrationNumber;
    }

    public String getIssuerPublicKey() {
        return issuerPublicKey;
    }

    public void setIssuerPublicKey(String issuerPublicKey) {
        this.issuerPublicKey = issuerPublicKey;
    }

    public LocalDate getIssueDate() {
        return issueDate;
    }

    public void setIssueDate(LocalDate issueDate) {
        this.issueDate = issueDate;
    }

    public LocalDate getExpiryDate() {
        return expiryDate;
    }

    public void setExpiryDate(LocalDate expiryDate) {
        this.expiryDate = expiryDate;
    }

    public CertificateStatus getStatus() {
        return status;
    }

    public void setStatus(CertificateStatus status) {
        this.status = status;
    }

    public String getVerificationStatus() {
        return verificationStatus;
    }

    public void setVerificationStatus(String verificationStatus) {
        this.verificationStatus = verificationStatus;
    }

    public String getSha256Hash() {
        return sha256Hash;
    }

    public void setSha256Hash(String sha256Hash) {
        this.sha256Hash = sha256Hash;
    }

    public String getDigitalSignature() {
        return digitalSignature;
    }

    public void setDigitalSignature(String digitalSignature) {
        this.digitalSignature = digitalSignature;
    }

    public boolean isSignatureValid() {
        return signatureValid;
    }

    public void setSignatureValid(boolean signatureValid) {
        this.signatureValid = signatureValid;
    }

    public boolean isHashValid() {
        return hashValid;
    }

    public void setHashValid(boolean hashValid) {
        this.hashValid = hashValid;
    }

    public String getRevocationReason() {
        return revocationReason;
    }

    public void setRevocationReason(String revocationReason) {
        this.revocationReason = revocationReason;
    }

    public LocalDateTime getRevokedAt() {
        return revokedAt;
    }

    public void setRevokedAt(LocalDateTime revokedAt) {
        this.revokedAt = revokedAt;
    }

    public LocalDateTime getVerifiedAt() {
        return verifiedAt;
    }

    public void setVerifiedAt(LocalDateTime verifiedAt) {
        this.verifiedAt = verifiedAt;
    }
}
