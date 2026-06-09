import { LuFileText, LuMail, LuFileSearch, LuCheck, LuX, LuZoomIn } from "react-icons/lu";
import type { Requirement, Evidence } from "@/types/assessment";

interface EvidenceCanvasProps {
  requirement: Requirement;
}

export function EvidenceCanvas({ requirement }: EvidenceCanvasProps) {
  if (requirement.status === "missing" || requirement.evidence.length === 0) {
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
              <span className="font-semibold text-[var(--color-on-surface)]">Result:</span> {requirement.assessment.summary}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full xl:w-[55%] min-h-[500px] select-none p-4 flex flex-col gap-6 relative">
      
      <div
        className="bg-white organic-shadow p-4 w-72 rounded-xl border border-[var(--color-primary-container)]/20 -rotate-1 hover:rotate-0 transition-transform duration-500 self-start z-20"
      >
        <div className="flex items-center gap-2 mb-2">
          <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-primary-container)]" />
          <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--color-primary-container)]">
            {requirement.code}
          </span>
        </div>
        <h3 className="text-[14px] font-bold tracking-tight text-[var(--color-on-surface)] mb-2">
          {requirement.title}
        </h3>
        <p className="text-[12px] text-[var(--color-on-surface-variant)] leading-relaxed">
          {requirement.description}
        </p>
      </div>

      <div className="flex flex-col gap-4 items-end pr-4">
        {requirement.evidence.map((ev, index) => {
          const rotation = index % 2 === 0 ? "rotate-[1.5deg]" : "-rotate-[2deg]";
          const isEmail = ev.type === "email";
          
          return (
            <div
              key={ev.id}
              tabIndex={0}
              className={`bg-white organic-shadow p-3 rounded-md w-72 transition-all duration-300 group hover:scale-[1.03] hover:z-30 ${rotation} ${
                isEmail 
                  ? "bg-[#fafafa] border border-[var(--color-outline-variant)]/30 border-l-[3px] border-l-[var(--color-tertiary-container)]"
                  : "border border-[var(--color-outline-variant)]/40"
              }`}
            >
              <div className="flex justify-between items-start mb-2 pb-2 border-b border-[var(--color-outline-variant)]/25">
                <div className="flex items-center gap-1.5">
                  {isEmail ? (
                    <LuMail className="w-3.5 h-3.5 text-[var(--color-secondary)] group-hover:text-[var(--color-tertiary-container)] transition-colors" strokeWidth={2} />
                  ) : (
                    <LuFileText className="w-3.5 h-3.5 text-[var(--color-secondary)] group-hover:text-[var(--color-primary-container)] transition-colors" strokeWidth={2} />
                  )}
                  <span className={`font-mono text-[10px] font-bold text-[var(--color-secondary)] transition-colors ${isEmail ? "group-hover:text-[var(--color-tertiary-container)]" : "group-hover:text-[var(--color-primary-container)]"}`}>
                    {ev.sourceDocument}
                  </span>
                </div>
                {(ev.pageNumber || ev.date) && (
                  <span className="text-[9px] font-mono text-[var(--color-secondary)] bg-[var(--color-surface-container-high)] px-1.5 py-0.5 rounded">
                    {ev.pageNumber || ev.date}
                  </span>
                )}
              </div>
              <div className="font-mono text-[10.5px] text-[var(--color-on-surface-variant)] leading-relaxed p-1 group-hover:bg-[#fff9e6] transition-colors rounded">
                {ev.excerpt}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
