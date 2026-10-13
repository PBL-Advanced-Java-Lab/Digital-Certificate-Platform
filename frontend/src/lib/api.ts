const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api";

export interface ApiError {
  status?: number;
  error?: string;
  message: string;
  errors?: Record<string, string>;
}

export interface User {
  id: number;
  fullName: string;
  email: string;
  roles: string[];
  active?: boolean;
  createdAt?: string;
}

export interface AuthResponse {
  token: string;
  tokenType: string;
  id: number;
  fullName: string;
  email: string;
  roles: string[];
}

export interface IssuerResponse {
  id: number;
  organizationName: string;
  registrationNumber: string;
  contactEmail: string;
  address?: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  userId: number;
  userEmail: string;
  createdAt: string;
}

export interface IssuerRegistrationPayload {
  organizationName: string;
  registrationNumber: string;
  contactEmail: string;
  address?: string;
}

export interface CertificateTypeResponse {
  id: number;
  name: string;
  code: string;
  description?: string;
  active: boolean;
  createdAt: string;
}

export interface CertificateResponse {
  id: number;
  certificateId: string;
  recipientName: string;
  recipientEmail: string;
  courseOrTitle: string;
  certificateTypeId: number;
  certificateTypeName: string;
  certificateTypeCode: string;
  issuerId: number;
  issuerOrganizationName: string;
  issuerRegistrationNumber: string;
  issueDate: string;
  expiryDate?: string;
  status: "ACTIVE" | "REVOKED" | "EXPIRED";
  sha256Hash: string;
  digitalSignature: string;
  qrCodeBase64: string;
  revocationReason?: string;
  revokedAt?: string;
  createdAt: string;
}

export interface CertificateIssuePayload {
  recipientName: string;
  recipientEmail: string;
  courseOrTitle: string;
  certificateTypeId: number;
  expiryDate?: string;
}

export interface PublicVerificationResponse {
  certificateId: string;
  recipientName: string;
  maskedRecipientEmail: string;
  courseOrTitle: string;
  certificateTypeName: string;
  certificateTypeCode: string;
  issuerOrganizationName: string;
  issuerRegistrationNumber: string;
  issuerPublicKey: string;
  issueDate: string;
  expiryDate?: string;
  status: "ACTIVE" | "REVOKED" | "EXPIRED";
  verificationStatus: "VERIFIED" | "EXPIRED" | "REVOKED" | "TAMPERED";
  sha256Hash: string;
  digitalSignature: string;
  signatureValid: boolean;
  hashValid: boolean;
  revocationReason?: string;
  revokedAt?: string;
  verifiedAt: string;
}

export interface FraudAlert {
  id: number;
  alertType: string;
  severity: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  certificateId?: string;
  ipAddress?: string;
  description: string;
  resolved: boolean;
  createdAt: string;
  resolvedAt?: string;
  resolvedBy?: string;
}

export interface VerificationLog {
  id: number;
  certificateId: string;
  verificationStatus: string;
  clientIp?: string;
  userAgent?: string;
  successful: boolean;
  timestamp: string;
}

export interface AnalyticsOverviewResponse {
  totalCertificatesIssued: number;
  activeCertificates: number;
  revokedCertificates: number;
  totalVerifications: number;
  verifiedCount: number;
  revokedScanCount: number;
  invalidNotFoundCount: number;
  activeFraudAlerts: number;
  successRate: number;
  recentAlerts: FraudAlert[];
  recentLogs: VerificationLog[];
}

// Token management in browser storage
export const tokenStorage = {
  get: (): string | null => {
    if (typeof window === "undefined") return null;
    return localStorage.getItem("certiguard_token");
  },
  set: (token: string): void => {
    if (typeof window === "undefined") return;
    localStorage.setItem("certiguard_token", token);
  },
  remove: (): void => {
    if (typeof window === "undefined") return;
    localStorage.setItem("certiguard_token", "");
    localStorage.removeItem("certiguard_token");
  },
};

// Generic request handler
async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = tokenStorage.get();

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    Accept: "application/json",
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  const text = await response.text();
  let data: any = null;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = text;
  }

  if (!response.ok) {
    const error: ApiError = {
      status: response.status,
      message: (data && data.message) || response.statusText || "Something went wrong",
      error: (data && data.error) || undefined,
      errors: (data && data.errors) || undefined,
    };
    throw error;
  }

  return data as T;
}

