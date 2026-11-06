import { useEffect, useMemo, useState } from 'react';
import { ALL_CRITERIA, CRITERIA_BY_CATEGORY, PARENT_CHILD_IDS, type CriteriaCategory, type CriteriaItem } from '@/data/benchmarkCriteria';
import { Flyout } from './Flyout';
import { CategoryTabs } from './CategoryTabs';
import { ResultsList } from './ResultsList';
import { ResultsSkeleton } from './ResultsSkeleton';
import { DateFilterBar, isWithinFilter, type DateFilterValue } from './DateRangeFilter';
import { RenameStep, summariseCriteria } from './RenameStep';

// How long the entrance skeleton shows for — only on the flyout's first
// open, never on a category switch or search within the same session.
const LOADING_MS = 2000;

type Step = 'select' | 'rename';

export interface CreatedBenchmark {
  name: string;
  value: number;
  description: string;
}

export function CreateBenchmarkFlyout({
  open,
  onClose,
  onCreate,
}: {
  open: boolean;
  onClose: () => void;
  onCreate: (benchmark: CreatedBenchmark) => void;
}) {
  const [step, setStep] = useState<Step>('select');
  const [category, setCategory] = useState<CriteriaCategory>('competitors');
  const [search, setSearch] = useState('');
  const [dateFilter, setDateFilter] = useState<DateFilterValue>({ type: 'all' });
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(true);

  // Keyed only on `open` — switching categories or typing a search never
  // touches this, so the skeleton only ever plays on a fresh open.
  useEffect(() => {
    if (!open) return;
    setLoading(true);
    const timer = setTimeout(() => setLoading(false), LOADING_MS);
    return () => clearTimeout(timer);
  }, [open]);

  function reset() {
    setStep('select');
    setCategory('competitors');
    setSearch('');
    setDateFilter({ type: 'all' });
    setSelectedIds(new Set());
    setName('');
  }

  function handleClose() {
    onClose();
    // Wait for the close transition's worth of time isn't needed — the
    // flyout unmounts immediately — but resetting synchronously would
    // flash the first step while it's still visually closing, so this
    // defers it to the next time it's actually reopened instead.
    setTimeout(reset, 300);
  }

  // A parent id (e.g. "NHS") toggles all of its children together — its
  // own id is never stored in `selectedIds`; the checkbox you see on a
  // parent row is always derived from how many of its children are
  // selected (see ResultsList), never written here directly.
  function toggle(id: string) {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      const childIds = PARENT_CHILD_IDS[id];
      if (childIds) {
        const allSelected = childIds.every((childId) => next.has(childId));
        for (const childId of childIds) {
          if (allSelected) next.delete(childId);
          else next.add(childId);
        }
      } else if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }

  const query = search.trim().toLowerCase();
  const isSearching = query.length > 0;

  // With no query, results stay scoped to the active category tab, same
  // as before. Once there's a query, it searches every category at
  // once — a matching parent brings all its children along, and a
  // matching child brings just itself plus its parent for context
  // (`ParentRow` force-expands whenever `isSearching` is true, so none
  // of this needs a manual expand to be visible).
  const filteredResults = useMemo(() => {
    if (!isSearching) {
      return CRITERIA_BY_CATEGORY[category].filter((item) => isWithinFilter(item.firstSeen, dateFilter));
    }
    const results: CriteriaItem[] = [];
    for (const items of Object.values(CRITERIA_BY_CATEGORY)) {
      for (const item of items) {
        if (!isWithinFilter(item.firstSeen, dateFilter)) continue;
        if (!item.children) {
          if (item.name.toLowerCase().includes(query)) results.push(item);
          continue;
        }
        if (item.name.toLowerCase().includes(query)) {
          results.push(item);
          continue;
        }
        const matchingChildren = item.children.filter((c) => c.name.toLowerCase().includes(query));
        if (matchingChildren.length > 0) results.push({ ...item, children: matchingChildren });
      }
    }
    return results;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [category, search, dateFilter, isSearching]);

  const selectedItems = useMemo(() => ALL_CRITERIA.filter((i) => selectedIds.has(i.id)), [selectedIds]);

  function handleCreate() {
    const value = Math.round(1800 + Math.random() * 1600);
    onCreate({ name: name.trim(), value, description: summariseCriteria(selectedItems) });
    handleClose();
  }

  const canProceed = selectedIds.size > 0;
  const canCreate = name.trim().length > 0;

  return (
    <Flyout
      open={open}
      onClose={handleClose}
      title={step === 'select' ? 'Create benchmark' : 'Rename benchmark'}
      description={
        step === 'select' ? 'Compare your publications against a defined reference set' : 'Name this benchmark based on the assets you selected'
      }
      stickyTop={
        step === 'select' ? (
          <div className="flex flex-col gap-4 pb-2">
            <CategoryTabs active={category} onChange={setCategory} />

            <DateFilterBar search={search} onSearchChange={setSearch} value={dateFilter} onChange={setDateFilter} />

            <div className="flex items-center justify-between border-t border-[var(--color-border)] pt-4">
              <p className="text-sm font-semibold text-[var(--color-foreground)]">Results</p>
              <p className="text-sm text-[var(--color-muted-foreground)]">{loading ? '—' : filteredResults.length} entries</p>
            </div>
          </div>
        ) : undefined
      }
      footer={
        step === 'select' ? (
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 text-sm">
              <span className="font-medium text-[var(--color-foreground)]">{selectedIds.size} items selected</span>
              <button
                type="button"
                onClick={() => setSelectedIds(new Set())}
                disabled={selectedIds.size === 0}
                className="font-semibold text-[var(--color-primary)] hover:underline disabled:cursor-not-allowed disabled:text-[var(--color-muted-foreground)] disabled:no-underline disabled:opacity-60"
              >
                Clear
              </button>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleClose}
                className="rounded-md border border-[var(--color-border)] px-4 py-2 text-sm font-semibold text-[var(--color-foreground)] transition-colors hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => setStep('rename')}
                disabled={!canProceed}
                className="rounded-md bg-[var(--color-primary)] px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-[var(--color-primary-hover)] disabled:cursor-not-allowed disabled:bg-gray-200 disabled:text-[var(--color-muted-foreground)]"
              >
                Next
              </button>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-between gap-2">
            <button
              type="button"
              onClick={() => setStep('select')}
              className="rounded-md border border-[var(--color-border)] px-4 py-2 text-sm font-semibold text-[var(--color-foreground)] transition-colors hover:bg-gray-50"
            >
              Back
            </button>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleClose}
                className="rounded-md border border-[var(--color-border)] px-4 py-2 text-sm font-semibold text-[var(--color-foreground)] transition-colors hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleCreate}
                disabled={!canCreate}
                className="rounded-md bg-[var(--color-primary)] px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-[var(--color-primary-hover)] disabled:cursor-not-allowed disabled:bg-gray-200 disabled:text-[var(--color-muted-foreground)]"
              >
                Create benchmark
              </button>
            </div>
          </div>
        )
      }
    >
      {step === 'select' ? (
        loading ? (
          <ResultsSkeleton />
        ) : (
          <ResultsList items={filteredResults} selectedIds={selectedIds} onToggle={toggle} forceExpandAll={isSearching} />
        )
      ) : (
        <RenameStep name={name} onNameChange={setName} selected={selectedItems} />
      )}
    </Flyout>
  );
}
