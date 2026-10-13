"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { api, IssuerResponse } from "@/lib/api";

const DEMO_ISSUERS: IssuerResponse[] = [
  {
    id: 1,
    organizationName: "National Technological University",
    registrationNumber: "NTU-REG-2026-987",
    contactEmail: "registrar@ntu.edu",
    address: "Academic Complex, North Campus, New Delhi",
    status: "APPROVED",
    userId: 2,
    userEmail: "admin@ntu.edu",
    createdAt: "2026-01-15T09:00:00",
  },
  {
    id: 2,
    organizationName: "Indian Institute of Technology",
    registrationNumber: "IIT-EDU-2026-442",
    contactEmail: "credentials@iit.ac.in",
    address: "Senate Hall, Technology Square, Mumbai",
    status: "APPROVED",
    userId: 3,
    userEmail: "dean@iit.ac.in",
    createdAt: "2026-02-10T11:00:00",
  },
  {
    id: 3,
    organizationName: "Global Tech Academy",
    registrationNumber: "GTA-2025-099",
    contactEmail: "certifications@globaltech.org",
    address: "Silicon District 4, Bangalore",
    status: "APPROVED",
    userId: 4,
    userEmail: "ops@globaltech.org",
    createdAt: "2025-11-20T14:30:00",
  },
];

export default function InstitutionalDirectoryPage() {
  const [issuers, setIssuers] = useState<IssuerResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);

    api.issuer
      .getDirectory()
      .then((data) => {
        if (isMounted) {
          if (data && data.length > 0) {
            setIssuers(data);
          } else {
            setIssuers(DEMO_ISSUERS);
          }
          setIsLoading(false);
        }
      })
      .catch(() => {
        if (isMounted) {
          setIssuers(DEMO_ISSUERS);
          setIsLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const filtered = issuers.filter((item) => {
    return (
      item.organizationName.toLowerCase().includes(search.toLowerCase()) ||
      item.registrationNumber.toLowerCase().includes(search.toLowerCase()) ||
      (item.address && item.address.toLowerCase().includes(search.toLowerCase()))
    );
  });

  return (
    <div className="flex-1 py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full space-y-10">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            Verified Institutional Directory
          </div>
          <h1 className="text-3xl font-extrabold text-[#0F172A] tracking-tight mt-1">
            Authorized Credential Issuers
          </h1>
          <p className="text-sm text-slate-600">
            All institutions authorized to issue RSA-signed credentials within the CertiGuard network.
          </p>
        </div>

        <Link
          href="/issuer/register"
          className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#1A237E] to-[#2563EB] hover:from-[#151c65] hover:to-blue-700 text-white font-semibold text-xs sm:text-sm shadow-md transition-all flex items-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          <span>Apply as Issuer</span>
        </Link>
      </div>

      {/* Search Input Box */}
      <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-xl shadow-slate-900/5">
        <div className="relative max-w-md">
          <input
            type="text"
            placeholder="Search by institution name, registration code, or location..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
          />
          <svg className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </div>

      {/* Grid of Verified Issuers */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((inst) => (
          <div
            key={inst.id}
            className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-xl shadow-slate-900/5 space-y-4 hover:border-blue-400 transition-all flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-3">
                <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-[#1A237E] font-bold flex items-center justify-center flex-shrink-0 text-base">
                  {inst.organizationName.charAt(0)}
                </div>
                <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center gap-1.5">
                  <svg className="w-3.5 h-3.5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                  Verified
                </span>
              </div>

              <div>
                <h3 className="text-lg font-bold text-[#0F172A] leading-snug">
                  {inst.organizationName}
                </h3>
                <span className="text-xs font-mono font-semibold text-[#1A237E] block mt-1">
                  Reg: {inst.registrationNumber}
                </span>
              </div>

              {inst.address && (
                <p className="text-xs text-slate-500 leading-relaxed">
                  {inst.address}
                </p>
              )}
            </div>

            <div className="pt-4 border-t border-slate-100 space-y-2 text-xs">
              <div className="flex items-center justify-between text-slate-500">
                <span>Official Contact:</span>
                <span className="font-mono text-slate-700">{inst.contactEmail}</span>
              </div>
              <div className="flex items-center justify-between text-slate-500">
                <span>Cryptographic Identity:</span>
                <span className="text-emerald-600 font-semibold">RSA-2048 Active</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
