"use client";

import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Header } from "@/components/Header";
import { EvidenceCanvas } from "@/components/EvidenceCanvas";
import { SynthesisPanel } from "@/components/SynthesisPanel";
import { LuCloudUpload, LuCircleCheck, LuFileText, LuLoader, LuDownload, LuArrowLeft, LuInfo } from "react-icons/lu";

type AppState = "upload" | "processing" | "results";
export type ReqId = "REQ_4_1_A" | "REQ_4_1_B" | "REQ_4_2_A";

export default function VendorLensApp() {
  const [appState, setAppState] = useState<AppState>("upload");
  const [reqFile, setReqFile] = useState<boolean>(false);
  const [vendorFile, setVendorFile] = useState<boolean>(false);
  const [selectedReq, setSelectedReq] = useState<ReqId>("REQ_4_1_A");

  const runAnalysisMutation = useMutation({
    mutationFn: async () => {
      return new Promise((resolve) => setTimeout(resolve, 2500));
    },
    onSuccess: () => {
      setAppState("results");
    },
  });

  const reqFileUploadMutation = useMutation({
    mutationFn: async () => {
      return new Promise((resolve) => setTimeout(resolve, 1500));
    },
    onSuccess: () => {
      setReqFile(true);
    },
  });

  const vendorFileUploadMutation = useMutation({
    mutationFn: async () => {
      return new Promise((resolve) => setTimeout(resolve, 2000));
    },
    onSuccess: () => {
      setVendorFile(true);
    },
  });

  const exportMutation = useMutation({
    mutationFn: async () => {
      return new Promise((resolve) => setTimeout(resolve, 1200));
    },
  });

  const handleRunAnalysis = () => {
    setAppState("processing");
    runAnalysisMutation.mutate();
  };

  const resetApp = () => {
    setAppState("upload");
    setReqFile(false);
    setVendorFile(false);
    setSelectedReq("REQ_4_1_A");
  };

  return (
    <div className="flex flex-col h-full w-full bg-white">
      <Header />

      <main className="flex-1 overflow-y-auto">
        {/* ── State 1: Upload Documents ── */}
        {appState === "upload" && (
          <div className="max-w-4xl mx-auto p-8 lg:p-16">
            <h1 className="text-[28px] font-bold tracking-tight text-[var(--color-on-surface)] mb-2">
              New Compliance Assessment
            </h1>
            <p className="text-[14px] text-[var(--color-secondary)] mb-10">
              Upload the requirements framework and the vendor's evidence submission to begin the automated extraction and assessment process.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
              {/* Requirements Upload */}
              <button
                onClick={() => { if (!reqFile && !reqFileUploadMutation.isPending) reqFileUploadMutation.mutate(); }}
                disabled={reqFileUploadMutation.isPending || reqFile}
                className={`p-8 border-2 border-dashed rounded-xl flex flex-col items-center justify-center text-center transition-colors ${
                  reqFile
                    ? "border-[var(--color-status-met)] bg-[var(--color-status-met)]/5"
                    : reqFileUploadMutation.isPending
                    ? "border-[var(--color-outline-variant)] bg-[var(--color-surface-container-low)]"
                    : "border-[var(--color-outline-variant)] hover:border-[var(--color-primary-container)] bg-[var(--color-surface-container-lowest)] cursor-pointer"
                }`}
              >
                {reqFile ? (
                  <>
                    <LuCircleCheck className="w-8 h-8 text-[var(--color-status-met)] mb-3" />
                    <span className="font-semibold text-[14px]">framework_v2.pdf</span>
                    <span className="text-[12px] text-[var(--color-secondary)]">240 KB</span>
                  </>
                ) : reqFileUploadMutation.isPending ? (
                  <>
                    <LuLoader className="w-8 h-8 text-[var(--color-secondary)] animate-spin mb-3" />
                    <span className="font-semibold text-[14px] mb-1">Uploading...</span>
                  </>
                ) : (
                  <>
                    <LuFileText className="w-8 h-8 text-[var(--color-secondary)] mb-3" />
                    <span className="font-semibold text-[14px] mb-1">Requirements Document</span>
                    <span className="text-[12px] text-[var(--color-secondary)]">Drop file or click to upload</span>
                  </>
                )}
              </button>

              {/* Vendor Submission Upload */}
              <button
                onClick={() => { if (!vendorFile && !vendorFileUploadMutation.isPending) vendorFileUploadMutation.mutate(); }}
                disabled={vendorFileUploadMutation.isPending || vendorFile}
                className={`p-8 border-2 border-dashed rounded-xl flex flex-col items-center justify-center text-center transition-colors ${
                  vendorFile
                    ? "border-[var(--color-status-met)] bg-[var(--color-status-met)]/5"
                    : vendorFileUploadMutation.isPending
                    ? "border-[var(--color-outline-variant)] bg-[var(--color-surface-container-low)]"
                    : "border-[var(--color-outline-variant)] hover:border-[var(--color-primary-container)] bg-[var(--color-surface-container-lowest)] cursor-pointer"
                }`}
              >
                {vendorFile ? (
                  <>
                    <LuCircleCheck className="w-8 h-8 text-[var(--color-status-met)] mb-3" />
                    <span className="font-semibold text-[14px]">vendor_evidence_pack.zip</span>
                    <span className="text-[12px] text-[var(--color-secondary)]">14 MB</span>
                  </>
                ) : vendorFileUploadMutation.isPending ? (
                  <>
                    <LuLoader className="w-8 h-8 text-[var(--color-secondary)] animate-spin mb-3" />
                    <span className="font-semibold text-[14px] mb-1">Uploading...</span>
                  </>
                ) : (
                  <>
                    <LuCloudUpload className="w-8 h-8 text-[var(--color-secondary)] mb-3" />
                    <span className="font-semibold text-[14px] mb-1">Vendor Submission</span>
                    <span className="text-[12px] text-[var(--color-secondary)]">Drop file or click to upload</span>
                  </>
                )}
              </button>
            </div>

            <div className="flex justify-end">
              <button
                onClick={handleRunAnalysis}
                disabled={!reqFile || !vendorFile}
                className="bg-[var(--color-primary-container)] disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 py-2.5 rounded-md font-medium text-[13px] flex items-center gap-2 hover:bg-[var(--color-brand-hover)] transition-colors"
              >
                Run Analysis
              </button>
            </div>
          </div>
        )}

        {/* ── State 2: Analysis Processing ── */}
        {appState === "processing" && (
          <div className="flex flex-col items-center justify-center h-full">
            <LuLoader className="w-10 h-10 text-[var(--color-primary-container)] animate-spin mb-4" />
            <h2 className="text-[18px] font-semibold text-[var(--color-on-surface)] mb-2">
              Extracting & Synthesizing Evidence
            </h2>
            <p className="text-[14px] text-[var(--color-secondary)] max-w-md text-center">
              Comparing vendor submission against 12 specific requirements. This usually takes around 30 seconds.
            </p>
          </div>
        )}

        {/* ── State 3: Assessment Results ── */}
        {appState === "results" && (
          <div className="max-w-[1200px] mx-auto p-6 md:p-10">
            {/* Top actions */}
            <div className="flex items-center justify-between mb-6 pb-6 border-b border-[var(--color-outline-variant)]/30">
              <div>
                <h1 className="text-[24px] font-bold tracking-tight text-[var(--color-on-surface)] mb-1">
                  Compliance Assessment
                </h1>
                <p className="text-[13px] text-[var(--color-secondary)]">
                  Vendor: Acme Corp • Framework: Internal Security v2
                </p>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={resetApp}
                  className="flex items-center gap-2 px-4 py-2 border border-[var(--color-outline-variant)] rounded-md text-[12px] font-medium hover:bg-[var(--color-surface-container-lowest)] transition-colors"
                >
                  <LuArrowLeft className="w-4 h-4" />
                  Analyze Another Vendor
                </button>
                <button 
                  onClick={() => exportMutation.mutate()}
                  disabled={exportMutation.isPending}
                  className="flex items-center gap-2 px-4 py-2 bg-[var(--color-primary-container)] disabled:opacity-50 text-white rounded-md text-[12px] font-medium hover:bg-[var(--color-brand-hover)] transition-colors"
                >
                  {exportMutation.isPending ? <LuLoader className="w-4 h-4 animate-spin" /> : <LuDownload className="w-4 h-4" />}
                  {exportMutation.isPending ? "Exporting..." : "Export Assessment"}
                </button>
              </div>
            </div>

            {/* Top Level Decision Banner */}
            <div className="mb-8 p-4 bg-[var(--color-surface-container-lowest)] border border-[var(--color-outline-variant)] rounded-md flex items-start gap-3">
              <LuInfo className="w-5 h-5 text-[var(--color-secondary)] shrink-0 mt-0.5" />
              <div>
                <div className="text-[13px] font-semibold text-[var(--color-on-surface)] mb-1">
                  Assessment Result: Review Required
                </div>
                <div className="text-[13px] text-[var(--color-on-surface-variant)] leading-relaxed">
                  2 requirements remain unresolved. Vendor cannot be approved automatically.
                </div>
              </div>
            </div>

            {/* Assessment Layout */}
            <div className="flex flex-col lg:flex-row gap-10">
              
              {/* Left Column: List/Summary */}
              <div className="w-full lg:w-1/3 flex flex-col gap-6">
                
                {/* Findings Filter */}
                <div className="flex items-center gap-2 p-1 bg-[var(--color-surface-container-low)] rounded-md">
                  {["All", "Missing", "Partial", "Met"].map((filter) => (
                    <button
                      key={filter}
                      className={`flex-1 text-center py-1.5 text-[11px] font-semibold rounded-sm transition-colors ${
                        filter === "All"
                          ? "bg-white shadow-sm text-[var(--color-on-surface)]"
                          : "text-[var(--color-secondary)] hover:text-[var(--color-on-surface)]"
                      }`}
                    >
                      {filter}
                    </button>
                  ))}
                </div>

                {/* Requirement Evaluation List */}
                <div className="flex flex-col gap-2">
                  <div 
                    onClick={() => setSelectedReq("REQ_4_1_A")}
                    className={`p-3 rounded-md cursor-pointer relative transition-colors ${
                      selectedReq === "REQ_4_1_A" ? "border border-[var(--color-tertiary-container)] bg-[var(--color-tertiary-fixed)]/20" : "border border-[var(--color-outline-variant)]/40 hover:bg-[var(--color-surface-container-low)]"
                    }`}
                  >
                    {selectedReq === "REQ_4_1_A" && <div className="absolute left-0 top-0 bottom-0 w-1 bg-[var(--color-tertiary-container)] rounded-l-md" />}
                    <div className="text-[10px] font-bold text-[var(--color-tertiary-container)] mb-1">REQ 4.1.A • PARTIAL</div>
                    <div className="text-[13px] font-semibold text-[var(--color-on-surface)]">Data Residency Constraints</div>
                  </div>
                  
                  <div 
                    onClick={() => setSelectedReq("REQ_4_1_B")}
                    className={`p-3 rounded-md cursor-pointer relative transition-colors ${
                      selectedReq === "REQ_4_1_B" ? "border border-[var(--color-status-met)] bg-[var(--color-status-met)]/5" : "border border-[var(--color-outline-variant)]/40 hover:bg-[var(--color-surface-container-low)]"
                    }`}
                  >
                    {selectedReq === "REQ_4_1_B" && <div className="absolute left-0 top-0 bottom-0 w-1 bg-[var(--color-status-met)] rounded-l-md" />}
                    <div className="text-[10px] font-bold text-[var(--color-status-met)] mb-1">REQ 4.1.B • MET</div>
                    <div className="text-[13px] font-medium text-[var(--color-on-surface)]">Encryption at Rest</div>
                  </div>

                  <div 
                    onClick={() => setSelectedReq("REQ_4_2_A")}
                    className={`p-3 rounded-md cursor-pointer relative transition-colors ${
                      selectedReq === "REQ_4_2_A" ? "border border-[var(--color-status-missing)] bg-[var(--color-status-missing)]/5" : "border border-[var(--color-outline-variant)]/40 hover:bg-[var(--color-surface-container-low)]"
                    }`}
                  >
                    {selectedReq === "REQ_4_2_A" && <div className="absolute left-0 top-0 bottom-0 w-1 bg-[var(--color-status-missing)] rounded-l-md" />}
                    <div className="text-[10px] font-bold text-[var(--color-status-missing)] mb-1">REQ 4.2.A • MISSING</div>
                    <div className="text-[13px] font-medium text-[var(--color-on-surface)]">Annual Penetration Testing</div>
                  </div>
                </div>

              </div>

              {/* Right Column: Evidence Viewer */}
              <div className="w-full lg:w-2/3 bg-[var(--color-surface-container-low)] rounded-xl p-6 border border-[var(--color-outline-variant)]/30 flex flex-col xl:flex-row gap-6">
                <EvidenceCanvas reqId={selectedReq} />
                <SynthesisPanel reqId={selectedReq} />
              </div>

            </div>
          </div>
        )}
      </main>
    </div>
  );
}
