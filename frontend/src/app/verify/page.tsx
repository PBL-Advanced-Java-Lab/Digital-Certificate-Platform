"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useRef, useState } from "react";
import jsQR from "jsqr";
import { api, ApiError, PublicVerificationResponse } from "@/lib/api";

const SAMPLE_IDS = [
  { id: "CG-2026-NTU-7890", label: "Active Degree (NTU)", color: "text-emerald-700 bg-emerald-50 border-emerald-200" },
  { id: "CG-2026-IIT-1002", label: "Active Certificate (IIT)", color: "text-blue-700 bg-blue-50 border-blue-200" },
  { id: "CG-2026-REVOKED-001", label: "Revoked Credential", color: "text-rose-700 bg-rose-50 border-rose-200" },
];

function VerifyMainContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialId = searchParams.get("id") || "";

  const [activeTab, setActiveTab] = useState<"id" | "camera" | "upload">("id");
  const [inputVal, setInputVal] = useState(initialId);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [quickResult, setQuickResult] = useState<PublicVerificationResponse | null>(null);

  // Camera QR Scanner State
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [cameraFacing, setCameraFacing] = useState<"environment" | "user">("environment");

  // File Upload State
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isProcessingUpload, setIsProcessingUpload] = useState(false);

  // Handle URL parameter on load
  useEffect(() => {
    if (initialId) {
      handleVerifyId(initialId);
    }
  }, [initialId]);

  // Cleanup camera stream when unmounting or switching tabs
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  const stopCamera = () => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setCameraActive(false);
  };

  const startCamera = async (facing: "environment" | "user" = cameraFacing) => {
    stopCamera();
    setCameraError(null);

    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error("Camera API is not supported in this browser.");
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: facing, width: { ideal: 1280 }, height: { ideal: 720 } },
      });

      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.setAttribute("playsinline", "true");
        await videoRef.current.play();
        setCameraActive(true);
        scanFrame();
      }
    } catch (err: any) {
      console.error("Camera access error:", err);
      setCameraError(
        err.name === "NotAllowedError"
          ? "Camera access was denied. Please allow camera permissions in your browser or enter the Certificate ID manually."
          : "Could not initialize video camera. Please verify device availability or switch to Certificate ID lookup."
      );
    }
  };

  const scanFrame = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;

    if (video && canvas && video.readyState === video.HAVE_ENOUGH_DATA) {
      const ctx = canvas.getContext("2d", { willReadFrequently: true });
      if (ctx) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const code = jsQR(imageData.data, imageData.width, imageData.height, {
          inversionAttempts: "dontInvert",
        });

        if (code && code.data) {
          processQrCodeData(code.data);
          return;
        }
      }
    }

    animationFrameRef.current = requestAnimationFrame(scanFrame);
  };

  const processQrCodeData = (data: string) => {
    stopCamera();
    try {
      // Data might be full verification URL: http://.../verify/CG-2026-ABCD or just CG-2026-ABCD
      let extractedId = data.trim();
      if (extractedId.includes("/verify/")) {
        const parts = extractedId.split("/verify/");
        extractedId = parts[parts.length - 1].split("?")[0].split("#")[0].trim();
      } else if (extractedId.includes("id=")) {
        const match = extractedId.match(/[?&]id=([^&]+)/);
        if (match) extractedId = decodeURIComponent(match[1]).trim();
      }

      if (extractedId) {
        router.push(`/verify/${encodeURIComponent(extractedId.toUpperCase())}`);
      } else {
        setErrorMsg(`Scanned QR code did not contain a recognizable Certificate ID.`);
        setActiveTab("id");
      }
    } catch (e) {
      setErrorMsg("Failed to parse scanned QR code.");
      setActiveTab("id");
    }
  };

  const handleVerifyId = async (idToVerify: string) => {
    const id = idToVerify.trim().toUpperCase();
    if (!id) return;

    setIsLoading(true);
    setErrorMsg(null);
    setQuickResult(null);

    try {
      const data = await api.verification.verifyPublic(id);
      setQuickResult(data);
    } catch (err: any) {
      // If server returned 404 or not found, redirect to dedicated details view to display comprehensive not found state
      router.push(`/verify/${encodeURIComponent(id)}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsProcessingUpload(true);
    setUploadError(null);

    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          setUploadError("Could not process image.");
          setIsProcessingUpload(false);
          return;
        }

        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);

        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const code = jsQR(imageData.data, imageData.width, imageData.height);

        if (code && code.data) {
          processQrCodeData(code.data);
        } else {
          setUploadError("No valid QR code was detected in the uploaded image. Please ensure the QR code is clearly visible and well-lit.");
        }
        setIsProcessingUpload(false);
      };
      img.onerror = () => {
        setUploadError("Failed to load selected image file.");
        setIsProcessingUpload(false);
      };
      img.src = reader.result as string;
    };
    reader.onerror = () => {
      setUploadError("Failed to read file.");
      setIsProcessingUpload(false);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="flex-1 py-12 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto w-full space-y-10">
      {/* Header Section */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200 shadow-sm">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          Authoritative Public Ledger Verification
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-[#0F172A] tracking-tight">
          Verify Certificate Authenticity
        </h1>
        <p className="text-sm sm:text-base text-slate-600 max-w-xl mx-auto">
          Verify any CertiGuard credential in seconds. Check document integrity, cryptographic digital signatures, and issuing organization credentials.
        </p>
      </div>

      {/* Mode Switcher Tabs */}
      <div className="flex items-center justify-center">
        <div className="inline-flex p-1.5 rounded-2xl bg-slate-100 border border-slate-200">
          <button
            type="button"
            onClick={() => {
              stopCamera();
              setActiveTab("id");
            }}
            className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 ${
              activeTab === "id"
                ? "bg-white text-[#0F172A] shadow-md shadow-slate-900/5"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <svg className="w-4 h-4 text-[#2563EB]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
            </svg>
            <span>Certificate ID Lookup</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveTab("camera");
              startCamera();
            }}
            className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 ${
              activeTab === "camera"
                ? "bg-white text-[#0F172A] shadow-md shadow-slate-900/5"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <svg className="w-4 h-4 text-[#2563EB]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span>Camera QR Scanner</span>
          </button>

          <button
            type="button"
            onClick={() => {
              stopCamera();
              setActiveTab("upload");
            }}
            className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 ${
              activeTab === "upload"
                ? "bg-white text-[#0F172A] shadow-md shadow-slate-900/5"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <svg className="w-4 h-4 text-[#2563EB]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span>Upload QR Image</span>
          </button>
        </div>
      </div>

      {/* Tab 1: Certificate ID Lookup */}
      {activeTab === "id" && (
        <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200/90 shadow-xl shadow-slate-900/5 space-y-6">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleVerifyId(inputVal);
            }}
            className="flex flex-col sm:flex-row gap-3"
          >
            <div className="relative flex-1">
              <div className="absolute left-4 top-3.5 text-slate-400">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                required
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
                placeholder="Enter Certificate ID (e.g. CG-2026-NTU-7890)"
                className="w-full pl-11 pr-4 py-3.5 rounded-2xl border border-slate-200 text-sm font-mono uppercase tracking-wide focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:border-transparent placeholder:text-slate-400 placeholder:font-sans placeholder:normal-case shadow-sm"
              />
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-[#1A237E] to-[#2563EB] hover:from-[#151c65] hover:to-blue-700 text-white font-semibold text-sm shadow-md shadow-blue-500/20 hover:shadow-lg transition-all flex items-center justify-center gap-2 flex-shrink-0"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                  </svg>
                  <span>Verifying...</span>
                </>
              ) : (
                <>
                  <span>Verify Credential</span>
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Records Chips */}
          <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center gap-2 text-xs">
            <span className="font-semibold text-slate-500">Quick Test Samples:</span>
            {SAMPLE_IDS.map((sample) => (
              <button
                key={sample.id}
                type="button"
                onClick={() => {
                  setInputVal(sample.id);
                  handleVerifyId(sample.id);
                }}
                className={`px-3 py-1.5 rounded-lg border font-mono transition-all hover:scale-105 ${sample.color}`}
              >
                {sample.id}
              </button>
            ))}
          </div>

          {errorMsg && (
            <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-sm">
              {errorMsg}
            </div>
          )}
        </div>
      )}

      {/* Tab 2: In-Browser WebRTC Camera Scanner */}
      {activeTab === "camera" && (
        <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200/90 shadow-xl shadow-slate-900/5 space-y-6 text-center">
          <div className="max-w-md mx-auto space-y-2">
            <h3 className="text-lg font-bold text-[#0F172A]">Point Camera at Certificate QR Code</h3>
            <p className="text-xs text-slate-500">
              Hold the certificate QR code steady within the scanning frame. Recognition is automatic.
            </p>
          </div>

          {cameraError ? (
            <div className="max-w-md mx-auto p-6 rounded-2xl bg-amber-50 border border-amber-200 text-amber-800 text-sm space-y-4">
              <p>{cameraError}</p>
              <button
                type="button"
                onClick={() => startCamera()}
                className="px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-semibold text-xs transition-all"
              >
                Retry Camera Access
              </button>
            </div>
          ) : (
            <div className="relative max-w-sm mx-auto aspect-square rounded-3xl overflow-hidden bg-slate-900 border-4 border-slate-800 shadow-2xl flex items-center justify-center">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover"
              />
              <canvas ref={canvasRef} className="hidden" />

              {/* Viewfinder Target Reticle */}
              <div className="absolute inset-8 border-2 border-dashed border-emerald-400/80 rounded-2xl pointer-events-none flex items-center justify-center">
                <div className="w-full h-0.5 bg-emerald-400/60 animate-pulse shadow-sm shadow-emerald-400"></div>
              </div>

              {!cameraActive && (
                <div className="absolute inset-0 bg-slate-950/80 flex flex-col items-center justify-center text-white space-y-3">
                  <svg className="animate-spin h-8 w-8 text-emerald-400" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                  </svg>
                  <span className="text-xs font-medium text-slate-300">Initializing camera feed...</span>
                </div>
              )}
            </div>
          )}

          <div className="flex items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => {
                const nextFacing = cameraFacing === "environment" ? "user" : "environment";
                setCameraFacing(nextFacing);
                startCamera(nextFacing);
              }}
              className="px-4 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold transition-all flex items-center gap-1.5 shadow-sm"
            >
              <svg className="w-4 h-4 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              <span>Flip Camera ({cameraFacing === "environment" ? "Back" : "Front"})</span>
            </button>

            <button
              type="button"
              onClick={() => {
                stopCamera();
                setActiveTab("id");
              }}
              className="px-4 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold transition-all shadow-sm"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Tab 3: Upload QR Image */}
      {activeTab === "upload" && (
        <div className="p-8 sm:p-12 rounded-3xl bg-white border border-slate-200/90 shadow-xl shadow-slate-900/5 space-y-6 text-center">
          <div className="max-w-md mx-auto space-y-2">
            <h3 className="text-lg font-bold text-[#0F172A]">Upload Certificate QR Image</h3>
            <p className="text-xs text-slate-500">
              Upload a screenshot or photo containing the certificate QR code to automatically read and verify its cryptographic credentials.
            </p>
          </div>

          <label className="block max-w-md mx-auto p-8 rounded-3xl border-2 border-dashed border-slate-300 hover:border-[#2563EB] bg-slate-50/50 hover:bg-blue-50/20 cursor-pointer transition-all">
            <input
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              className="hidden"
              disabled={isProcessingUpload}
            />
            <div className="space-y-3">
              <div className="w-14 h-14 rounded-2xl bg-blue-100 text-[#2563EB] flex items-center justify-center mx-auto shadow-sm">
                <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
              </div>
              <div>
                <span className="text-sm font-bold text-[#0F172A] block">
                  {isProcessingUpload ? "Decoding QR Code..." : "Click to select or drop an image file"}
                </span>
                <span className="text-xs text-slate-400">Supports PNG, JPG, WEBP</span>
              </div>
            </div>
          </label>

          {uploadError && (
            <div className="max-w-md mx-auto p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs sm:text-sm">
              {uploadError}
            </div>
          )}
        </div>
      )}

      {/* Quick Result Preview Card if verified via direct search */}
      {quickResult && (
        <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200/90 shadow-2xl shadow-blue-900/5 space-y-6 animate-fadeIn">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div
                className={`w-14 h-14 rounded-2xl flex items-center justify-center font-bold ${
                  quickResult.status === "ACTIVE"
                    ? "bg-emerald-100 text-emerald-700"
                    : "bg-rose-100 text-rose-700"
                }`}
              >
                {quickResult.status === "ACTIVE" ? (
                  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                )}
              </div>
              <div>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                    quickResult.status === "ACTIVE"
                      ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                      : "bg-rose-100 text-rose-800 border border-rose-300"
                  }`}
                >
                  {quickResult.status === "ACTIVE" ? "Cryptographically Valid" : "Revoked"}
                </span>
                <h3 className="text-xl font-bold text-[#0F172A] mt-1">{quickResult.courseOrTitle}</h3>
                <span className="text-xs text-slate-400 font-mono">ID: {quickResult.certificateId}</span>
              </div>
            </div>

            <Link
              href={`/verify/${encodeURIComponent(quickResult.certificateId)}`}
              className="px-5 py-2.5 rounded-xl bg-[#2563EB] hover:bg-blue-700 text-white font-semibold text-xs sm:text-sm shadow-md transition-all flex items-center gap-1.5 self-stretch sm:self-auto justify-center"
            >
              <span>View Full Audit & Official PDF</span>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs">
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
              <span className="text-slate-400 block font-semibold uppercase">Recipient</span>
              <span className="font-bold text-slate-900 text-sm mt-0.5 block">{quickResult.recipientName}</span>
              <span className="font-mono text-slate-500 text-[11px]">{quickResult.maskedRecipientEmail}</span>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
              <span className="text-slate-400 block font-semibold uppercase">Issuer</span>
              <span className="font-bold text-slate-900 text-sm mt-0.5 block">{quickResult.issuerOrganizationName}</span>
              <span className="font-mono text-slate-500 text-[11px]">{quickResult.issuerRegistrationNumber}</span>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
              <span className="text-slate-400 block font-semibold uppercase">Category</span>
              <span className="font-bold text-slate-900 text-sm mt-0.5 block">{quickResult.certificateTypeName}</span>
              <span className="text-slate-500 text-[11px]">{quickResult.certificateTypeCode}</span>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
              <span className="text-slate-400 block font-semibold uppercase">Issue Date</span>
              <span className="font-bold text-slate-900 text-sm mt-0.5 block">{quickResult.issueDate}</span>
              <span className="text-slate-500 text-[11px]">Validity: {quickResult.expiryDate || "Lifetime"}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function PublicVerifyPage() {
  return (
    <Suspense
      fallback={
        <div className="flex-1 max-w-4xl mx-auto w-full py-16 px-4 text-center">
          <div className="inline-block animate-spin h-8 w-8 border-4 border-[#2563EB] border-t-transparent rounded-full"></div>
        </div>
      }
    >
      <VerifyMainContent />
    </Suspense>
  );
}
