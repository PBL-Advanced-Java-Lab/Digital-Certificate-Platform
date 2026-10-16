package com.digitalcertificate.dto;

import com.digitalcertificate.entity.CertificateType;

import java.time.LocalDateTime;

public class CertificateTypeResponse {

    private Long id;
    private String name;
    private String code;
    private String description;
    private boolean active;
    private LocalDateTime createdAt;

    public CertificateTypeResponse() {
    }

    public CertificateTypeResponse(CertificateType entity) {
        this.id = entity.getId();
        this.name = entity.getName();
        this.code = entity.getCode();
        this.description = entity.getDescription();
        this.active = entity.isActive();
        this.createdAt = entity.getCreatedAt();
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public boolean isActive() {
        return active;
    }

    public void setActive(boolean active) {
        this.active = active;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
