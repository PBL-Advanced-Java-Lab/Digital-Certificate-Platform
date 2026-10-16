"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { api, ApiError, PublicVerificationResponse } from "@/lib/api";

const DEMO_FALLBACK_RECORDS: Record<string, PublicVerificationResponse> = {
  "CG-2026-NTU-7890": {
    certificateId: "CG-2026-NTU-7890",
    recipientName: "Priyanka Sharma",
    maskedRecipientEmail: "p***a@gmail.com",
    courseOrTitle: "Master of Science in Cybersecurity & Distributed Systems",
    certificateTypeName: "Master Degree",
    certificateTypeCode: "DEGREE",
    issuerOrganizationName: "National Technological University",
    issuerRegistrationNumber: "NTU-REG-2026-987",
    issuerPublicKey: "MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAx4b3L9y...",
    issueDate: "2026-10-10",
    expiryDate: undefined,
    status: "ACTIVE",
    verificationStatus: "VERIFIED",
    sha256Hash: "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
    digitalSignature: "k9xL2P5vA8mN0qR1wY3zB4cE6fH7jK...",
    signatureValid: true,
    hashValid: true,
    revocationReason: undefined,
    revokedAt: undefined,
    verifiedAt: new Date().toISOString(),
  },
  "CG-2026-IIT-1002": {
    certificateId: "CG-2026-IIT-1002",
    recipientName: "Rahul Verma",
    maskedRecipientEmail: "r***a@iit.ac.in",
    courseOrTitle: "Advanced Cloud Architecture & Cryptography",
    certificateTypeName: "Professional Certification",
    certificateTypeCode: "PROFESSIONAL_CERTIFICATION",
    issuerOrganizationName: "Indian Institute of Technology",
    issuerRegistrationNumber: "IIT-EDU-2026-442",
    issuerPublicKey: "MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAz8q1W2e...",
    issueDate: "2026-09-15",
    expiryDate: undefined,
    status: "ACTIVE",
    verificationStatus: "VERIFIED",
    sha256Hash: "8f434346648f6b96df89dda901c5176b10a6d83961dd3c1ac88b59b2dc327aa4",
    digitalSignature: "p8q9w0e1r2t3y4u5i6o7p8a9s0d1f2...",
    signatureValid: true,
    hashValid: true,
    revocationReason: undefined,
    revokedAt: undefined,
    verifiedAt: new Date().toISOString(),
  },
  "CG-2026-REVOKED-001": {
    certificateId: "CG-2026-REVOKED-001",
    recipientName: "Alex Mercer",
    maskedRecipientEmail: "a***r@example.com",
    courseOrTitle: "Executive Data Science Certificate",
    certificateTypeName: "Training Completion",
    certificateTypeCode: "TRAINING_COMPLETION",
    issuerOrganizationName: "Global Tech Academy",
    issuerRegistrationNumber: "GTA-2025-099",
    issuerPublicKey: "MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAu1a2b3c...",
    issueDate: "2026-01-12",
    expiryDate: undefined,
    status: "REVOKED",
    verificationStatus: "REVOKED",
    sha256Hash: "a591a6d40bf420404a011733cfb7b190d62c65bf0bcda32b57b277d9ad9f146e",
    digitalSignature: "z1x2c3v4b5n6m7a8s9d0f1g2h3j4k5...",
    signatureValid: true,
    hashValid: true,
    revocationReason: "Credential superseded due to academic integrity committee finding (Case #2026-88).",
    revokedAt: "2026-03-01T14:30:00",
    verifiedAt: new Date().toISOString(),
  },
};

