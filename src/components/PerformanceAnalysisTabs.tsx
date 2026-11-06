import { Sparkles, TrendingUp } from 'lucide-react';
import { cn } from '@/lib/utils';

export type MainTab = 'performance' | 'analysis';

export function PerformanceAnalysisTabs({ active, onChange }: { active: MainTab; onChange: (tab: MainTab) => void }) {
  return (
    // Equal padding on all four sides of the container, hugging content.
    <div className="inline-flex w-fit shrink-0 items-center self-start gap-1 rounded-[4px] border border-[var(--color-border)] bg-white p-[7px]">
      <TabButton active={active === 'performance'} onClick={() => onChange('performance')} icon={<TrendingUp className="size-4" />} label="Performance" />
      <TabButton active={active === 'analysis'} onClick={() => onChange('analysis')} icon={<Sparkles className="size-4" />} label="Analysis" />
    </div>
  );
}

function TabButton({ active, onClick, icon, label }: { active: boolean; onClick: () => void; icon: React.ReactNode; label: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        // Same stable-border trick as the metric pills — a transparent
        // 1px border at rest so picking up the real one on selection
        // never shifts size.
        'flex items-center gap-1.5 rounded-[4px] border px-3.5 py-1.5 text-sm transition-colors duration-150',
        active
          ? 'border-[rgba(91,79,224,0.25)] bg-[var(--color-primary-soft)] font-semibold text-[var(--color-primary)]'
          : 'border-transparent font-normal text-[var(--color-foreground)] hover:bg-[var(--color-primary-soft)]',
      )}
    >
      {icon}
      {label}
    </button>
  );
}
