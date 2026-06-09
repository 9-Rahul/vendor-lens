import { LuShield } from "react-icons/lu";

export function Header() {
  return (
    <header className="flex items-center gap-2 px-6 py-4 bg-white border-b border-[var(--color-outline-variant)]/30 shrink-0">
      <LuShield className="w-5 h-5 text-[var(--color-primary-container)]" strokeWidth={2.5} />
      <span className="text-[16px] font-semibold tracking-tight text-[var(--color-on-surface)]">
        VendorLens
      </span>
      <span className="text-[12px] font-medium text-[var(--color-secondary)] ml-2 border-l border-[var(--color-outline-variant)]/50 pl-3">
        Read less. Trust more.
      </span>
    </header>
  );
}
