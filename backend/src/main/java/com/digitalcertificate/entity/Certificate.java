package com.digitalcertificate.entity;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(
    name = "certificates",
    uniqueConstraints = {
        @UniqueConstraint(name = "uk_certificate_id", columnNames = "certificate_id")
    }
)
public class Certificate {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "certificate_id", nullable = false, length = 64)
    private String certificateId;

    @Column(nullable = false, length = 150)
    private String recipientName;

    @Column(nullable = false, length = 150)
    private String recipientEmail;

    @Column(nullable = false, length = 200)
    private String courseOrTitle;

    @ManyToOne(fetch = FetchType.EAGER, optional = false)
    @JoinColumn(name = "certificate_type_id", nullable = false)
    private CertificateType certificateType;

    @ManyToOne(fetch = FetchType.EAGER, optional = false)
    @JoinColumn(name = "issuer_id", nullable = false)
    private Issuer issuer;

    @Column(nullable = false)
    private LocalDate issueDate;

    private LocalDate expiryDate;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private CertificateStatus status = CertificateStatus.ACTIVE;

    @Column(nullable = false, length = 64)
    private String sha256Hash;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String digitalSignature;

    @Column(length = 500)
    private String revocationReason;

    private LocalDateTime revokedAt;

    @Column(columnDefinition = "TEXT")
    private String qrCodeBase64;

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        if (issueDate == null) {
            issueDate = LocalDate.now();
        }
        if (status == null) {
            status = CertificateStatus.ACTIVE;
        }
    }

    public Certificate() {
    }

    public Long getId() {
        return id;
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

    public String getRecipientEmail() {
        return recipientEmail;
    }

    public void setRecipientEmail(String recipientEmail) {
        this.recipientEmail = recipientEmail;
    }

    public String getCourseOrTitle() {
        return courseOrTitle;
    }

    public void setCourseOrTitle(String courseOrTitle) {
        this.courseOrTitle = courseOrTitle;
    }

    public CertificateType getCertificateType() {
        return certificateType;
    }

    public void setCertificateType(CertificateType certificateType) {
        this.certificateType = certificateType;
    }

    public Issuer getIssuer() {
        return issuer;
    }

    public void setIssuer(Issuer issuer) {
        this.issuer = issuer;
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

    public String getQrCodeBase64() {
        return qrCodeBase64;
    }

    public void setQrCodeBase64(String qrCodeBase64) {
        this.qrCodeBase64 = qrCodeBase64;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
}
