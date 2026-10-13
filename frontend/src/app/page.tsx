"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";

export default function HomePage() {
  const [certId, setCertId] = useState("");
  const router = useRouter();
  const { user, isAuthenticated, isAdmin, isIssuer } = useAuth();

  const dashboardRoute = isAdmin ? "/admin" : isIssuer ? "/issuer" : "/holder";
  const roleTitle = isAdmin ? "System Admin" : isIssuer ? "Verified Issuer" : "Credential Holder";

  const handleQuickVerify = (e: React.FormEvent) => {
    e.preventDefault();
    if (certId.trim()) {
      router.push(`/verify?id=${encodeURIComponent(certId.trim())}`);
    } else {
      router.push("/verify");
    }
  };

  return (
    <div className="flex flex-col flex-1 gradient-mesh">
      {/* Hero Section */}
      <section className="relative pt-8 pb-20 lg:pt-14 lg:pb-28 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-6">
            {/* Authenticated User Role Banner */}
            {isAuthenticated && user && (
              <div className="p-4 sm:p-4.5 rounded-2xl bg-white border border-blue-200/90 shadow-xl shadow-blue-900/5 flex flex-col sm:flex-row items-center justify-between gap-4 text-left">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#1A237E] to-[#2563EB] text-white font-bold flex items-center justify-center text-sm shadow-md shadow-blue-500/20">
                    {user.fullName?.charAt(0) || "U"}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-[#0F172A]">{user.fullName}</span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold uppercase ${
                        isAdmin ? "bg-purple-100 text-purple-700" : isIssuer ? "bg-blue-100 text-[#2563EB]" : "bg-slate-100 text-slate-700"
                      }`}>
                        {roleTitle}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500">
                      Signed in. Access your dedicated vertical navigation and control panel.
                    </p>
                  </div>
                </div>
                <Link
                  href={dashboardRoute}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#1A237E] to-[#2563EB] hover:from-[#151c65] hover:to-blue-700 text-white text-xs font-bold shadow-md shadow-blue-500/20 transition-all flex items-center gap-1.5 whitespace-nowrap"
                >
                  <span>Go to My Dashboard</span>
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </Link>
              </div>
            )}

            {/* Pill Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-blue-100/80 text-[#1A237E] border border-blue-200/80 shadow-sm">
              <span className="w-2 h-2 rounded-full bg-[#2563EB] animate-ping"></span>
              <span>Next-Gen Digital Credential Verification & Revocation</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-[#0F172A] leading-tight">
              Trust Every Credential.{" "}
              <span className="bg-gradient-to-r from-[#1A237E] via-[#2563EB] to-indigo-600 bg-clip-text text-transparent">
                Verify Every Certificate.
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-lg sm:text-xl text-slate-600 leading-relaxed">
              Empowering universities, enterprises, and certification authorities to issue tamper-proof certificates with SHA-256 cryptographic hashing, dynamic QR codes, and instant revocation tracking.
            </p>

            {/* Interactive Instant Verification Bar */}
            <div className="pt-4 max-w-2xl mx-auto">
              <form
                onSubmit={handleQuickVerify}
                className="p-2 sm:p-2.5 rounded-2xl bg-white shadow-xl shadow-blue-900/5 border border-slate-200 flex flex-col sm:flex-row gap-2"
              >
                <div className="relative flex-1 flex items-center">
                  <div className="absolute left-4 text-slate-400">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                      />
                    </svg>
                  </div>
                  <input
                    type="text"
                    value={certId}
                    onChange={(e) => setCertId(e.target.value)}
                    placeholder="Enter Certificate ID (e.g. CERT-2026-001)"
                    className="w-full pl-11 pr-4 py-3 text-sm text-slate-900 bg-transparent rounded-xl focus:outline-none placeholder:text-slate-400 font-mono"
                  />
                </div>
                <button
                  type="submit"
                  className="px-6 py-3 text-sm font-semibold text-white bg-gradient-to-r from-[#1A237E] to-[#2563EB] hover:from-[#151c65] hover:to-blue-700 rounded-xl shadow-md shadow-blue-500/20 hover:shadow-lg transition-all flex items-center justify-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <span>Verify Now</span>
                </button>
              </form>

              <div className="mt-3 flex items-center justify-center gap-2 text-xs text-slate-500">
                <span>Try sample certificate:</span>
                <button
                  type="button"
                  onClick={() => setCertId("CG-2026-NTU-7890")}
                  className="font-mono text-blue-600 hover:underline font-medium"
                >
                  CG-2026-NTU-7890
                </button>
              </div>
            </div>

            {/* Secondary Actions */}
            <div className="pt-2 flex flex-wrap items-center justify-center gap-4">
              {isAuthenticated ? (
                <Link
                  href={dashboardRoute}
                  className="px-5 py-2.5 rounded-xl border border-blue-600 bg-[#2563EB] hover:bg-blue-700 text-white font-semibold text-sm shadow-md shadow-blue-500/20 transition-all flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                  </svg>
                  <span>Open {roleTitle} Console</span>
                </Link>
              ) : (
                <Link
                  href="/login"
                  className="px-5 py-2.5 rounded-xl border border-blue-600 bg-[#2563EB] hover:bg-blue-700 text-white font-semibold text-sm shadow-md shadow-blue-500/20 transition-all flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                  </svg>
                  <span>Sign In to Dashboard</span>
                </Link>
              )}
              <Link
                href="/verify"
                className="px-5 py-2.5 rounded-xl border border-slate-300 bg-white/80 hover:bg-white text-slate-700 font-medium text-sm shadow-sm transition-all flex items-center gap-2"
              >
                <svg className="w-4 h-4 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Upload QR Code Image
              </Link>
              <Link
                href="/issuer/register"
                className="px-5 py-2.5 rounded-xl border border-blue-200 bg-blue-50/80 hover:bg-blue-100 text-[#1A237E] font-medium text-sm transition-all"
              >
                Become a Verified Issuer →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Badges Bar */}
      <section className="py-6 border-y border-slate-200/80 bg-white/60 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="space-y-1">
              <p className="text-2xl font-extrabold text-[#1A237E]">SHA-256</p>
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Cryptographic Hash</p>
            </div>
            <div className="space-y-1">
              <p className="text-2xl font-extrabold text-[#2563EB]">100%</p>
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Tamper-Proof Audit</p>
            </div>
            <div className="space-y-1">
              <p className="text-2xl font-extrabold text-emerald-600">&lt; 50ms</p>
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Public Lookup Speed</p>
            </div>
            <div className="space-y-1">
              <p className="text-2xl font-extrabold text-[#0F172A]">Real-Time</p>
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Revocation Protocol</p>
            </div>
          </div>
        </div>
      </section>

      {/* Four Security Pillars */}
      <section className="py-20 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <h2 className="text-xs uppercase font-bold tracking-widest text-[#2563EB]">Enterprise Architecture</h2>
            <p className="text-3xl font-extrabold text-[#0F172A]">
              Built for Absolute Trust and Zero Fraud
            </p>
            <p className="text-sm text-slate-600">
              CertiGuard protects organizations against diploma mills, certificate forgery, and revoked credentials with multi-layer verification.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Card 1 */}
            <div className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-sm hover:shadow-md transition-shadow space-y-4">
              <div className="w-12 h-12 rounded-xl bg-blue-50 text-[#2563EB] flex items-center justify-center font-bold">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-slate-900">Cryptographic Integrity</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Every certificate is sealed using SHA-256 digital signatures. Modifying a single letter immediately invalidates the entire checksum.
              </p>
            </div>

            {/* Card 2 */}
            <div className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-sm hover:shadow-md transition-shadow space-y-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-slate-900">Dynamic QR Verification</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Scan embedded QR codes on physical prints or digital PDFs using any standard mobile phone to authenticate against our ledger in seconds.
              </p>
            </div>

            {/* Card 3 */}
            <div className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-sm hover:shadow-md transition-shadow space-y-4">
              <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-slate-900">Instant Revocation</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Issuers and administrators can revoke credentials in real-time with documented audit logs, immediately reflecting in public verification.
              </p>
            </div>

            {/* Card 4 */}
            <div className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-sm hover:shadow-md transition-shadow space-y-4">
              <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-slate-900">Verified Organizations</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Strict multi-tier approval for institutions. Only registered and approved organizations can sign and issue certificates to recipients.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-white border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <h2 className="text-xs uppercase font-bold tracking-widest text-[#2563EB]">The Process</h2>
            <p className="text-3xl font-extrabold text-[#0F172A]">How CertiGuard Operates</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center text-center space-y-4 p-6 rounded-2xl bg-slate-50 border border-slate-200/60">
              <div className="w-12 h-12 rounded-full bg-[#1A237E] text-white flex items-center justify-center font-bold text-lg shadow-md">
                1
              </div>
              <h4 className="text-lg font-bold text-slate-900">Institution Onboarding</h4>
              <p className="text-sm text-slate-600">
                Organizations submit their registration numbers and contact details. Platform administrators review and approve issuer credentials.
              </p>
            </div>

            <div className="flex flex-col items-center text-center space-y-4 p-6 rounded-2xl bg-slate-50 border border-slate-200/60">
              <div className="w-12 h-12 rounded-full bg-[#2563EB] text-white flex items-center justify-center font-bold text-lg shadow-md">
                2
              </div>
              <h4 className="text-lg font-bold text-slate-900">Cryptographic Issuance</h4>
              <p className="text-sm text-slate-600">
                Certificates are generated with unique IDs, SHA-256 tamper-proof hashes, and verifiable QR codes ready for PDF download.
              </p>
            </div>

            <div className="flex flex-col items-center text-center space-y-4 p-6 rounded-2xl bg-slate-50 border border-slate-200/60">
              <div className="w-12 h-12 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-lg shadow-md">
                3
              </div>
              <h4 className="text-lg font-bold text-slate-900">Instant Public Verification</h4>
              <p className="text-sm text-slate-600">
                Anyone can verify credentials via Certificate ID or QR code without requiring an account, confirming authenticity and active status.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Banner */}
      <section className="py-16 bg-gradient-to-r from-[#1A237E] via-[#151c65] to-[#0F172A] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Ready to Secure Your Organization’s Credentials?
          </h2>
          <p className="text-slate-300 max-w-2xl mx-auto text-base">
            Join the digital trust network today. Register your organization, issue verifiable certificates, and eliminate credential fraud.
          </p>
          <div className="flex flex-wrap justify-center gap-4 pt-2">
            <Link
              href="/issuer/register"
              className="px-6 py-3 rounded-xl bg-white text-[#1A237E] font-bold text-sm shadow-lg hover:bg-slate-100 transition-colors"
            >
              Apply as Verified Issuer
            </Link>
            <Link
              href="/verify"
              className="px-6 py-3 rounded-xl border border-white/20 bg-white/10 hover:bg-white/20 text-white font-bold text-sm backdrop-blur transition-colors"
            >
              Test Public Verification
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
