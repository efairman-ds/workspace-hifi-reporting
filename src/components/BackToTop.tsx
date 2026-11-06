import { ArrowUp } from 'lucide-react';

export function BackToTop() {
  return (
    <div className="flex items-center gap-4 py-6">
      <div className="h-px flex-1 bg-[var(--color-border)]" />
      <button
        type="button"
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className="flex shrink-0 items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium text-[var(--color-muted-foreground)] transition-colors hover:bg-gray-100 hover:text-[var(--color-foreground)]"
      >
        <ArrowUp className="size-4" />
        Back to top
      </button>
      <div className="h-px flex-1 bg-[var(--color-border)]" />
    </div>
  );
}