export const api = {
  // Authentication
  auth: {
    register: (fullName: string, email: string, password: string): Promise<AuthResponse> =>
      request<AuthResponse>("/auth/register", {
        method: "POST",
        body: JSON.stringify({ fullName, email, password }),
      }),

    login: (email: string, password: string): Promise<AuthResponse> =>
      request<AuthResponse>("/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      }),

    getProfile: (): Promise<User> =>
      request<User>("/auth/me", {
        method: "GET",
      }),
  },

  // Issuers
  issuer: {
    register: (payload: IssuerRegistrationPayload): Promise<IssuerResponse> =>
      request<IssuerResponse>("/issuers/register", {
        method: "POST",
        body: JSON.stringify(payload),
      }),

    getMyProfile: (): Promise<IssuerResponse> =>
      request<IssuerResponse>("/issuers/my-profile", {
        method: "GET",
      }),

    getAll: (status?: string): Promise<IssuerResponse[]> =>
      request<IssuerResponse[]>(`/issuers${status ? `?status=${status}` : ""}`, {
        method: "GET",
      }),

    getDirectory: (): Promise<IssuerResponse[]> =>
      request<IssuerResponse[]>("/issuers/directory", {
        method: "GET",
      }),

    approve: (id: number): Promise<IssuerResponse> =>
      request<IssuerResponse>(`/issuers/${id}/approve`, {
        method: "PUT",
      }),

    reject: (id: number): Promise<IssuerResponse> =>
      request<IssuerResponse>(`/issuers/${id}/reject`, {
        method: "PUT",
      }),
  },

  // Certificate Types
  certificateTypes: {
    getActive: (): Promise<CertificateTypeResponse[]> =>
      request<CertificateTypeResponse[]>("/certificate-types", {
        method: "GET",
      }),

    getAll: (): Promise<CertificateTypeResponse[]> =>
      request<CertificateTypeResponse[]>("/certificate-types/all", {
        method: "GET",
      }),

    create: (name: string, code: string, description?: string): Promise<CertificateTypeResponse> =>
      request<CertificateTypeResponse>("/certificate-types", {
        method: "POST",
        body: JSON.stringify({ name, code, description }),
      }),
  },

  // Certificates
  certificates: {
    getAll: (): Promise<CertificateResponse[]> =>
      request<CertificateResponse[]>("/certificates", {
        method: "GET",
      }),

    issue: (payload: CertificateIssuePayload): Promise<CertificateResponse> =>
      request<CertificateResponse>("/certificates/issue", {
        method: "POST",
        body: JSON.stringify(payload),
      }),

    getById: (certificateId: string): Promise<CertificateResponse> =>
      request<CertificateResponse>(`/certificates/${encodeURIComponent(certificateId)}`, {
        method: "GET",
      }),

    getPdfUrl: (certificateId: string): string => {
      return `${API_BASE_URL}/certificates/${encodeURIComponent(certificateId)}/pdf`;
    },

    revoke: (certificateId: string, reason: string): Promise<CertificateResponse> =>
      request<CertificateResponse>(`/certificates/${encodeURIComponent(certificateId)}/revoke`, {
        method: "PUT",
        body: JSON.stringify({ reason }),
      }),

    getMyIssued: (): Promise<CertificateResponse[]> =>
      request<CertificateResponse[]>("/certificates/my-issued", {
        method: "GET",
      }),

    getMyReceived: (): Promise<CertificateResponse[]> =>
      request<CertificateResponse[]>("/certificates/my-received", {
        method: "GET",
      }),
  },

  // Verification (Public)
  verification: {
    verifyPublic: (certificateId: string): Promise<PublicVerificationResponse> =>
      request<PublicVerificationResponse>(`/public/verify/${encodeURIComponent(certificateId)}`, {
        method: "GET",
      }),
  },

  // Analytics & Fraud Detection (Admin)
  analytics: {
    getOverview: (): Promise<AnalyticsOverviewResponse> =>
      request<AnalyticsOverviewResponse>("/analytics/overview", {
        method: "GET",
      }),

    getFraudAlerts: (unresolvedOnly = false): Promise<FraudAlert[]> =>
      request<FraudAlert[]>(`/analytics/fraud-alerts?unresolvedOnly=${unresolvedOnly}`, {
        method: "GET",
      }),

    resolveAlert: (alertId: number): Promise<FraudAlert> =>
      request<FraudAlert>(`/analytics/fraud-alerts/${alertId}/resolve`, {
        method: "PUT",
      }),

    getLogs: (): Promise<VerificationLog[]> =>
      request<VerificationLog[]>("/analytics/logs", {
        method: "GET",
      }),
  },

  // Health
  health: {
    check: (): Promise<{ status: string; application: string; message: string }> =>
      request("/health", { method: "GET" }),
    database: (): Promise<{ database: string; status: string; message: string }> =>
      request("/health/database", { method: "GET" }),
  },
};
