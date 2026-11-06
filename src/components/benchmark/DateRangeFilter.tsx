import { useState } from 'react';
import { Calendar, Check, ChevronDown, ChevronUp, ListFilter, Search, X } from 'lucide-react';
import { cn } from '@/lib/utils';

export type DateFilterType = 'all' | 'custom';

export interface DateFilterValue {
  type: DateFilterType;
  start?: string;
  end?: string;
}

function labelFor(type: DateFilterType): string {
  return type === 'custom' ? 'Custom range' : 'All time';
}

/** The keyword-search field + date-filter trigger, and (when expanded)
 *  the full-width Custom range panel directly beneath both — part of the
 *  filter layout itself, not a floating dropdown/options list. Expanding
 *  it pushes the results list down rather than overlaying it. */
export function DateFilterBar({
  search,
  onSearchChange,
  value,
  onChange,
}: {
  search: string;
  onSearchChange: (v: string) => void;
  value: DateFilterValue;
  onChange: (v: DateFilterValue) => void;
}) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-[var(--color-muted-foreground)]" />
          <input
            type="text"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Filter by keyword"
            className="h-10 w-full rounded-md border border-[var(--color-border)] pr-8 pl-9 text-sm text-[var(--color-foreground)] outline-none focus:border-[var(--color-primary)]"
          />
          {search ? (
            <button
              type="button"
              onClick={() => onSearchChange('')}
              aria-label="Clear search"
              className="absolute top-1/2 right-2 flex size-5 -translate-y-1/2 items-center justify-center rounded-[4px] text-[var(--color-muted-foreground)] transition-colors hover:bg-gray-100 hover:text-[var(--color-foreground)]"
            >
              <X className="size-3.5" />
            </button>
          ) : null}
        </div>
        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          aria-expanded={expanded}
          className="flex h-10 shrink-0 items-center gap-1.5 rounded-[4px] border border-[var(--color-border)] bg-gray-50 px-3 text-sm font-medium text-[var(--color-foreground)] transition-colors hover:bg-gray-100"
        >
          <ListFilter className="size-4 text-[var(--color-muted-foreground)]" />
          {labelFor(value.type)}
          {expanded ? (
            <ChevronUp className="size-3.5 text-[var(--color-muted-foreground)]" />
          ) : (
            <ChevronDown className="size-3.5 text-[var(--color-muted-foreground)]" />
          )}
        </button>
      </div>

      {expanded ? (
        <CustomRangePanel
          value={value}
          onApply={(start, end) => {
            onChange({ type: 'custom', start, end });
            setExpanded(false);
          }}
        />
      ) : null}
    </div>
  );
}

/** The inline Custom range panel — full width, part of normal document
 *  flow (not an absolutely-positioned overlay), so it displaces the
 *  results list beneath it instead of covering it. */
function CustomRangePanel({
  value,
  onApply,
}: {
  value: DateFilterValue;
  onApply: (start: string, end: string) => void;
}) {
  const [start, setStart] = useState(value.start ?? '');
  const [end, setEnd] = useState(value.end ?? '');

  return (
    <div className="w-full rounded-[4px] border border-[var(--color-border)] bg-gray-50/60 p-5">
      <p className="text-base font-semibold text-[var(--color-foreground)]">Custom range</p>
      <p className="mt-1 text-sm text-[var(--color-muted-foreground)]">Dates are shown in UTC. Publication data is available from Jan 1, 2010.</p>

      <div className="mt-4 flex gap-4">
        <DateField label="Start date" value={start} onChange={setStart} />
        <DateField label="End date" value={end} onChange={setEnd} />
      </div>

      <div className="mt-4 flex justify-end">
        <button
          type="button"
          onClick={() => onApply(start, end)}
          className={cn(
            'flex items-center gap-1.5 rounded-md border border-[var(--color-border)] bg-white px-4 py-2 text-sm font-semibold text-[var(--color-primary)] transition-colors hover:bg-[var(--color-primary-soft)]',
          )}
        >
          <Check className="size-4" />
          Apply
        </button>
      </div>
    </div>
  );
}

function DateField({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div className="flex flex-1 flex-col gap-1.5">
      <label className="text-sm font-medium text-[var(--color-foreground)]">{label}</label>
      <div className="relative">
        <Calendar className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-[var(--color-muted-foreground)]" />
        <input
          type="date"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          min="2010-01-01"
          placeholder="YYYY-MM-DD"
          className="h-11 w-full rounded-md border border-[var(--color-border)] bg-white pr-3 pl-9 text-sm text-[var(--color-foreground)] outline-none focus:border-[var(--color-primary)]"
        />
      </div>
    </div>
  );
}

export function isWithinFilter(firstSeen: string, filter: DateFilterValue): boolean {
  if (filter.type === 'all') return true;
  if (!filter.start && !filter.end) return true;
  const date = new Date(firstSeen).getTime();
  const start = filter.start ? new Date(filter.start).getTime() : -Infinity;
  const end = filter.end ? new Date(filter.end).getTime() : Infinity;
  return date >= start && date <= end;
}
