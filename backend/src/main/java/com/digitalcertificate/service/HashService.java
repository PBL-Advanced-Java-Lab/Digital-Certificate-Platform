package com.digitalcertificate.service;

import org.springframework.stereotype.Service;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;

@Service
public class HashService {

    public String buildCanonicalString(
            String certificateId,
            String recipientName,
            String recipientEmail,
            String courseOrTitle,
            String typeCode,
            String issuerRegNumber,
            String issueDate,
            String expiryDate
    ) {
        return String.format(
                "CERT_ID=%s|RECIPIENT=%s|EMAIL=%s|TITLE=%s|TYPE=%s|ISSUER=%s|ISSUED=%s|EXPIRY=%s",
                certificateId != null ? certificateId.trim() : "",
                recipientName != null ? recipientName.trim() : "",
                recipientEmail != null ? recipientEmail.trim().toLowerCase() : "",
                courseOrTitle != null ? courseOrTitle.trim() : "",
                typeCode != null ? typeCode.trim().toUpperCase() : "",
                issuerRegNumber != null ? issuerRegNumber.trim() : "",
                issueDate != null ? issueDate.trim() : "",
                expiryDate != null ? expiryDate.trim() : "LIFETIME"
        );
    }

    public String calculateSha256(String input) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] hash = digest.digest(input.getBytes(StandardCharsets.UTF_8));
            StringBuilder hexString = new StringBuilder();
            for (byte b : hash) {
                String hex = Integer.toHexString(0xff & b);
                if (hex.length() == 1) hexString.append('0');
                hexString.append(hex);
            }
            return hexString.toString();
        } catch (NoSuchAlgorithmException e) {
            throw new IllegalStateException("SHA-256 algorithm unavailable", e);
        }
    }
}
