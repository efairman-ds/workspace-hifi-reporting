import type { MetricChartData, RowId, Segments } from '@/data/dashboard';

/** Pure chart-geometry math shared by the live on-screen chart
 *  (`PerformanceChart.tsx`) and the PDF export's vector redraw
 *  (`src/pdf/components/BarChart.tsx`) — moved here verbatim so both
 *  can never silently compute a different layout for the same data. */

export function getTicks(axisMax: number, axisStep: number): number[] {
  const ticks: number[] = [];
  for (let t = 0; t <= axisMax; t += axisStep) ticks.push(t);
  return ticks;
}

export function computeWidths(data: MetricChartData, plotWidth: number): Record<RowId, Segments> {
  const result = {} as Record<RowId, Segments>;
  for (const row of data.rows) {
    result[row.rowId] = {
      reach: (row.segments.reach / data.axisMax) * plotWidth,
      engagement: (row.segments.engagement / data.axisMax) * plotWidth,
      impact: (row.segments.impact / data.axisMax) * plotWidth,
      scientific: (row.segments.scientific / data.axisMax) * plotWidth,
    };
  }
  return result;
}
