import { Document } from '@react-pdf/renderer';
import type { ReportData } from '@/data/report/buildReportData';
import { CoverPage } from './CoverPage';
import { ExecutiveSummaryPage } from './ExecutiveSummaryPage';
import { WorkspaceOverviewPage } from './WorkspaceOverviewPage';
import { PerformanceChartPage } from './PerformanceChartPage';
import { BenchmarksPage } from './BenchmarksPage';
import { PublicationsPage } from './PublicationsPage';
import { MetricBreakdownPage } from './MetricBreakdownPage';
import { MethodologyPage } from './MethodologyPage';

/** Assembles only the pages for currently-selected sections, in a fixed,
 *  sensible reading order — the cover always renders (it's the report's
 *  identity, not a toggleable section). */
export function ReportDocument({ data }: { data: ReportData }) {
  const has = (id: string) => data.selectedLeafIds.has(id);

  return (
    <Document title={`${data.workspaceName} — Workspace Report`}>
      <CoverPage data={data} />
      {has('executive_summary') ? <ExecutiveSummaryPage data={data} /> : null}
      {has('workspace_overview') ? <WorkspaceOverviewPage data={data} /> : null}
      {data.performanceCharts.map((chart) => (
        <PerformanceChartPage key={chart.metric} data={data} chart={chart} />
      ))}
      {has('benchmarks') ? <BenchmarksPage data={data} /> : null}
      {has('publications') ? <PublicationsPage data={data} /> : null}
      {has('metric_breakdowns') ? <MetricBreakdownPage data={data} /> : null}
      {has('methodology') ? <MethodologyPage data={data} /> : null}
    </Document>
  );
}
