package com.digitalcertificate.service;

import com.digitalcertificate.dto.CertificateIssueRequest;
import com.digitalcertificate.dto.CertificateResponse;
import com.digitalcertificate.dto.PublicVerificationResponse;
import com.digitalcertificate.entity.*;
import com.digitalcertificate.exception.ResourceNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.KeyPair;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@Transactional
public class CertificateService {

    private final CertificateRepository certificateRepository;
    private final CertificateTypeRepository certificateTypeRepository;
    private final IssuerRepository issuerRepository;
    private final UserRepository userRepository;
    private final HashService hashService;
    private final DigitalSignatureService digitalSignatureService;
    private final QrCodeService qrCodeService;
    private final PdfCertificateService pdfCertificateService;

    public CertificateService(
            CertificateRepository certificateRepository,
            CertificateTypeRepository certificateTypeRepository,
            IssuerRepository issuerRepository,
            UserRepository userRepository,
            HashService hashService,
            DigitalSignatureService digitalSignatureService,
            QrCodeService qrCodeService,
            PdfCertificateService pdfCertificateService
    ) {
        this.certificateRepository = certificateRepository;
        this.certificateTypeRepository = certificateTypeRepository;
        this.issuerRepository = issuerRepository;
        this.userRepository = userRepository;
        this.hashService = hashService;
        this.digitalSignatureService = digitalSignatureService;
        this.qrCodeService = qrCodeService;
        this.pdfCertificateService = pdfCertificateService;
    }

    public CertificateResponse issueCertificate(CertificateIssueRequest request, String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new IllegalArgumentException("User not found with email: " + userEmail));

        Issuer issuer = issuerRepository.findByUserId(user.getId())
                .orElseThrow(() -> new IllegalStateException("You must have a registered organization to issue certificates."));

        if (issuer.getStatus() != IssuerStatus.APPROVED) {
            throw new IllegalStateException("Your organization registration is currently " + issuer.getStatus() + ". Only approved organizations can issue certificates.");
        }

        // Ensure issuer has cryptographic keypair
        if (issuer.getPrivateKeyBase64() == null || issuer.getPublicKeyBase64() == null) {
            KeyPair keyPair = digitalSignatureService.generateRsaKeyPair();
            issuer.setPublicKeyBase64(digitalSignatureService.encodePublicKey(keyPair.getPublic()));
            issuer.setPrivateKeyBase64(digitalSignatureService.encodePrivateKey(keyPair.getPrivate()));
            issuerRepository.save(issuer);
        }

        CertificateType certType = certificateTypeRepository.findById(request.getCertificateTypeId())
                .orElseThrow(() -> new IllegalArgumentException("Certificate type not found with ID: " + request.getCertificateTypeId()));

        if (!certType.isActive()) {
            throw new IllegalArgumentException("Selected certificate type is currently deactivated.");
        }

        // Generate unique certificate ID (e.g. CG-2026-A1B2C3D4)
        String uniqueSuffix = UUID.randomUUID().toString().substring(0, 8).toUpperCase();
        String certificateId = String.format("CG-%d-%s", LocalDate.now().getYear(), uniqueSuffix);

        LocalDate issueDate = LocalDate.now();
        String expiryString = request.getExpiryDate() != null ? request.getExpiryDate().toString() : "LIFETIME";

        // Build canonical string and SHA-256 hash
        String canonicalData = hashService.buildCanonicalString(
                certificateId,
                request.getRecipientName(),
                request.getRecipientEmail(),
                request.getCourseOrTitle(),
                certType.getCode(),
                issuer.getRegistrationNumber(),
                issueDate.toString(),
                expiryString
        );

        String sha256Hash = hashService.calculateSha256(canonicalData);

        // Sign with issuer's private key
        String digitalSignature = digitalSignatureService.sign(canonicalData, issuer.getPrivateKeyBase64());

