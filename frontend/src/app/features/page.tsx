import Link from "next/link";

export default function FeaturesPage() {
  return (
    <div className="flex-1 py-12 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto w-full space-y-16">
      {/* Hero Section */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-[#2563EB] border border-blue-200">
          <span className="w-2 h-2 rounded-full bg-[#2563EB]"></span>
          Core Architectural Capabilities
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-[#0F172A] tracking-tight">
          Next-Generation Credential Security & Verification
        </h1>
        <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
          CertiGuard combines asymmetric RSA cryptography, canonical SHA-256 checksums, and instantaneous public verification to eliminate credential fraud and paper forgery.
        </p>
      </div>

      {/* 6 Core Pillars Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {/* Pillar 1 */}
        <div className="p-8 rounded-3xl bg-white border border-slate-200/90 shadow-xl shadow-slate-900/5 space-y-4 hover:border-blue-400 transition-all group">
          <div className="w-14 h-14 rounded-2xl bg-indigo-50 text-[#1A237E] flex items-center justify-center font-bold group-hover:scale-105 transition-transform">
            <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-[#0F172A]">Asymmetric RSA-2048 & SHA-256</h3>
          <p className="text-sm text-slate-600 leading-relaxed">
            Every certificate is normalized into canonical data, hashed with SHA-256, and signed using the approved issuer’s private 2048-bit key. Any alteration invalidates the mathematical signature instantly.
          </p>
          <div className="pt-2 text-xs font-semibold text-[#2563EB] flex items-center gap-1">
            <span>Mathematical Proof</span>
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </div>

        {/* Pillar 2 */}
        <div className="p-8 rounded-3xl bg-white border border-slate-200/90 shadow-xl shadow-slate-900/5 space-y-4 hover:border-emerald-400 transition-all group">
          <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold group-hover:scale-105 transition-transform">
            <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-[#0F172A]">Real-Time WebRTC QR Scanner</h3>
          <p className="text-sm text-slate-600 leading-relaxed">
            Scan physical or digital credentials with zero app installation. Uses in-browser WebRTC camera streams and client-side canvas decoding with continuous feedback and instant ledger redirect.
          </p>
          <div className="pt-2 text-xs font-semibold text-emerald-600 flex items-center gap-1">
            <span>Zero App Install</span>
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </div>

        {/* Pillar 3 */}
        <div className="p-8 rounded-3xl bg-white border border-slate-200/90 shadow-xl shadow-slate-900/5 space-y-4 hover:border-blue-400 transition-all group">
          <div className="w-14 h-14 rounded-2xl bg-blue-50 text-[#2563EB] flex items-center justify-center font-bold group-hover:scale-105 transition-transform">
            <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-[#0F172A]">Authoritative OpenPDF Engine</h3>
          <p className="text-sm text-slate-600 leading-relaxed">
            Server-side vector rendering with OpenPDF creates tamper-evident A4 landscape certificates. Dynamic ZXing QR codes are directly rasterized into the document for seamless offline verification.
          </p>
          <div className="pt-2 text-xs font-semibold text-[#2563EB] flex items-center gap-1">
            <span>Vector Quality</span>
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </div>

        {/* Pillar 4 */}
        <div className="p-8 rounded-3xl bg-white border border-slate-200/90 shadow-xl shadow-slate-900/5 space-y-4 hover:border-rose-400 transition-all group">
          <div className="w-14 h-14 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center font-bold group-hover:scale-105 transition-transform">
            <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-[#0F172A]">Instant Revocation Ledger</h3>
          <p className="text-sm text-slate-600 leading-relaxed">
            When academic integrity violations or credential errors occur, issuers can invalidate certificates with an audited revocation reason. Public verification endpoints reflect the revocation instantly.
          </p>
          <div className="pt-2 text-xs font-semibold text-rose-600 flex items-center gap-1">
            <span>Zero-Latency Status</span>
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </div>

        {/* Pillar 5 */}
        <div className="p-8 rounded-3xl bg-white border border-slate-200/90 shadow-xl shadow-slate-900/5 space-y-4 hover:border-amber-400 transition-all group">
          <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold group-hover:scale-105 transition-transform">
            <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-[#0F172A]">Institutional Governance</h3>
          <p className="text-sm text-slate-600 leading-relaxed">
            Issuing privileges are strictly segregated. Institutions submit regulatory documentation and must be approved by Platform Administrators before receiving cryptographic signing keys.
          </p>
          <div className="pt-2 text-xs font-semibold text-amber-600 flex items-center gap-1">
            <span>Strict Role Vetting</span>
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </div>

        {/* Pillar 6 */}
        <div className="p-8 rounded-3xl bg-white border border-slate-200/90 shadow-xl shadow-slate-900/5 space-y-4 hover:border-blue-400 transition-all group">
          <div className="w-14 h-14 rounded-2xl bg-sky-50 text-sky-600 flex items-center justify-center font-bold group-hover:scale-105 transition-transform">
            <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.458 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-[#0F172A]">Privacy-Safe Disclosure</h3>
          <p className="text-sm text-slate-600 leading-relaxed">
            Public verification reveals necessary verification proofs while masking personal emails and retaining private keys securely. Scraping-resistant design protects holder identities.
          </p>
          <div className="pt-2 text-xs font-semibold text-sky-600 flex items-center gap-1">
            <span>Selective Privacy</span>
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </div>
      </div>

      {/* Comparison Table Section */}
      <div className="p-8 sm:p-12 rounded-3xl bg-white border border-slate-200/90 shadow-xl shadow-slate-900/5 space-y-8">
        <div className="text-center space-y-2 max-w-xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0F172A]">
            Why Modern Institutions Choose CertiGuard
          </h2>
          <p className="text-sm text-slate-600">
            Compare traditional credentialing against CertiGuard’s cryptographically backed platform.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm border-collapse">
            <thead>
              <tr className="border-b border-slate-200 text-xs font-bold uppercase tracking-wider text-slate-500">
                <th className="py-4 px-4">Feature Metric</th>
                <th className="py-4 px-4 text-slate-400">Traditional Paper</th>
                <th className="py-4 px-4 text-slate-400">Standard Unsigned PDF</th>
                <th className="py-4 px-4 text-[#2563EB]">CertiGuard Platform</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              <tr>
                <td className="py-4 px-4 font-bold text-[#0F172A]">Verification Speed</td>
                <td className="py-4 px-4 text-slate-500">3 – 14 business days</td>
                <td className="py-4 px-4 text-slate-500">Manual email verification</td>
                <td className="py-4 px-4 text-emerald-600 font-bold">&lt; 1 second (Instant)</td>
              </tr>
              <tr>
                <td className="py-4 px-4 font-bold text-[#0F172A]">Forgery Resistance</td>
                <td className="py-4 px-4 text-rose-500">Low (Watermarks forgeable)</td>
                <td className="py-4 px-4 text-rose-500">Zero (Easily edited in Photoshop)</td>
                <td className="py-4 px-4 text-emerald-600 font-bold">100% (RSA-SHA256 Signed)</td>
              </tr>
              <tr>
                <td className="py-4 px-4 font-bold text-[#0F172A]">Revocation Capability</td>
                <td className="py-4 px-4 text-slate-500">None (Paper cannot be recalled)</td>
                <td className="py-4 px-4 text-slate-500">None (Files circulate forever)</td>
                <td className="py-4 px-4 text-emerald-600 font-bold">Instant Real-Time Revocation</td>
              </tr>
              <tr>
                <td className="py-4 px-4 font-bold text-[#0F172A]">Public Auditing</td>
                <td className="py-4 px-4 text-slate-500">Requires physical notary</td>
                <td className="py-4 px-4 text-slate-500">Unverifiable</td>
                <td className="py-4 px-4 text-emerald-600 font-bold">Open Public Ledger Lookup</td>
              </tr>
              <tr>
                <td className="py-4 px-4 font-bold text-[#0F172A]">Mobile QR Inspection</td>
                <td className="py-4 px-4 text-slate-500">Not supported</td>
                <td className="py-4 px-4 text-slate-500">Static link at best</td>
                <td className="py-4 px-4 text-emerald-600 font-bold">In-Browser WebRTC Scanner</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Call to Action Banner */}
      <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-[#1A237E] via-[#2563EB] to-[#1A237E] text-white text-center space-y-6 shadow-2xl shadow-blue-900/20">
        <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
          Ready to eliminate credential forgery?
        </h2>
        <p className="text-sm sm:text-base text-blue-100 max-w-xl mx-auto">
          Onboard your university, government body, or certification board to begin issuing cryptographically verified credentials.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/issuer/register"
            className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-white hover:bg-slate-100 text-[#1A237E] font-bold text-sm shadow-lg transition-all"
          >
            Apply for Issuer Authorization
          </Link>
          <Link
            href="/verify"
            className="w-full sm:w-auto px-8 py-3.5 rounded-2xl border border-white/30 hover:bg-white/10 text-white font-semibold text-sm transition-all"
          >
            Try Public Verification
          </Link>
        </div>
      </div>
    </div>
  );
}
