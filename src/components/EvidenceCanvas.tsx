"use client";

import { FileText, Mail } from "lucide-react";

export function EvidenceCanvas() {
  return (
    <div className="w-full lg:w-[65%] relative min-h-[580px] select-none">

      {/* ── Requirement node ── */}
      <div
        className="absolute top-0 left-4 z-20 glass-panel organic-shadow
                   p-5 w-72 rounded-2xl border border-[var(--color-primary-container)]/20
                   -rotate-1 hover:rotate-0 transition-transform duration-500"
      >
        <div className="flex items-center gap-2 mb-2">
          <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-primary-container)]" />
          <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--color-primary-container)]">
            Requirement 4.1.a
          </span>
        </div>
        <h3 className="text-[16px] font-bold tracking-tight text-[var(--color-on-surface)] mb-2">
          Data Residency Constraints
        </h3>
        <p className="text-[13px] text-[var(--color-on-surface-variant)] leading-relaxed">
          Vendor must ensure all PII is stored and processed exclusively within EU
          jurisdictions.
        </p>
      </div>

      {/* ── SVG connector lines ── */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none z-10"
        style={{ minHeight: 580 }}
        aria-hidden="true"
      >
        {/* Dashed grey — requirement → snippet 1 */}
        <path
          d="M 145 140 C 145 280, 310 190, 360 340"
          fill="none"
          stroke="#e5e5e5"
          strokeWidth="1.5"
          className="connector-animated"
        />
      </svg>

      {/* ── Evidence snippet 1 — PDF ── */}
      <div
        className="absolute top-44 left-28 z-30 bg-white organic-shadow
                   border border-[var(--color-outline-variant)]/40
                   p-4 rounded-md w-80 rotate-[1.5deg]
                   hover:z-50 hover:scale-[1.03] transition-all duration-300 cursor-default"
      >
        <div className="flex justify-between items-start mb-3 pb-2 border-b border-[var(--color-outline-variant)]/25">
          <div className="flex items-center gap-1.5">
            <FileText className="w-3.5 h-3.5 text-[var(--color-secondary)]" strokeWidth={2} />
            <span className="font-mono text-[10px] font-bold text-[var(--color-secondary)]">
              MSA_Addendum_v2.pdf
            </span>
          </div>
          <span className="text-[9px] font-mono text-[var(--color-secondary)]">
            Page 42
          </span>
        </div>
        <div className="font-mono text-[10.5px] text-[var(--color-on-surface)] leading-relaxed p-1">
          &quot;…data center facilities located in Frankfurt, Germany, shall serve as the
          primary processing node for all European client accounts…&quot;
        </div>
      </div>

      {/* ── Evidence snippet 2 — email thread ── */}
      <div
        className="absolute top-[320px] left-6 z-20 bg-[#fafafa] organic-shadow
                   p-4 rounded-md w-72 -rotate-[2.5deg]
                   hover:z-50 hover:scale-[1.03] transition-all duration-300 cursor-default
                   border border-[var(--color-outline-variant)]/30
                   border-l-[3px] border-l-[var(--color-tertiary-container)]"
      >
        <div className="flex justify-between items-start mb-3 pb-2 border-b border-[var(--color-outline-variant)]/25">
          <div className="flex items-center gap-1.5">
            <Mail className="w-3.5 h-3.5 text-[var(--color-secondary)]" strokeWidth={2} />
            <span className="font-mono text-[10px] font-bold text-[var(--color-secondary)]">
              Vendor Comm Thread
            </span>
          </div>
          <span className="text-[9px] font-mono text-[var(--color-secondary)]">
            Oct 12
          </span>
        </div>
        <div className="font-mono text-[10.5px] text-[var(--color-on-surface-variant)] leading-relaxed p-1">
          &quot;While primary DBs are in Frankfurt, failover backups occasionally sync to
          US-East-1 during maintenance windows. We are working on a fix.&quot;
        </div>
        <div className="mt-3 pt-2 border-t border-[var(--color-outline-variant)]/20 flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-tertiary-container)]" />
          <span className="text-[9px] uppercase tracking-wider text-[var(--color-tertiary-container)] font-bold">
            Flagged for Review
          </span>
        </div>
      </div>
    </div>
  );
}
