import { useState } from 'react';
import { ChevronRight, Minus, SearchX } from 'lucide-react';
import type { CriteriaItem } from '@/data/benchmarkCriteria';
import { cn } from '@/lib/utils';

type CheckState = 'checked' | 'unchecked' | 'indeterminate';

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

/** A single selectable row — used for both standalone items and nested
 *  children. `indent` adds the extra left padding that marks a child as
 *  visually subordinate to its parent. */
function CriteriaRow({
  item,
  state,
  onToggle,
  indent,
}: {
  item: CriteriaItem;
  state: CheckState;
  onToggle: (id: string) => void;
  indent?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={() => onToggle(item.id)}
      aria-pressed={state === 'checked'}
      className={cn(
        // Square-edged on purpose — selected rows (and their hover
        // state) must not pick up any corner radius.
        'flex items-center justify-between gap-3 rounded-none py-2.5 text-left transition-colors',
        indent ? 'pr-3 pl-9' : 'px-3',
        state !== 'unchecked' ? 'bg-[var(--color-primary-soft)]' : 'hover:bg-gray-50',
      )}
    >
      <span className="text-sm font-medium text-[var(--color-foreground)]">{item.name}</span>
      <Checkbox state={state} />
    </button>
  );
}

/** A parent row with nested children — the expand/collapse chevron and
 *  the selectable row are separate interactive targets, per the brief.
 *  Its own checkbox state is always derived from its children's
 *  selection (all/some/none), never stored independently. */
function ParentRow({
  item,
  selectedIds,
  onToggle,
  forceExpanded,
}: {
  item: CriteriaItem;
  selectedIds: Set<string>;
  onToggle: (id: string) => void;
  forceExpanded?: boolean;
}) {
  const [expanded, setExpanded] = useState(false);
  // Search force-expands without touching the user's own toggle, so
  // clearing the search reveals exactly the expand/collapse state they
  // had going in.
  const effectiveExpanded = expanded || !!forceExpanded;
  const children = item.children ?? [];
  const selectedCount = children.filter((c) => selectedIds.has(c.id)).length;
  const state: CheckState = selectedCount === 0 ? 'unchecked' : selectedCount === children.length ? 'checked' : 'indeterminate';

  return (
    <div>
      <div className={cn('flex items-center gap-1 transition-colors', state !== 'unchecked' ? 'bg-[var(--color-primary-soft)]' : 'hover:bg-gray-50')}>
        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          aria-expanded={effectiveExpanded}
          aria-label={effectiveExpanded ? `Collapse ${item.name}` : `Expand ${item.name}`}
          className="flex size-9 shrink-0 items-center justify-center text-[var(--color-muted-foreground)] transition-colors hover:text-[var(--color-foreground)]"
        >
          <ChevronRight className={cn('size-4 transition-transform duration-200', effectiveExpanded && 'rotate-90')} />
        </button>
        <button
          type="button"
          onClick={() => onToggle(item.id)}
          aria-pressed={state === 'checked'}
          className="flex flex-1 items-center justify-between gap-3 rounded-none py-2.5 pr-3 text-left"
        >
          <span className="text-sm font-medium text-[var(--color-foreground)]">{item.name}</span>
          <Checkbox state={state} />
        </button>
      </div>

      <div
        className="overflow-hidden transition-[max-height,opacity] duration-200 ease-[cubic-bezier(0.4,0,0.2,1)]"
        style={{ maxHeight: effectiveExpanded ? children.length * 44 : 0, opacity: effectiveExpanded ? 1 : 0 }}
      >
        <div className="flex flex-col gap-[1px]">
          {children.map((child) => (
            <CriteriaRow key={child.id} item={child} state={selectedIds.has(child.id) ? 'checked' : 'unchecked'} onToggle={onToggle} indent />
          ))}
        </div>
      </div>
    </div>
  );
}

export function ResultsList({
  items,
  selectedIds,
  onToggle,
  forceExpandAll,
}: {
  items: CriteriaItem[];
  selectedIds: Set<string>;
  onToggle: (id: string) => void;
  /** True while a global search is active — every parent in `items` is
   *  there because it (or one of its children) matched, so all of them
   *  force-open rather than making the user expand each one by hand. */
  forceExpandAll?: boolean;
}) {
  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center gap-2 py-14 text-center">
        <SearchX className="size-6 text-[var(--color-muted-foreground)]" />
        <p className="text-sm font-medium text-[var(--color-foreground)]">No matches</p>
        <p className="text-sm text-[var(--color-muted-foreground)]">Try a different keyword or filter.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-[1px]">
      {items.map((item) =>
        item.children ? (
          <ParentRow key={item.id} item={item} selectedIds={selectedIds} onToggle={onToggle} forceExpanded={forceExpandAll} />
        ) : (
          <CriteriaRow key={item.id} item={item} state={selectedIds.has(item.id) ? 'checked' : 'unchecked'} onToggle={onToggle} />
        ),
      )}
    </div>
  );
}
