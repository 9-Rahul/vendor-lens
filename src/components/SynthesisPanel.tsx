"use client";

import { useState, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { LuTriangleAlert, LuCircleCheck, LuGavel, LuCircleX, LuLoader } from "react-icons/lu";
import type { ReqId } from "@/app/page";

export function SynthesisPanel({ reqId }: { reqId: ReqId }) {
  const [logged, setLogged] = useState(false);

  // Reset logged state when reqId changes
  useEffect(() => {
    setLogged(false);
  }, [reqId]);

  const flagMutation = useMutation({
    mutationFn: async () => {
      return new Promise((resolve) => setTimeout(resolve, 800));
    },
    onSuccess: () => {
      setLogged(true);
    }
  });

  const getStatus = () => {
    if (reqId === "REQ_4_1_B") return { label: "Met Compliance", icon: LuCircleCheck, color: "text-[var(--color-status-met)]", desc: "Encryption standard explicitly met in vendor documentation." };
    if (reqId === "REQ_4_2_A") return { label: "Missing Evidence", icon: LuCircleX, color: "text-[var(--color-status-missing)]", desc: "No mention of penetration testing frequency or reports." };
    return { label: "Partial Compliance", icon: LuTriangleAlert, color: "text-[var(--color-tertiary-container)]", desc: "Primary residency requirement met. US-East backup infrastructure introduces compliance risk." };
  }

  const status = getStatus();

  return (
    <div className="w-full xl:w-[45%] flex flex-col gap-4 relative z-40">
      
      {/* ── Metadata Stats ── */}
      <div className="bg-white organic-shadow p-4 rounded-xl border border-[var(--color-outline-variant)]/30">
        <div className="grid grid-cols-2 gap-y-3">
          <div className="col-span-2 text-[11px] font-bold uppercase tracking-widest text-[var(--color-secondary)] mb-1">
            Global Assessment
          </div>
          
          <div>
            <div className="text-[10px] text-[var(--color-secondary)]">Evaluated</div>
            <div className="text-[14px] font-semibold text-[var(--color-on-surface)]">12</div>
          </div>
          <div>
            <div className="text-[10px] text-[var(--color-status-met)]">Met</div>
            <div className="text-[14px] font-semibold text-[var(--color-on-surface)]">8</div>
          </div>
          <div>
            <div className="text-[10px] text-[var(--color-tertiary-container)]">Partial</div>
            <div className="text-[14px] font-semibold text-[var(--color-on-surface)]">2</div>
          </div>
          <div>
            <div className="text-[10px] text-[var(--color-status-missing)]">Missing</div>
            <div className="text-[14px] font-semibold text-[var(--color-on-surface)]">2</div>
          </div>
        </div>
      </div>

      {/* ── Synthesis Decision card ── */}
      <div className="bg-white organic-shadow border border-[var(--color-outline-variant)]/50 p-5 rounded-xl flex-1 flex flex-col">
        <h2 className="text-[14px] font-semibold text-[var(--color-on-surface)] mb-3 pb-2 border-b border-[var(--color-outline-variant)]/35">
          Requirement Status
        </h2>

        <div className="flex flex-col gap-3 flex-1">
          <div className="flex items-center gap-2">
            <status.icon className={`w-4 h-4 ${status.color}`} strokeWidth={2.5} />
            <span className="text-[13px] font-semibold text-[var(--color-on-surface)]">
              {status.label}
            </span>
          </div>

          <p className="text-[12px] text-[var(--color-on-surface-variant)] leading-relaxed">
            {status.desc}
          </p>

          <div className="text-[11px] font-medium text-[var(--color-on-surface)] mt-1">
            <span className="text-[var(--color-secondary)] mr-1">Action:</span> 
            {reqId === "REQ_4_1_B" ? "None required." : "Request remediation plan."}
          </div>

          <div className="pt-2 mt-auto border-t border-[var(--color-outline-variant)]/30">
            <button
              onClick={() => flagMutation.mutate()}
              disabled={logged || flagMutation.isPending}
              className={`w-full flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-md text-[11.5px] font-medium transition-colors ${
                logged
                  ? "bg-[var(--color-surface-container)] text-[var(--color-secondary)] cursor-default"
                  : "bg-[var(--color-primary-container)] text-white hover:bg-[var(--color-brand-hover)]"
              }`}
            >
              {flagMutation.isPending ? (
                <LuLoader className="w-3.5 h-3.5 animate-spin" strokeWidth={2.5} />
              ) : logged ? (
                <LuCircleCheck className="w-3.5 h-3.5" strokeWidth={2.5} />
              ) : (
                <LuGavel className="w-3.5 h-3.5" strokeWidth={2.5} />
              )}
              {flagMutation.isPending ? "Logging..." : logged ? "Review Logged" : "Flag for Review"}
            </button>
          </div>
        </div>
      </div>

      {/* ── Evidence Coverage card ── */}
      <div className="bg-white organic-shadow p-5 rounded-xl border border-[var(--color-outline-variant)]/30">
        <div className="text-[10px] font-semibold uppercase tracking-widest text-[var(--color-secondary)] mb-2 pb-2 border-b border-[var(--color-outline-variant)]/25">
          Evidence Coverage
        </div>
        
        <div className="text-[14px] font-medium text-[var(--color-on-surface)]">
          {reqId === "REQ_4_2_A" ? "0" : reqId === "REQ_4_1_A" ? "2" : "1"} Supporting Document{reqId !== "REQ_4_1_B" && "s"}
        </div>
      </div>
    </div>
  );
}
