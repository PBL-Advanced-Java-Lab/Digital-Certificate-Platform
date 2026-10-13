package com.digitalcertificate.dto;

import com.digitalcertificate.entity.FraudAlert;
import com.digitalcertificate.entity.VerificationLog;

import java.util.List;

public class AnalyticsOverviewResponse {

    private long totalCertificatesIssued;
    private long activeCertificates;
    private long revokedCertificates;
    private long totalVerifications;
    private long verifiedCount;
    private long revokedScanCount;
    private long invalidNotFoundCount;
    private long activeFraudAlerts;
    private double successRate;
    private List<FraudAlert> recentAlerts;
    private List<VerificationLog> recentLogs;

    public AnalyticsOverviewResponse() {
    }

    public long getTotalCertificatesIssued() {
        return totalCertificatesIssued;
    }

    public void setTotalCertificatesIssued(long totalCertificatesIssued) {
        this.totalCertificatesIssued = totalCertificatesIssued;
    }

    public long getActiveCertificates() {
        return activeCertificates;
    }

    public void setActiveCertificates(long activeCertificates) {
        this.activeCertificates = activeCertificates;
    }

    public long getRevokedCertificates() {
        return revokedCertificates;
    }

    public void setRevokedCertificates(long revokedCertificates) {
        this.revokedCertificates = revokedCertificates;
    }

    public long getTotalVerifications() {
        return totalVerifications;
    }

    public void setTotalVerifications(long totalVerifications) {
        this.totalVerifications = totalVerifications;
    }

    public long getVerifiedCount() {
        return verifiedCount;
    }

    public void setVerifiedCount(long verifiedCount) {
        this.verifiedCount = verifiedCount;
    }

    public long getRevokedScanCount() {
        return revokedScanCount;
    }

    public void setRevokedScanCount(long revokedScanCount) {
        this.revokedScanCount = revokedScanCount;
    }

    public long getInvalidNotFoundCount() {
        return invalidNotFoundCount;
    }

    public void setInvalidNotFoundCount(long invalidNotFoundCount) {
        this.invalidNotFoundCount = invalidNotFoundCount;
    }

    public long getActiveFraudAlerts() {
        return activeFraudAlerts;
    }

    public void setActiveFraudAlerts(long activeFraudAlerts) {
        this.activeFraudAlerts = activeFraudAlerts;
    }

    public double getSuccessRate() {
        return successRate;
    }

    public void setSuccessRate(double successRate) {
        this.successRate = successRate;
    }

    public List<FraudAlert> getRecentAlerts() {
        return recentAlerts;
    }

    public void setRecentAlerts(List<FraudAlert> recentAlerts) {
        this.recentAlerts = recentAlerts;
    }

    public List<VerificationLog> getRecentLogs() {
        return recentLogs;
    }

    public void setRecentLogs(List<VerificationLog> recentLogs) {
        this.recentLogs = recentLogs;
    }
}
