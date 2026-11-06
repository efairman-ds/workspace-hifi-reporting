import { METRICS, type MetricId } from '@/data/dashboard';
import { cn } from '@/lib/utils';

export function MetricTabs({ active, onChange }: { active: MetricId; onChange: (id: MetricId) => void }) {
  return (
    <div className="flex flex-wrap gap-2">
      {METRICS.map((m) => (
        <button
          key={m.id}
          type="button"
          onClick={() => onChange(m.id)}
          aria-pressed={active === m.id}
          className={cn(
            // A stable 1px transparent border even when unselected, so
            // picking up the real border on selection never shifts the
            // pill's size.
            'rounded-[4px] border px-3 py-1.5 text-sm transition-colors duration-150',
            active === m.id
              ? 'border-[rgba(91,79,224,0.25)] bg-[var(--color-primary-soft)] font-semibold text-[var(--color-primary)]'
              : 'border-transparent font-normal text-[var(--color-foreground)] hover:bg-[var(--color-primary-soft)]',
          )}
        >
          {m.label}
        </button>
      ))}
    </div>
  );
}
