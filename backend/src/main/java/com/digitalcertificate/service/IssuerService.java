
package com.digitalcertificate.service;

import com.digitalcertificate.entity.Issuer;
import com.digitalcertificate.entity.IssuerRepository;
import com.digitalcertificate.entity.IssuerStatus;
import com.digitalcertificate.entity.User;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class IssuerService {

    private final IssuerRepository issuerRepository;

    public IssuerService(IssuerRepository issuerRepository) {
        this.issuerRepository = issuerRepository;
    }

    public Issuer registerIssuer(
            String organizationName,
            String registrationNumber,
            String contactEmail,
            String address,
            User user) {

        if (issuerRepository
                .findByRegistrationNumber(registrationNumber)
                .isPresent()) {
            throw new IllegalArgumentException(
                    "An issuer with this registration number already exists."
            );
        }

        if (issuerRepository.findByUserId(user.getId()).isPresent()) {
            throw new IllegalArgumentException(
                    "This user already has an issuer profile."
            );
        }

        Issuer issuer = new Issuer();
        issuer.setOrganizationName(organizationName);
        issuer.setRegistrationNumber(registrationNumber);
        issuer.setContactEmail(contactEmail);
        issuer.setAddress(address);
        issuer.setUser(user);
        issuer.setStatus(IssuerStatus.PENDING);

        return issuerRepository.save(issuer);
    }

    @Transactional(readOnly = true)
    public List<Issuer> getAllIssuers() {
        return issuerRepository.findAll();
    }

    @Transactional(readOnly = true)
    public Optional<Issuer> getIssuerById(Long id) {
        return issuerRepository.findById(id);
    }

    @Transactional(readOnly = true)
    public List<Issuer> getIssuersByStatus(IssuerStatus status) {
        return issuerRepository.findByStatus(status);
    }

    @Transactional(readOnly = true)
    public Optional<Issuer> getIssuerByUserId(Long userId) {
        return issuerRepository.findByUserId(userId);
    }

    public Issuer approveIssuer(Long id) {
        Issuer issuer = issuerRepository.findById(id)
                .orElseThrow(() ->
                        new IllegalArgumentException("Issuer not found."));

        issuer.setStatus(IssuerStatus.APPROVED);
        return issuerRepository.save(issuer);
    }

    public Issuer rejectIssuer(Long id) {
        Issuer issuer = issuerRepository.findById(id)
                .orElseThrow(() ->
                        new IllegalArgumentException("Issuer not found."));

        issuer.setStatus(IssuerStatus.REJECTED);
        return issuerRepository.save(issuer);
    }
}
