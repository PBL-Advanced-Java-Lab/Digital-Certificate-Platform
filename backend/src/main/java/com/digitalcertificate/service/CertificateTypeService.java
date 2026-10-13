package com.digitalcertificate.service;

import com.digitalcertificate.dto.CertificateTypeRequest;
import com.digitalcertificate.dto.CertificateTypeResponse;
import com.digitalcertificate.entity.CertificateType;
import com.digitalcertificate.entity.CertificateTypeRepository;
import jakarta.annotation.PostConstruct;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class CertificateTypeService {

    private final CertificateTypeRepository certificateTypeRepository;

    public CertificateTypeService(CertificateTypeRepository certificateTypeRepository) {
        this.certificateTypeRepository = certificateTypeRepository;
    }

    @PostConstruct
    public void initDefaultTypes() {
        if (certificateTypeRepository.count() == 0) {
            saveDefaultIfMissing("University Degree", "DEGREE", "Undergraduate, Postgraduate, and Doctoral Degrees");
            saveDefaultIfMissing("Academic Diploma", "DIPLOMA", "Diplomas and Graduate Certificates");
            saveDefaultIfMissing("Professional Certification", "PROFESSIONAL_CERTIFICATION", "Industry-recognized technical and professional credentials");
            saveDefaultIfMissing("Training & Participation", "TRAINING_COMPLETION", "Proof of course, seminar, or workshop completion");
            saveDefaultIfMissing("Accredited License", "LICENSE", "Official professional or regulatory licenses");
        }
    }

    private void saveDefaultIfMissing(String name, String code, String description) {
        if (!certificateTypeRepository.existsByCode(code)) {
            certificateTypeRepository.save(new CertificateType(name, code, description));
        }
    }

    @Transactional(readOnly = true)
    public List<CertificateTypeResponse> getAllTypes() {
        return certificateTypeRepository.findAll().stream()
                .map(CertificateTypeResponse::new)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<CertificateTypeResponse> getActiveTypes() {
        return certificateTypeRepository.findByActiveTrue().stream()
                .map(CertificateTypeResponse::new)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public CertificateTypeResponse getTypeById(Long id) {
        return certificateTypeRepository.findById(id)
                .map(CertificateTypeResponse::new)
                .orElseThrow(() -> new IllegalArgumentException("Certificate type not found with ID: " + id));
    }

    public CertificateTypeResponse createType(CertificateTypeRequest request) {
        String cleanCode = request.getCode().trim().toUpperCase().replaceAll("\\s+", "_");
        if (certificateTypeRepository.existsByCode(cleanCode)) {
            throw new IllegalArgumentException("Certificate type code '" + cleanCode + "' already exists.");
        }

        CertificateType entity = new CertificateType(
                request.getName().trim(),
                cleanCode,
                request.getDescription() != null ? request.getDescription().trim() : null
        );

        CertificateType saved = certificateTypeRepository.save(entity);
        return new CertificateTypeResponse(saved);
    }
}
