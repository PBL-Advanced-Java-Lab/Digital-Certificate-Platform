"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { api, ApiError, CertificateTypeResponse } from "@/lib/api";
import DashboardShell from "@/components/dashboard/DashboardShell";

export default function NewCertificatePage() {
  const { user, isAuthenticated, isLoading, isIssuer } = useAuth();
  const router = useRouter();

  const [types, setTypes] = useState<CertificateTypeResponse[]>([]);
  const [selectedTypeId, setSelectedTypeId] = useState<number | "">("");
  const [recipientName, setRecipientName] = useState("");
  const [recipientEmail, setRecipientEmail] = useState("");
  const [courseOrTitle, setCourseOrTitle] = useState("");
  const [expiryDate, setExpiryDate] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api.certificateTypes
      .getActive()
      .then((data) => {
        setTypes(data);
        if (data.length > 0) {
          setSelectedTypeId(data[0].id);
        }
      })
      .catch(() => {
        // Fallback default
        setTypes([
          { id: 1, name: "University Degree", code: "DEGREE", active: true, createdAt: "" },
          { id: 2, name: "Academic Diploma", code: "DIPLOMA", active: true, createdAt: "" },
          { id: 3, name: "Professional Certification", code: "PROFESSIONAL_CERTIFICATION", active: true, createdAt: "" },
        ]);
        setSelectedTypeId(1);
      });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTypeId) {
      setError("Please select a valid certificate type.");
      return;
    }

    setError(null);
    setIsSubmitting(true);

    try {
      const response = await api.certificates.issue({
        recipientName: recipientName.trim(),
        recipientEmail: recipientEmail.trim().toLowerCase(),
        courseOrTitle: courseOrTitle.trim(),
        certificateTypeId: Number(selectedTypeId),
        expiryDate: expiryDate ? expiryDate : undefined,
      });

      router.push(`/certificates/${response.certificateId}`);
    } catch (err: any) {
      const apiErr = err as ApiError;
      setError(apiErr.message || "Failed to issue certificate. Please verify details.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center py-20">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="flex-1 flex items-center justify-center py-16 px-4 gradient-mesh">
        <div className="max-w-md w-full p-8 rounded-2xl bg-white border border-slate-200 shadow-xl text-center space-y-4">
          <h2 className="text-2xl font-bold text-slate-900">Sign In Required</h2>
          <p className="text-sm text-slate-600">
            You must be signed in as an approved issuer to issue digital certificates.
          </p>
          <Link
            href="/login"
            className="inline-block w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-[#1A237E] to-[#2563EB] text-white font-semibold text-sm shadow-md"
          >
            Sign In
          </Link>
        </div>
      </div>
    );
  }

  const selectedTypeObj = types.find((t) => t.id === Number(selectedTypeId));

  return (
    <DashboardShell
      title="Issue Digital Certificate"
      subtitle="Digitally sign, seal, and publish verifiable credentials with SHA-256 integrity"
      activeNav="issue-new"
      actions={
        <Link
          href="/issuer"
          className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 border border-slate-200 rounded-lg bg-white shadow-sm hover:bg-slate-50 transition-colors"
        >
          ← Back to Ledger
        </Link>
      }
    >
      <div className="space-y-8">

      {error && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-sm flex items-start gap-3">
          <svg className="w-5 h-5 flex-shrink-0 text-rose-500 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>{error}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Issuance Form */}
        <div className="lg:col-span-6 p-6 sm:p-8 rounded-2xl bg-white border border-slate-200 shadow-xl space-y-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                Certificate Category / Type
              </label>
              <select
                required
                value={selectedTypeId}
                onChange={(e) => setSelectedTypeId(Number(e.target.value))}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
              >
                {types.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name} ({t.code})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                Recipient Full Name
              </label>
              <input
                type="text"
                required
                value={recipientName}
                onChange={(e) => setRecipientName(e.target.value)}
                placeholder="e.g. Priyanka Sharma"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#2563EB] placeholder:text-slate-400"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                Recipient Email
              </label>
              <input
                type="email"
                required
                value={recipientEmail}
                onChange={(e) => setRecipientEmail(e.target.value)}
                placeholder="priyanka@example.com"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#2563EB] placeholder:text-slate-400"
              />
              <p className="mt-1 text-[11px] text-slate-400">
                The certificate will automatically link to the recipient’s holder dashboard.
              </p>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                Course, Degree, or Credential Title
              </label>
              <input
                type="text"
                required
                value={courseOrTitle}
                onChange={(e) => setCourseOrTitle(e.target.value)}
                placeholder="e.g. Master of Science in Cybersecurity & Distributed Systems"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#2563EB] placeholder:text-slate-400"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                Expiry Date (Optional)
              </label>
              <input
                type="date"
                value={expiryDate}
                onChange={(e) => setExpiryDate(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
              />
              <p className="mt-1 text-[11px] text-slate-400">
                Leave empty for a permanent, lifetime credential with no expiration.
              </p>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-[#1A237E] to-[#2563EB] hover:from-[#151c65] hover:to-blue-700 text-white font-semibold text-sm shadow-md shadow-blue-500/20 hover:shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                    </svg>
                    <span>Signing & Publishing...</span>
                  </>
                ) : (
                  <span>Sign, Seal & Issue Certificate</span>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Right Column: Live Document Preview Card */}
        <div className="lg:col-span-6 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Live Certificate Layout Preview
            </span>
            <span className="text-xs text-blue-600 font-mono">Dynamic Render</span>
          </div>

          <div className="p-8 rounded-2xl bg-white border-4 border-[#1A237E] shadow-2xl relative overflow-hidden space-y-6">
            {/* Inner Gold Border */}
            <div className="border-2 border-[#C2964B] p-6 text-center space-y-4">
              <div className="text-[11px] font-bold tracking-widest uppercase text-[#1A237E]">
                CertiGuard Digital Credential Platform
              </div>

              <div className="space-y-1">
                <h3 className="text-2xl font-black text-[#0F172A] tracking-tight uppercase">
                  Certificate of Achievement
                </h3>
                <p className="text-xs text-slate-500">
                  This official verifiable credential is presented to
                </p>
              </div>

              <div className="py-2 border-b border-slate-200">
                <p className="text-xl font-extrabold text-[#1A237E]">
                  {recipientName.trim() ? recipientName.toUpperCase() : "RECIPIENT FULL NAME"}
                </p>
              </div>

              <div className="space-y-1">
                <p className="text-xs text-slate-500">for successfully completing</p>
                <p className="text-sm font-bold text-slate-900">
                  {courseOrTitle.trim() ? courseOrTitle : "Course / Credential Title"}
                </p>
                <p className="text-[11px] text-slate-400">
                  Category: {selectedTypeObj ? selectedTypeObj.name : "Degree"}
                </p>
              </div>

              <div className="pt-4 flex items-center justify-between text-left text-xs border-t border-slate-100">
                <div>
                  <span className="text-[10px] text-slate-400 block uppercase">Issuing Authority</span>
                  <span className="font-bold text-slate-800">{user?.fullName || "Verified Institution"}</span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-slate-400 block uppercase">Validity</span>
                  <span className="font-bold text-emerald-600">
                    {expiryDate ? expiryDate : "Permanent (Lifetime)"}
                  </span>
                </div>
              </div>
            </div>

            {/* Cryptographic Footnote */}
            <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono pt-2">
              <span className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                SHA-256 + RSA-2048 Protected
              </span>
              <span>ID: CG-2026-AUTOGEN</span>
            </div>
          </div>
        </div>
      </div>
      </div>
    </DashboardShell>
  );
}
