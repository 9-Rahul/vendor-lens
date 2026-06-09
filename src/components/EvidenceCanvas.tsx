"use client";

import { LuFileText, LuMail, LuFileSearch, LuCheck } from "react-icons/lu";
import type { ReqId } from "@/app/page";

export function EvidenceCanvas({ reqId }: { reqId: ReqId }) {
  if (reqId === "REQ_4_2_A") {
    return (
      <div className="w-full xl:w-[55%] flex flex-col items-center justify-center min-h-[500px]">
        <div className="text-center max-w-sm">
          <div className="w-12 h-12 rounded-full bg-[var(--color-surface-container)] flex items-center justify-center mx-auto mb-4 border border-[var(--color-outline-variant)]">
            <LuFileSearch className="w-6 h-6 text-[var(--color-secondary)]" />
          </div>
          <h3 className="text-[15px] font-bold text-[var(--color-on-surface)] mb-2">
            No Supporting Evidence Found
          </h3>
          
          <div className="text-[12px] text-[var(--color-on-surface-variant)] mb-6 text-left bg-white p-4 border border-[var(--color-outline-variant)]/50 rounded-md">
            <div className="font-semibold mb-2 text-[11px] uppercase tracking-wider text-[var(--color-secondary)]">Searched Documents:</div>
            <div className="flex items-center gap-2 mb-1">
              <LuCheck className="w-3 h-3 text-[var(--color-status-met)]" /> Vendor Proposal.pdf
            </div>
            <div className="flex items-center gap-2 mb-3">
              <LuCheck className="w-3 h-3 text-[var(--color-status-met)]" /> Security Overview.pdf
            </div>
            <div className="pt-3 border-t border-[var(--color-outline-variant)]/30">
              <span className="font-semibold text-[var(--color-on-surface)]">Result:</span> No evidence identified for annual penetration testing.
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full xl:w-[55%] relative min-h-[500px] select-none">
      {/* ── Requirement node ── */}
      <div
        className="absolute top-0 left-0 z-20 bg-white organic-shadow
                   p-4 w-64 rounded-xl border border-[var(--color-primary-container)]/20
                   -rotate-1 hover:rotate-0 transition-transform duration-500"
      >
        <div className="flex items-center gap-2 mb-2">
          <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-primary-container)]" />
          <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--color-primary-container)]">
            {reqId === "REQ_4_1_A" ? "Requirement 4.1.a" : "Requirement 4.1.b"}
          </span>
        </div>
        <h3 className="text-[14px] font-bold tracking-tight text-[var(--color-on-surface)] mb-2">
          {reqId === "REQ_4_1_A" ? "Data Residency Constraints" : "Encryption at Rest"}
        </h3>
        <p className="text-[12px] text-[var(--color-on-surface-variant)] leading-relaxed">
          {reqId === "REQ_4_1_A" 
            ? "Vendor must ensure all PII is stored and processed exclusively within EU jurisdictions."
            : "All stored data must be encrypted using AES-256 or stronger algorithms."}
        </p>
      </div>

      {/* ── Evidence snippet 1 — PDF ── */}
      <div
        className="absolute top-36 left-12 z-30 bg-white organic-shadow
                   border border-[var(--color-outline-variant)]/40
                   p-3 rounded-md w-72 rotate-[1.5deg]
                   hover:z-50 hover:scale-[1.03] transition-all duration-300 cursor-pointer group"
      >
        <div className="flex justify-between items-start mb-2 pb-2 border-b border-[var(--color-outline-variant)]/25">
          <div className="flex items-center gap-1.5">
            <LuFileText className="w-3.5 h-3.5 text-[var(--color-secondary)] group-hover:text-[var(--color-primary-container)] transition-colors" strokeWidth={2} />
            <span className="font-mono text-[10px] font-bold text-[var(--color-secondary)] group-hover:text-[var(--color-primary-container)] transition-colors">
              MSA_Addendum_v2.pdf
            </span>
          </div>
          <span className="text-[9px] font-mono text-[var(--color-secondary)] bg-[var(--color-surface-container-high)] px-1.5 py-0.5 rounded">
            Page 42
          </span>
        </div>
        <div className="font-mono text-[10.5px] text-[var(--color-on-surface)] leading-relaxed p-1 group-hover:bg-[#fff9e6] transition-colors rounded">
          &quot;…data center facilities located in Frankfurt, Germany, shall serve as the
          primary processing node for all European client accounts…&quot;
        </div>
      </div>

      {reqId === "REQ_4_1_A" && (
        <div
          className="absolute top-[280px] left-0 z-20 bg-[#fafafa] organic-shadow
                    p-3 rounded-md w-64 -rotate-[2deg]
                    hover:z-50 hover:scale-[1.03] transition-all duration-300 cursor-pointer group
                    border border-[var(--color-outline-variant)]/30
                    border-l-[3px] border-l-[var(--color-tertiary-container)]"
        >
          <div className="flex justify-between items-start mb-2 pb-2 border-b border-[var(--color-outline-variant)]/25">
            <div className="flex items-center gap-1.5">
              <LuMail className="w-3.5 h-3.5 text-[var(--color-secondary)] group-hover:text-[var(--color-tertiary-container)] transition-colors" strokeWidth={2} />
              <span className="font-mono text-[10px] font-bold text-[var(--color-secondary)] group-hover:text-[var(--color-tertiary-container)] transition-colors">
                Vendor Comm Thread
              </span>
            </div>
            <span className="text-[9px] font-mono text-[var(--color-secondary)] bg-[var(--color-surface-container-high)] px-1.5 py-0.5 rounded">
              Oct 12
            </span>
          </div>
          <div className="font-mono text-[10.5px] text-[var(--color-on-surface-variant)] leading-relaxed p-1 group-hover:bg-[#fff9e6] transition-colors rounded">
            &quot;While primary DBs are in Frankfurt, failover backups occasionally sync to
            US-East-1 during maintenance windows. We are working on a fix.&quot;
          </div>
        </div>
      )}
    </div>
  );
}
