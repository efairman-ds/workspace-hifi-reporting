import { useState } from 'react';
import type { CriteriaItem } from '@/data/benchmarkCriteria';

const PREVIEW_COUNT = 4;

export function summariseCriteria(items: CriteriaItem[]): string {
  const names = items.map((i) => i.name);
  if (names.length <= PREVIEW_COUNT) return names.join(', ');
  return `${names.slice(0, PREVIEW_COUNT).join(', ')} (+${names.length - PREVIEW_COUNT} more)`;
}

export function RenameStep({
  name,
  onNameChange,
  selected,
}: {
  name: string;
  onNameChange: (name: string) => void;
  selected: CriteriaItem[];
}) {
  const [expanded, setExpanded] = useState(false);
  const names = selected.map((i) => i.name);
  const visibleNames = expanded ? names : names.slice(0, PREVIEW_COUNT);
  const remaining = names.length - PREVIEW_COUNT;

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-1.5">
        <label htmlFor="benchmark-name" className="text-sm font-semibold text-[var(--color-foreground)]">
          Benchmark name
        </label>
        <input
          id="benchmark-name"
          type="text"
          autoFocus
          value={name}
          onChange={(e) => onNameChange(e.target.value)}
          placeholder="e.g. Competitor drugs Q1 2026"
          className="h-11 rounded-md border border-[var(--color-primary)] px-3 text-sm text-[var(--color-foreground)] shadow-[0_0_0_3px_rgba(91,79,224,0.12)] outline-none"
        />
      </div>

      <div className="rounded-lg border border-[var(--color-border)] bg-gray-50/60 p-4">
        <p className="text-sm font-semibold text-[var(--color-foreground)]">Selected Criteria ({names.length})</p>
        <p className="mt-1 text-sm text-[var(--color-muted-foreground)]">
          {visibleNames.join(', ')}
          {!expanded && remaining > 0 ? (
            <>
              {' '}
              <button
                type="button"
                onClick={() => setExpanded(true)}
                className="font-semibold text-[var(--color-primary)] hover:underline"
              >
                (+{remaining} more)
              </button>
            </>
          ) : null}
          {expanded && remaining > 0 ? (
            <>
              {' '}
              <button
                type="button"
                onClick={() => setExpanded(false)}
                className="font-semibold text-[var(--color-primary)] hover:underline"
              >
                (hide)
              </button>
            </>
          ) : null}
        </p>
      </div>
    </div>
  );
}
