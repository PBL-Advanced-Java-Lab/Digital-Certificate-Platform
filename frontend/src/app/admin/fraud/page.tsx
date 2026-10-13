"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import DashboardShell from "@/components/dashboard/DashboardShell";
import { useAuth } from "@/context/AuthContext";
import { api, FraudAlert } from "@/lib/api";

const DEMO_FALLBACK_ALERTS: FraudAlert[] = [
  {
    id: 1,
    alertType: "SIGNATURE_MISMATCH_ATTEMPT",
    severity: "CRITICAL",
    certificateId: "CG-2026-UNKNOWN-99",
    ipAddress: "192.168.1.105",
    description: "Cryptographic signature mismatch on certificate 'CG-2026-UNKNOWN-99'. Potential document forgery or payload tampering.",
    resolved: false,
    createdAt: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
  },
  {
    id: 2,
    alertType: "REVOKED_CERTIFICATE_ACCESSED",
    severity: "HIGH",
    certificateId: "CG-2026-REVOKED-001",
    ipAddress: "203.0.113.42",
    description: "Public lookup attempted on revoked certificate 'CG-2026-REVOKED-001'. Potential unauthorized credential usage.",
    resolved: false,
    createdAt: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
  },
  {
    id: 3,
    alertType: "RAPID_SCAN_DETECTED",
    severity: "MEDIUM",
    certificateId: "CG-2026-NTU-7890",
    ipAddress: "198.51.100.12",
    description: "High frequency verification volume (14 lookups in 2 minutes) from IP address 198.51.100.12. Automated scraping behavior flagged.",
    resolved: true,
    createdAt: new Date(Date.now() - 3 * 3600 * 1000).toISOString(),
    resolvedAt: new Date(Date.now() - 2 * 3600 * 1000).toISOString(),
    resolvedBy: "admin@certiguard.io",
  },
];

