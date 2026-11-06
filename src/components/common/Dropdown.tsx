import { useEffect, useRef, useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DropdownOption {
  id: string;
  label: string;
  /** Renders the option non-interactive — e.g. a "coming soon" format. */
  disabled?: boolean;
  /** Small secondary text shown next to the label, e.g. "Coming soon". */
  caption?: string;
}

/** A small trigger + options-list dropdown used for the date-range and
 *  export menus — closes on outside click or Escape, shows a clear
 *  selected state, matches the reference's hover/open styling. */
export function Dropdown({
  options,
  selectedId,
  onSelect,
  trigger,
  align = 'end',
  panelWidthClassName = 'w-52',
}: {
  options: DropdownOption[];
  selectedId?: string;
  onSelect: (id: string) => void;
  trigger: (open: boolean) => React.ReactNode;
  align?: 'start' | 'end';
  /** Overrides the options panel's width — the default `w-52` is sized
   *  for short labels like the date-range menu; a menu with longer
   *  labels/captions (e.g. the export format menu) should pass a wider
   *  class so nothing wraps. */
  panelWidthClassName?: string;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function handle(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false);
    }
    document.addEventListener('mousedown', handle);
    document.addEventListener('keydown', handleKey);
    return () => {
      document.removeEventListener('mousedown', handle);
      document.removeEventListener('keydown', handleKey);
    };
  }, [open]);

  return (
    <div ref={ref} className="relative">
      <button type="button" onClick={() => setOpen((v) => !v)} aria-haspopup="listbox" aria-expanded={open}>
        {trigger(open)}
      </button>
      {open ? (
        <div
          role="listbox"
          className={cn(
            'absolute top-full z-30 mt-1.5 overflow-hidden rounded-lg border border-[var(--color-border)] bg-white py-1 shadow-lg',
            panelWidthClassName,
            align === 'end' ? 'right-0' : 'left-0',
          )}
        >
          {options.map((opt) => (
            <button
              key={opt.id}
              type="button"
              role="option"
              aria-selected={opt.id === selectedId}
              aria-disabled={opt.disabled}
              disabled={opt.disabled}
              onClick={() => {
                if (opt.disabled) return;
                onSelect(opt.id);
                setOpen(false);
              }}
              className={cn(
                'flex w-full items-center justify-between gap-3 px-3.5 py-2 text-left text-sm transition-colors',
                opt.disabled
                  ? 'cursor-not-allowed text-[var(--color-muted-foreground)] opacity-60'
                  : opt.id === selectedId
                    ? 'bg-[var(--color-primary-soft)] font-semibold text-[var(--color-primary)]'
                    : 'font-medium text-[var(--color-foreground)] hover:bg-gray-50',
              )}
            >
              <span className="whitespace-nowrap">{opt.label}</span>
              {opt.caption ? <span className="whitespace-nowrap text-xs text-[var(--color-muted-foreground)]">{opt.caption}</span> : null}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}

export function CaretTrigger({ label, open }: { label: string; open: boolean }) {
  return (
    <span
      className={cn(
        'flex items-center gap-1 rounded-md px-2 py-1 text-sm font-medium text-[var(--color-muted-foreground)] transition-colors',
        'hover:bg-gray-50 hover:text-[var(--color-foreground)]',
        open && 'bg-gray-50 text-[var(--color-foreground)]',
      )}
    >
      {label}
      <ChevronDown className={cn('size-3.5 transition-transform duration-200', open && 'rotate-180')} />
    </span>
  );
}
