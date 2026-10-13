"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { ApiError } from "@/lib/api";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { login, user, isAuthenticated } = useAuth();
  const router = useRouter();

  const getRoleDashboard = (roles: string[]): string => {
    if (roles.some((r) => r.toUpperCase().includes("ADMIN"))) return "/admin";
    if (roles.some((r) => r.toUpperCase().includes("ISSUER"))) return "/issuer";
    return "/holder";
  };

  useEffect(() => {
    if (isAuthenticated && user) {
      router.push(getRoleDashboard(user.roles || []));
    }
  }, [isAuthenticated, user, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const res = await login(email.trim(), password);
      const target = getRoleDashboard(res.roles || []);
      router.push(target);
    } catch (err: any) {
      const apiErr = err as ApiError;
      setError(apiErr.message || "Failed to sign in. Please verify your credentials.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleQuickLogin = (roleEmail: string, rolePass: string) => {
    setEmail(roleEmail);
    setPassword(rolePass);
  };

  return (
    <div className="flex-1 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 gradient-mesh">
      <div className="w-full max-w-md space-y-8">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex w-12 h-12 rounded-2xl bg-gradient-to-br from-[#1A237E] to-[#2563EB] items-center justify-center shadow-lg shadow-blue-500/20 text-white mb-2">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
          </div>
          <h2 className="text-3xl font-extrabold text-[#0F172A] tracking-tight">
            Sign in to CertiGuard
          </h2>
          <p className="text-sm text-slate-500">
            Access your role-specific dashboard with dedicated navigation
          </p>
        </div>

        {/* Card */}
        <div className="p-8 rounded-2xl bg-white border border-slate-200/80 shadow-xl shadow-slate-900/5">
          {/* Quick 1-Click Role Fillers */}
          <div className="mb-6 pb-6 border-b border-slate-100">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-2 text-center">
              Quick Test Role Fillers
            </span>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => handleQuickLogin("admin@certiguard.io", "Admin@12345")}
                className="px-2.5 py-1.5 rounded-lg border border-purple-200 bg-purple-50 hover:bg-purple-100 text-purple-700 text-xs font-semibold transition-colors flex flex-col items-center gap-0.5 text-center"
              >
                <span>Admin</span>
                <span className="text-[10px] font-normal text-purple-600">→ /admin</span>
              </button>
              <button
                type="button"
                onClick={() => handleQuickLogin("issuer@apex.edu", "Issuer@12345")}
                className="px-2.5 py-1.5 rounded-lg border border-blue-200 bg-blue-50 hover:bg-blue-100 text-[#2563EB] text-xs font-semibold transition-colors flex flex-col items-center gap-0.5 text-center"
              >
                <span>Issuer</span>
                <span className="text-[10px] font-normal text-blue-600">→ /issuer</span>
              </button>
              <button
                type="button"
                onClick={() => handleQuickLogin("holder@example.com", "Holder@12345")}
                className="px-2.5 py-1.5 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-semibold transition-colors flex flex-col items-center gap-0.5 text-center"
              >
                <span>Holder</span>
                <span className="text-[10px] font-normal text-slate-500">→ /holder</span>
              </button>
            </div>
          </div>

          {error && (
            <div className="mb-6 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-sm flex items-start gap-3">
              <svg className="w-5 h-5 flex-shrink-0 text-rose-500 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@organization.com"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:border-transparent text-sm text-slate-900 transition-all placeholder:text-slate-400"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700">
                  Password
                </label>
              </div>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:border-transparent text-sm text-slate-900 transition-all placeholder:text-slate-400"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-[#1A237E] to-[#2563EB] hover:from-[#151c65] hover:to-blue-700 text-white font-semibold text-sm shadow-md shadow-blue-500/20 hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                  </svg>
                  <span>Authenticating...</span>
                </>
              ) : (
                <span>Sign In & Go to Dashboard</span>
              )}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-slate-100 text-center text-sm text-slate-500">
            Don’t have an account yet?{" "}
            <Link href="/register" className="font-semibold text-[#2563EB] hover:underline">
              Create an account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
