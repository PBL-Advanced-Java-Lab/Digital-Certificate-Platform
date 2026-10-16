import Link from "next/link";

export default function AboutPage() {
  return (
    <div className="flex-1 py-12 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto w-full space-y-16">
      {/* Hero Section */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 text-[#1A237E] border border-indigo-200">
          <span className="w-2 h-2 rounded-full bg-[#1A237E]"></span>
          Platform Mission & Principles
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-[#0F172A] tracking-tight">
          Trust every credential. Verify every certificate.
        </h1>
        <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
          CertiGuard was created to solve a pervasive global challenge: fraudulent degrees, altered certifications, and unverified credentials in higher education and professional industries.
        </p>
      </div>

      {/* Problem & Solution Story */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="p-8 rounded-3xl bg-white border border-slate-200/90 shadow-xl shadow-slate-900/5 space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center font-bold">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-[#0F172A]">The Verification Crisis</h2>
          <p className="text-sm text-slate-600 leading-relaxed">
            Every year, thousands of forged diplomas, manipulated certificates, and unaccredited credentials circulate undetected. Traditional verification relies on slow manual phone calls, expensive apostilles, or static paper seals that are effortlessly forged with modern graphics software.
          </p>
        </div>

        <div className="p-8 rounded-3xl bg-white border border-slate-200/90 shadow-xl shadow-slate-900/5 space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-[#0F172A]">The Cryptographic Standard</h2>
          <p className="text-sm text-slate-600 leading-relaxed">
            CertiGuard establishes an authoritative, tamper-proof digital ledger. By anchoring credentials to unique RSA-2048 issuer keys and computing canonical SHA-256 digests, any altered letter or changed date instantly breaks the cryptographic seal during public verification.
          </p>
        </div>
      </div>

      {/* 4 Core Pillars */}
      <div className="space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0F172A]">Our Architectural Pillars</h2>
          <p className="text-sm text-slate-600">The foundational values that guide CertiGuard’s design and security model.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-2">
            <span className="text-2xl font-black text-[#2563EB]">01</span>
            <h3 className="font-bold text-[#0F172A]">Mathematical Proof</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              We rely on proven public-key cryptography (RSA-SHA256) rather than trusting closed, unverifiable claims.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-2">
            <span className="text-2xl font-black text-[#2563EB]">02</span>
            <h3 className="font-bold text-[#0F172A]">Zero-Knowledge Privacy</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Public lookups confirm credential authenticity without exposing recipient personal emails or confidential records.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-2">
            <span className="text-2xl font-black text-[#2563EB]">03</span>
            <h3 className="font-bold text-[#0F172A]">Instant Revocability</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Authorized institutions can revoke credentials immediately, stopping compromised credentials from circulating.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-2">
            <span className="text-2xl font-black text-[#2563EB]">04</span>
            <h3 className="font-bold text-[#0F172A]">Open Interoperability</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Anyone with a standard browser or smartphone camera can verify credentials without proprietary proprietary apps.
            </p>
          </div>
        </div>
      </div>

      {/* System Technical Stack Overview */}
      <div className="p-8 sm:p-12 rounded-3xl bg-slate-900 text-white space-y-6 shadow-2xl">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
          <div>
            <span className="text-xs font-semibold text-blue-400 uppercase tracking-wider">Enterprise Tech Stack</span>
            <h2 className="text-2xl font-extrabold mt-1">Platform Engineering Specifications</h2>
          </div>
          <span className="px-3 py-1 rounded-full text-xs font-mono bg-blue-900/60 text-blue-300 border border-blue-700">
            PBL Project Standard
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 text-xs text-slate-300">
          <div className="space-y-1">
            <span className="font-bold text-white block text-sm">Backend Engine</span>
            <p>Java 21 • Spring Boot 4</p>
            <p className="text-slate-400">Spring Security, JJWT 0.12.6, OpenPDF 2.0.3, ZXing 3.5.3</p>
          </div>

          <div className="space-y-1">
            <span className="font-bold text-white block text-sm">Relational Persistence</span>
            <p>PostgreSQL 18</p>
            <p className="text-slate-400">Spring Data JPA, Hibernate, Connection Pooling, Strict Foreign Keys</p>
          </div>

          <div className="space-y-1">
            <span className="font-bold text-white block text-sm">Frontend Architecture</span>
            <p>Next.js 15+ App Router</p>
            <p className="text-slate-400">React 19, TypeScript 5, Tailwind CSS, WebRTC Camera Scanner, jsQR</p>
          </div>

          <div className="space-y-1">
            <span className="font-bold text-white block text-sm">Hosting & Deployment</span>
            <p>Render & Vercel</p>
            <p className="text-slate-400">Decoupled microservice architecture, Stateless sessions, Dynamic CORS</p>
          </div>
        </div>
      </div>

      {/* Back to Home CTA */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-8 rounded-3xl bg-white border border-slate-200">
        <div>
          <h3 className="text-lg font-bold text-[#0F172A]">Verify a certificate right now</h3>
          <p className="text-xs text-slate-500">Test CertiGuard’s instant cryptographic validation with your browser or webcam.</p>
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <Link
            href="/verify"
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-[#2563EB] hover:bg-blue-700 text-white font-semibold text-xs sm:text-sm text-center shadow-md transition-all"
          >
            Launch Public Verifier
          </Link>
          <Link
            href="/issuer/register"
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-semibold text-xs sm:text-sm text-center transition-all"
          >
            Institutional Application
          </Link>
        </div>
      </div>
    </div>
  );
}
