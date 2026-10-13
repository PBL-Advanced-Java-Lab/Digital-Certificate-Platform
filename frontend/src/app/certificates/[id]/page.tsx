"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { api, ApiError, CertificateResponse } from "@/lib/api";

export default function CertificateDetailPage() {
  const params = useParams();
  const router = useRouter();
  const certificateId = String(params.id || "");
  const { user, isIssuer, isAdmin } = useAuth();

  const [cert, setCert] = useState<CertificateResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Revocation Modal State
  const [showRevokeModal, setShowRevokeModal] = useState(false);
  const [revokeReason, setRevokeReason] = useState("");
  const [isRevoking, setIsRevoking] = useState(false);
  const [revokeError, setRevokeError] = useState<string | null>(null);

  const [copiedHash, setCopiedHash] = useState(false);

  useEffect(() => {
    if (certificateId) {
      api.certificates
        .getById(certificateId)
        .then((data) => setCert(data))
        .catch((err: any) => {
          const apiErr = err as ApiError;
          setError(apiErr.message || "Certificate not found or unavailable.");
        })
        .finally(() => setIsLoading(false));
    }
  }, [certificateId]);

  const handleCopyHash = () => {
    if (cert?.sha256Hash) {
      navigator.clipboard.writeText(cert.sha256Hash);
      setCopiedHash(true);
      setTimeout(() => setCopiedHash(false), 2000);
    }
  };

  const handleRevoke = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!revokeReason.trim()) {
      setRevokeError("Please specify a reason for revocation.");
      return;
    }

    setIsRevoking(true);
    setRevokeError(null);

    try {
      const updated = await api.certificates.revoke(certificateId, revokeReason.trim());
      setCert(updated);
      setShowRevokeModal(false);
    } catch (err: any) {
      const apiErr = err as ApiError;
      setRevokeError(apiErr.message || "Failed to revoke certificate.");
    } finally {
      setIsRevoking(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center py-20">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error || !cert) {
    return (
      <div className="flex-1 flex items-center justify-center py-16 px-4">
        <div className="max-w-md w-full p-8 rounded-2xl bg-white border border-slate-200 shadow-xl text-center space-y-4">
          <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 mx-auto flex items-center justify-center font-bold text-xl">
            !
          </div>
          <h2 className="text-xl font-bold text-slate-900">Certificate Unavailable</h2>
          <p className="text-sm text-slate-600">{error || "Unable to locate certificate record."}</p>
          <Link
            href="/verify"
            className="inline-block py-2.5 px-4 rounded-xl bg-gradient-to-r from-[#1A237E] to-[#2563EB] text-white text-xs font-semibold"
          >
            Go to Verification Portal
          </Link>
        </div>
      </div>
    );
  }

  const pdfDownloadUrl = api.certificates.getPdfUrl(cert.certificateId);
  const canRevoke = (isIssuer || isAdmin) && cert.status === "ACTIVE";

  return (
    <div className="flex-1 py-10 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto w-full space-y-8">
      {/* Top Banner Navigation */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span
              className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                cert.status === "ACTIVE"
                  ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                  : cert.status === "REVOKED"
                  ? "bg-rose-100 text-rose-800 border border-rose-300"
                  : "bg-amber-100 text-amber-800 border border-amber-300"
              }`}
            >
              {cert.status === "ACTIVE"
                ? "Cryptographically Valid"
                : cert.status === "REVOKED"
                ? "Revoked Credential"
                : "Expired"}
            </span>
            <span className="text-xs font-mono text-slate-400">ID: {cert.certificateId}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0F172A] tracking-tight">
            {cert.courseOrTitle}
          </h1>
          <p className="text-xs text-slate-500">
            Issued by <strong className="text-slate-800">{cert.issuerOrganizationName}</strong> on {cert.issueDate}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-3">
          <a
            href={pdfDownloadUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#1A237E] to-[#2563EB] hover:from-[#151c65] hover:to-blue-700 text-white font-semibold text-xs shadow-md shadow-blue-500/20 hover:shadow-lg transition-all flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            <span>Download Official PDF</span>
          </a>

          {canRevoke && (
            <button
              onClick={() => setShowRevokeModal(true)}
              className="px-4 py-2.5 rounded-xl border border-rose-200 text-rose-600 hover:bg-rose-50 text-xs font-semibold transition-colors"
            >
              Revoke Certificate
            </button>
          )}
        </div>
      </div>

      {/* Revocation Warning Box if Revoked */}
      {cert.status === "REVOKED" && (
        <div className="p-6 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 space-y-2">
          <div className="flex items-center gap-2 font-bold text-sm">
            <svg className="w-5 h-5 text-rose-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <span>Certificate Revocation Notice</span>
          </div>
          <p className="text-xs text-rose-700 leading-relaxed">
            This credential was permanently revoked by the issuing authority on{" "}
            {cert.revokedAt ? new Date(cert.revokedAt).toLocaleString() : "record"}.
          </p>
          {cert.revocationReason && (
            <div className="text-xs bg-white/70 p-3 rounded-lg border border-rose-200 text-rose-900">
              <strong>Official Reason:</strong> {cert.revocationReason}
            </div>
          )}
        </div>
      )}

      {/* Main Grid: Details & QR Block */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Detail Cards */}
        <div className="lg:col-span-8 space-y-6">
          <div className="p-6 sm:p-8 rounded-2xl bg-white border border-slate-200 shadow-xl space-y-6">
            <h3 className="text-xs uppercase font-bold tracking-wider text-slate-400">
              Credential Specifications
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Recipient Full Name
                </span>
                <p className="text-base font-bold text-slate-900">{cert.recipientName}</p>
                <p className="text-xs text-slate-500">{cert.recipientEmail}</p>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Issuing Organization
                </span>
                <p className="text-base font-bold text-[#1A237E]">{cert.issuerOrganizationName}</p>
                <p className="text-xs text-slate-500 font-mono">Reg: {cert.issuerRegistrationNumber}</p>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Credential Category
                </span>
                <p className="text-sm font-bold text-slate-800">{cert.certificateTypeName}</p>
                <p className="text-xs text-slate-500 font-mono">Code: {cert.certificateTypeCode}</p>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Validity Period
                </span>
                <p className="text-sm font-bold text-slate-800">Issued: {cert.issueDate}</p>
                <p className="text-xs text-slate-500">
                  Expiry: {cert.expiryDate ? cert.expiryDate : "Permanent (Lifetime)"}
                </p>
              </div>
            </div>
          </div>

          {/* Cryptographic Hash & Digital Signature */}
          <div className="p-6 sm:p-8 rounded-2xl bg-slate-900 text-white space-y-4 shadow-xl">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono uppercase tracking-wider text-slate-400 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                Cryptographic SHA-256 Proof & Signature
              </span>
              <button
                onClick={handleCopyHash}
                className="text-xs text-blue-400 hover:text-blue-300 font-mono"
              >
                {copiedHash ? "Copied!" : "Copy SHA-256"}
              </button>
            </div>

            <div className="space-y-1">
              <span className="text-[11px] text-slate-400 uppercase tracking-wider">
                SHA-256 Checksum:
              </span>
              <p className="font-mono text-xs text-slate-200 break-all bg-slate-800/80 p-3 rounded-lg border border-slate-700">
                {cert.sha256Hash}
              </p>
            </div>

            <div className="space-y-1">
              <span className="text-[11px] text-slate-400 uppercase tracking-wider">
                RSA-2048 Digital Signature (SHA256withRSA):
              </span>
              <p className="font-mono text-[11px] text-slate-400 break-all bg-slate-800/80 p-3 rounded-lg border border-slate-700 max-h-24 overflow-y-auto">
                {cert.digitalSignature}
              </p>
            </div>
          </div>
        </div>

        {/* Right: Embedded QR Panel */}
        <div className="lg:col-span-4 p-6 rounded-2xl bg-white border border-slate-200 shadow-xl text-center space-y-4">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Dynamic Verification QR
          </span>

          <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-center">
            {cert.qrCodeBase64 ? (
              <img
                src={cert.qrCodeBase64}
                alt={`QR code for ${cert.certificateId}`}
                className="w-48 h-48 object-contain"
              />
            ) : (
              <div className="w-48 h-48 bg-slate-200 animate-pulse rounded-lg"></div>
            )}
          </div>

          <div className="space-y-2">
            <p className="text-xs text-slate-500 leading-relaxed">
              Scan this QR code with any smartphone or camera to load live tamper-proof verification on the public portal.
            </p>
            <Link
              href={`/verify?id=${encodeURIComponent(cert.certificateId)}`}
              className="text-xs font-semibold text-[#2563EB] hover:underline block"
            >
              Open Public Verification Result →
            </Link>
          </div>
        </div>
      </div>

      {/* Revocation Confirmation Modal */}
      {showRevokeModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-white rounded-2xl p-6 shadow-2xl space-y-4">
            <h3 className="text-lg font-bold text-slate-900">Confirm Certificate Revocation</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Revoking a certificate is an irreversible cryptographic action. Once revoked, public verifications will flag this credential as invalid.
            </p>

            {revokeError && (
              <div className="p-3 rounded-lg bg-rose-50 text-rose-700 text-xs">
                {revokeError}
              </div>
            )}

            <form onSubmit={handleRevoke} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1">
                  Reason for Revocation *
                </label>
                <textarea
                  rows={3}
                  required
                  value={revokeReason}
                  onChange={(e) => setRevokeReason(e.target.value)}
                  placeholder="e.g. Credential invalidated due to academic integrity violation or administrative correction."
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-rose-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowRevokeModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isRevoking}
                  className="px-4 py-2 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-lg shadow disabled:opacity-50"
                >
                  {isRevoking ? "Revoking..." : "Confirm Revocation"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