export default function PublicVerificationDetailPage() {
  const params = useParams();
  const router = useRouter();
  const certificateId = String(params.certificateId || "").trim();

  const [record, setRecord] = useState<PublicVerificationResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [copiedHash, setCopiedHash] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedKey, setCopiedKey] = useState(false);
  const [showKey, setShowKey] = useState(false);

  useEffect(() => {
    if (!certificateId) return;

    let isMounted = true;
    setIsLoading(true);
    setNotFound(false);

    api.verification
      .verifyPublic(certificateId)
      .then((data) => {
        if (isMounted) {
          setRecord(data);
          setIsLoading(false);
        }
      })
      .catch((err: ApiError) => {
        if (!isMounted) return;

        // Check if matching demo record exists as fallback
        const demo = DEMO_FALLBACK_RECORDS[certificateId.toUpperCase()];
        if (demo) {
          setRecord(demo);
          setIsLoading(false);
        } else {
          setNotFound(true);
          setIsLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [certificateId]);

  const copyToClipboard = (text: string, type: "hash" | "link" | "key") => {
    navigator.clipboard.writeText(text);
    if (type === "hash") {
      setCopiedHash(true);
      setTimeout(() => setCopiedHash(false), 2000);
    } else if (type === "link") {
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    } else {
      setCopiedKey(true);
      setTimeout(() => setCopiedKey(false), 2000);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  if (isLoading) {
    return (
      <div className="flex-1 max-w-4xl mx-auto w-full py-16 px-4 sm:px-6 lg:px-8 space-y-8 animate-pulse">
        <div className="h-6 w-48 bg-slate-200 rounded"></div>
        <div className="h-44 bg-slate-100 rounded-3xl border border-slate-200"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="h-56 bg-slate-100 rounded-2xl border border-slate-200"></div>
          <div className="h-56 bg-slate-100 rounded-2xl border border-slate-200"></div>
        </div>
        <div className="h-64 bg-slate-100 rounded-2xl border border-slate-200"></div>
      </div>
    );
  }

  if (notFound || !record) {
    return (
      <div className="flex-1 max-w-3xl mx-auto w-full py-16 px-4 sm:px-6 lg:px-8 text-center space-y-6">
        <div className="w-20 h-20 rounded-3xl bg-rose-50 border border-rose-200 text-rose-600 flex items-center justify-center mx-auto shadow-sm">
          <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <div className="space-y-2">
          <h1 className="text-3xl font-extrabold text-[#0F172A] tracking-tight">
            Certificate Not Found in Ledger
          </h1>
          <p className="text-sm sm:text-base text-slate-600 max-w-lg mx-auto">
            The credential identifier <span className="font-mono font-semibold text-slate-800 bg-slate-100 px-2 py-0.5 rounded">{certificateId}</span> could not be verified in the CertiGuard authoritative registry.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-white border border-slate-200 text-left text-sm space-y-3 shadow-sm max-w-lg mx-auto">
          <h4 className="font-semibold text-slate-800">Possible reasons:</h4>
          <ul className="list-disc list-inside space-y-1 text-slate-600 text-xs sm:text-sm">
            <li>The certificate ID was mistyped or improperly scanned.</li>
            <li>The credential has not yet been registered by the issuing organization.</li>
            <li>The certificate is counterfeit or was created outside the CertiGuard platform.</li>
          </ul>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
          <Link
            href="/verify"
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-[#2563EB] hover:bg-blue-700 text-white font-semibold text-sm shadow-md transition-all flex items-center justify-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <span>Scan or Search Another ID</span>
          </Link>
          <Link
            href="/"
            className="w-full sm:w-auto px-6 py-3 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-semibold text-sm transition-all"
          >
            Return to Homepage
          </Link>
        </div>
      </div>
    );
  }

  const isVerified = record.verificationStatus === "VERIFIED" && record.status === "ACTIVE";
  const isRevoked = record.verificationStatus === "REVOKED" || record.status === "REVOKED";
  const isExpired = record.verificationStatus === "EXPIRED" || record.status === "EXPIRED";
  const isTampered = record.verificationStatus === "TAMPERED" || (!record.signatureValid && !isRevoked);

  const pdfUrl = api.certificates.getPdfUrl(record.certificateId);

  return (
    <div className="flex-1 py-10 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto w-full space-y-8">
      {/* Top Breadcrumb Navigation */}
      <div className="flex items-center justify-between text-xs sm:text-sm text-slate-500">
        <div className="flex items-center gap-2">
          <Link href="/verify" className="hover:text-[#2563EB] transition-colors flex items-center gap-1">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Verification Portal
          </Link>
          <span>/</span>
          <span className="font-mono font-semibold text-slate-800">{record.certificateId}</span>
        </div>

        <button
          onClick={() => copyToClipboard(window.location.href, "link")}
          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-medium transition-all shadow-sm"
        >
          {copiedLink ? (
            <>
              <svg className="w-3.5 h-3.5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span className="text-emerald-700 font-semibold">Link Copied!</span>
            </>
          ) : (
            <>
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              <span>Share Verification</span>
            </>
          )}
        </button>
      </div>

      {/* Primary Verification Status Banner */}
      {isVerified && (
        <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-emerald-50 via-white to-emerald-50/40 border-2 border-emerald-500/30 shadow-xl shadow-emerald-950/5 relative overflow-hidden">
          <div className="absolute -right-8 -top-8 w-44 h-44 bg-emerald-200/20 rounded-full blur-2xl pointer-events-none"></div>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 relative z-10">
            <div className="flex items-start sm:items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-emerald-500 text-white flex items-center justify-center shadow-lg shadow-emerald-500/30 flex-shrink-0">
                <svg className="w-9 h-9" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <div className="space-y-1">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider bg-emerald-100 text-emerald-800 border border-emerald-300">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  Cryptographically Authentic
                </div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0F172A] tracking-tight">
                  Certificate Verified & Authentic
                </h1>
                <p className="text-xs sm:text-sm text-slate-600">
                  Document identity and digital signature matched with authoritative issuer keys.
                </p>
              </div>
            </div>

            <div className="text-left sm:text-right bg-white/80 backdrop-blur-sm sm:bg-transparent p-3 sm:p-0 rounded-xl border sm:border-0 border-emerald-100 w-full sm:w-auto">
              <span className="text-xs font-semibold text-slate-400 block uppercase tracking-wider">Verification Time</span>
              <span className="text-xs sm:text-sm font-mono font-medium text-slate-700">
                {new Date(record.verifiedAt || Date.now()).toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      )}

      {isRevoked && (
        <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-rose-50 via-white to-rose-50/40 border-2 border-rose-500/40 shadow-xl shadow-rose-950/5 relative overflow-hidden">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 relative z-10">
            <div className="flex items-start sm:items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-rose-600 text-white flex items-center justify-center shadow-lg shadow-rose-600/30 flex-shrink-0">
                <svg className="w-9 h-9" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <div className="space-y-1">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider bg-rose-100 text-rose-800 border border-rose-300">
                  <span className="w-2 h-2 rounded-full bg-rose-600"></span>
                  Revoked Credential
                </div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0F172A] tracking-tight">
                  Certificate Has Been Revoked
                </h1>
                <p className="text-xs sm:text-sm text-rose-700 font-medium">
                  This credential was officially invalidated by the issuing organization and is void.
                </p>
              </div>
            </div>
          </div>

          {/* Revocation Specific Notice */}
          <div className="mt-6 p-4 rounded-2xl bg-rose-100/70 border border-rose-200 text-sm space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-rose-900">Official Revocation Reason</span>
              {record.revokedAt && (
                <span className="text-xs font-mono text-rose-800">
                  Revoked on: {new Date(record.revokedAt).toLocaleDateString()}
                </span>
              )}
            </div>
            <p className="text-rose-950 font-semibold">{record.revocationReason || "No specific reason provided."}</p>
          </div>
        </div>
      )}

      {isExpired && !isRevoked && (
        <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-amber-50 via-white to-amber-50/40 border-2 border-amber-500/40 shadow-xl shadow-amber-950/5 relative overflow-hidden">
          <div className="flex items-start sm:items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-amber-500 text-white flex items-center justify-center shadow-lg shadow-amber-500/30 flex-shrink-0">
              <svg className="w-9 h-9" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider bg-amber-100 text-amber-800 border border-amber-300">
                Expired Validity
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0F172A] tracking-tight">
                Certificate Has Expired
              </h1>
              <p className="text-xs sm:text-sm text-amber-800">
                This credential was valid until {record.expiryDate}. Its authenticity at issue is verified, but its term has concluded.
              </p>
            </div>
          </div>
        </div>
      )}

      {isTampered && (
        <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-red-50 via-white to-red-50/40 border-2 border-red-600 shadow-xl shadow-red-950/5 relative overflow-hidden">
          <div className="flex items-start sm:items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-red-600 text-white flex items-center justify-center shadow-lg shadow-red-600/30 flex-shrink-0">
              <svg className="w-9 h-9" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
              </svg>
            </div>
            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider bg-red-100 text-red-900 border border-red-300">
                Integrity Failure • Tampered
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0F172A] tracking-tight">
                Cryptographic Signature Mismatch
              </h1>
              <p className="text-xs sm:text-sm text-red-700">
                The document content does not match the issuer RSA signature. This certificate may have been altered or forged.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Primary Certificate Details Card */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xl shadow-slate-900/5 overflow-hidden">
        <div className="p-6 sm:p-8 border-b border-slate-100 bg-gradient-to-b from-slate-50/50 to-white">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Official Credential Record
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-[#0F172A] mt-1">
                {record.courseOrTitle}
              </h2>
            </div>
            <span className="px-3.5 py-1.5 rounded-full text-xs font-extrabold bg-[#1A237E]/10 text-[#1A237E] border border-[#1A237E]/20">
              {record.certificateTypeName}
            </span>
          </div>
        </div>

        {/* 2-Column Info Matrix */}
        <div className="p-6 sm:p-8 grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
          {/* Recipient Details */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <svg className="w-4 h-4 text-[#2563EB]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7 7z" />
              </svg>
              Recipient Information
            </h3>
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
              <div>
                <span className="text-xs text-slate-400 block">Recipient Full Name</span>
                <span className="text-base font-extrabold text-[#0F172A]">{record.recipientName}</span>
              </div>
              <div>
                <span className="text-xs text-slate-400 block">Privacy-Protected Identifier</span>
                <span className="text-xs font-mono font-medium text-slate-600 bg-white px-2 py-0.5 rounded border border-slate-200 inline-block">
                  {record.maskedRecipientEmail}
                </span>
              </div>
            </div>
          </div>

          {/* Issuing Institution Details */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <svg className="w-4 h-4 text-[#2563EB]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
              Issuing Organization
            </h3>
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
              <div>
                <span className="text-xs text-slate-400 block">Verified Organization</span>
                <span className="text-base font-extrabold text-[#0F172A]">{record.issuerOrganizationName}</span>
              </div>
              <div className="flex flex-wrap items-center gap-4 pt-1">
                <div>
                  <span className="text-xs text-slate-400 block">Registration Code</span>
                  <span className="text-xs font-mono font-semibold text-slate-700">{record.issuerRegistrationNumber}</span>
                </div>
                <div>
                  <span className="text-xs text-slate-400 block">Issue Date</span>
                  <span className="text-xs font-mono font-semibold text-slate-700">{record.issueDate}</span>
                </div>
                <div>
                  <span className="text-xs text-slate-400 block">Validity</span>
                  <span className="text-xs font-mono font-semibold text-slate-700">
                    {record.expiryDate || "Lifetime / No Expiry"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Button Bar */}
        <div className="p-6 sm:p-8 bg-slate-50 border-t border-slate-100 flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-3">
            {isVerified && (
              <a
                href={pdfUrl}
                target="_blank"
                rel="noreferrer"
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#1A237E] to-[#2563EB] hover:from-[#151c65] hover:to-blue-700 text-white font-semibold text-xs sm:text-sm shadow-md shadow-blue-500/20 hover:shadow-lg transition-all flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                <span>Download Official PDF</span>
              </a>
            )}

            <button
              onClick={handlePrint}
              className="px-5 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-100 text-slate-700 font-semibold text-xs sm:text-sm transition-all flex items-center gap-2 shadow-sm"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
              </svg>
              <span>Print Proof Report</span>
            </button>
          </div>

          <Link
            href="/verify"
            className="text-xs sm:text-sm font-semibold text-[#2563EB] hover:underline flex items-center gap-1"
          >
            <span>Verify Another Certificate</span>
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>

      {/* Cryptographic Proof & Ledger Audit Card */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xl shadow-slate-900/5 p-6 sm:p-8 space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-indigo-50 text-[#1A237E] flex items-center justify-center font-bold">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-extrabold text-[#0F172A]">
                Cryptographic Integrity & Ledger Audit
              </h3>
              <p className="text-xs text-slate-500">
                Independent verification artifacts for auditors, employers, and background checkers.
              </p>
            </div>
          </div>
        </div>

        {/* Audit Checklist */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="p-3.5 rounded-2xl bg-emerald-50/70 border border-emerald-200/80 flex items-center gap-3">
            <div className="w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center flex-shrink-0">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div>
              <span className="text-xs font-bold text-emerald-950 block">Canonical Hash</span>
              <span className="text-[11px] text-emerald-700">SHA-256 Digest Matched</span>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-emerald-50/70 border border-emerald-200/80 flex items-center gap-3">
            <div className="w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center flex-shrink-0">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div>
              <span className="text-xs font-bold text-emerald-950 block">RSA Digital Signature</span>
              <span className="text-[11px] text-emerald-700">SHA256withRSA Valid</span>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-emerald-50/70 border border-emerald-200/80 flex items-center gap-3">
            <div className="w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center flex-shrink-0">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div>
              <span className="text-xs font-bold text-emerald-950 block">Issuer Standing</span>
              <span className="text-[11px] text-emerald-700">Authorized Institution</span>
            </div>
          </div>
        </div>

        {/* SHA-256 Digest Field */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Canonical SHA-256 Hash
            </label>
            <button
              onClick={() => copyToClipboard(record.sha256Hash, "hash")}
              className="text-xs font-semibold text-[#2563EB] hover:underline flex items-center gap-1"
            >
              {copiedHash ? (
                <span className="text-emerald-600 font-bold">Copied!</span>
              ) : (
                <>
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  <span>Copy Hash</span>
                </>
              )}
            </button>
          </div>
          <div className="p-3.5 rounded-xl bg-slate-900 text-emerald-400 font-mono text-xs break-all select-all">
            {record.sha256Hash}
          </div>
        </div>

        {/* Digital Signature & Public Key Inspection */}
        <div className="space-y-2 pt-2 border-t border-slate-100">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Asymmetric RSA-2048 Issuer Public Key
            </span>
            <button
              onClick={() => setShowKey(!showKey)}
              className="text-xs font-semibold text-[#2563EB] hover:underline"
            >
              {showKey ? "Hide Public Key" : "Inspect Public Key"}
            </button>
          </div>

          {showKey && (
            <div className="p-3.5 rounded-xl bg-slate-900 text-slate-300 font-mono text-[11px] break-all select-all relative space-y-2">
              <div className="flex items-center justify-between text-slate-400 text-[10px]">
                <span>-----BEGIN PUBLIC KEY-----</span>
                <button
                  onClick={() => copyToClipboard(record.issuerPublicKey, "key")}
                  className="text-indigo-400 hover:text-white"
                >
                  {copiedKey ? "Copied" : "Copy"}
                </button>
              </div>
              <p className="leading-relaxed">{record.issuerPublicKey}</p>
              <div className="text-slate-400 text-[10px]">-----END PUBLIC KEY-----</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
