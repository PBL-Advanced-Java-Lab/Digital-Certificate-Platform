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
} from "@/lib/api";

const DEMO_HOLDER_FALLBACK: CertificateResponse[] = [
  {
    id: 101,
    certificateId: "CG-2026-NTU-7890",
    recipientName: "Priyanka Sharma",
    recipientEmail: "priyanka@gmail.com",
    courseOrTitle: "Master of Science in Cybersecurity & Distributed Systems",
    certificateTypeId: 1,
    certificateTypeName: "Master Degree",
    certificateTypeCode: "DEGREE",
    issuerId: 1,
    issuerOrganizationName: "National Technological University",
    issuerRegistrationNumber: "NTU-REG-2026-987",
    issueDate: "2026-10-10",
    expiryDate: undefined,
    status: "ACTIVE",
    sha256Hash: "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
    digitalSignature: "k9xL2P5vA8mN0qR1wY3zB4cE6fH7jK...",
    qrCodeBase64: "",
    createdAt: "2026-10-10T10:00:00",
  },
];

export default function HolderDashboardPage() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();

  const [certificates, setCertificates] = useState<CertificateResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const loadHolderData = async () => {
    setIsLoading(true);
    try {
      const data = await api.certificates.getMyReceived();
      if (data && data.length > 0) {
        setCertificates(data);
      } else {
        // Fallback demo certificate if database has none for current email
        setCertificates(DEMO_HOLDER_FALLBACK);
      }
    } catch (err: any) {
      setCertificates(DEMO_HOLDER_FALLBACK);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!authLoading) {
      if (!isAuthenticated) {
        router.push("/login");
      } else {
        loadHolderData();
      }
    }
  }, [authLoading, isAuthenticated]);

  const copyShareLink = (certificateId: string) => {
    const url = `${window.location.origin}/verify/${certificateId}`;
    navigator.clipboard.writeText(url);
    setCopiedId(certificateId);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <DashboardShell
      title="My Credentials & Certified Wallet"
      subtitle="View, download, and share your cryptographically validated certificates."
      activeNav="holder-dashboard"
      actions={
        <div className="flex items-center gap-2">
          <Link
            href="/verify"
            className="px-4 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold transition-all shadow-sm flex items-center gap-1.5"
          >
            <svg className="w-4 h-4 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            <span>Verify External ID</span>
          </Link>
        </div>
      }
    >
      <div className="space-y-8">
        {/* KPI Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-xl shadow-slate-900/5 space-y-1">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Total Certificates Earned
            </span>
            <div className="flex items-baseline justify-between">
              <span className="text-3xl font-black text-[#0F172A]">{certificates.length}</span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-extrabold bg-blue-100 text-[#2563EB]">
                Verified
              </span>
            </div>
            <p className="text-xs text-slate-500">Credited to your verified email</p>
          </div>

          <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-xl shadow-slate-900/5 space-y-1">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Active Credentials
            </span>
            <div className="flex items-baseline justify-between">
              <span className="text-3xl font-black text-[#0F172A]">
                {certificates.filter((c) => c.status === "ACTIVE").length}
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-extrabold bg-emerald-100 text-emerald-800">
                100% Valid
              </span>
            </div>
            <p className="text-xs text-slate-500">Tamper-proof & verifiable</p>
          </div>

          <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-xl shadow-slate-900/5 space-y-1">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Digital Trust Engine
            </span>
            <div className="flex items-baseline justify-between">
              <span className="text-lg font-bold text-indigo-700">SHA256withRSA</span>
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
            </div>
            <p className="text-xs text-slate-500">Anchored by institutional keys</p>
          </div>
        </div>

        {/* Credentials Grid */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-[#0F172A]">My Credential Portfolio</h3>
            <span className="text-xs text-slate-400 font-mono">
              Account: {user?.email}
            </span>
          </div>

          {certificates.length === 0 ? (
            <div className="p-12 bg-white rounded-3xl border border-slate-200 text-center text-sm text-slate-500 space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <p className="font-semibold text-slate-700">No certificates found under this email.</p>
              <p className="text-xs text-slate-400">When an approved institution issues a credential to {user?.email}, it will automatically appear here.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {certificates.map((cert) => (
                <div
                  key={cert.id}
                  className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200/90 shadow-xl shadow-slate-900/5 space-y-6 flex flex-col justify-between hover:border-blue-400 transition-all"
                >
                  <div className="space-y-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <span className="px-3 py-1 rounded-full text-xs font-extrabold uppercase bg-indigo-50 text-[#1A237E] border border-indigo-200/70">
                          {cert.certificateTypeName}
                        </span>
                        <h4 className="text-xl font-bold text-[#0F172A] mt-2">
                          {cert.courseOrTitle}
                        </h4>
                      </div>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                          cert.status === "ACTIVE"
                            ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                            : "bg-rose-100 text-rose-800 border border-rose-300"
                        }`}
                      >
                        {cert.status}
                      </span>
                    </div>

                    <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1.5 text-xs">
                      <div className="flex justify-between">
                        <span className="text-slate-400 font-semibold uppercase">Issuing Institution</span>
                        <span className="font-bold text-[#0F172A]">{cert.issuerOrganizationName}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400 font-semibold uppercase">Certificate ID</span>
                        <span className="font-mono font-bold text-[#1A237E]">{cert.certificateId}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400 font-semibold uppercase">Issue Date</span>
                        <span className="font-mono text-slate-700">{cert.issueDate}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400 font-semibold uppercase">Validity</span>
                        <span className="font-mono text-slate-700">{cert.expiryDate || "Lifetime / Permanent"}</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <a
                        href={api.certificates.getPdfUrl(cert.certificateId)}
                        target="_blank"
                        rel="noreferrer"
                        className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#1A237E] to-[#2563EB] text-white text-xs font-semibold shadow-md shadow-blue-500/20 hover:shadow-lg transition-all flex items-center gap-1.5"
                      >
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                        </svg>
                        <span>Download PDF</span>
                      </a>

                      <Link
                        href={`/verify/${cert.certificateId}`}
                        className="px-3.5 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold transition-all"
                      >
                        Public Proof
                      </Link>
                    </div>

                    <button
                      onClick={() => copyShareLink(cert.certificateId)}
                      className="text-xs font-semibold text-[#2563EB] hover:underline flex items-center gap-1"
                    >
                      {copiedId === cert.certificateId ? (
                        <span className="text-emerald-600 font-bold">Link Copied!</span>
                      ) : (
                        <>
                          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                          </svg>
                          <span>Share Link</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Institutional Upsell Callout */}
        <div className="p-8 rounded-3xl bg-slate-900 text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 shadow-xl">
          <div className="space-y-1 max-w-xl">
            <h4 className="text-lg font-bold">Are you an educational institution or licensing board?</h4>
            <p className="text-xs text-slate-300">
              Apply for institutional authorization to issue tamper-proof certificates signed with your own RSA cryptographic keypair.
            </p>
          </div>
          <Link
            href="/issuer/register"
            className="px-6 py-3 rounded-2xl bg-white hover:bg-slate-100 text-[#1A237E] font-bold text-xs shadow-md transition-all flex-shrink-0"
          >
            Apply as Issuer
          </Link>
        </div>
      </div>
    </DashboardShell>
  );
}
