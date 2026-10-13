package com.digitalcertificate.service;

import com.digitalcertificate.entity.Certificate;
import com.lowagie.text.*;
import com.lowagie.text.pdf.PdfPCell;
import com.lowagie.text.pdf.PdfPTable;
import com.lowagie.text.pdf.PdfWriter;
import org.springframework.stereotype.Service;

import java.awt.Color;
import java.io.ByteArrayOutputStream;

@Service
public class PdfCertificateService {

    private final QrCodeService qrCodeService;

    public PdfCertificateService(QrCodeService qrCodeService) {
        this.qrCodeService = qrCodeService;
    }

    public byte[] generateCertificatePdf(Certificate certificate) {
        try (ByteArrayOutputStream out = new ByteArrayOutputStream()) {
            // Landscape A4
            Document document = new Document(PageSize.A4.rotate(), 36, 36, 36, 36);
            PdfWriter.getInstance(document, out);
            document.open();

            // Colors
            Color navy = new Color(26, 35, 126);      // #1A237E
            Color darkNavy = new Color(15, 23, 42);   // #0F172A
            Color gold = new Color(194, 150, 75);     // #C2964B
            Color muted = new Color(100, 116, 139);   // #64748B

            // Fonts
            Font brandFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 12, navy);
            Font headerFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 26, darkNavy);
            Font subHeaderFont = FontFactory.getFont(FontFactory.HELVETICA, 12, muted);
            Font recipientFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 22, navy);
            Font titleFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 15, darkNavy);
            Font metaFont = FontFactory.getFont(FontFactory.HELVETICA, 10, muted);
            Font metaBoldFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 10, darkNavy);
            Font hashFont = FontFactory.getFont(FontFactory.COURIER, 7, muted);

            // Outer Container Table with Double Border
            PdfPTable container = new PdfPTable(1);
            container.setWidthPercentage(100);
            container.getDefaultCell().setBorderColor(navy);
            container.getDefaultCell().setBorderWidth(3f);
            container.getDefaultCell().setPadding(16f);

            // Inner Table
            PdfPTable inner = new PdfPTable(1);
            inner.setWidthPercentage(100);
            inner.getDefaultCell().setBorderColor(gold);
            inner.getDefaultCell().setBorderWidth(1.5f);
            inner.getDefaultCell().setPadding(18f);

            // Brand / Platform Header
            Paragraph brandPara = new Paragraph("CERTIGUARD DIGITAL CREDENTIAL PLATFORM", brandFont);
            brandPara.setAlignment(Element.ALIGN_CENTER);
            inner.addCell(createCleanCell(brandPara));

            Paragraph idPara = new Paragraph("CERTIFICATE ID: " + certificate.getCertificateId(), metaBoldFont);
            idPara.setAlignment(Element.ALIGN_CENTER);
            inner.addCell(createCleanCell(idPara));

            // Main Title
            Paragraph titlePara = new Paragraph("CERTIFICATE OF ACHIEVEMENT", headerFont);
            titlePara.setAlignment(Element.ALIGN_CENTER);
            titlePara.setSpacingBefore(10f);
            titlePara.setSpacingAfter(6f);
            inner.addCell(createCleanCell(titlePara));

            Paragraph certifyPara = new Paragraph("This official verifiable credential is proudly presented to", subHeaderFont);
            certifyPara.setAlignment(Element.ALIGN_CENTER);
            inner.addCell(createCleanCell(certifyPara));

            // Recipient Name
            Paragraph namePara = new Paragraph(certificate.getRecipientName().toUpperCase(), recipientFont);
            namePara.setAlignment(Element.ALIGN_CENTER);
            namePara.setSpacingBefore(10f);
            namePara.setSpacingAfter(6f);
            inner.addCell(createCleanCell(namePara));

            // Course / Qualification
            Paragraph completionPara = new Paragraph("for successfully fulfilling all requirements and standards for", subHeaderFont);
            completionPara.setAlignment(Element.ALIGN_CENTER);
            inner.addCell(createCleanCell(completionPara));

            Paragraph coursePara = new Paragraph(certificate.getCourseOrTitle(), titleFont);
            coursePara.setAlignment(Element.ALIGN_CENTER);
            coursePara.setSpacingBefore(4f);
            coursePara.setSpacingAfter(4f);
            inner.addCell(createCleanCell(coursePara));

            Paragraph typePara = new Paragraph("Category: " + certificate.getCertificateType().getName(), metaFont);
            typePara.setAlignment(Element.ALIGN_CENTER);
            inner.addCell(createCleanCell(typePara));

            // Bottom Section: Issuer Info + Signature Hash + QR Code
            PdfPTable footerTable = new PdfPTable(3);
            footerTable.setWidthPercentage(100);
            footerTable.setWidths(new float[]{35f, 45f, 20f});
            footerTable.setSpacingBefore(14f);

            // Left: Issuer Details
            PdfPCell issuerCell = new PdfPCell();
            issuerCell.setBorder(Rectangle.NO_BORDER);
            issuerCell.addElement(new Paragraph("ISSUING AUTHORITY", metaBoldFont));
            issuerCell.addElement(new Paragraph(certificate.getIssuer().getOrganizationName(), metaBoldFont));
            issuerCell.addElement(new Paragraph("Reg No: " + certificate.getIssuer().getRegistrationNumber(), metaFont));
            issuerCell.addElement(new Paragraph("Issue Date: " + certificate.getIssueDate().toString(), metaFont));
            String expiry = certificate.getExpiryDate() != null ? certificate.getExpiryDate().toString() : "Lifetime";
            issuerCell.addElement(new Paragraph("Expiry: " + expiry, metaFont));
            footerTable.addCell(issuerCell);

            // Middle: Cryptographic Signature & Hash Block
            PdfPCell hashCell = new PdfPCell();
            hashCell.setBorder(Rectangle.NO_BORDER);
            hashCell.addElement(new Paragraph("CRYPTOGRAPHIC INTEGRITY & AUDIT PROOF", metaBoldFont));
            hashCell.addElement(new Paragraph("SHA-256 Digest:", metaFont));
            hashCell.addElement(new Paragraph(certificate.getSha256Hash(), hashFont));
            hashCell.addElement(new Paragraph("Digital Signature Algorithm: RSA-2048 / SHA256withRSA", metaFont));
            String sigPreview = certificate.getDigitalSignature().length() > 64
                    ? certificate.getDigitalSignature().substring(0, 64) + "..."
                    : certificate.getDigitalSignature();
            hashCell.addElement(new Paragraph("Signature: " + sigPreview, hashFont));
            footerTable.addCell(hashCell);

            // Right: Embedded QR Code
            PdfPCell qrCell = new PdfPCell();
            qrCell.setBorder(Rectangle.NO_BORDER);
            qrCell.setHorizontalAlignment(Element.ALIGN_RIGHT);

            String verifyUrl = qrCodeService.buildVerificationUrl(certificate.getCertificateId());
            byte[] qrBytes = qrCodeService.generateQrCodeBytes(verifyUrl, 100, 100);
            Image qrImage = Image.getInstance(qrBytes);
            qrImage.scaleAbsolute(70f, 70f);
            qrImage.setAlignment(Element.ALIGN_RIGHT);
            qrCell.addElement(qrImage);

            Paragraph scanPara = new Paragraph("Scan to Verify", metaFont);
            scanPara.setAlignment(Element.ALIGN_RIGHT);
            qrCell.addElement(scanPara);

            footerTable.addCell(qrCell);

            inner.addCell(createCleanCell(footerTable));
            container.addCell(inner);
            document.add(container);

            document.close();
            return out.toByteArray();
        } catch (Exception e) {
            throw new IllegalStateException("Failed to generate certificate PDF", e);
        }
    }

    private PdfPCell createCleanCell(Element element) {
        PdfPCell cell = new PdfPCell();
        cell.setBorder(Rectangle.NO_BORDER);
        cell.addElement(element);
        return cell;
    }
}
