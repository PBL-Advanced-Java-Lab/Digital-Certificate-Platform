package com.digitalcertificate.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class IssuerRegistrationRequest {

    @NotBlank(message = "Organization name is required")
    @Size(max = 150, message = "Organization name cannot exceed 150 characters")
    private String organizationName;

    @NotBlank(message = "Registration number is required")
    @Size(max = 100, message = "Registration number cannot exceed 100 characters")
    private String registrationNumber;

    @NotBlank(message = "Contact email is required")
    @Email(message = "Please provide a valid contact email address")
    @Size(max = 150, message = "Contact email cannot exceed 150 characters")
    private String contactEmail;

    @Size(max = 500, message = "Address cannot exceed 500 characters")
    private String address;

    public IssuerRegistrationRequest() {
    }

    public IssuerRegistrationRequest(String organizationName, String registrationNumber, String contactEmail, String address) {
        this.organizationName = organizationName;
        this.registrationNumber = registrationNumber;
        this.contactEmail = contactEmail;
        this.address = address;
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
}
