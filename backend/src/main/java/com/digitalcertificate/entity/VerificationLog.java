package com.digitalcertificate.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "verification_logs")
public class VerificationLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String certificateId;

    @Column(nullable = false)
    private String verificationStatus; // VERIFIED, REVOKED, EXPIRED, NOT_FOUND, TAMPERED

    private String clientIp;

    @Column(length = 500)
    private String userAgent;

    @Column(nullable = false)
    private boolean successful;

    @Column(nullable = false)
    private LocalDateTime timestamp;

    public VerificationLog() {
        this.timestamp = LocalDateTime.now();
    }

    public VerificationLog(String certificateId, String verificationStatus, String clientIp, String userAgent, boolean successful) {
        this.certificateId = certificateId;
        this.verificationStatus = verificationStatus;
        this.clientIp = clientIp;
        this.userAgent = userAgent;
        this.successful = successful;
        this.timestamp = LocalDateTime.now();
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

    public String getVerificationStatus() {
        return verificationStatus;
    }

    public void setVerificationStatus(String verificationStatus) {
        this.verificationStatus = verificationStatus;
    }

    public String getClientIp() {
        return clientIp;
    }

    public void setClientIp(String clientIp) {
        this.clientIp = clientIp;
    }

    public String getUserAgent() {
        return userAgent;
    }

    public void setUserAgent(String userAgent) {
        this.userAgent = userAgent;
    }

    public boolean isSuccessful() {
        return successful;
    }

    public void setSuccessful(boolean successful) {
        this.successful = successful;
    }

    public LocalDateTime getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(LocalDateTime timestamp) {
        this.timestamp = timestamp;
    }
}
