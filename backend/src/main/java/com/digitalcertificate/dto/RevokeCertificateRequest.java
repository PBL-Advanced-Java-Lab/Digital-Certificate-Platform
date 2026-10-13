package com.digitalcertificate.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class RevokeCertificateRequest {

    @NotBlank(message = "Revocation reason is required")
    @Size(max = 500, message = "Reason cannot exceed 500 characters")
    private String reason;

    public RevokeCertificateRequest() {
    }

    public RevokeCertificateRequest(String reason) {
        this.reason = reason;
    }

    public String getReason() {
        return reason;
    }

    public void setReason(String reason) {
        this.reason = reason;
    }
}