        // Generate QR code with public verification URL
        String verificationUrl = qrCodeService.buildVerificationUrl(certificateId);
        String qrCodeBase64 = qrCodeService.generateQrCodeBase64(verificationUrl, 250, 250);

        Certificate certificate = new Certificate();
        certificate.setCertificateId(certificateId);
        certificate.setRecipientName(request.getRecipientName().trim());
        certificate.setRecipientEmail(request.getRecipientEmail().trim().toLowerCase());
        certificate.setCourseOrTitle(request.getCourseOrTitle().trim());
        certificate.setCertificateType(certType);
        certificate.setIssuer(issuer);
        certificate.setIssueDate(issueDate);
        certificate.setExpiryDate(request.getExpiryDate());
        certificate.setStatus(CertificateStatus.ACTIVE);
        certificate.setSha256Hash(sha256Hash);
        certificate.setDigitalSignature(digitalSignature);
        certificate.setQrCodeBase64(qrCodeBase64);

        Certificate saved = certificateRepository.save(certificate);
        return new CertificateResponse(saved);
    }

    public CertificateResponse getCertificateById(String certificateId) {
        Certificate certificate = certificateRepository.findByCertificateId(certificateId.trim().toUpperCase())
                .orElseThrow(() -> new IllegalArgumentException("Certificate not found with ID: " + certificateId));

        // Auto-check for expiry
        if (certificate.getStatus() == CertificateStatus.ACTIVE &&
                certificate.getExpiryDate() != null &&
                certificate.getExpiryDate().isBefore(LocalDate.now())) {
            certificate.setStatus(CertificateStatus.EXPIRED);
            certificate = certificateRepository.save(certificate);
        }

        return new CertificateResponse(certificate);
    }

    @Transactional(readOnly = true)
    public List<CertificateResponse> getCertificatesByIssuer(String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new IllegalArgumentException("User not found: " + userEmail));

        Issuer issuer = issuerRepository.findByUserId(user.getId())
                .orElseThrow(() -> new IllegalArgumentException("Issuer profile not found for user: " + userEmail));

        return certificateRepository.findByIssuerIdOrderByCreatedAtDesc(issuer.getId()).stream()
                .map(CertificateResponse::new)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<CertificateResponse> getCertificatesByRecipient(String userEmail) {
        return certificateRepository.findByRecipientEmailIgnoreCaseOrderByCreatedAtDesc(userEmail.trim()).stream()
                .map(CertificateResponse::new)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<CertificateResponse> getAllCertificates() {
        return certificateRepository.findAllByOrderByCreatedAtDesc().stream()
                .map(CertificateResponse::new)
                .collect(Collectors.toList());
    }

    public CertificateResponse revokeCertificate(String certificateId, String reason, String userEmail, boolean isAdmin) {
        Certificate certificate = certificateRepository.findByCertificateId(certificateId.trim().toUpperCase())
                .orElseThrow(() -> new IllegalArgumentException("Certificate not found with ID: " + certificateId));

        if (!isAdmin) {
            User user = userRepository.findByEmail(userEmail)
                    .orElseThrow(() -> new IllegalArgumentException("User not found: " + userEmail));
            if (!certificate.getIssuer().getUser().getId().equals(user.getId())) {
                throw new IllegalStateException("You are not authorized to revoke certificates issued by another organization.");
            }
        }

        certificate.setStatus(CertificateStatus.REVOKED);
        certificate.setRevocationReason(reason.trim());
        certificate.setRevokedAt(LocalDateTime.now());

        Certificate saved = certificateRepository.save(certificate);
        return new CertificateResponse(saved);
    }

    public byte[] generateCertificatePdf(String certificateId) {
        Certificate certificate = certificateRepository.findByCertificateId(certificateId.trim().toUpperCase())
                .orElseThrow(() -> new IllegalArgumentException("Certificate not found with ID: " + certificateId));

        return pdfCertificateService.generateCertificatePdf(certificate);
    }

    public PublicVerificationResponse verifyCertificatePublic(String certificateId) {
        Certificate certificate = certificateRepository.findByCertificateId(certificateId.trim().toUpperCase())
                .orElseThrow(() -> new ResourceNotFoundException("Certificate with identifier '" + certificateId + "' was not found in the CertiGuard ledger."));

        // Auto-check for expiry
        if (certificate.getStatus() == CertificateStatus.ACTIVE &&
                certificate.getExpiryDate() != null &&
                certificate.getExpiryDate().isBefore(LocalDate.now())) {
            certificate.setStatus(CertificateStatus.EXPIRED);
            certificate = certificateRepository.save(certificate);
        }

        String expiryString = certificate.getExpiryDate() != null ? certificate.getExpiryDate().toString() : "LIFETIME";

        // Reconstruct canonical data
        String canonicalData = hashService.buildCanonicalString(
                certificate.getCertificateId(),
                certificate.getRecipientName(),
                certificate.getRecipientEmail(),
                certificate.getCourseOrTitle(),
                certificate.getCertificateType().getCode(),
                certificate.getIssuer().getRegistrationNumber(),
                certificate.getIssueDate().toString(),
                expiryString
        );

        // Recalculate and verify SHA-256 hash
        String recalculatedHash = hashService.calculateSha256(canonicalData);
        boolean hashValid = recalculatedHash.equalsIgnoreCase(certificate.getSha256Hash());

        // Cryptographically verify RSA signature
        boolean signatureValid = false;
        if (certificate.getIssuer() != null && certificate.getIssuer().getPublicKeyBase64() != null) {
            signatureValid = digitalSignatureService.verify(
                    canonicalData,
                    certificate.getDigitalSignature(),
                    certificate.getIssuer().getPublicKeyBase64()
            );
        }

        // Determine definitive verification outcome
        String verificationStatus;
        if (!hashValid || !signatureValid) {
            verificationStatus = "TAMPERED";
        } else if (certificate.getStatus() == CertificateStatus.REVOKED) {
            verificationStatus = "REVOKED";
        } else if (certificate.getStatus() == CertificateStatus.EXPIRED) {
            verificationStatus = "EXPIRED";
        } else {
            verificationStatus = "VERIFIED";
        }

        String maskedEmail = maskEmail(certificate.getRecipientEmail());

        PublicVerificationResponse response = new PublicVerificationResponse();
        response.setCertificateId(certificate.getCertificateId());
        response.setRecipientName(certificate.getRecipientName());
        response.setMaskedRecipientEmail(maskedEmail);
        response.setCourseOrTitle(certificate.getCourseOrTitle());
        response.setCertificateTypeName(certificate.getCertificateType().getName());
        response.setCertificateTypeCode(certificate.getCertificateType().getCode());
        response.setIssuerOrganizationName(certificate.getIssuer().getOrganizationName());
        response.setIssuerRegistrationNumber(certificate.getIssuer().getRegistrationNumber());
        response.setIssuerPublicKey(certificate.getIssuer().getPublicKeyBase64());
        response.setIssueDate(certificate.getIssueDate());
        response.setExpiryDate(certificate.getExpiryDate());
        response.setStatus(certificate.getStatus());
        response.setVerificationStatus(verificationStatus);
        response.setSha256Hash(certificate.getSha256Hash());
        response.setDigitalSignature(certificate.getDigitalSignature());
        response.setSignatureValid(signatureValid);
        response.setHashValid(hashValid);
        response.setRevocationReason(certificate.getRevocationReason());
        response.setRevokedAt(certificate.getRevokedAt());
        response.setVerifiedAt(LocalDateTime.now());

        return response;
    }

    private String maskEmail(String email) {
        if (email == null || !email.contains("@")) {
            return "***";
        }
        String[] parts = email.split("@");
        String local = parts[0];
        String domain = parts[1];
        if (local.length() <= 2) {
            return local.charAt(0) + "***@" + domain;
        }
        return local.charAt(0) + "***" + local.charAt(local.length() - 1) + "@" + domain;
    }
}
