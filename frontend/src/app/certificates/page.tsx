"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { api, CertificateResponse } from "@/lib/api";

const DEMO_MASTER_CERTS: CertificateResponse[] = [
  {
    id: 1,
    certificateId: "CG-2026-NTU-7890",
    recipientName: "Priyanka Sharma",
    recipientEmail: "priyanka@gmail.com",
    courseOrTitle: "Master of Science in Cybersecurity & Distributed Systems",
    certificateTypeId: 1,
    certificateTypeName: "Master Degree",
    certificateTypeCode: "DEGREE",
    issuerId: 1,
    issuerOrganizationName: "National Technological University",
    issuerRegistrationNumber: "NTU-REG-2026-987",
    issueDate: "2026-10-10",
    expiryDate: undefined,
    status: "ACTIVE",
    sha256Hash: "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
    digitalSignature: "k9xL2P5vA8mN0qR1wY3zB4cE6fH7jK...",
    qrCodeBase64: "",
    createdAt: "2026-10-10T10:00:00",
  },
  {
    id: 2,
    certificateId: "CG-2026-IIT-1002",
    recipientName: "Rahul Verma",
    recipientEmail: "rahul@iit.ac.in",
    courseOrTitle: "Advanced Cloud Architecture & Cryptography",
    certificateTypeId: 2,
    certificateTypeName: "Professional Certification",
    certificateTypeCode: "PROFESSIONAL_CERTIFICATION",
    issuerId: 2,
    issuerOrganizationName: "Indian Institute of Technology",
    issuerRegistrationNumber: "IIT-EDU-2026-442",
    issueDate: "2026-09-15",
    expiryDate: undefined,
    status: "ACTIVE",
    sha256Hash: "8f434346648f6b96df89dda901c5176b10a6d83961dd3c1ac88b59b2dc327aa4",
    digitalSignature: "p8q9w0e1r2t3y4u5i6o7p8a9s0d1f2...",
    qrCodeBase64: "",
    createdAt: "2026-09-15T10:00:00",
  },
  {
    id: 3,
    certificateId: "CG-2026-REVOKED-001",
    recipientName: "Alex Mercer",
    recipientEmail: "alex@example.com",
    courseOrTitle: "Executive Data Science Certificate",
    certificateTypeId: 3,
    certificateTypeName: "Training Completion",
    certificateTypeCode: "TRAINING_COMPLETION",
    issuerId: 3,
    issuerOrganizationName: "Global Tech Academy",
    issuerRegistrationNumber: "GTA-2025-099",
    issueDate: "2026-01-12",
    expiryDate: undefined,
    status: "REVOKED",
    sha256Hash: "a591a6d40bf420404a011733cfb7b190d62c65bf0bcda32b57b277d9ad9f146e",
    digitalSignature: "z1x2c3v4b5n6m7a8s9d0f1g2h3j4k5...",
    qrCodeBase64: "",
    createdAt: "2026-01-12T10:00:00",
  },
];

