import { fullColor } from './colors';
import type { SegmentKey } from '@/data/dashboard';

export interface TooltipState {
  x: number;
  y: number;
  rowLabel: string;
  isWorkspaceRow: boolean;
  segmentKey: SegmentKey;
  segmentLabel: string;
  value: number;
  workspaceValue: number;
}

export function ChartTooltip({ tooltip }: { tooltip: TooltipState | null }) {
  if (!tooltip) return null;

  return (
    <div
      className="pointer-events-none absolute z-40 w-56 rounded-lg border border-[var(--color-border)] bg-white p-3 shadow-xl transition-opacity duration-150"
      style={{
        left: tooltip.x,
        top: tooltip.y,
        transform: 'translate(-50%, calc(-100% - 10px))',
      }}
    >
      <p className="mb-2 text-[11px] font-bold tracking-wide text-[var(--color-muted-foreground)] uppercase">{tooltip.rowLabel}</p>
      <div className="flex items-center justify-between gap-3 text-sm">
        <span className="flex items-center gap-1.5 font-semibold text-[var(--color-foreground)]">
          <span className="size-2.5 shrink-0 rounded-sm" style={{ backgroundColor: fullColor(tooltip.segmentKey) }} />
          {tooltip.segmentLabel}
        </span>
        <span className="font-semibold tabular-nums text-[var(--color-foreground)]">{tooltip.value.toLocaleString()}</span>
      </div>
      {!tooltip.isWorkspaceRow ? (
        <div className="mt-1 flex items-center justify-between gap-3 text-sm">
          <span className="text-[var(--color-muted-foreground)]">Workspace library</span>
          <span className="font-medium tabular-nums text-[var(--color-muted-foreground)]">{tooltip.workspaceValue.toLocaleString()}</span>
        </div>
      ) : null}
      <div
        className="absolute left-1/2 top-full size-2.5 -translate-x-1/2 -translate-y-1/2 rotate-45 border-r border-b border-[var(--color-border)] bg-white"
        aria-hidden
      />
    </div>
  );
}
