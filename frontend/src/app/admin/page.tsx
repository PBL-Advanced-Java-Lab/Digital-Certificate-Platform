"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import DashboardShell from "@/components/dashboard/DashboardShell";
import { useAuth } from "@/context/AuthContext";
import {
  api,
  ApiError,
  CertificateResponse,
  CertificateTypeResponse,
  IssuerResponse,
} from "@/lib/api";

function AdminDashboardContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialTab = searchParams.get("tab") || "overview";

  const { user, isAuthenticated, isAdmin, isLoading: authLoading } = useAuth();

  const [activeTab, setActiveTab] = useState<"overview" | "issuers" | "types">(
    initialTab as "overview" | "issuers" | "types"
  );

  const [issuers, setIssuers] = useState<IssuerResponse[]>([]);
  const [types, setTypes] = useState<CertificateTypeResponse[]>([]);
  const [certificates, setCertificates] = useState<CertificateResponse[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // New Category Modal State
  const [showTypeModal, setShowTypeModal] = useState(false);
  const [newTypeName, setNewTypeName] = useState("");
  const [newTypeCode, setNewTypeCode] = useState("");
  const [newTypeDesc, setNewTypeDesc] = useState("");
  const [isSubmittingType, setIsSubmittingType] = useState(false);

  // Issuer Action State
  const [processingIssuerId, setProcessingIssuerId] = useState<number | null>(null);

  useEffect(() => {
    if (initialTab === "issuers" || initialTab === "types" || initialTab === "overview") {
      setActiveTab(initialTab);
    }
  }, [initialTab]);

  const loadAllData = async () => {
    setIsLoadingData(true);
    setErrorMsg(null);

    try {
      const [allIssuers, allTypes, allCerts] = await Promise.all([
        api.issuer.getAll().catch(() => []),
        api.certificateTypes.getAll().catch(() => []),
        api.certificates.getAll().catch(() => []),
      ]);

      setIssuers(allIssuers);
      setTypes(allTypes);
      setCertificates(allCerts);
    } catch (err: any) {
      setErrorMsg("Failed to synchronize administrative datasets.");
    } finally {
      setIsLoadingData(false);
    }
  };

  useEffect(() => {
    if (!authLoading) {
      if (!isAuthenticated) {
        router.push("/login");
      } else {
        loadAllData();
      }
    }
  }, [authLoading, isAuthenticated]);

  const handleApproveIssuer = async (id: number) => {
    setProcessingIssuerId(id);
    try {
      const approved = await api.issuer.approve(id);
      setIssuers((prev) => prev.map((item) => (item.id === id ? approved : item)));
    } catch (err: any) {
      alert(err.message || "Failed to approve issuer.");
    } finally {
      setProcessingIssuerId(null);
    }
  };

  const handleRejectIssuer = async (id: number) => {
    if (!confirm("Are you sure you want to reject this organization application?")) return;
    setProcessingIssuerId(id);
    try {
      const rejected = await api.issuer.reject(id);
      setIssuers((prev) => prev.map((item) => (item.id === id ? rejected : item)));
    } catch (err: any) {
      alert(err.message || "Failed to reject issuer.");
    } finally {
      setProcessingIssuerId(null);
    }
  };

  const handleCreateType = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTypeName.trim() || !newTypeCode.trim()) return;

    setIsSubmittingType(true);
    try {
      const created = await api.certificateTypes.create(
        newTypeName.trim(),
        newTypeCode.trim().toUpperCase(),
        newTypeDesc.trim() || undefined
      );
      setTypes((prev) => [...prev, created]);
      setShowTypeModal(false);
      setNewTypeName("");
      setNewTypeCode("");
      setNewTypeDesc("");
    } catch (err: any) {
      alert(err.message || "Failed to create certificate category.");
    } finally {
      setIsSubmittingType(false);
    }
  };

  const pendingIssuers = issuers.filter((i) => i.status === "PENDING");
  const approvedIssuers = issuers.filter((i) => i.status === "APPROVED");
  const activeCertificates = certificates.filter((c) => c.status === "ACTIVE");

  return (
    <DashboardShell
      title="System Administration & Governance"
      subtitle="Institutional authorization, certificate categories, and ledger audit overview."
      activeNav={
        activeTab === "issuers"
          ? "admin-issuers"
          : activeTab === "types"
          ? "admin-types"
          : "admin-overview"
      }
      actions={
        <div className="flex items-center gap-2">
          <button
            onClick={() => loadAllData()}
            className="px-3 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold transition-all flex items-center gap-1.5 shadow-sm"
          >
            <svg className="w-4 h-4 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            <span>Refresh</span>
          </button>
          <button
            onClick={() => setShowTypeModal(true)}
            className="px-4 py-2 rounded-xl bg-[#2563EB] hover:bg-blue-700 text-white text-xs font-semibold transition-all shadow-md flex items-center gap-1.5"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            <span>Add Category</span>
          </button>
        </div>
      }
    >
      <div className="space-y-8">
        {/* KPI Metric Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-xl shadow-slate-900/5 space-y-1">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Pending Applications
            </span>
            <div className="flex items-baseline justify-between">
              <span className="text-3xl font-black text-[#0F172A]">{pendingIssuers.length}</span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-extrabold bg-amber-100 text-amber-800">
                Action Required
              </span>
            </div>
            <p className="text-xs text-slate-500">Organizations waiting for verification</p>
          </div>

          <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-xl shadow-slate-900/5 space-y-1">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Approved Issuers
            </span>
            <div className="flex items-baseline justify-between">
              <span className="text-3xl font-black text-[#0F172A]">{approvedIssuers.length}</span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-extrabold bg-emerald-100 text-emerald-800">
                RSA Active
              </span>
            </div>
            <p className="text-xs text-slate-500">Authorized credential authorities</p>
          </div>

          <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-xl shadow-slate-900/5 space-y-1">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Active Certificates
            </span>
            <div className="flex items-baseline justify-between">
              <span className="text-3xl font-black text-[#0F172A]">{activeCertificates.length}</span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-extrabold bg-blue-100 text-[#2563EB]">
                Ledger
              </span>
            </div>
            <p className="text-xs text-slate-500">Total cryptographically valid credentials</p>
          </div>

          <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-xl shadow-slate-900/5 space-y-1">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Credential Categories
            </span>
            <div className="flex items-baseline justify-between">
              <span className="text-3xl font-black text-[#0F172A]">{types.length}</span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-extrabold bg-purple-100 text-purple-700">
                Configured
              </span>
            </div>
            <p className="text-xs text-slate-500">Degrees, diplomas, and licenses</p>
          </div>
        </div>

        {/* Tab Controls */}
        <div className="flex items-center gap-2 border-b border-slate-200 pb-3">
          <button
            onClick={() => setActiveTab("overview")}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
              activeTab === "overview"
                ? "bg-[#1A237E] text-white shadow-sm"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
            }`}
          >
            Overview & Pending Actions
          </button>
          <button
            onClick={() => setActiveTab("issuers")}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 ${
              activeTab === "issuers"
                ? "bg-[#1A237E] text-white shadow-sm"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
            }`}
          >
            <span>All Issuers</span>
            <span className="px-2 py-0.5 rounded-full text-[10px] bg-slate-200 text-slate-800">
              {issuers.length}
            </span>
          </button>
          <button
            onClick={() => setActiveTab("types")}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 ${
              activeTab === "types"
                ? "bg-[#1A237E] text-white shadow-sm"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
            }`}
          >
            <span>Certificate Categories</span>
            <span className="px-2 py-0.5 rounded-full text-[10px] bg-slate-200 text-slate-800">
              {types.length}
            </span>
          </button>
        </div>

        {/* Tab 1: Overview & Pending Actions */}
        {activeTab === "overview" && (
          <div className="space-y-8">
            {/* Pending Issuer Approval Queue */}
            <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xl shadow-slate-900/5 overflow-hidden">
              <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-[#0F172A]">
                    Pending Institutional Applications ({pendingIssuers.length})
                  </h3>
                  <p className="text-xs text-slate-500">
                    Review and authorize organizations. Approving automatically generates a 2048-bit RSA keypair and grants issuance privileges.
                  </p>
                </div>
              </div>

              {pendingIssuers.length === 0 ? (
                <div className="p-12 text-center text-sm text-slate-500 space-y-2">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <p className="font-semibold text-slate-800">All applications processed!</p>
                  <p className="text-xs text-slate-400">There are no pending institutional verification requests.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm border-collapse">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-100 text-xs font-bold uppercase text-slate-500">
                        <th className="py-3.5 px-6">Organization</th>
                        <th className="py-3.5 px-6">Reg Number</th>
                        <th className="py-3.5 px-6">Contact Email</th>
                        <th className="py-3.5 px-6">Applied Date</th>
                        <th className="py-3.5 px-6 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {pendingIssuers.map((issuer) => (
                        <tr key={issuer.id} className="hover:bg-slate-50/60 transition-colors">
                          <td className="py-4 px-6">
                            <span className="font-bold text-[#0F172A] block">{issuer.organizationName}</span>
                            <span className="text-xs text-slate-400">{issuer.address || "No address specified"}</span>
                          </td>
                          <td className="py-4 px-6 font-mono text-xs font-semibold text-slate-700">
                            {issuer.registrationNumber}
                          </td>
                          <td className="py-4 px-6 text-xs text-slate-600">
                            {issuer.contactEmail}
                          </td>
                          <td className="py-4 px-6 text-xs text-slate-500 font-mono">
                            {new Date(issuer.createdAt).toLocaleDateString()}
                          </td>
                          <td className="py-4 px-6 text-right space-x-2">
                            <button
                              disabled={processingIssuerId === issuer.id}
                              onClick={() => handleApproveIssuer(issuer.id)}
                              className="px-4 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs shadow-sm transition-all"
                            >
                              {processingIssuerId === issuer.id ? "Processing..." : "Approve & Issue RSA"}
                            </button>
                            <button
                              disabled={processingIssuerId === issuer.id}
                              onClick={() => handleRejectIssuer(issuer.id)}
                              className="px-3 py-1.5 rounded-xl border border-rose-200 text-rose-700 hover:bg-rose-50 font-semibold text-xs transition-all"
                            >
                              Reject
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Tab 2: All Issuers Directory */}
        {activeTab === "issuers" && (
          <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xl shadow-slate-900/5 overflow-hidden">
            <div className="p-6 border-b border-slate-100">
              <h3 className="text-lg font-bold text-[#0F172A]">All Registered Organizations ({issuers.length})</h3>
              <p className="text-xs text-slate-500">Full institutional registry across all status states.</p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-100 text-xs font-bold uppercase text-slate-500">
                    <th className="py-3.5 px-6">Organization</th>
                    <th className="py-3.5 px-6">Reg Number</th>
                    <th className="py-3.5 px-6">User Account</th>
                    <th className="py-3.5 px-6">Status</th>
                    <th className="py-3.5 px-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {issuers.map((issuer) => (
                    <tr key={issuer.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="py-4 px-6">
                        <span className="font-bold text-[#0F172A] block">{issuer.organizationName}</span>
                        <span className="text-xs text-slate-400">{issuer.contactEmail}</span>
                      </td>
                      <td className="py-4 px-6 font-mono text-xs font-semibold text-slate-700">
                        {issuer.registrationNumber}
                      </td>
                      <td className="py-4 px-6 text-xs text-slate-600 font-mono">
                        {issuer.userEmail}
                      </td>
                      <td className="py-4 px-6">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                            issuer.status === "APPROVED"
                              ? "bg-emerald-100 text-emerald-800"
                              : issuer.status === "PENDING"
                              ? "bg-amber-100 text-amber-800"
                              : "bg-rose-100 text-rose-800"
                          }`}
                        >
                          {issuer.status}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-right">
                        {issuer.status === "PENDING" ? (
                          <button
                            onClick={() => handleApproveIssuer(issuer.id)}
                            className="px-3.5 py-1.5 rounded-lg bg-emerald-600 text-white font-semibold text-xs hover:bg-emerald-700 transition-all shadow-sm"
                          >
                            Approve
                          </button>
                        ) : (
                          <span className="text-xs text-slate-400">Archived</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 3: Certificate Types Management */}
        {activeTab === "types" && (
          <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xl shadow-slate-900/5 overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-[#0F172A]">Credential Categories ({types.length})</h3>
                <p className="text-xs text-slate-500">Categories available for issuers during certificate generation.</p>
              </div>
              <button
                onClick={() => setShowTypeModal(true)}
                className="px-4 py-2 rounded-xl bg-[#2563EB] hover:bg-blue-700 text-white text-xs font-semibold transition-all shadow-sm flex items-center gap-1.5"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                <span>Add Category</span>
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-100 text-xs font-bold uppercase text-slate-500">
                    <th className="py-3.5 px-6">Category Name</th>
                    <th className="py-3.5 px-6">Code Identifier</th>
                    <th className="py-3.5 px-6">Description</th>
                    <th className="py-3.5 px-6">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {types.map((type) => (
                    <tr key={type.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="py-4 px-6 font-bold text-[#0F172A]">{type.name}</td>
                      <td className="py-4 px-6 font-mono text-xs font-semibold text-slate-700">
                        {type.code}
                      </td>
                      <td className="py-4 px-6 text-xs text-slate-600">
                        {type.description || "—"}
                      </td>
                      <td className="py-4 px-6">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
                            type.active
                              ? "bg-emerald-100 text-emerald-800"
                              : "bg-slate-100 text-slate-600"
                          }`}
                        >
                          {type.active ? "Active" : "Inactive"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Add Certificate Type Modal */}
      {showTypeModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 space-y-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold text-[#0F172A]">Add Certificate Category</h3>
              <button
                onClick={() => setShowTypeModal(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleCreateType} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Category Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Postgraduate Diploma"
                  value={newTypeName}
                  onChange={(e) => setNewTypeName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Code Identifier (Uppercase)
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. POSTGRADUATE_DIPLOMA"
                  value={newTypeCode}
                  onChange={(e) => setNewTypeCode(e.target.value.toUpperCase())}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Description
                </label>
                <textarea
                  rows={3}
                  placeholder="Brief description of the credential category..."
                  value={newTypeDesc}
                  onChange={(e) => setNewTypeDesc(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowTypeModal(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 text-xs font-semibold hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingType}
                  className="px-6 py-2 rounded-xl bg-[#2563EB] hover:bg-blue-700 text-white text-xs font-semibold shadow-md"
                >
                  {isSubmittingType ? "Creating..." : "Save Category"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DashboardShell>
  );
}

export default function AdminPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC]">
          <div className="animate-spin h-8 w-8 border-4 border-[#2563EB] border-t-transparent rounded-full"></div>
        </div>
      }
    >
      <AdminDashboardContent />
    </Suspense>
  );
}
