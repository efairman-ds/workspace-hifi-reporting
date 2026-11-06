import { useState } from 'react';
import { ChevronRight, Minus } from 'lucide-react';
import type { ReportSection } from '@/data/report/reportSections';
import { REPORT_SECTIONS } from '@/data/report/reportSections';
import { cn } from '@/lib/utils';

type CheckState = 'checked' | 'unchecked' | 'indeterminate';

/** Same visual checkbox as `src/components/benchmark/ResultsList.tsx`'s
 *  `Checkbox` — reused verbatim for consistency with the rest of the app. */
function Checkbox({ state }: { state: CheckState }) {
  return (
    <span
      aria-hidden
      className={cn(
        'flex size-[18px] shrink-0 items-center justify-center rounded-[4px] border-2 transition-colors',
        state === 'unchecked' ? 'border-gray-300 bg-white' : 'border-[var(--color-primary)] bg-[var(--color-primary)]',
      )}
    >
      {state === 'checked' ? (
        <svg width="11" height="9" viewBox="0 0 11 9" fill="none">
          <path d="M1 4.5L4 7.5L10 1" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ) : null}
      {state === 'indeterminate' ? <Minus className="size-3" stroke="white" strokeWidth={2.5} /> : null}
    </span>
  );
}

function Row({ label, state, onToggle, indent }: { label: string; state: CheckState; onToggle: () => void; indent?: boolean }) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-pressed={state === 'checked'}
      className={cn(
        'flex w-full items-center justify-between gap-3 py-2.5 text-left transition-colors',
        indent ? 'pr-3 pl-9' : 'px-3',
        state !== 'unchecked' ? 'bg-[var(--color-primary-soft)]' : 'hover:bg-gray-50',
      )}
    >
      <span className="text-sm font-medium text-[var(--color-foreground)]">{label}</span>
      <Checkbox state={state} />
    </button>
  );
}

function ParentSectionRow({ section, selectedIds, onToggle }: { section: ReportSection; selectedIds: Set<string>; onToggle: (id: string) => void }) {
  const [expanded, setExpanded] = useState(true);
  const children = section.children ?? [];
  const selectedCount = children.filter((c) => selectedIds.has(c.id)).length;
  const state: CheckState = selectedCount === 0 ? 'unchecked' : selectedCount === children.length ? 'checked' : 'indeterminate';

  return (
    <div>
      <div className={cn('flex items-center gap-1 transition-colors', state !== 'unchecked' ? 'bg-[var(--color-primary-soft)]' : 'hover:bg-gray-50')}>
        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          aria-expanded={expanded}
          aria-label={expanded ? `Collapse ${section.label}` : `Expand ${section.label}`}
          className="flex size-9 shrink-0 items-center justify-center text-[var(--color-muted-foreground)] transition-colors hover:text-[var(--color-foreground)]"
        >
          <ChevronRight className={cn('size-4 transition-transform duration-200', expanded && 'rotate-90')} />
        </button>
        <button type="button" onClick={() => onToggle(section.id)} aria-pressed={state === 'checked'} className="flex flex-1 items-center justify-between gap-3 py-2.5 pr-3 text-left">
          <span className="text-sm font-medium text-[var(--color-foreground)]">{section.label}</span>
          <Checkbox state={state} />
        </button>
      </div>
      {expanded ? (
        <div className="flex flex-col gap-[1px]">
          {children.map((child) => (
            <Row key={child.id} label={child.label} state={selectedIds.has(child.id) ? 'checked' : 'unchecked'} onToggle={() => onToggle(child.id)} indent />
          ))}
        </div>
      ) : null}
    </div>
  );
}

/** The export config modal's 7-section checkbox tree — only "Workspace
 *  performance" nests (4 metric leaves). Parent/indeterminate behaviour
 *  mirrors `ResultsList.tsx`'s `ParentRow` pattern. */
export function SectionTree({ selectedIds, onToggle }: { selectedIds: Set<string>; onToggle: (id: string) => void }) {
  return (
    <div className="flex flex-col gap-[1px] overflow-hidden rounded-lg border border-[var(--color-border)]">
      {REPORT_SECTIONS.map((section) =>
        section.children ? (
          <ParentSectionRow key={section.id} section={section} selectedIds={selectedIds} onToggle={onToggle} />
        ) : (
          <Row key={section.id} label={section.label} state={selectedIds.has(section.id) ? 'checked' : 'unchecked'} onToggle={() => onToggle(section.id)} />
        ),
      )}
    </div>
  );
}
