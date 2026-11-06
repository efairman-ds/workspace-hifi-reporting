import { CRITERIA_CATEGORIES, type CriteriaCategory } from '@/data/benchmarkCriteria';
import { cn } from '@/lib/utils';

// Same pill treatment as the Workspace performance metric selector —
// same tokens, same stable-border trick, same 4px radius — so every
// segmented control in the app reads as one consistent pattern.
export function CategoryTabs({ active, onChange }: { active: CriteriaCategory; onChange: (category: CriteriaCategory) => void }) {
  return (
    <div className="flex flex-wrap gap-2">
      {CRITERIA_CATEGORIES.map((cat) => (
        <button
          key={cat.id}
          type="button"
          onClick={() => onChange(cat.id)}
          aria-pressed={active === cat.id}
          className={cn(
            'rounded-[4px] border px-3 py-1.5 text-sm transition-colors duration-150',
            active === cat.id
              ? 'border-[rgba(91,79,224,0.25)] bg-[var(--color-primary-soft)] font-semibold text-[var(--color-primary)]'
              : 'border-transparent font-normal text-[var(--color-foreground)] hover:bg-[var(--color-primary-soft)]',
          )}
        >
          {cat.label}
        </button>
      ))}
    </div>
  );
}
