package com.digitalcertificate.dto;

import com.digitalcertificate.entity.Issuer;
import com.digitalcertificate.entity.IssuerStatus;

import java.time.LocalDateTime;

public class IssuerResponse {

    private Long id;
    private String organizationName;
    private String registrationNumber;
    private String contactEmail;
    private String address;
    private IssuerStatus status;
    private Long userId;
    private String userEmail;
    private LocalDateTime createdAt;

    public IssuerResponse() {
    }

    public IssuerResponse(Issuer issuer) {
        this.id = issuer.getId();
        this.organizationName = issuer.getOrganizationName();
        this.registrationNumber = issuer.getRegistrationNumber();
        this.contactEmail = issuer.getContactEmail();
        this.address = issuer.getAddress();
        this.status = issuer.getStatus();
        if (issuer.getUser() != null) {
            this.userId = issuer.getUser().getId();
            this.userEmail = issuer.getUser().getEmail();
        }
        this.createdAt = issuer.getCreatedAt();
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getOrganizationName() {
        return organizationName;
    }

    public void setOrganizationName(String organizationName) {
        this.organizationName = organizationName;
    }

    public String getRegistrationNumber() {
        return registrationNumber;
    }

    public void setRegistrationNumber(String registrationNumber) {
        this.registrationNumber = registrationNumber;
    }

    public String getContactEmail() {
        return contactEmail;
    }

    public void setContactEmail(String contactEmail) {
        this.contactEmail = contactEmail;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public IssuerStatus getStatus() {
        return status;
    }

    public void setStatus(IssuerStatus status) {
        this.status = status;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public String getUserEmail() {
        return userEmail;
    }

    public void setUserEmail(String userEmail) {
        this.userEmail = userEmail;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