export default function CertificateDirectoryPage() {
  const [certificates, setCertificates] = useState<CertificateResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"ALL" | "ACTIVE" | "REVOKED">("ALL");

  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);

    api.certificates
      .getAll()
      .then((data) => {
        if (isMounted) {
          if (data && data.length > 0) {
            setCertificates(data);
          } else {
            setCertificates(DEMO_MASTER_CERTS);
          }
          setIsLoading(false);
        }
      })
      .catch(() => {
        if (isMounted) {
          setCertificates(DEMO_MASTER_CERTS);
          setIsLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const filtered = certificates.filter((c) => {
    const matchesStatus = statusFilter === "ALL" || c.status === statusFilter;
    const matchesQuery =
      c.certificateId.toLowerCase().includes(search.toLowerCase()) ||
      c.recipientName.toLowerCase().includes(search.toLowerCase()) ||
      c.courseOrTitle.toLowerCase().includes(search.toLowerCase()) ||
      c.issuerOrganizationName.toLowerCase().includes(search.toLowerCase());
    return matchesStatus && matchesQuery;
  });

  return (
    <div className="flex-1 py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-[#2563EB] border border-blue-200">
            Authoritative Public Ledger
          </div>
          <h1 className="text-3xl font-extrabold text-[#0F172A] tracking-tight mt-1">
            Certificate Registry
          </h1>
          <p className="text-sm text-slate-600">
            Browse and inspect all registered credentials across institutions.
          </p>
        </div>

        <Link
          href="/verify"
          className="px-6 py-2.5 rounded-xl bg-[#2563EB] hover:bg-blue-700 text-white font-semibold text-xs sm:text-sm shadow-md transition-all flex items-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
          <span>Scan or Verify by ID</span>
        </Link>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-xl shadow-slate-900/5 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <input
            type="text"
            placeholder="Search by ID, recipient, course, or issuer..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
          />
          <svg className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>

        <div className="inline-flex p-1 rounded-xl bg-slate-100 text-xs w-full sm:w-auto justify-center">
          <button
            onClick={() => setStatusFilter("ALL")}
            className={`px-4 py-1.5 rounded-lg font-semibold transition-all ${
              statusFilter === "ALL" ? "bg-white text-[#0F172A] shadow-sm" : "text-slate-600"
            }`}
          >
            All Status
          </button>
          <button
            onClick={() => setStatusFilter("ACTIVE")}
            className={`px-4 py-1.5 rounded-lg font-semibold transition-all ${
              statusFilter === "ACTIVE" ? "bg-white text-emerald-700 shadow-sm" : "text-slate-600"
            }`}
          >
            Active
          </button>
          <button
            onClick={() => setStatusFilter("REVOKED")}
            className={`px-4 py-1.5 rounded-lg font-semibold transition-all ${
              statusFilter === "REVOKED" ? "bg-white text-rose-700 shadow-sm" : "text-slate-600"
            }`}
          >
            Revoked
          </button>
        </div>
      </div>

      {/* Directory Table */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xl shadow-slate-900/5 overflow-hidden">
        {filtered.length === 0 ? (
          <div className="p-12 text-center text-sm text-slate-500">
            No matching certificates found for your search criteria.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100 text-xs font-bold uppercase text-slate-500">
                  <th className="py-3.5 px-6">Certificate ID</th>
                  <th className="py-3.5 px-6">Recipient Name</th>
                  <th className="py-3.5 px-6">Course / Title</th>
                  <th className="py-3.5 px-6">Issuing Institution</th>
                  <th className="py-3.5 px-6">Status</th>
                  <th className="py-3.5 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((cert) => (
                  <tr key={cert.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-4 px-6 font-mono text-xs font-bold text-[#1A237E]">
                      <Link href={`/verify/${cert.certificateId}`} className="hover:underline">
                        {cert.certificateId}
                      </Link>
                    </td>
                    <td className="py-4 px-6 font-bold text-[#0F172A]">
                      {cert.recipientName}
                    </td>
                    <td className="py-4 px-6">
                      <span className="font-semibold text-slate-800 block text-xs sm:text-sm">
                        {cert.courseOrTitle}
                      </span>
                      <span className="text-[11px] text-slate-400">{cert.certificateTypeName}</span>
                    </td>
                    <td className="py-4 px-6 text-xs text-slate-600">
                      <span className="font-semibold text-slate-800 block">
                        {cert.issuerOrganizationName}
                      </span>
                      <span className="text-slate-400 font-mono text-[11px]">
                        {cert.issuerRegistrationNumber}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                          cert.status === "ACTIVE"
                            ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                            : "bg-rose-100 text-rose-800 border border-rose-300"
                        }`}
                      >
                        {cert.status}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right space-x-2">
                      <a
                        href={api.certificates.getPdfUrl(cert.certificateId)}
                        target="_blank"
                        rel="noreferrer"
                        className="px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold transition-all inline-block shadow-sm"
                      >
                        PDF
                      </a>
                      <Link
                        href={`/verify/${cert.certificateId}`}
                        className="px-3.5 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-[#2563EB] text-xs font-semibold transition-all inline-block"
                      >
                        Verify
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
