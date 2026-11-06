import { useEffect, useState } from 'react';
import { X } from 'lucide-react';

const ANIMATION_MS = 200;
const EASE = 'cubic-bezier(0.4, 0, 0.2, 1)';

/** Generic centered modal shell — the app only had a right-side `Flyout`
 *  (`src/components/benchmark/Flyout.tsx`) before this; reuses its same
 *  conventions (backdrop, Escape-to-close, body-scroll lock, animated
 *  mount/unmount) but with a centered-panel geometry instead of a
 *  side-drawer, since this is used by the export config modal which
 *  isn't a drawer-shaped flow. */
export function Modal({
  open,
  onClose,
  title,
  description,
  footer,
  children,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  footer?: React.ReactNode;
  children: React.ReactNode;
}) {
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
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
        className="relative flex max-h-[85vh] w-full max-w-lg flex-col rounded-xl bg-white shadow-2xl"
        style={{
          opacity: entered ? 1 : 0,
          transform: entered ? 'scale(1)' : 'scale(0.97)',
          transition: `opacity ${ANIMATION_MS}ms ${EASE}, transform ${ANIMATION_MS}ms ${EASE}`,
        }}
      >
        <div className="flex shrink-0 items-start justify-between gap-4 border-b border-[var(--color-border)] px-6 py-5">
          <div>
            <h2 className="font-heading text-lg font-bold text-[var(--color-foreground)]">{title}</h2>
            {description ? <p className="mt-1 text-sm text-[var(--color-muted-foreground)]">{description}</p> : null}
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

        <div className="min-h-0 flex-1 overflow-y-auto px-6 py-5">{children}</div>

        {footer ? <div className="shrink-0 border-t border-[var(--color-border)] px-6 py-4">{footer}</div> : null}
      </div>
    </div>
  );
}
