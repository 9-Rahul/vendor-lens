"use client";

import { LuTriangleAlert, LuCircleCheck, LuCircleX } from "react-icons/lu";
import type { Requirement, AssessmentData } from "@/types/assessment";

interface SynthesisPanelProps {
  assessment: AssessmentData;
  requirement: Requirement;
}

export function SynthesisPanel({ assessment, requirement }: SynthesisPanelProps) {

  const getStatusDisplay = () => {
    switch (requirement.status) {
      case "met":
        return { label: "Met Compliance", icon: LuCircleCheck, color: "text-[var(--color-status-met)]" };
      case "missing":
        return { label: "Missing Evidence", icon: LuCircleX, color: "text-[var(--color-status-missing)]" };
      case "partial":
      default:
        return { label: "Partial Compliance", icon: LuTriangleAlert, color: "text-[var(--color-tertiary-container)]" };
    }
  };

  const status = getStatusDisplay();

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
    <div className="w-full lg:w-[45%] flex flex-col gap-4 relative z-40">
      
      <div className="bg-white organic-shadow p-4 rounded-xl border border-[var(--color-outline-variant)]/30">
        <div className="grid grid-cols-4 lg:grid-cols-2 gap-y-3">
          <div className="col-span-4 lg:col-span-2 text-[11px] font-bold uppercase tracking-widest text-[var(--color-secondary)] mb-1">
            Global Assessment
          </div>
          
          <div>
            <div className="text-[10px] text-[var(--color-secondary)]">Evaluated</div>
            <div className="text-[14px] font-semibold text-[var(--color-on-surface)]">{assessment.stats.evaluated}</div>
          </div>
          <div>
            <div className="text-[10px] text-[var(--color-status-met)]">Met</div>
            <div className="text-[14px] font-semibold text-[var(--color-on-surface)]">{assessment.stats.met}</div>
          </div>
          <div>
            <div className="text-[10px] text-[var(--color-tertiary-container)]">Partial</div>
            <div className="text-[14px] font-semibold text-[var(--color-on-surface)]">{assessment.stats.partial}</div>
          </div>
          <div>
            <div className="text-[10px] text-[var(--color-status-missing)]">Missing</div>
            <div className="text-[14px] font-semibold text-[var(--color-on-surface)]">{assessment.stats.missing}</div>
          </div>
        </div>
      </div>

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
            {requirement.assessment.summary}
          </p>

          <div className="text-[11px] font-medium text-[var(--color-on-surface)] mt-1">
            <span className="text-[var(--color-secondary)] mr-1">Action:</span> 
            {requirement.assessment.action || "None required."}
          </div>
        </div>
      </div>

      <div className="bg-white organic-shadow p-5 rounded-xl border border-[var(--color-outline-variant)]/30">
        <div className="text-[10px] font-semibold uppercase tracking-widest text-[var(--color-secondary)] mb-2 pb-2 border-b border-[var(--color-outline-variant)]/25">
          Evidence Coverage
        </div>
        
        <div className="text-[14px] font-medium text-[var(--color-on-surface)]">
          {requirement.evidence.length} Supporting Document{requirement.evidence.length !== 1 && "s"}
        </div>
      </div>
    </div>
  );
}
