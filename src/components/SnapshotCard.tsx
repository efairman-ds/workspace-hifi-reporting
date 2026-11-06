import { Info } from 'lucide-react';
import { PERFORMANCE_SNAPSHOT } from '@/data/dashboard';
import { ExportButton } from './common/ExportButton';

export function SnapshotCard() {
  return (
    <div className="flex-1 rounded-xl border border-[var(--color-border)] bg-white p-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <h3 className="font-heading text-base font-semibold text-[var(--color-foreground)]">Performance snapshot</h3>
          <Info className="size-3.5 text-[var(--color-muted-foreground)]" />
        </div>
        <ExportButton />
      </div>

      <div className="mt-5 grid grid-cols-2 gap-x-4 gap-y-6">
        {PERFORMANCE_SNAPSHOT.map((item) => (
          <div key={item.id} className="flex items-baseline gap-2">
            <span className="font-heading text-[28px] font-semibold tracking-tight text-[var(--color-foreground)]">{item.value.toLocaleString()}</span>
            <span className="text-sm text-[var(--color-muted-foreground)]">{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
