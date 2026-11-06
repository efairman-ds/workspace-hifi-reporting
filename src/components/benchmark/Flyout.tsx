import { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

const ANIMATION_MS = 320;
const EASE = 'cubic-bezier(0.4, 0, 0.2, 1)';

/** Generic right-hand flyout shell — overlay, fixed panel, a fixed header,
 *  an optional sticky block that sits below the header but above the
 *  scroll area (category tabs, search, filters — anything that must stay
 *  put while only the results underneath it scroll), a scrollable body,
 *  and a fixed footer. Reused by the "Create benchmark" flow but not
 *  specific to it. */
export function Flyout({
  open,
  onClose,
  title,
  description,
  stickyTop,
  footer,
  children,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  description: string;
  stickyTop?: React.ReactNode;
  footer?: React.ReactNode;
  children: React.ReactNode;
}) {
  // Stays mounted for the full close transition instead of vanishing the
  // instant `open` flips false, so the panel can slide out rather than
  // disappearing — a real setTimeout (not rAF) guarantees the off-screen
  // starting position actually paints before `entered` flips to true.
  const [mounted, setMounted] = useState(open);
  const [entered, setEntered] = useState(false);

  useEffect(() => {
    if (open) {
      setMounted(true);
      const timer = setTimeout(() => setEntered(true), 10);
      return () => clearTimeout(timer);
    }
    setEntered(false);
    const timer = setTimeout(() => setMounted(false), ANIMATION_MS);
    return () => clearTimeout(timer);
  }, [open]);

  useEffect(() => {
    if (!mounted) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }
    document.addEventListener('keydown', handleKey);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', handleKey);
    };
  }, [mounted, onClose]);

  if (!mounted) return null;

  return (
    <div className="fixed inset-0 z-50">
      <div
        className="absolute inset-0 bg-black/40"
        style={{ opacity: entered ? 1 : 0, transition: `opacity ${ANIMATION_MS}ms ${EASE}` }}
        onClick={onClose}
        aria-hidden
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className="absolute inset-y-0 right-0 flex w-[40vw] min-w-[420px] flex-col bg-white shadow-2xl"
        style={{
          transform: entered ? 'translateX(0)' : 'translateX(100%)',
          transition: `transform ${ANIMATION_MS}ms ${EASE}`,
        }}
      >
        <div className="flex shrink-0 items-start justify-between gap-4 border-b border-[var(--color-border)] px-8 py-6">
          <div>
            <h2 className="font-heading text-xl font-bold text-[var(--color-foreground)]">{title}</h2>
            <p className="mt-1 text-sm text-[var(--color-muted-foreground)]">{description}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="flex size-8 shrink-0 items-center justify-center rounded-md text-[var(--color-muted-foreground)] transition-colors hover:bg-gray-100 hover:text-[var(--color-foreground)]"
          >
            <X className="size-5" />
          </button>
        </div>

        {stickyTop ? <div className="shrink-0 px-8 pt-6">{stickyTop}</div> : null}

        <div className={cn('min-h-0 flex-1 overflow-y-auto px-8 pb-6', stickyTop ? 'pt-3' : 'pt-6')}>{children}</div>

        {footer ? <div className="shrink-0 border-t border-[var(--color-border)] px-8 py-4">{footer}</div> : null}
      </div>
    </div>
  );
}
