import { CircleHelp, UserRound } from 'lucide-react';
import { cn } from '@/lib/utils';

function Logo() {
  return (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden>
      <path d="M14 2 L18 12 L14 14 L10 12 Z" fill="#2bb0e6" />
      <path d="M26 14 L16 18 L14 14 L16 10 Z" fill="#e3488f" />
      <path d="M14 26 L10 16 L14 14 L18 16 Z" fill="#f1a644" />
      <path d="M2 14 L12 10 L14 14 L12 18 Z" fill="#5b4ae6" />
    </svg>
  );
}

function IconButton({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      className={cn(
        'flex size-9 items-center justify-center rounded-lg text-[var(--color-muted-foreground)] transition-colors',
        'hover:bg-[var(--color-primary-soft)] hover:text-[var(--color-primary)]',
        'focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--color-primary)]',
      )}
    >
      {children}
    </button>
  );
}

export function Sidebar() {
  return (
    // Fixed to the viewport, not part of the scrollable page flow — the
    // main content area (see App.tsx) carries a matching left offset
    // instead of relying on flex layout to sit next to it.
    <aside className="fixed inset-y-0 left-0 z-20 flex h-screen w-[70px] shrink-0 flex-col items-center justify-between border-r border-[var(--color-border)] bg-white py-5">
      <div className="flex flex-col items-center gap-6">
        <button type="button" aria-label="Home" className="transition-transform hover:scale-105">
          <Logo />
        </button>
      </div>

      <div className="flex flex-col items-center gap-2">
        <IconButton label="Account">
          <UserRound className="size-5" />
        </IconButton>
        <IconButton label="Help">
          <CircleHelp className="size-5" />
        </IconButton>
        <div className="mt-2 text-center text-[9px] leading-tight font-semibold tracking-wide text-[var(--color-muted-foreground)]">
          DIGITAL
          <br />
          SCIENCE
        </div>
      </div>
    </aside>
  );
}
