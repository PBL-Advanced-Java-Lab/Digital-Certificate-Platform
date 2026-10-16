"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import DashboardShell from "@/components/dashboard/DashboardShell";
import { useAuth } from "@/context/AuthContext";
import {
  api,
  ApiError,
  CertificateResponse,
  IssuerResponse,
} from "@/lib/api";

export default function IssuerDashboardPage() {
  const router = useRouter();
  const { user, isAuthenticated, isIssuer, isLoading: authLoading } = useAuth();

  const [profile, setProfile] = useState<IssuerResponse | null>(null);
  const [certificates, setCertificates] = useState<CertificateResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Search & Filter
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"ALL" | "ACTIVE" | "REVOKED">("ALL");

  // Revocation Modal
  const [selectedCertForRevoke, setSelectedCertForRevoke] = useState<CertificateResponse | null>(null);
  const [revokeReason, setRevokeReason] = useState("");
  const [isRevoking, setIsRevoking] = useState(false);
  const [revokeError, setRevokeError] = useState<string | null>(null);

  const loadIssuerData = async () => {
    setIsLoading(true);
    setErrorMsg(null);

    try {
      const [issuerProfile, issuedCerts] = await Promise.all([
        api.issuer.getMyProfile().catch(() => null),
        api.certificates.getMyIssued().catch(() => []),
      ]);

      setProfile(issuerProfile);
      setCertificates(issuedCerts);
    } catch (err: any) {
      setErrorMsg("Failed to load issuer dashboard data.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!authLoading) {
      if (!isAuthenticated) {
        router.push("/login");
      } else {
        loadIssuerData();
      }
    }
  }, [authLoading, isAuthenticated]);

  const handleRevoke = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCertForRevoke || !revokeReason.trim()) return;

    setIsRevoking(true);
    setRevokeError(null);

    try {
      const updated = await api.certificates.revoke(
        selectedCertForRevoke.certificateId,
        revokeReason.trim()
      );

      setCertificates((prev) =>
        prev.map((c) => (c.certificateId === updated.certificateId ? updated : c))
      );
      setSelectedCertForRevoke(null);
      setRevokeReason("");
    } catch (err: any) {
      setRevokeError(err.message || "Failed to revoke certificate.");
    } finally {
      setIsRevoking(false);
    }
  };

  const activeCerts = certificates.filter((c) => c.status === "ACTIVE");
  const revokedCerts = certificates.filter((c) => c.status === "REVOKED");

  const filteredCerts = certificates.filter((c) => {
    const matchesStatus =
      statusFilter === "ALL" || c.status === statusFilter;
    const matchesSearch =
      c.recipientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.certificateId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.courseOrTitle.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  return (
    <DashboardShell
      title="Issuer Operations & Issuance Hub"
      subtitle={
        profile
          ? `${profile.organizationName} • Official Reg: ${profile.registrationNumber}`
          : "Manage organization credentials, issue verified records, and handle revocations."
      }
      activeNav="issuer-dashboard"
      actions={
        <div className="flex items-center gap-2">
          <Link
            href="/certificates/new"
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#1A237E] to-[#2563EB] hover:from-[#151c65] hover:to-blue-700 text-white text-xs font-semibold transition-all shadow-md flex items-center gap-1.5"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            <span>Issue Certificate</span>
          </Link>
        </div>
      }
    >
      <div className="space-y-8">
        {/* If user does not have an approved issuer profile */}
        {!isIssuer && (
          <div className="p-6 rounded-3xl bg-amber-50 border border-amber-200 text-amber-900 space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-200 text-amber-800 flex items-center justify-center font-bold">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h4 className="font-bold">Organization Application Status</h4>
                <p className="text-xs text-amber-800">
                  {profile
                    ? `Your registration for '${profile.organizationName}' is currently ${profile.status}. You will be able to issue certificates once approved.`
                    : "You do not have a registered institution yet."}
                </p>
              </div>
            </div>
            {!profile && (
              <Link
                href="/issuer/register"
                className="inline-block px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-semibold text-xs shadow-sm transition-all"
              >
                Submit Institutional Application
              </Link>
            )}
          </div>
        )}

        {/* KPI Metric Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-xl shadow-slate-900/5 space-y-1">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Total Issued
            </span>
            <div className="flex items-baseline justify-between">
              <span className="text-3xl font-black text-[#0F172A]">{certificates.length}</span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-extrabold bg-blue-100 text-[#2563EB]">
                All Time
              </span>
            </div>
            <p className="text-xs text-slate-500">Credentials published to ledger</p>
          </div>

          <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-xl shadow-slate-900/5 space-y-1">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Active Credentials
            </span>
            <div className="flex items-baseline justify-between">
              <span className="text-3xl font-black text-[#0F172A]">{activeCerts.length}</span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-extrabold bg-emerald-100 text-emerald-800">
                Valid
              </span>
            </div>
            <p className="text-xs text-slate-500">Currently verifiable certificates</p>
          </div>

          <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-xl shadow-slate-900/5 space-y-1">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Revoked Credentials
            </span>
            <div className="flex items-baseline justify-between">
              <span className="text-3xl font-black text-[#0F172A]">{revokedCerts.length}</span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-extrabold bg-rose-100 text-rose-800">
                Invalidated
              </span>
            </div>
            <p className="text-xs text-slate-500">Revoked with audited reason</p>
          </div>

          <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-xl shadow-slate-900/5 space-y-1">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              RSA Identity State
            </span>
            <div className="flex items-baseline justify-between">
              <span className="text-xl font-bold text-emerald-600">Active (2048-bit)</span>
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
            </div>
            <p className="text-xs text-slate-500">SHA256withRSA signature keys active</p>
          </div>
        </div>

        {/* Certificate Table with Search & Status Filters */}
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xl shadow-slate-900/5 overflow-hidden">
          {/* Header & Filter Controls */}
          <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-bold text-[#0F172A]">Issued Credentials Registry</h3>
              <p className="text-xs text-slate-500">Manage, inspect, and revoke authoritative credentials.</p>
            </div>

            <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
              {/* Search Bar */}
              <div className="relative flex-1 sm:w-64">
                <input
                  type="text"
                  placeholder="Search recipient or ID..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
                />
                <svg className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>

              {/* Status Filter Chips */}
              <div className="inline-flex p-1 rounded-xl bg-slate-100 text-xs">
                <button
                  onClick={() => setStatusFilter("ALL")}
                  className={`px-3 py-1 rounded-lg font-semibold transition-all ${
                    statusFilter === "ALL" ? "bg-white text-[#0F172A] shadow-sm" : "text-slate-600"
                  }`}
                >
                  All ({certificates.length})
                </button>
                <button
                  onClick={() => setStatusFilter("ACTIVE")}
                  className={`px-3 py-1 rounded-lg font-semibold transition-all ${
                    statusFilter === "ACTIVE" ? "bg-white text-emerald-700 shadow-sm" : "text-slate-600"
                  }`}
                >
                  Active ({activeCerts.length})
                </button>
                <button
                  onClick={() => setStatusFilter("REVOKED")}
                  className={`px-3 py-1 rounded-lg font-semibold transition-all ${
                    statusFilter === "REVOKED" ? "bg-white text-rose-700 shadow-sm" : "text-slate-600"
                  }`}
                >
                  Revoked ({revokedCerts.length})
                </button>
              </div>
            </div>
          </div>

          {/* Table Contents */}
          {filteredCerts.length === 0 ? (
            <div className="p-12 text-center text-sm text-slate-500 space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <p className="font-semibold text-slate-700">No credentials found.</p>
              <p className="text-xs text-slate-400">
                {searchQuery || statusFilter !== "ALL"
                  ? "Try clearing your filters or search keywords."
                  : "Click 'Issue Certificate' above to issue your first verified credential."}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-100 text-xs font-bold uppercase text-slate-500">
                    <th className="py-3.5 px-6">Certificate ID</th>
                    <th className="py-3.5 px-6">Recipient</th>
                    <th className="py-3.5 px-6">Title & Category</th>
                    <th className="py-3.5 px-6">Issue Date</th>
                    <th className="py-3.5 px-6">Status</th>
                    <th className="py-3.5 px-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredCerts.map((cert) => (
                    <tr key={cert.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="py-4 px-6 font-mono text-xs font-bold text-[#1A237E]">
                        <Link href={`/certificates/${cert.certificateId}`} className="hover:underline">
                          {cert.certificateId}
                        </Link>
                      </td>
                      <td className="py-4 px-6">
                        <span className="font-bold text-[#0F172A] block">{cert.recipientName}</span>
                        <span className="text-xs text-slate-400 font-mono">{cert.recipientEmail}</span>
                      </td>
                      <td className="py-4 px-6">
                        <span className="font-semibold text-slate-800 block text-xs sm:text-sm">
                          {cert.courseOrTitle}
                        </span>
                        <span className="text-[11px] text-slate-500">{cert.certificateTypeName}</span>
                      </td>
                      <td className="py-4 px-6 text-xs text-slate-600 font-mono">
                        {cert.issueDate}
                      </td>
                      <td className="py-4 px-6">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                            cert.status === "ACTIVE"
                              ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                              : "bg-rose-100 text-rose-800 border border-rose-300"
                          }`}
                        >
                          {cert.status}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-right space-x-2">
                        <a
                          href={api.certificates.getPdfUrl(cert.certificateId)}
                          target="_blank"
                          rel="noreferrer"
                          className="px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold transition-all inline-block shadow-sm"
                        >
                          PDF
                        </a>
                        <Link
                          href={`/certificates/${cert.certificateId}`}
                          className="px-3 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-[#2563EB] text-xs font-semibold transition-all inline-block"
                        >
                          Details
                        </Link>
                        {cert.status === "ACTIVE" && (
                          <button
                            onClick={() => {
                              setSelectedCertForRevoke(cert);
                              setRevokeReason("");
                              setRevokeError(null);
                            }}
                            className="px-3 py-1.5 rounded-lg border border-rose-200 hover:bg-rose-50 text-rose-700 text-xs font-semibold transition-all"
                          >
                            Revoke
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Revocation Modal */}
      {selectedCertForRevoke && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 space-y-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold text-rose-900">Revoke Certificate</h3>
              <button
                onClick={() => setSelectedCertForRevoke(null)}
                className="text-slate-400 hover:text-slate-600"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <p className="text-xs text-slate-600">
              Revoking certificate <span className="font-mono font-bold text-slate-800">{selectedCertForRevoke.certificateId}</span> for <span className="font-bold">{selectedCertForRevoke.recipientName}</span> will immediately render it invalid across all public verification channels.
            </p>

            <form onSubmit={handleRevoke} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Official Revocation Reason
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="e.g. Credential superseded, error in grade reporting, academic integrity committee finding..."
                  value={revokeReason}
                  onChange={(e) => setRevokeReason(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
                />
              </div>

              {revokeError && (
                <div className="p-3 rounded-xl bg-rose-50 text-rose-700 text-xs">
                  {revokeError}
                </div>
              )}

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedCertForRevoke(null)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 text-xs font-semibold hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isRevoking}
                  className="px-6 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold shadow-md"
                >
                  {isRevoking ? "Revoking..." : "Confirm Revocation"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DashboardShell>
  );
}
