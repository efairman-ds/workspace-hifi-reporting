import { Clock, FileText } from 'lucide-react';
import type { BenchmarkEntry } from '@/data/dashboard';
import { Dropdown, CaretTrigger } from './common/Dropdown';
import { ExportMenu } from './export/ExportMenu';

const DATE_RANGES = [
  { id: 'past-month', label: 'Past month' },
  { id: 'past-3-months', label: 'Past 3 months' },
  { id: 'past-6-months', label: 'Past 6 months' },
  { id: 'past-year', label: 'Past year' },
  { id: 'all-time', label: 'All time' },
];

export function WorkspaceHeader({
  dateRange,
  onDateRangeChange,
  publicationCount,
  benchmarks,
}: {
  dateRange: string;
  onDateRangeChange: (id: string) => void;
  publicationCount: number;
  benchmarks: BenchmarkEntry[];
}) {
  const rangeLabel = DATE_RANGES.find((r) => r.id === dateRange)?.label ?? 'Past year';

  return (
    <div className="flex items-start justify-between gap-4">
      <div>
        <h1 className="font-heading text-[28px] font-extrabold tracking-tight text-[var(--color-foreground)]">Oncology workspace</h1>
        <div className="mt-1.5 flex items-center gap-1.5 text-sm text-[var(--color-muted-foreground)]">
          <FileText className="size-4" />
          <span>{publicationCount.toLocaleString()} publications</span>
          <a
            href="#"
            onClick={(e) => e.preventDefault()}
            className="font-semibold text-[var(--color-primary)] transition-colors hover:text-[var(--color-primary-hover)] hover:underline"
          >
            View library
          </a>
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-4 pt-1">
        <span className="flex items-center gap-1.5 text-sm text-[var(--color-muted-foreground)]">
          <Clock className="size-4" />
          Last updated today
        </span>
        <Dropdown
          options={DATE_RANGES}
          selectedId={dateRange}
          onSelect={onDateRangeChange}
          trigger={(open) => <CaretTrigger label={rangeLabel} open={open} />}
        />
        <ExportMenu benchmarks={benchmarks} />
      </div>
    </div>
  );
}
