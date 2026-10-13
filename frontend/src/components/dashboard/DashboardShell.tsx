"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ReactNode, useState } from "react";
import { useAuth } from "@/context/AuthContext";

interface DashboardShellProps {
  children: ReactNode;
  title: string;
  subtitle?: string;
  actions?: ReactNode;
  activeNav?: string;
}

export default function DashboardShell({
  children,
  title,
  subtitle,
  actions,
  activeNav,
}: DashboardShellProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isAuthenticated, isIssuer, isAdmin, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const isActive = (path: string, navKey?: string) => {
    if (activeNav && navKey) return activeNav === navKey;
    return pathname === path;
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col md:flex-row">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-sm md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar Navigation */}
      <aside
        className={`fixed md:sticky top-0 left-0 z-50 h-screen w-72 bg-white border-r border-slate-200/90 flex flex-col justify-between transition-transform duration-200 md:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full overflow-y-auto">
          {/* Brand Header */}
          <div className="p-6 border-b border-slate-100 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#1A237E] via-[#2563EB] to-indigo-900 flex items-center justify-center shadow-md shadow-blue-500/20">
                <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-bold tracking-tight text-[#0F172A] flex items-center gap-1">
                  Certi<span className="text-[#2563EB]">Guard</span>
                </span>
                <span className="text-[10px] tracking-wider uppercase font-semibold text-slate-500">
                  Trust Management
                </span>
              </div>
            </Link>

            <button
              onClick={() => setSidebarOpen(false)}
              className="p-1 rounded-lg text-slate-400 hover:text-slate-600 md:hidden"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* User Role Badge Card */}
          <div className="p-4 mx-4 my-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#1A237E]/10 text-[#1A237E] font-bold flex items-center justify-center flex-shrink-0 text-sm">
              {user?.fullName?.charAt(0) || "U"}
            </div>
            <div className="flex flex-col min-w-0 flex-1">
              <span className="text-sm font-bold text-[#0F172A] truncate">
                {user?.fullName || "Authenticated User"}
              </span>
              <div className="flex items-center gap-1.5 mt-0.5">
                {isAdmin ? (
                  <span className="px-2 py-0.5 rounded text-[10px] font-extrabold uppercase bg-purple-100 text-purple-700">
                    System Admin
                  </span>
                ) : isIssuer ? (
                  <span className="px-2 py-0.5 rounded text-[10px] font-extrabold uppercase bg-blue-100 text-[#2563EB]">
                    Verified Issuer
                  </span>
                ) : (
                  <span className="px-2 py-0.5 rounded text-[10px] font-extrabold uppercase bg-slate-200 text-slate-700">
                    Credential Holder
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="flex-1 px-4 space-y-6 text-sm">
            {/* Primary Role-Specific Section */}
            {isAdmin && (
              <div className="space-y-1">
                <span className="px-3 text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                  Admin Governance
                </span>
                <Link
                  href="/admin"
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium transition-all ${
                    isActive("/admin", "admin-overview")
                      ? "bg-[#2563EB] text-white shadow-md shadow-blue-500/20"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                  }`}
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                  <span>Admin Overview</span>
                </Link>
                <Link
                  href="/admin?tab=issuers"
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium transition-all ${
                    isActive("/admin?tab=issuers", "admin-issuers")
                      ? "bg-[#2563EB] text-white shadow-md shadow-blue-500/20"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                  }`}
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                  <span>Issuer Authorizations</span>
                </Link>
                <Link
                  href="/admin?tab=types"
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium transition-all ${
                    isActive("/admin?tab=types", "admin-types")
                      ? "bg-[#2563EB] text-white shadow-md shadow-blue-500/20"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                  }`}
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                  </svg>
                  <span>Certificate Types</span>
                </Link>
                <Link
                  href="/admin/fraud"
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium transition-all ${
                    isActive("/admin/fraud", "admin-fraud")
                      ? "bg-[#2563EB] text-white shadow-md shadow-blue-500/20"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                  }`}
                >
                  <svg className="w-4 h-4 text-rose-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  <span>Fraud & Anomaly Guard</span>
                </Link>
                <Link
                  href="/admin/analytics"
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium transition-all ${
                    isActive("/admin/analytics", "admin-analytics")
                      ? "bg-[#2563EB] text-white shadow-md shadow-blue-500/20"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                  }`}
                >
                  <svg className="w-4 h-4 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span>Platform Analytics</span>
                </Link>
              </div>
            )}

            {isIssuer && (
              <div className="space-y-1">
                <span className="px-3 text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                  Issuer Operations
                </span>
                <Link
                  href="/issuer"
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium transition-all ${
                    isActive("/issuer", "issuer-dashboard")
                      ? "bg-[#2563EB] text-white shadow-md shadow-blue-500/20"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                  }`}
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                  <span>Issuer Dashboard</span>
                </Link>
                <Link
                  href="/certificates/new"
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium transition-all ${
                    isActive("/certificates/new", "issue-new")
                      ? "bg-[#2563EB] text-white shadow-md shadow-blue-500/20"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                  }`}
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  <span>Issue Certificate</span>
                </Link>
              </div>
            )}

            {/* Holder Credential Section */}
            <div className="space-y-1">
              <span className="px-3 text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                My Credentials
              </span>
              <Link
                href="/holder"
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium transition-all ${
                  isActive("/holder", "holder-dashboard")
                    ? "bg-[#2563EB] text-white shadow-md shadow-blue-500/20"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                }`}
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
                <span>My Certificates</span>
              </Link>
            </div>

            {/* Platform Master Navigation ("The rest of this") */}
            <div className="space-y-1 pt-3 border-t border-slate-100">
              <span className="px-3 text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                Platform & Public Pages
              </span>
              <Link
                href="/"
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium transition-all ${
                  isActive("/", "home")
                    ? "bg-[#2563EB] text-white shadow-md shadow-blue-500/20"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                }`}
              >
                <svg className="w-4 h-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                <span>Landing Page</span>
              </Link>
              <Link
                href="/verify"
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium transition-all ${
                  isActive("/verify", "verify")
                    ? "bg-[#2563EB] text-white shadow-md shadow-blue-500/20"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                }`}
              >
                <svg className="w-4 h-4 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                <span>Verify Certificate</span>
              </Link>
              <Link
                href="/certificates"
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium transition-all ${
                  isActive("/certificates", "all-certificates")
                    ? "bg-[#2563EB] text-white shadow-md shadow-blue-500/20"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                }`}
              >
                <svg className="w-4 h-4 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                </svg>
                <span>Certificate Directory</span>
              </Link>
              <Link
                href="/issuers"
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium transition-all ${
                  isActive("/issuers", "all-issuers")
                    ? "bg-[#2563EB] text-white shadow-md shadow-blue-500/20"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                }`}
              >
                <svg className="w-4 h-4 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
                <span>Institutional Directory</span>
              </Link>
              <Link
                href="/features"
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium transition-all ${
                  isActive("/features", "features")
                    ? "bg-[#2563EB] text-white shadow-md shadow-blue-500/20"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                }`}
              >
                <svg className="w-4 h-4 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                <span>Platform Features</span>
              </Link>
              <Link
                href="/about"
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium transition-all ${
                  isActive("/about", "about")
                    ? "bg-[#2563EB] text-white shadow-md shadow-blue-500/20"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                }`}
              >
                <svg className="w-4 h-4 text-cyan-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>About CertiGuard</span>
              </Link>
              {!isIssuer && !isAdmin && (
                <Link
                  href="/issuer/register"
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium transition-all ${
                    isActive("/issuer/register", "issuer-register")
                      ? "bg-[#2563EB] text-white shadow-md shadow-blue-500/20"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                  }`}
                >
                  <svg className="w-4 h-4 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>Become an Issuer</span>
                </Link>
              )}
            </div>
          </nav>

          {/* Bottom Logout Button */}
          <div className="p-4 border-t border-slate-100">
            <button
              onClick={logout}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 hover:border-rose-200 text-slate-600 hover:text-rose-600 hover:bg-rose-50/50 text-xs font-semibold transition-all"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header Bar */}
        <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-slate-200/80 px-4 sm:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 md:hidden"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <div>
              <h1 className="text-xl sm:text-2xl font-extrabold text-[#0F172A] tracking-tight">
                {title}
              </h1>
              {subtitle && (
                <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3">
            {actions}
          </div>
        </header>

        {/* Child Page Content Slot */}
        <main className="p-4 sm:p-8 flex-1 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
