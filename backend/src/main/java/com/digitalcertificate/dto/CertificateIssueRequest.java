package com.digitalcertificate.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.time.LocalDate;

public class CertificateIssueRequest {

    @NotBlank(message = "Recipient name is required")
    @Size(max = 150, message = "Recipient name cannot exceed 150 characters")
    private String recipientName;

    @NotBlank(message = "Recipient email is required")
    @Email(message = "Valid recipient email is required")
    @Size(max = 150, message = "Recipient email cannot exceed 150 characters")
    private String recipientEmail;

    @NotBlank(message = "Course or degree title is required")
    @Size(max = 200, message = "Title cannot exceed 200 characters")
    private String courseOrTitle;

    @NotNull(message = "Certificate type ID is required")
    private Long certificateTypeId;

    private LocalDate expiryDate;

    public CertificateIssueRequest() {
    }

    public CertificateIssueRequest(String recipientName, String recipientEmail, String courseOrTitle, Long certificateTypeId, LocalDate expiryDate) {
        this.recipientName = recipientName;
        this.recipientEmail = recipientEmail;
        this.courseOrTitle = courseOrTitle;
        this.certificateTypeId = certificateTypeId;
        this.expiryDate = expiryDate;
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

    public Long getCertificateTypeId() {
        return certificateTypeId;
    }

    public void setCertificateTypeId(Long certificateTypeId) {
        this.certificateTypeId = certificateTypeId;
    }

    public LocalDate getExpiryDate() {
        return expiryDate;
    }

    public void setExpiryDate(LocalDate expiryDate) {
        this.expiryDate = expiryDate;
    }
}
