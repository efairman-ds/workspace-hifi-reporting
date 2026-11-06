import {
  BENCHMARKS as DEFAULT_BENCHMARKS,
  DOMAIN_CARDS,
  METRICS,
  METRIC_DATA,
  PERFORMANCE_SNAPSHOT,
  PUBLICATIONS,
  SEGMENTS,
  withCustomRows,
  type BenchmarkEntry,
  type MetricChartData,
  type MetricId,
  type Publication,
} from '@/data/dashboard';

/** The only seam between live app state and the PDF presentation layer —
 *  `src/pdf/**` never imports `@/data/dashboard` directly. Pulls exactly
 *  the real data the selected sections need and nothing else; omitted
 *  sections cost nothing to compute. */

export interface ReportData {
  workspaceName: string;
  exportedAt: Date;
  selectedLeafIds: Set<string>;
  publications: Publication[];
  benchmarks: BenchmarkEntry[]; // excludes any still-`calculating` entries
  calculatingCount: number;
  performanceSnapshot: typeof PERFORMANCE_SNAPSHOT;
  domainCards: typeof DOMAIN_CARDS;
  /** One chart dataset per selected performance metric, in the fixed
   *  METRICS order — never combined into a single chart. */
  performanceCharts: { metric: MetricId; label: string; axisLabel: string; data: MetricChartData }[];
}

// No "current workspace" object exists anywhere in the data layer (the
// title is a hardcoded string in WorkspaceHeader.tsx) — reproduced
// verbatim here rather than inventing a workspace model that doesn't exist.
const WORKSPACE_NAME = 'Oncology workspace';

export function buildReportData(selectedLeafIds: Set<string>, benchmarks: BenchmarkEntry[] = DEFAULT_BENCHMARKS): ReportData {
  const activeBenchmarks = benchmarks.filter((b) => !b.calculating);
  const calculatingCount = benchmarks.length - activeBenchmarks.length;

  const performanceCharts = METRICS.filter((m) => selectedLeafIds.has(m.id)).map((m) => ({
    metric: m.id,
    label: m.label,
    axisLabel: m.axisLabel,
    data: withCustomRows(
      m.id,
      METRIC_DATA[m.id],
      activeBenchmarks.map((b) => ({ id: b.id, label: b.name, value: b.value, calculating: false })),
    ),
  }));

  return {
    workspaceName: WORKSPACE_NAME,
    exportedAt: new Date(),
    selectedLeafIds,
    publications: PUBLICATIONS,
    benchmarks: activeBenchmarks,
    calculatingCount,
    performanceSnapshot: PERFORMANCE_SNAPSHOT,
    domainCards: DOMAIN_CARDS,
    performanceCharts,
  };
}

export { SEGMENTS };
