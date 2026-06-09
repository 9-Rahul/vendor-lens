import { Sidebar } from "@/components/Sidebar";
import { EvidenceCanvas } from "@/components/EvidenceCanvas";
import { SynthesisPanel } from "@/components/SynthesisPanel";
import { Bell, Menu, ChevronRight } from "lucide-react";

export default function EvidenceWorkspacePage() {
  return (
    <div className="flex h-full w-full relative overflow-hidden bg-[var(--color-surface-container-lowest)]">

      {/* ── Background photo — subtle texture ── */}
      <div
        className="fixed inset-0 z-0 pointer-events-none opacity-5"
        style={{ filter: "blur(12px) grayscale(100%)" }}
        aria-hidden="true"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          alt=""
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuDa_LrfBSOlqeynqRPm8_r286fJ1g39JJQdSN916VY1y1OqZKXaqJJEAS0mYeYUBY7nnO-GyrV14N-gm5jXTTIW95Uw6DuHMfrsFWdZj_VoHrrcGJJESAiilO8W23cNtpWryQFapYNrq705V0B2-lCfvWXB0xc5iaBo3EQXrYdwo_O-R-h7vteBu34Ow_JYiq47yZh4L-55gKP-taCgIKH0p28u0q1DueMJnsyC33Yd173u_FsIZS4Z6JXfM8gKc7u7c6Izk-Nb5hc"
          className="w-full h-full object-cover object-center"
        />
      </div>

      {/* ── Sidebar ── */}
      <Sidebar />

      {/* ── Main content ── */}
      <main className="flex-1 flex flex-col h-full overflow-hidden relative z-10">

        {/* Mobile top bar */}
        <nav
          aria-label="Mobile navigation"
          className="md:hidden flex justify-between items-center
                     px-4 py-3 bg-white/80 backdrop-blur-md sticky top-0 z-50
                     border-b border-[var(--color-outline-variant)]/30"
        >
          <span className="text-[15px] font-semibold text-[var(--color-primary-container)]">
            VendorLens
          </span>
          <div className="flex gap-4 text-[var(--color-primary-container)]">
            <Bell className="w-5 h-5" />
            <Menu className="w-5 h-5" />
          </div>
        </nav>

        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto p-6 md:p-12">

          {/* Page header */}
          <header className="mb-16 max-w-3xl">
            {/* Breadcrumb */}
            <div className="flex items-center gap-1.5 text-[var(--color-secondary)] font-mono text-[11px] mb-3 uppercase tracking-widest">
              <span>Workspace</span>
              <ChevronRight className="w-3.5 h-3.5" strokeWidth={2} />
              <span className="text-[var(--color-primary-container)] font-bold">
                Acme Corp Audit
              </span>
            </div>

            <h1 className="text-[32px] font-bold tracking-tight text-[var(--color-on-surface)] leading-tight mb-4">
              Evidence Review
            </h1>
            <p className="text-[15px] text-[var(--color-secondary)] leading-relaxed max-w-xl">
              Trace requirements through unstructured evidence snippets to form
              definitive compliance decisions.
            </p>
          </header>

          {/* Two-column canvas */}
          <div className="flex flex-col lg:flex-row gap-12 lg:gap-20 relative">
            <EvidenceCanvas />
            <SynthesisPanel />
          </div>
        </div>
      </main>
    </div>
  );
}
