"use client";

import { Shield, User, Plus, LayoutDashboard, Map, Lightbulb, Archive, Settings, HelpCircle } from "lucide-react";

const NAV_ITEMS = [
  { icon: LayoutDashboard, label: "Dashboard",  href: "#" },
  { icon: Map,             label: "Risk Map",   href: "#" },
  { icon: Lightbulb,       label: "Evidence",   href: "#", active: true },
  { icon: Archive,         label: "Archive",    href: "#" },
  { icon: Settings,        label: "Settings",   href: "#" },
];

export function Sidebar() {
  return (
    <nav
      aria-label="Main navigation"
      className="hidden md:flex flex-col h-full py-5 px-2 gap-3
                 bg-[var(--color-surface-container-lowest)]
                 border-r border-[var(--color-outline-variant)]/30
                 w-[210px] shrink-0"
    >
      {/* Brand */}
      <div className="flex items-center gap-2 px-2 mb-2">
        <Shield className="w-5 h-5 text-[var(--color-primary-container)]" strokeWidth={2.5} />
        <span className="text-[14px] font-semibold tracking-tight text-[var(--color-on-surface)]">
          VendorLens
        </span>
      </div>

      {/* User */}
      <div className="flex items-center gap-2.5 px-2 pb-4 mb-1 border-b border-[var(--color-outline-variant)]/25">
        <div className="w-7 h-7 rounded-full bg-[var(--color-surface-variant)] flex items-center justify-center shrink-0">
          <User className="w-4 h-4 text-[var(--color-secondary)]" />
        </div>
        <div>
          <div className="text-[11px] font-medium text-[var(--color-on-surface)]">
            Lead Analyst
          </div>
          <div className="text-[10px] text-[var(--color-secondary)]">
            Global Procurement
          </div>
        </div>
      </div>

      {/* New Analysis CTA */}
      <button
        className="w-full flex items-center justify-center gap-1.5
                   bg-[var(--color-primary-container)] text-white
                   text-[11px] font-medium py-1.5 px-3 rounded-md
                   hover:bg-[var(--color-brand-hover)] transition-colors mb-2"
      >
        <Plus className="w-3.5 h-3.5" strokeWidth={2.5} />
        New Analysis
      </button>

      {/* Nav links */}
      <div className="flex flex-col gap-0.5 flex-1">
        {NAV_ITEMS.map(({ icon: Icon, label, href, active }) => (
          <a
            key={label}
            href={href}
            onClick={(e) => e.preventDefault()}
            aria-current={active ? "page" : undefined}
            className={[
              "flex items-center gap-2.5 px-2 py-1.5 rounded-md text-[11px] font-medium transition-all duration-200",
              active
                ? "bg-[var(--color-primary-container)]/10 text-[var(--color-primary-container)] border-r-[2px] border-[var(--color-primary-container)]"
                : "text-[var(--color-secondary)] hover:text-[var(--color-on-surface)] hover:bg-[var(--color-surface-container-high)]",
            ].join(" ")}
          >
            <Icon className="w-4 h-4" strokeWidth={active ? 2.5 : 2} />
            {label}
          </a>
        ))}
      </div>

      {/* Help */}
      <div className="border-t border-[var(--color-outline-variant)]/25 pt-2">
        <a
          href="#"
          onClick={(e) => e.preventDefault()}
          className="flex items-center gap-2.5 px-2 py-1.5 rounded-md text-[11px]
                     text-[var(--color-secondary)] hover:text-[var(--color-on-surface)]
                     hover:bg-[var(--color-surface-container-high)] transition-all duration-200"
        >
          <HelpCircle className="w-4 h-4" strokeWidth={2} />
          Help Center
        </a>
      </div>
    </nav>
  );
}
