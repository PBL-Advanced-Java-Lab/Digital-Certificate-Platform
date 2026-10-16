"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { api, ApiError, IssuerResponse } from "@/lib/api";

export default function IssuerRegisterPage() {
  const { user, isAuthenticated, isLoading } = useAuth();

  const [existingIssuer, setExistingIssuer] = useState<IssuerResponse | null>(null);
  const [checkingExisting, setCheckingExisting] = useState(true);

  const [organizationName, setOrganizationName] = useState("");
  const [registrationNumber, setRegistrationNumber] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [address, setAddress] = useState("");

  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      api.issuer
        .getMyProfile()
        .then((profile) => {
          setExistingIssuer(profile);
        })
        .catch(() => {
          setExistingIssuer(null);
        })
        .finally(() => {
          setCheckingExisting(false);
        });
    } else {
      setCheckingExisting(false);
    }
  }, [isAuthenticated]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setFieldErrors({});
    setIsSubmitting(true);

    try {
      const created = await api.issuer.register({
        organizationName: organizationName.trim(),
        registrationNumber: registrationNumber.trim(),
        contactEmail: contactEmail.trim(),
        address: address.trim() || undefined,
      });

      setExistingIssuer(created);
      setSuccess(true);
    } catch (err: any) {
      const apiErr = err as ApiError;
      setError(apiErr.message || "Failed to submit issuer application.");
      if (apiErr.errors) {
        setFieldErrors(apiErr.errors);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading || checkingExisting) {
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
          <div className="w-12 h-12 rounded-2xl bg-blue-100 text-[#2563EB] mx-auto flex items-center justify-center">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-slate-900">Sign In Required</h2>
          <p className="text-sm text-slate-600">
            Please sign in to your user account first before registering your organization as an issuer.
          </p>
          <div className="pt-2 flex flex-col gap-2">
            <Link
              href="/login"
              className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-[#1A237E] to-[#2563EB] text-white font-semibold text-sm shadow-md"
            >
              Sign In to Continue
            </Link>
            <Link
              href="/register"
              className="w-full py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-sm"
            >
              Create Account
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // If already registered as issuer, show profile & status
  if (existingIssuer) {
    return (
      <div className="flex-1 py-16 px-4 sm:px-6 lg:px-8 max-w-2xl mx-auto w-full space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-extrabold text-[#0F172A]">Issuer Status Portal</h1>
          <p className="text-sm text-slate-500">Your organization’s credentials on CertiGuard</p>
        </div>

        <div className="p-8 rounded-2xl bg-white border border-slate-200 shadow-xl space-y-6">
          <div className="flex items-center justify-between pb-6 border-b border-slate-100">
            <div>
              <span className="text-xs uppercase font-semibold text-slate-400">Application Status</span>
              <div className="mt-1 flex items-center gap-2">
                {existingIssuer.status === "APPROVED" && (
                  <span className="px-3 py-1 rounded-full text-xs font-bold uppercase bg-emerald-100 text-emerald-800 border border-emerald-300">
                    Approved Verified Issuer
                  </span>
                )}
                {existingIssuer.status === "PENDING" && (
                  <span className="px-3 py-1 rounded-full text-xs font-bold uppercase bg-amber-100 text-amber-800 border border-amber-300">
                    Pending Review
                  </span>
                )}
                {existingIssuer.status === "REJECTED" && (
                  <span className="px-3 py-1 rounded-full text-xs font-bold uppercase bg-rose-100 text-rose-800 border border-rose-300">
                    Application Rejected
                  </span>
                )}
              </div>
            </div>
            <span className="text-xs font-mono text-slate-400">ID #{existingIssuer.id}</span>
          </div>

          <div className="space-y-4 text-sm">
            <div>
              <span className="text-xs font-semibold text-slate-400 uppercase">Organization Name</span>
              <p className="text-base font-bold text-slate-900">{existingIssuer.organizationName}</p>
            </div>
            <div>
              <span className="text-xs font-semibold text-slate-400 uppercase">Registration Number</span>
              <p className="font-mono text-slate-800">{existingIssuer.registrationNumber}</p>
            </div>
            <div>
              <span className="text-xs font-semibold text-slate-400 uppercase">Contact Email</span>
              <p className="text-slate-800">{existingIssuer.contactEmail}</p>
            </div>
            {existingIssuer.address && (
              <div>
                <span className="text-xs font-semibold text-slate-400 uppercase">Address</span>
                <p className="text-slate-800">{existingIssuer.address}</p>
              </div>
            )}
          </div>

          {existingIssuer.status === "PENDING" && (
            <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs leading-relaxed">
              <strong>Application Under Verification:</strong> An administrator will review your organization details. Once approved, your account will gain permission to issue and sign digital certificates.
            </div>
          )}
        </div>
      </div>
    );
  }

  // Registration Form
  return (
    <div className="flex-1 py-12 px-4 sm:px-6 lg:px-8 max-w-2xl mx-auto w-full space-y-8">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-extrabold text-[#0F172A]">Register as an Issuer</h1>
        <p className="text-sm text-slate-500">
          Apply to issue cryptographically signed, verifiable digital certificates
        </p>
      </div>

      <div className="p-8 rounded-2xl bg-white border border-slate-200 shadow-xl space-y-6">
        {error && (
          <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-sm flex items-start gap-3">
            <svg className="w-5 h-5 flex-shrink-0 text-rose-500 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
              Organization Name
            </label>
            <input
              type="text"
              required
              value={organizationName}
              onChange={(e) => setOrganizationName(e.target.value)}
              placeholder="e.g. National Technological University"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#2563EB] text-sm text-slate-900 placeholder:text-slate-400"
            />
            {fieldErrors.organizationName && (
              <p className="mt-1 text-xs text-rose-600">{fieldErrors.organizationName}</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
              Official Registration / Accreditation Number
            </label>
            <input
              type="text"
              required
              value={registrationNumber}
              onChange={(e) => setRegistrationNumber(e.target.value)}
              placeholder="e.g. NTU-REG-2026-987"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#2563EB] text-sm text-slate-900 font-mono placeholder:font-sans placeholder:text-slate-400"
            />
            {fieldErrors.registrationNumber && (
              <p className="mt-1 text-xs text-rose-600">{fieldErrors.registrationNumber}</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
              Institutional Contact Email
            </label>
            <input
              type="email"
              required
              value={contactEmail}
              onChange={(e) => setContactEmail(e.target.value)}
              placeholder="credentials@university.edu"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#2563EB] text-sm text-slate-900 placeholder:text-slate-400"
            />
            {fieldErrors.contactEmail && (
              <p className="mt-1 text-xs text-rose-600">{fieldErrors.contactEmail}</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
              Official Address / Campus Location
            </label>
            <textarea
              rows={3}
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Campus address, city, and country"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#2563EB] text-sm text-slate-900 placeholder:text-slate-400"
            />
            {fieldErrors.address && (
              <p className="mt-1 text-xs text-rose-600">{fieldErrors.address}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-[#1A237E] to-[#2563EB] hover:from-[#151c65] hover:to-blue-700 text-white font-semibold text-sm shadow-md shadow-blue-500/20 hover:shadow-lg transition-all flex items-center justify-center gap-2 mt-2"
          >
            {isSubmitting ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                </svg>
                <span>Submitting Application...</span>
              </>
            ) : (
              <span>Submit Issuer Application</span>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
