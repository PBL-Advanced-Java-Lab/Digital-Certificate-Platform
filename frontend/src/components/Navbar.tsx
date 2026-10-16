"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";

export default function Navbar() {
  const { user, isAuthenticated, logout, isLoading, isIssuer, isAdmin } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path;

  // On dashboard pages, the dedicated left-hand vertical sidebar handles navigation
  const isDashboardRoute =
    pathname.startsWith("/admin") ||
    (pathname.startsWith("/issuer") && pathname !== "/issuer/register") ||
    pathname.startsWith("/holder") ||
    pathname.startsWith("/certificates/new");

  if (isDashboardRoute) {
    return null;
  }

  return (
    <header className="sticky top-0 z-50 w-full glass-panel border-b border-slate-200/80 bg-white/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#1A237E] via-[#2563EB] to-indigo-900 flex items-center justify-center shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform duration-200">
              <svg
                className="w-5 h-5 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2.2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                />
              </svg>
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold tracking-tight text-[#0F172A] flex items-center gap-1.5">
                Certi<span className="text-[#2563EB]">Guard</span>
              </span>
              <span className="text-[10px] tracking-wider uppercase font-semibold text-slate-500">
                Digital Trust Platform
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2">
            <Link
              href="/"
              className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                isActive("/")
                  ? "text-[#2563EB] bg-blue-50/80"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/60"
              }`}
            >
              Home
            </Link>
            <Link
              href="/verify"
              className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors flex items-center gap-1.5 ${
                isActive("/verify")
                  ? "text-[#2563EB] bg-blue-50/80 font-semibold"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/60"
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              Verify Certificate
            </Link>
            <Link
              href="/issuer/register"
              className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                isActive("/issuer/register")
                  ? "text-[#2563EB] bg-blue-50/80"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/60"
              }`}
            >
              For Issuers
            </Link>
            <Link
              href="/features"
              className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                isActive("/features")
                  ? "text-[#2563EB] bg-blue-50/80"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/60"
              }`}
            >
              Features
            </Link>
            <Link
              href="/about"
              className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                isActive("/about")
                  ? "text-[#2563EB] bg-blue-50/80"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/60"
              }`}
            >
              About
            </Link>
          </nav>

          {/* Dynamic Auth Buttons */}
          <div className="hidden md:flex items-center gap-3">
            {isLoading ? (
              <div className="w-24 h-9 bg-slate-200 animate-pulse rounded-lg"></div>
            ) : isAuthenticated && user ? (
              <div className="flex items-center gap-3">
                <Link
                  href={isAdmin ? "/admin" : isIssuer ? "/issuer" : "/holder"}
                  className="px-3 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-[#2563EB] text-xs font-semibold transition-all flex items-center gap-1.5"
                >
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                  </svg>
                  <span>Dashboard</span>
                </Link>
                <div className="flex flex-col text-right">
                  <span className="text-xs font-semibold text-slate-900">{user.fullName}</span>
                  <span className="text-[10px] font-medium text-slate-500 flex items-center justify-end gap-1">
                    {isAdmin ? (
                      <span className="px-1.5 py-0.5 rounded bg-purple-100 text-purple-700 font-bold">Admin</span>
                    ) : isIssuer ? (
                      <span className="px-1.5 py-0.5 rounded bg-blue-100 text-[#2563EB] font-bold">Issuer</span>
                    ) : (
                      <span className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-600">Holder</span>
                    )}
                  </span>
                </div>
                <button
                  onClick={logout}
                  className="px-3.5 py-1.5 text-xs font-medium text-slate-600 hover:text-rose-600 border border-slate-200 hover:border-rose-200 rounded-lg hover:bg-rose-50/50 transition-colors"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  href="/login"
                  className="px-4 py-2 text-sm font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-100/80 rounded-lg transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  href="/register"
                  className="px-4 py-2 text-sm font-semibold text-white bg-gradient-to-r from-[#1A237E] to-[#2563EB] hover:from-[#151c65] hover:to-blue-700 rounded-lg shadow-sm shadow-blue-500/20 hover:shadow-md transition-all duration-200"
                >
                  Create Account
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100"
              aria-label="Toggle menu"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white/95 backdrop-blur-lg px-4 pt-3 pb-5 space-y-2">
          <Link
            href="/"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 text-base font-medium text-slate-700 hover:bg-slate-100 rounded-lg"
          >
            Home
          </Link>
          <Link
            href="/verify"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 text-base font-medium text-blue-600 hover:bg-blue-50 rounded-lg"
          >
            Verify Certificate
          </Link>
          <Link
            href="/issuer/register"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 text-base font-medium text-slate-700 hover:bg-slate-100 rounded-lg"
          >
            For Issuers
          </Link>
          <Link
            href="/features"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 text-base font-medium text-slate-700 hover:bg-slate-100 rounded-lg"
          >
            Features
          </Link>
          <Link
            href="/about"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 text-base font-medium text-slate-700 hover:bg-slate-100 rounded-lg"
          >
            About
          </Link>

          <div className="pt-3 border-t border-slate-200 flex flex-col gap-2">
            {isAuthenticated && user ? (
              <>
                <div className="px-3 py-2 bg-slate-50 rounded-lg">
                  <p className="text-sm font-semibold text-slate-900">{user.fullName}</p>
                  <p className="text-xs text-slate-500">{user.email}</p>
                </div>
                <button
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full text-center px-4 py-2 text-sm font-medium text-rose-600 bg-rose-50 rounded-lg"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center px-4 py-2 text-sm font-medium text-slate-700 bg-slate-100 rounded-lg"
                >
                  Sign In
                </Link>
                <Link
                  href="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center px-4 py-2 text-sm font-semibold text-white bg-gradient-to-r from-[#1A237E] to-[#2563EB] rounded-lg"
                >
                  Create Account
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
