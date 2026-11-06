import { useEffect } from 'react';
import { CircleCheck } from 'lucide-react';

/** Bottom-left success toast — auto-dismisses after a few seconds so it
 *  never needs its own close button. */
export function Toast({ open, onClose }: { open: boolean; onClose: () => void }) {
  useEffect(() => {
    if (!open) return;
    const timer = setTimeout(onClose, 5000);
    return () => clearTimeout(timer);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed bottom-6 left-[86px] z-[60] flex w-80 items-start gap-3 rounded-lg bg-[#1c1d22] p-4 text-white shadow-2xl">
      <CircleCheck className="mt-0.5 size-5 shrink-0 text-emerald-400" />
      <div>
        <p className="text-sm font-semibold">Benchmark created</p>
        <p className="mt-0.5 text-sm text-white/70">You'll receive an email when it's ready in the workspace.</p>
      </div>
    </div>
  );
}
