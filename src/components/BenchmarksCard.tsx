import { useEffect, useRef, useState } from 'react';
import { BarChart3, Clock, Info, MoreHorizontal, Plus } from 'lucide-react';
import type { BenchmarkEntry } from '@/data/dashboard';
import { cn } from '@/lib/utils';
import { CreateBenchmarkFlyout, type CreatedBenchmark } from './benchmark/CreateBenchmarkFlyout';
import { Toast } from './benchmark/Toast';

function formatDate(iso: string): string {
  return iso;
}

function OverflowMenu({ onRemove }: { onRemove: () => void }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label="More options"
        className={cn(
          'flex size-7 items-center justify-center rounded-md text-[var(--color-muted-foreground)] transition-colors hover:bg-gray-100 hover:text-[var(--color-foreground)]',
          open && 'bg-gray-100 text-[var(--color-foreground)]',
        )}
      >
        <MoreHorizontal className="size-4" />
      </button>
      {open ? (
        <div className="absolute top-full right-0 z-20 mt-1 w-36 overflow-hidden rounded-lg border border-[var(--color-border)] bg-white py-1 shadow-lg">
          <button type="button" className="block w-full px-3 py-1.5 text-left text-sm font-medium text-[var(--color-foreground)] hover:bg-gray-50">
            Rename
          </button>
          <button
            type="button"
            onClick={() => {
              setOpen(false);
              onRemove();
            }}
            className="block w-full px-3 py-1.5 text-left text-sm font-medium text-red-600 hover:bg-red-50"
          >
            Remove
          </button>
        </div>
      ) : null}
    </div>
  );
}

const VISIBLE_COUNT = 3;

export function BenchmarksCard({
  benchmarks,
  onCreateBenchmark,
  onRemoveBenchmark,
}: {
  benchmarks: BenchmarkEntry[];
  onCreateBenchmark: (benchmark: CreatedBenchmark) => void;
  onRemoveBenchmark: (id: string) => void;
}) {
  const [flyoutOpen, setFlyoutOpen] = useState(false);
  const [toastOpen, setToastOpen] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const visible = expanded ? benchmarks : benchmarks.slice(0, VISIBLE_COUNT);

  // Entry creation (and its "Calculating…" lifecycle) lives in App,
  // shared with the Workspace performance chart — this just forwards the
  // new benchmark up and handles its own local toast feedback.
  function handleCreate(benchmark: CreatedBenchmark) {
    onCreateBenchmark(benchmark);
    setToastOpen(true);
  }

  return (
    <div className="flex-1 rounded-xl border border-[var(--color-border)] bg-white p-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <h3 className="font-heading text-base font-bold text-[var(--color-foreground)]">Benchmarks</h3>
          <Info className="size-3.5 text-[var(--color-muted-foreground)]" />
        </div>
        <button
          type="button"
          onClick={() => setFlyoutOpen(true)}
          className="flex items-center gap-1.5 rounded-md bg-[var(--color-primary)] px-3 py-1.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-[var(--color-primary-hover)] active:translate-y-px"
        >
          <Plus className="size-4" />
          Create benchmark
        </button>
      </div>

      <div className="mt-4 flex flex-col divide-y divide-[var(--color-border)]">
        {visible.map((b) => (
          <div
            key={b.id}
            className={cn('group flex items-start justify-between gap-3 py-3 first:pt-0 last:pb-0', b.calculating && 'opacity-50')}
          >
            <div className="flex items-start gap-2.5">
              <BarChart3 className="mt-0.5 size-4 shrink-0 text-[var(--color-muted-foreground)]" />
              <div>
                <p className="text-sm font-semibold text-[var(--color-foreground)]">
                  {b.name} <span className="font-bold">{b.value.toLocaleString()}</span>
                </p>
                <p className="mt-0.5 text-sm text-[var(--color-muted-foreground)]">{b.calculating ? 'Calculating…' : b.description}</p>
              </div>
            </div>
            <div className="flex shrink-0 items-center gap-1.5 text-xs text-[var(--color-muted-foreground)]">
              <Clock className="size-3.5" />
              <span>{formatDate(b.savedAt)}</span>
              <OverflowMenu onRemove={() => onRemoveBenchmark(b.id)} />
            </div>
          </div>
        ))}
      </div>

      {benchmarks.length > VISIBLE_COUNT ? (
        <div className="mt-3 flex justify-center border-t border-[var(--color-border)] pt-3">
          <button
            type="button"
            onClick={() => setExpanded((v) => !v)}
            className="rounded-[4px] border border-[var(--color-border)] bg-white px-3.5 py-1.5 text-sm font-semibold text-[var(--color-primary)] transition-colors hover:bg-[var(--color-primary-soft)]"
          >
            {expanded ? 'Show less' : 'Show more'}
          </button>
        </div>
      ) : null}

      <CreateBenchmarkFlyout open={flyoutOpen} onClose={() => setFlyoutOpen(false)} onCreate={handleCreate} />
      <Toast open={toastOpen} onClose={() => setToastOpen(false)} />
    </div>
  );
}
