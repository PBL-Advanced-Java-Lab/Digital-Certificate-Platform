package com.digitalcertificate.service;

import com.google.zxing.BarcodeFormat;
import com.google.zxing.client.j2se.MatrixToImageWriter;
import com.google.zxing.common.BitMatrix;
import com.google.zxing.qrcode.QRCodeWriter;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.util.Base64;

@Service
public class QrCodeService {

    @Value("${app.frontend-url:http://localhost:3000}")
    private String frontendUrl;

    public byte[] generateQrCodeBytes(String text, int width, int height) {
        try {
            QRCodeWriter qrCodeWriter = new QRCodeWriter();
            BitMatrix bitMatrix = qrCodeWriter.encode(text, BarcodeFormat.QR_CODE, width, height);
            ByteArrayOutputStream pngOutputStream = new ByteArrayOutputStream();
            MatrixToImageWriter.writeToStream(bitMatrix, "PNG", pngOutputStream);
            return pngOutputStream.toByteArray();
        } catch (Exception e) {
            throw new IllegalStateException("Failed to generate QR code", e);
        }
    }

    public String generateQrCodeBase64(String text, int width, int height) {
        byte[] bytes = generateQrCodeBytes(text, width, height);
        return "data:image/png;base64," + Base64.getEncoder().encodeToString(bytes);
    }

    public String buildVerificationUrl(String certificateId) {
        return String.format("%s/verify/%s", frontendUrl.replaceAll("/$", ""), certificateId);
    }
}