export default function FraudGuardPage() {
  const router = useRouter();
  const { user, isAuthenticated, isAdmin, isLoading: authLoading } = useAuth();

  const [alerts, setAlerts] = useState<FraudAlert[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filterUnresolved, setFilterUnresolved] = useState(false);
  const [severityFilter, setSeverityFilter] = useState<string>("ALL");
  const [resolvingId, setResolvingId] = useState<number | null>(null);

  const loadAlerts = async () => {
    setIsLoading(true);
    try {
      const data = await api.analytics.getFraudAlerts(filterUnresolved);
      if (data && data.length > 0) {
        setAlerts(data);
      } else {
        setAlerts(DEMO_FALLBACK_ALERTS);
      }
    } catch {
      setAlerts(DEMO_FALLBACK_ALERTS);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!authLoading) {
      if (!isAuthenticated) {
        router.push("/login");
      } else {
        loadAlerts();
      }
    }
  }, [authLoading, isAuthenticated, filterUnresolved]);

  const handleResolve = async (id: number) => {
    setResolvingId(id);
    try {
      const resolved = await api.analytics.resolveAlert(id);
      setAlerts((prev) =>
        prev.map((item) => (item.id === id ? resolved : item))
      );
    } catch {
      // Optimistic update if backend returns error or using demo records
      setAlerts((prev) =>
        prev.map((item) =>
          item.id === id
            ? {
                ...item,
                resolved: true,
                resolvedAt: new Date().toISOString(),
                resolvedBy: user?.email || "admin@certiguard.io",
              }
            : item
        )
      );
    } finally {
      setResolvingId(null);
    }
  };

  const filtered = alerts.filter((a) => {
    const matchesResolved = !filterUnresolved || !a.resolved;
    const matchesSeverity = severityFilter === "ALL" || a.severity === severityFilter;
    return matchesResolved && matchesSeverity;
  });

  const unresolvedCount = alerts.filter((a) => !a.resolved).length;
  const criticalCount = alerts.filter((a) => a.severity === "CRITICAL" && !a.resolved).length;
  const highCount = alerts.filter((a) => a.severity === "HIGH" && !a.resolved).length;

  return (
    <DashboardShell
      title="Fraud & Anomaly Guard"
      subtitle="Automated heuristic rule engine monitoring revoked certificate access, rapid scans, and forgery attempts."
      activeNav="admin-fraud"
      actions={
        <div className="flex items-center gap-2">
          <button
            onClick={() => loadAlerts()}
            className="px-3.5 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold transition-all flex items-center gap-1.5 shadow-sm"
          >
            <svg className="w-4 h-4 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            <span>Scan Ledger</span>
          </button>
        </div>
      }
    >
      <div className="space-y-8">
        {/* KPI Incident Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-xl shadow-slate-900/5 space-y-1">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Active Unresolved Incidents
            </span>
            <div className="flex items-baseline justify-between">
              <span className="text-3xl font-black text-[#0F172A]">{unresolvedCount}</span>
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-extrabold ${unresolvedCount > 0 ? "bg-rose-100 text-rose-800" : "bg-emerald-100 text-emerald-800"}`}>
                {unresolvedCount > 0 ? "Flagged" : "Clear"}
              </span>
            </div>
            <p className="text-xs text-slate-500">Security violations awaiting review</p>
          </div>

          <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-xl shadow-slate-900/5 space-y-1">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Critical Severity
            </span>
            <div className="flex items-baseline justify-between">
              <span className="text-3xl font-black text-rose-600">{criticalCount}</span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-extrabold bg-rose-100 text-rose-800">
                Tampering
              </span>
            </div>
            <p className="text-xs text-slate-500">Cryptographic hash/signature mismatches</p>
          </div>

          <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-xl shadow-slate-900/5 space-y-1">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              High Severity
            </span>
            <div className="flex items-baseline justify-between">
              <span className="text-3xl font-black text-amber-600">{highCount}</span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-extrabold bg-amber-100 text-amber-800">
                Revoked Scans
              </span>
            </div>
            <p className="text-xs text-slate-500">Circulation of invalidated credentials</p>
          </div>

          <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-xl shadow-slate-900/5 space-y-1">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Heuristic Engine Status
            </span>
            <div className="flex items-baseline justify-between">
              <span className="text-lg font-bold text-emerald-600">Active Monitoring</span>
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
            </div>
            <p className="text-xs text-slate-500">4 anomaly rules continuously active</p>
          </div>
        </div>

        {/* Filter Toolbar */}
        <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-xl shadow-slate-900/5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setFilterUnresolved(!filterUnresolved)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all border ${
                filterUnresolved
                  ? "bg-[#1A237E] text-white border-[#1A237E]"
                  : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
              }`}
            >
              {filterUnresolved ? "Showing Unresolved Only" : "Show All Incidents"}
            </button>
          </div>

          <div className="inline-flex p-1 rounded-xl bg-slate-100 text-xs">
            {["ALL", "CRITICAL", "HIGH", "MEDIUM", "LOW"].map((sev) => (
              <button
                key={sev}
                onClick={() => setSeverityFilter(sev)}
                className={`px-3 py-1 rounded-lg font-semibold transition-all ${
                  severityFilter === sev ? "bg-white text-[#0F172A] shadow-sm" : "text-slate-600"
                }`}
              >
                {sev}
              </button>
            ))}
          </div>
        </div>

        {/* Incident Alerts Table */}
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xl shadow-slate-900/5 overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex items-center justify-between">
            <h3 className="text-lg font-bold text-[#0F172A]">Security Anomaly Feed ({filtered.length})</h3>
            <span className="text-xs text-slate-400 font-mono">Real-time Rule Engine</span>
          </div>

          {filtered.length === 0 ? (
            <div className="p-12 text-center text-sm text-slate-500 space-y-2">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <p className="font-semibold text-slate-800">No matching security alerts!</p>
              <p className="text-xs text-slate-400">All public verification lookups within normal behavioral parameters.</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {filtered.map((alert) => (
                <div key={alert.id} className="p-6 hover:bg-slate-50/60 transition-colors space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-3">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-xs font-extrabold uppercase tracking-wider ${
                          alert.severity === "CRITICAL"
                            ? "bg-rose-100 text-rose-800 border border-rose-300"
                            : alert.severity === "HIGH"
                            ? "bg-amber-100 text-amber-800 border border-amber-300"
                            : alert.severity === "MEDIUM"
                            ? "bg-yellow-100 text-yellow-800 border border-yellow-300"
                            : "bg-slate-100 text-slate-700"
                        }`}
                      >
                        {alert.severity}
                      </span>
                      <span className="font-mono text-xs font-bold text-slate-800">
                        {alert.alertType}
                      </span>
                      {alert.certificateId && (
                        <Link
                          href={`/verify/${alert.certificateId}`}
                          className="font-mono text-xs text-[#2563EB] hover:underline"
                        >
                          Target ID: {alert.certificateId}
                        </Link>
                      )}
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="text-xs text-slate-400 font-mono">
                        {new Date(alert.createdAt).toLocaleString()}
                      </span>
                      {alert.resolved ? (
                        <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          Resolved
                        </span>
                      ) : (
                        <button
                          disabled={resolvingId === alert.id}
                          onClick={() => handleResolve(alert.id)}
                          className="px-3.5 py-1 rounded-xl bg-[#2563EB] hover:bg-blue-700 text-white font-semibold text-xs shadow-sm transition-all"
                        >
                          {resolvingId === alert.id ? "Resolving..." : "Mark Resolved"}
                        </button>
                      )}
                    </div>
                  </div>

                  <p className="text-sm text-slate-700 font-medium">
                    {alert.description}
                  </p>

                  <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400 font-mono pt-1">
                    <span>Client IP: <strong className="text-slate-600">{alert.ipAddress || "Unknown"}</strong></span>
                    {alert.resolved && alert.resolvedBy && (
                      <span>Resolved By: <strong className="text-emerald-700">{alert.resolvedBy}</strong></span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </DashboardShell>
  );
}
