"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Footer() {
  const pathname = usePathname();

  const isDashboardRoute =
    pathname.startsWith("/admin") ||
    (pathname.startsWith("/issuer") && pathname !== "/issuer/register") ||
    pathname.startsWith("/holder") ||
    pathname.startsWith("/certificates/new");

  if (isDashboardRoute) {
    return null;
  }

  return (
    <footer className="w-full bg-[#0F172A] text-slate-300 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand Info */}
          <div className="md:col-span-1 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#1A237E] to-[#2563EB] flex items-center justify-center">
                <svg
                  className="w-5 h-5 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                  />
                </svg>
              </div>
              <span className="text-xl font-bold tracking-tight text-white">
                Certi<span className="text-[#2563EB]">Guard</span>
              </span>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed">
              A tamper-proof digital certificate verification and revocation platform powered by SHA-256 cryptographic hashing and role-based governance.
            </p>
            <div className="flex items-center gap-2 text-xs text-emerald-400 font-mono">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              SHA-256 Signature Verified
            </div>
          </div>

          {/* Platform Navigation */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-4">
              Platform
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/verify" className="hover:text-white transition-colors">
                  Verify Certificate
                </Link>
              </li>
              <li>
                <Link href="/issuer/register" className="hover:text-white transition-colors">
                  Register as Issuer
                </Link>
              </li>
              <li>
                <Link href="/login" className="hover:text-white transition-colors">
                  Sign In to Dashboard
                </Link>
              </li>
              <li>
                <Link href="/features" className="hover:text-white transition-colors">
                  Platform Features
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-white transition-colors">
                  About CertiGuard
                </Link>
              </li>
              <li>
                <Link href="/register" className="hover:text-white transition-colors">
                  Create User Account
                </Link>
              </li>
            </ul>
          </div>

          {/* Security & Verification Modules */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-4">
              Architecture & Security
            </h4>
            <ul className="space-y-2.5 text-sm text-slate-400">
              <li>Cryptographic SHA-256 Hash</li>
              <li>Dynamic QR Verification</li>
              <li>Stateless JWT Authentication</li>
              <li>Instant Revocation Protocol</li>
              <li>Audit Logging & Anomaly Guard</li>
            </ul>
          </div>

          {/* Academic & Stack Details */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-4">
              System Specifications
            </h4>
            <p className="text-xs text-slate-400 mb-3 leading-relaxed">
              Developed as an enterprise-grade PBL Project utilizing Java 21, Spring Boot 4, Next.js 15, and PostgreSQL 18.
            </p>
            <div className="pt-2 border-t border-slate-800 text-[11px] text-slate-500 font-mono">
              Branch: <span className="text-blue-400">priyanka</span> | Repo: <span className="text-slate-300">Digital-Certificate-Platform</span>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} CertiGuard. Trust every credential. Verify every certificate.</p>
          <div className="flex gap-6">
            <Link href="/verify" className="hover:text-slate-300 transition-colors">
              Public Portal
            </Link>
            <Link href="/issuer/register" className="hover:text-slate-300 transition-colors">
              Institutional Onboarding
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
