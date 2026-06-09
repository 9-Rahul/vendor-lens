"use client";

import { useState, useRef, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { Header } from "@/components/Header";
import { EvidenceCanvas } from "@/components/EvidenceCanvas";
import { SynthesisPanel } from "@/components/SynthesisPanel";
import { RequirementList } from "@/components/RequirementList";
import { 
  uploadRequirementsFile, 
  uploadVendorFile, 
  analyzeDocuments, 
  exportAssessment 
} from "@/services/assessment";
import type { AppState, AssessmentData } from "@/types/assessment";
import { LuCloudUpload, LuCircleCheck, LuFileText, LuLoader, LuDownload, LuArrowLeft, LuInfo, LuCircleAlert } from "react-icons/lu";

export default function VendorLensApp() {
  const [appState, setAppState] = useState<AppState>("upload");
  const [reqFile, setReqFile] = useState<File | null>(null);
  const [vendorFile, setVendorFile] = useState<File | null>(null);
  const [selectedReqId, setSelectedReqId] = useState<string>("");
  const [assessmentData, setAssessmentData] = useState<AssessmentData | null>(null);
  const [errorMsg, setErrorMsg] = useState<string>("");
  const [history, setHistory] = useState<AssessmentData[]>([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("vendorlens_history");
      if (stored) {
        setHistory(JSON.parse(stored));
      }
    } catch (e) {}
  }, []);

  const reqFileInputRef = useRef<HTMLInputElement>(null);
  const vendorFileInputRef = useRef<HTMLInputElement>(null);

  const reqFileUploadMutation = useMutation({
    mutationFn: (file: File) => uploadRequirementsFile(file),
    onSuccess: (_, file) => {
      setReqFile(file);
      setErrorMsg("");
    },
    onError: (error: Error) => {
      setErrorMsg(error.message);
    }
  });

  const vendorFileUploadMutation = useMutation({
    mutationFn: (file: File) => uploadVendorFile(file),
    onSuccess: (_, file) => {
      setVendorFile(file);
      setErrorMsg("");
    },
    onError: (error: Error) => {
      setErrorMsg(error.message);
    }
  });

  const runAnalysisMutation = useMutation({
    mutationFn: ({ reqFile, vendorFile }: { reqFile: File; vendorFile: File }) => 
      analyzeDocuments(reqFile, vendorFile),
    onSuccess: (data) => {
      setAssessmentData(data);
      if (data.requirements.length > 0) {
        setSelectedReqId(data.requirements[0].id);
      }
      
      try {
        const currentHistory = JSON.parse(localStorage.getItem('vendorlens_history') || '[]');
        const updatedHistory = [data, ...currentHistory.filter((a: AssessmentData) => a.id !== data.id)].slice(0, 10);
        localStorage.setItem('vendorlens_history', JSON.stringify(updatedHistory));
        setHistory(updatedHistory);
      } catch (e) {}

      setAppState("results");
    },
    onError: (error: Error) => {
      setErrorMsg(error.message);
      setAppState("error");
    }
  });

  const exportMutation = useMutation({
    mutationFn: () => exportAssessment(assessmentData!),
  });

  const handleRunAnalysis = () => {
    if (!reqFile || !vendorFile) return;
    setAppState("processing");
    setErrorMsg("");
    runAnalysisMutation.mutate({ reqFile, vendorFile });
  };

  const resetApp = () => {
    if (window.confirm("Are you sure? This will clear your current view.")) {
      setAppState("upload");
      setReqFile(null);
      setVendorFile(null);
      setAssessmentData(null);
      setSelectedReqId("");
      setErrorMsg("");
    }
  };

  const loadPastAssessment = (pastAssessment: AssessmentData) => {
    setAssessmentData(pastAssessment);
    if (pastAssessment.requirements.length > 0) {
      setSelectedReqId(pastAssessment.requirements[0].id);
    }
    setAppState("results");
  };

  const selectedReq = assessmentData?.requirements.find(r => r.id === selectedReqId);

  return (
    <div className="flex flex-col h-full w-full bg-white">
      <Header />

      <main className="flex-1 overflow-y-auto">
        
        {errorMsg && appState === "upload" && (
          <div className="bg-red-50 text-red-800 p-4 border-b border-red-200 flex items-center justify-center gap-2 text-[13px] font-medium">
            <LuCircleAlert className="w-4 h-4" />
            {errorMsg}
          </div>
        )}

        {appState === "upload" && (
          <div className="max-w-4xl mx-auto p-8 lg:p-16">
            <h1 className="text-[32px] font-extrabold tracking-tight text-[var(--color-on-surface)] mb-2">
              Verify Vendors in Seconds.
            </h1>
            <p className="text-[16px] text-[var(--color-secondary)] mb-10 max-w-2xl">
              Upload your security rules and the vendor's documents. We'll read them for you and highlight exactly what's missing. No more digging through hundreds of pages of PDFs.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
              
              <input 
                type="file" 
                ref={reqFileInputRef} 
                className="hidden" 
                onChange={(e) => {
                  if (e.target.files?.[0]) reqFileUploadMutation.mutate(e.target.files[0]);
                }} 
              />
              <button
                onClick={() => reqFileInputRef.current?.click()}
                disabled={reqFileUploadMutation.isPending || reqFile !== null}
                className={`p-8 border-2 border-dashed rounded-xl flex flex-col items-center justify-center text-center transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary-container)] ${
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
                    <span className="font-semibold text-[14px]">{reqFile.name}</span>
                    <span className="text-[12px] text-[var(--color-secondary)]">{(reqFile.size / 1024).toFixed(0)} KB</span>
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

              <input 
                type="file" 
                ref={vendorFileInputRef} 
                className="hidden" 
                onChange={(e) => {
                  if (e.target.files?.[0]) vendorFileUploadMutation.mutate(e.target.files[0]);
                }} 
              />
              <button
                onClick={() => vendorFileInputRef.current?.click()}
                disabled={vendorFileUploadMutation.isPending || vendorFile !== null}
                className={`p-8 border-2 border-dashed rounded-xl flex flex-col items-center justify-center text-center transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary-container)] ${
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
                    <span className="font-semibold text-[14px]">{vendorFile.name}</span>
                    <span className="text-[12px] text-[var(--color-secondary)]">{(vendorFile.size / 1024 / 1024).toFixed(2)} MB</span>
                  </>
                ) : vendorFileUploadMutation.isPending ? (
                  <>
                    <LuLoader className="w-8 h-8 text-[var(--color-secondary)] animate-spin mb-3" />
                    <span className="font-semibold text-[14px] mb-1">Uploading...</span>
                  </>
                ) : (
                  <>
                    <LuCloudUpload className="w-8 h-8 text-[var(--color-secondary)] mb-3" />
                    <span className="font-semibold text-[14px] mb-1">Vendor Documents</span>
                    <span className="text-[12px] text-[var(--color-secondary)]">Drop file or click to upload</span>
                  </>
                )}
              </button>
            </div>

            <div className="flex justify-end">
              <button
                onClick={handleRunAnalysis}
                disabled={!reqFile || !vendorFile}
                className="bg-[var(--color-primary-container)] disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 py-2.5 rounded-md font-medium text-[13px] flex items-center gap-2 hover:bg-[var(--color-brand-hover)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[var(--color-primary-container)]"
              >
                Run Analysis
              </button>
            </div>
            
            {history.length > 0 && (
              <div className="mt-16 border-t border-[var(--color-outline-variant)]/30 pt-8">
                <h2 className="text-[16px] font-bold text-[var(--color-on-surface)] mb-4">
                  Past Assessments
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {history.map((assessment) => (
                    <div 
                      key={assessment.id}
                      onClick={() => loadPastAssessment(assessment)}
                      className="bg-white border border-[var(--color-outline-variant)]/40 p-4 rounded-xl cursor-pointer hover:border-[var(--color-primary-container)] hover:shadow-sm transition-all"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div className="text-[13px] font-bold text-[var(--color-on-surface)] truncate">{assessment.vendorName}</div>
                        <div className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                          assessment.status === 'approved' ? 'bg-[var(--color-status-met)]/10 text-[var(--color-status-met)]' :
                          assessment.status === 'rejected' ? 'bg-[var(--color-status-missing)]/10 text-[var(--color-status-missing)]' :
                          'bg-[var(--color-tertiary-container)]/10 text-[var(--color-tertiary-container)]'
                        }`}>
                          {assessment.status.toUpperCase().replace('_', ' ')}
                        </div>
                      </div>
                      <div className="text-[11px] text-[var(--color-secondary)] truncate mb-3">
                        {assessment.frameworkName}
                      </div>
                      <div className="text-[11px] text-[var(--color-on-surface-variant)] line-clamp-2 leading-relaxed">
                        {assessment.summary}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {appState === "processing" && (
          <div className="flex flex-col items-center justify-center h-full" aria-live="polite">
            <LuLoader className="w-10 h-10 text-[var(--color-primary-container)] animate-spin mb-4" />
            <h2 className="text-[18px] font-semibold text-[var(--color-on-surface)] mb-2">
              Reading the Documents...
            </h2>
            <p className="text-[14px] text-[var(--color-secondary)] max-w-md text-center">
              We are checking the vendor's answers against your rules. This takes just a few seconds.
            </p>
          </div>
        )}

        {appState === "error" && (
          <div className="flex flex-col items-center justify-center h-full">
            <LuCircleAlert className="w-10 h-10 text-red-500 mb-4" />
            <h2 className="text-[18px] font-semibold text-[var(--color-on-surface)] mb-2">
              Analysis Failed
            </h2>
            <p className="text-[14px] text-[var(--color-secondary)] max-w-md text-center mb-6">
              {errorMsg}
            </p>
            <button
              onClick={() => setAppState("upload")}
              className="bg-[var(--color-surface-container-high)] text-[var(--color-on-surface)] px-6 py-2.5 rounded-md font-medium text-[13px] hover:bg-[var(--color-outline-variant)] transition-colors"
            >
              Try Again
            </button>
          </div>
        )}

        {appState === "results" && assessmentData && selectedReq && (
          <div className="max-w-[1200px] mx-auto p-6 md:p-10">
            <div className="flex items-center justify-between mb-6 pb-6 border-b border-[var(--color-outline-variant)]/30">
              <div>
                <h1 className="text-[24px] font-bold tracking-tight text-[var(--color-on-surface)] mb-1">
                  Compliance Assessment
                </h1>
                <p className="text-[13px] text-[var(--color-secondary)]">
                  Vendor: {assessmentData.vendorName} • Framework: {assessmentData.frameworkName}
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
                  className="flex items-center gap-2 px-4 py-2 bg-[var(--color-primary-container)] disabled:opacity-50 text-white rounded-md text-[12px] font-medium hover:bg-[var(--color-brand-hover)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[var(--color-primary-container)]"
                >
                  {exportMutation.isPending ? <LuLoader className="w-4 h-4 animate-spin" /> : <LuDownload className="w-4 h-4" />}
                  {exportMutation.isPending ? "Exporting..." : "Export Assessment"}
                </button>
              </div>
            </div>

            <div className="mb-8 p-4 bg-[var(--color-surface-container-lowest)] border border-[var(--color-outline-variant)] rounded-md flex items-start gap-3">
              <LuInfo className="w-5 h-5 text-[var(--color-secondary)] shrink-0 mt-0.5" />
              <div>
                <div className="text-[13px] font-semibold text-[var(--color-on-surface)] mb-1">
                  Assessment Result: {assessmentData.status === "review_required" ? "Review Required" : "Approved"}
                </div>
                <div className="text-[13px] text-[var(--color-on-surface-variant)] leading-relaxed">
                  {assessmentData.summary}
                </div>
              </div>
            </div>

            <div className="flex flex-col lg:flex-row gap-10">
              
              <div className="w-full lg:w-1/3 flex flex-col gap-6">
                


                <RequirementList 
                  requirements={assessmentData.requirements} 
                  selectedReqId={selectedReqId}
                  onSelect={setSelectedReqId}
                />

              </div>

              <div className="w-full lg:w-2/3 bg-[var(--color-surface-container-low)] rounded-xl p-6 border border-[var(--color-outline-variant)]/30 flex flex-col xl:flex-row gap-6">
                <EvidenceCanvas requirement={selectedReq} />
                <SynthesisPanel assessment={assessmentData} requirement={selectedReq} />
              </div>

            </div>
          </div>
        )}
      </main>
    </div>
  );
}
