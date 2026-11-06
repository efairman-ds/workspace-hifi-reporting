import { Loader2 } from 'lucide-react';

/** Honest indeterminate progress — `@react-pdf/renderer`'s `toBlob()`
 *  exposes no real progress signal, so this never fabricates a
 *  percentage or implies completion before the promise actually
 *  resolves. */
export function ExportProcessingState() {
  return (
    <div className="flex flex-col items-center gap-4 py-10 text-center">
      <Loader2 className="size-8 animate-spin text-[var(--color-primary)]" />
      <div>
        <p className="text-sm font-semibold text-[var(--color-foreground)]">Generating your workspace report…</p>
        <p className="mt-1 text-sm text-[var(--color-muted-foreground)]">Assembling the selected sections into a PDF. This usually takes a few seconds.</p>
      </div>
    </div>
  );
}
