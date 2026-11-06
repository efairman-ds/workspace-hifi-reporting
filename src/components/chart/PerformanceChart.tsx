import { useEffect, useMemo, useRef, useState } from 'react';
import { Info } from 'lucide-react';
import {
  METRICS,
  METRIC_DATA,
  SEGMENTS,
  withCustomRows,
  type BenchmarkEntry,
  type MetricChartData,
  type MetricId,
  type MetricRowData,
  type RowId,
  type SegmentKey,
  type Segments,
} from '@/data/dashboard';
import { useElementWidth } from '@/lib/useElementWidth';
import { computeWidths, getTicks } from '@/lib/chartGeometry';
import { cn } from '@/lib/utils';
import { ExportButton } from '../common/ExportButton';
import { Dropdown, CaretTrigger } from '../common/Dropdown';
import { MetricTabs } from './MetricTabs';
import { segmentColor, type HoveredSegment } from './colors';
import { ChartTooltip, type TooltipState } from './ChartTooltip';

const DATE_RANGES = [
  { id: 'past-month', label: 'Past month' },
  { id: 'past-3-months', label: 'Past 3 months' },
  { id: 'past-6-months', label: 'Past 6 months' },
  { id: 'past-year', label: 'Past year' },
  { id: 'all-time', label: 'All time' },
];

const ROW_HEIGHT = 44;
// Benchmark bars read as secondary to the workspace library bar — 30%
// shorter, everything else about their layout (gap, corner radius,
// vertical rhythm) stays the same.
const BENCHMARK_ROW_HEIGHT = Math.round(ROW_HEIGHT * 0.7);
const ROW_GAP = 16;

function rowHeight(isWorkspace: boolean): number {
  return isWorkspace ? ROW_HEIGHT : BENCHMARK_ROW_HEIGHT;
}
const EASE = 'cubic-bezier(0.4, 0, 0.2, 1)';
// The one-time left-to-right draw-in, on first load only.
const ENTRANCE_MS = 620;
// Every later metric change — segments just reposition/resize in place.
const REPOSITION_MS = 350;

function zeroWidths(data: MetricChartData): Record<RowId, Segments> {
  const result = {} as Record<RowId, Segments>;
  for (const row of data.rows) result[row.rowId] = { reach: 0, engagement: 0, impact: 0, scientific: 0 };
  return result;
}

