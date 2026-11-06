import { useEffect, useState } from 'react';
import { CheckCircle2, Download } from 'lucide-react';

/** Success state — a genuine Blob download via an object URL, never an
 *  auto-triggered or implied download. The modal stays open until the
 *  user closes it themselves (never auto-closes on completion).
 *
 *  Creation and revocation both live inside the same effect (keyed on
 *  `blob`) rather than a ref guard + separate cleanup — React's
 *  StrictMode (see main.tsx) deliberately mounts, runs effect cleanup,
 *  then remounts every component once in dev. With creation outside
 *  the effect, that cleanup revoked the one-and-only URL right after
 *  creating it and nothing ever recreated it, leaving the Download
 *  button pointing at a dead `blob:` URL — which the browser surfaces
 *  as a generic failed-download error. Keeping both in the effect
 *  means each mount cycle creates and revokes its own URL pair, and
 *  the one left standing after StrictMode settles is always valid. */
export function ExportCompleteState({ blob, filename }: { blob: Blob; filename: string }) {
  const [url, setUrl] = useState<string | null>(null);

  useEffect(() => {
    const objectUrl = URL.createObjectURL(blob);
    setUrl(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, [blob]);

  function handleDownload() {
    if (!url) return;
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
  }

  return (
    <div className="flex flex-col items-center gap-4 py-10 text-center">
      <CheckCircle2 className="size-10 text-emerald-500" />
      <div>
        <p className="text-sm font-semibold text-[var(--color-foreground)]">Your report is ready</p>
        <p className="mt-1 text-sm text-[var(--color-muted-foreground)]">{filename}</p>
      </div>
      <button
        type="button"
        onClick={handleDownload}
        className="flex items-center gap-2 rounded-md bg-[var(--color-primary)] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[var(--color-primary-hover)]"
      >
        <Download className="size-4" />
        Download PDF
      </button>
    </div>
  );
}
