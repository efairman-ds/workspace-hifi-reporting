import { AlertTriangle } from 'lucide-react';

/** Error state — never shows a success notification or an invalid
 *  download. Retry is handled by the parent re-invoking generation with
 *  the exact same (already-built) selection, so nothing is lost. */
export function ExportErrorState({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="flex flex-col items-center gap-4 py-10 text-center">
      <AlertTriangle className="size-10 text-[var(--color-danger,#b9433f)]" />
      <div>
        <p className="text-sm font-semibold text-[var(--color-foreground)]">Something went wrong generating your report</p>
        <p className="mt-1 text-sm text-[var(--color-muted-foreground)]">Your selected sections have been kept — you can try again without reconfiguring.</p>
      </div>
      <button
        type="button"
        onClick={onRetry}
        className="rounded-md border border-[var(--color-border)] px-4 py-2 text-sm font-semibold text-[var(--color-foreground)] transition-colors hover:bg-gray-50"
      >
        Retry export
      </button>
    </div>
  );
}
