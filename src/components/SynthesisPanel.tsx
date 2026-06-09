"use client";

import { useState } from "react";
import { AlertTriangle, CheckCircle, Gavel } from "lucide-react";

export function SynthesisPanel() {
  const [logged, setLogged] = useState(false);

  return (
    <div className="w-full lg:w-[35%] lg:mt-32 flex flex-col gap-6 relative z-40">

      {/* ── Synthesis Decision card ── */}
      <div
        className="bg-white organic-shadow border border-[var(--color-outline-variant)]/50
                   p-6 rounded-[1.5rem] relative overflow-hidden"
      >
        <h2
          className="text-[14px] font-semibold text-[var(--color-on-surface)]
                     mb-4 pb-3 border-b border-[var(--color-outline-variant)]/35"
        >
          Assessment
        </h2>

        <div className="flex flex-col gap-4">
          {/* Status */}
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-[var(--color-tertiary-container)]" strokeWidth={2.5} />
            <span className="text-[13px] font-semibold text-[var(--color-on-surface)]">
              Partial Compliance
            </span>
          </div>

          {/* Note */}
          <p className="text-[13px] text-[var(--color-on-surface-variant)] leading-relaxed">
            Primary residency requirement met. <br />
            US-East backup infrastructure introduces compliance risk.
          </p>

          <div className="text-[12px] font-medium text-[var(--color-on-surface)] mt-1">
            <span className="text-[var(--color-secondary)] mr-1">Action:</span> 
            Request remediation plan.
          </div>

          {/* CTA */}
          <div className="pt-3 mt-1 border-t border-[var(--color-outline-variant)]/30">
            <button
              onClick={() => setLogged(true)}
              disabled={logged}
              className={[
                "w-full flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-md",
                "text-[11.5px] font-medium transition-colors",
                logged
                  ? "bg-[var(--color-surface-container)] text-[var(--color-secondary)] cursor-default"
                  : "bg-[var(--color-primary-container)] text-white hover:bg-[var(--color-brand-hover)]",
              ].join(" ")}
            >
              {logged ? (
                <CheckCircle className="w-3.5 h-3.5" strokeWidth={2.5} />
              ) : (
                <Gavel className="w-3.5 h-3.5" strokeWidth={2.5} />
              )}
              {logged ? "Finding Logged" : "Log Finding"}
            </button>
          </div>
        </div>
      </div>

      {/* ── Confidence Score card ── */}
      <div className="glass-panel p-5 rounded-2xl border border-[var(--color-outline-variant)]/30">
        <div
          className="text-[10px] font-semibold uppercase tracking-widest text-[var(--color-secondary)]
                     mb-4 pb-2 border-b border-[var(--color-outline-variant)]/25"
        >
          Confidence Score
        </div>

        <div className="flex items-end gap-4">
          <div className="text-[36px] font-light text-[var(--color-on-surface)] leading-none">
            82
            <span className="text-[18px] text-[var(--color-secondary)]">%</span>
          </div>
          <div className="flex-1 pb-0.5">
            <div className="h-1.5 w-full bg-[var(--color-surface-variant)] rounded-full overflow-hidden">
              <div
                className="h-full bg-[var(--color-primary-container)] rounded-full"
                style={{ width: "82%" }}
              />
            </div>
          </div>
        </div>

        <div className="mt-4 flex gap-2">
          <span
            className="px-2 py-1 bg-[var(--color-surface-container-high)] rounded
                       text-[10px] font-mono text-[var(--color-secondary)]"
          >
            2 Sources
          </span>
          <span
            className="px-2 py-1 bg-[var(--color-surface-container-high)] rounded
                       text-[10px] font-mono text-[var(--color-secondary)]"
          >
            High Quality
          </span>
        </div>
      </div>
    </div>
  );
}