export function PerformanceChart({ benchmarks }: { benchmarks: BenchmarkEntry[] }) {
  const [metric, setMetric] = useState<MetricId>('total_mentions');
  const [dateRange, setDateRange] = useState('past-year');
  const [hovered, setHovered] = useState<HoveredSegment | null>(null);
  const [tooltip, setTooltip] = useState<TooltipState | null>(null);
  // Rendered segment widths in px — deliberately its own state, not
  // derived inline from `metric`, so the bars already on screen stay put
  // until an effect below explicitly decides to move them. That's what
  // lets a metric switch zero everything out and redraw it, instead of
  // the new target width just appearing on the very next render.
  const [widths, setWidths] = useState<Record<RowId, Segments> | null>(null);
  // Whether the width transition is active, and how long it runs — off
  // (and instant) only for the one frame where the entrance animation
  // snaps every segment to zero, so that lands as a real paint rather
  // than kicking off its own animated shrink that the "grow to target"
  // update would interrupt partway through.
  const [animateWidth, setAnimateWidth] = useState(false);
  const [transitionMs, setTransitionMs] = useState(ENTRANCE_MS);
  // Whether the one-time left-to-right draw-in has already played —
  // every metric change after that just repositions the existing bars.
  const hasEnteredRef = useRef(false);

  const cardRef = useRef<HTMLDivElement>(null);
  const { ref: plotRef, width: plotWidth } = useElementWidth<HTMLDivElement>();

  const calculatingIds = useMemo(() => new Set(benchmarks.filter((b) => b.calculating).map((b) => b.id)), [benchmarks]);
  // Signature of just the fields that change how the chart should render
  // each custom row — lets the effect below react to a benchmark being
  // added or finishing calculation without re-running on every unrelated
  // App-level render.
  const customRowsSignature = benchmarks.map((b) => `${b.id}:${b.calculating ? 1 : 0}:${b.value}`).join('|');

  const data = useMemo(
    () =>
      withCustomRows(
        metric,
        METRIC_DATA[metric],
        benchmarks.map((b) => ({ id: b.id, label: b.name, value: b.value, calculating: !!b.calculating })),
      ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [metric, customRowsSignature],
  );
  const rangeLabel = DATE_RANGES.find((r) => r.id === dateRange)?.label ?? 'Past year';
  const workspaceRow = data.rows.find((r) => r.isWorkspace)!;
  const ticks = getTicks(data.axisMax, data.axisStep);

  // Fires once the plot area's width is first measurable, and again on
  // any later resize. The very first time, it plays the entrance draw-in
  // (zero → real, transition off then on); every time after that — pure
  // container resizes, since metric changes are handled by the effect
  // below — it just keeps the bars in sync with the new pixel scale.
  useEffect(() => {
    if (plotWidth === 0) return;

    if (!hasEnteredRef.current) {
      hasEnteredRef.current = true;
      setAnimateWidth(false);
      setWidths(zeroWidths(data));
      // A nested double-rAF is the usual trick for this, but it isn't
      // reliable here — browsers are free to run a rAF callback's own
      // nested rAF request within the very same frame if the page is
      // catching up on a missed one, which collapses both steps into a
      // single paint. A real-time timeout doesn't have that failure
      // mode: the zero-width, transition-off frame is guaranteed to
      // actually paint before this fires.
      const timer = setTimeout(() => {
        setTransitionMs(ENTRANCE_MS);
        setAnimateWidth(true);
        setWidths(computeWidths(data, plotWidth));
      }, 50);
      return () => clearTimeout(timer);
    }

    setTransitionMs(REPOSITION_MS);
    setAnimateWidth(true);
    setWidths(computeWidths(data, plotWidth));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [plotWidth]);

  // Switching metrics never replays the draw-in — the entrance effect
  // above owns that, once. This just smoothly repositions and resizes
  // every segment from wherever it currently is to its new target.
  useEffect(() => {
    if (!hasEnteredRef.current || plotWidth === 0) return;
    setHovered(null);
    setTooltip(null);
    setTransitionMs(REPOSITION_MS);
    setAnimateWidth(true);
    setWidths(computeWidths(data, plotWidth));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [metric]);

  // A benchmark being added (zeroed-out while calculating) or finishing
  // calculation (its real segments appearing for the first time) both
  // just reposition/resize in place, same as a metric change — the real
  // segments are mounted at width 0 the whole time it's calculating (see
  // the calculating-row placeholder below), so this is a genuine 0→target
  // grow, not a pop-in.
  useEffect(() => {
    if (!hasEnteredRef.current || plotWidth === 0) return;
    setTransitionMs(REPOSITION_MS);
    setAnimateWidth(true);
    setWidths(computeWidths(data, plotWidth));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [customRowsSignature]);

  function pxFor(value: number): number {
    if (plotWidth === 0) return 0;
    return (value / data.axisMax) * plotWidth;
  }

  function handleEnter(e: React.MouseEvent<HTMLDivElement>, row: MetricRowData, key: SegmentKey) {
    setHovered({ rowId: row.rowId, key });
    const segRect = e.currentTarget.getBoundingClientRect();
    const cardRect = cardRef.current?.getBoundingClientRect();
    if (!cardRect) return;
    const segmentInfo = SEGMENTS.find((s) => s.key === key)!;
    setTooltip({
      x: segRect.left - cardRect.left + segRect.width / 2,
      y: segRect.top - cardRect.top,
      rowLabel: row.label,
      isWorkspaceRow: row.isWorkspace,
      segmentKey: key,
      segmentLabel: segmentInfo.label,
      value: row.segments[key],
      workspaceValue: workspaceRow.segments[key],
    });
  }

  function handleLeave() {
    setHovered(null);
    setTooltip(null);
  }

  return (
    <section ref={cardRef} className="relative p-5">
      <ChartTooltip tooltip={tooltip} />

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-1.5">
          <h2 className="font-heading text-lg font-bold text-[var(--color-foreground)]">Workspace performance</h2>
          <InfoTooltip />
        </div>
        <div className="flex items-center gap-3">
          <Dropdown
            options={DATE_RANGES}
            selectedId={dateRange}
            onSelect={setDateRange}
            trigger={(open) => <CaretTrigger label={rangeLabel} open={open} />}
          />
          <ExportButton />
        </div>
      </div>

      <div className="mt-3">
        <MetricTabs active={metric} onChange={setMetric} />
      </div>

      <div className="mt-4 flex">
        {/* Row labels */}
        <div className="flex w-[180px] shrink-0 flex-col pr-3" style={{ gap: ROW_GAP }}>
          {data.rows.map((row) => (
            <div
              key={row.rowId}
              className={cn(
                'flex items-center text-sm font-semibold',
                calculatingIds.has(row.rowId) ? 'text-[var(--color-muted-foreground)]' : 'text-[var(--color-foreground)]',
              )}
              style={{ height: rowHeight(row.isWorkspace) }}
            >
              {row.label}
            </div>
          ))}
        </div>

        {/* Plot area */}
        <div className="relative min-w-0 flex-1" ref={plotRef}>
          {/* Gridlines span the full row stack height */}
          <div className="pointer-events-none absolute inset-0" aria-hidden>
            {ticks.map((tick) =>
              tick === 0 ? null : (
                <div
                  key={tick}
                  className="absolute top-0 bottom-0 border-l border-dashed border-gray-200"
                  style={{ left: pxFor(tick) }}
                />
              ),
            )}
            <div className="absolute top-0 bottom-0 left-0 w-px bg-gray-300" />
          </div>

          <div className="relative flex flex-col" style={{ gap: ROW_GAP }}>
            {data.rows.map((row) => {
              const calculatingRow = calculatingIds.has(row.rowId);
              return (
                <div key={row.rowId} className="flex items-center" style={{ height: rowHeight(row.isWorkspace) }}>
                  <div
                    className="relative flex h-full shrink-0 overflow-visible"
                    // The mounted-at-0 real segments contribute nothing to
                    // flow width, and the placeholder below is positioned
                    // absolutely so it wouldn't reserve any either — without
                    // this, the "Calculating…" label butts up against (and
                    // overlaps) the placeholder instead of sitting after it.
                    style={{ gap: 1, width: calculatingRow ? 28 : undefined }}
                    onMouseLeave={handleLeave}
                  >
                    {SEGMENTS.map((seg, i) => (
                      <div
                        key={seg.key}
                        onMouseEnter={calculatingRow ? undefined : (e) => handleEnter(e, row, seg.key)}
                        className={cn('h-full', calculatingRow ? undefined : 'cursor-pointer')}
                        style={{
                          // Kept mounted at 0 width the whole time a row is
                          // calculating (rather than skipping render) so
                          // that once it's ready, the width transition has
                          // a real 0 to grow from instead of popping in.
                          width: calculatingRow ? 0 : (widths?.[row.rowId]?.[seg.key] ?? 0),
                          backgroundColor: segmentColor(row.rowId, row.isWorkspace, seg.key, hovered),
                          // Only the final segment gets rounded — and only on
                          // its outer (right-hand) corners — every other
                          // segment, and the left/inner corners of this one,
                          // stay perfectly square. This is a fixed property of
                          // the segment's position in the stack, not state,
                          // so it's unaffected by hover or the width/colour
                          // transitions below.
                          borderTopRightRadius: i === SEGMENTS.length - 1 ? 4 : 0,
                          borderBottomRightRadius: i === SEGMENTS.length - 1 ? 4 : 0,
                          transition: animateWidth
                            ? `width ${transitionMs}ms ${EASE}, background-color 150ms ease`
                            : 'background-color 150ms ease',
                        }}
                      />
                    ))}
                    {calculatingRow ? (
                      <div className="absolute inset-y-0 left-0 w-7 rounded-r-[4px] bg-gray-300" aria-hidden />
                    ) : null}
                  </div>
                  {calculatingRow ? (
                    <span className="ml-2 text-sm font-medium text-[var(--color-muted-foreground)]">Calculating…</span>
                  ) : (
                    <span
                      className={cn(
                        'ml-2 font-bold tabular-nums text-[var(--color-foreground)]',
                        row.isWorkspace ? 'text-xl' : 'text-base',
                      )}
                    >
                      {row.total.toLocaleString()}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* X-axis */}
      <div className="mt-2 flex">
        <div className="w-[180px] shrink-0" />
        <div className="relative h-5 flex-1">
          {ticks.map((tick) => (
            <span
              key={tick}
              className="absolute -translate-x-1/2 text-xs text-[var(--color-muted-foreground)]"
              style={{ left: pxFor(tick) }}
            >
              {tick.toLocaleString()}
            </span>
          ))}
        </div>
      </div>
      <div className="flex">
        <div className="w-[180px] shrink-0" />
        <p className="flex-1 text-center text-xs text-[var(--color-muted-foreground)]">{METRICS.find((m) => m.id === metric)?.axisLabel}</p>
      </div>

      {/* Legend */}
      <div className="mt-4 flex flex-wrap justify-center gap-x-5 gap-y-2 border-t border-[var(--color-border)] pt-4">
        {SEGMENTS.map((seg) => (
          <div key={seg.key} className="flex items-center gap-1.5">
            <span className="size-3 shrink-0 rounded-full" style={{ backgroundColor: seg.color }} />
            <span className="text-sm font-medium text-[var(--color-foreground)]">{seg.label}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

function InfoTooltip() {
  return (
    <div className="group relative inline-flex">
      <Info className="size-4 text-[var(--color-muted-foreground)]" />
      <div className="pointer-events-none absolute bottom-full left-1/2 mb-2 w-64 -translate-x-1/2 rounded-lg bg-gray-900 px-3 py-2 text-xs leading-relaxed text-white opacity-0 shadow-xl transition-opacity duration-150 group-hover:opacity-100">
        Shows how your workspace's research output compares to benchmarks across key metrics over the selected time period.
        <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-900" />
      </div>
    </div>
  );
}
