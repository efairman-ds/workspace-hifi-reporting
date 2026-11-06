import type { MetricId } from '@/data/dashboard';

/** The export modal's static section tree. Only `workspace_performance`
 *  nests — its 4 children are the same `MetricId`s the live chart
 *  already switches between, so a leaf id always doubles as a real
 *  metric id with no translation layer. */

export interface ReportSectionLeaf {
  id: MetricId;
  label: string;
}

export interface ReportSection {
  id: string;
  label: string;
  children?: ReportSectionLeaf[];
}

export const PERFORMANCE_LEAVES: ReportSectionLeaf[] = [
  { id: 'total_mentions', label: 'Total Mentions' },
  { id: 'altmetric_score', label: 'Altmetric Score' },
  { id: 'citations', label: 'Citations' },
  { id: 'clinical_guidelines', label: 'Clinical Guidelines Citations' },
];

export const REPORT_SECTIONS: ReportSection[] = [
  { id: 'workspace_overview', label: 'Workspace overview' },
  { id: 'executive_summary', label: 'Executive summary' },
  { id: 'workspace_performance', label: 'Workspace performance', children: PERFORMANCE_LEAVES },
  { id: 'benchmarks', label: 'Benchmarks' },
  { id: 'publications', label: 'Publications' },
  { id: 'metric_breakdowns', label: 'Metric breakdowns and supporting data' },
  { id: 'methodology', label: 'Methodology and data sources' },
];

/** Every individually-toggleable leaf id across the whole tree — a
 *  top-level section with no children is itself a leaf (it has nothing
 *  finer-grained to select), `workspace_performance`'s 4 metrics are
 *  the only "real" nested leaves. */
export const ALL_LEAF_IDS: string[] = REPORT_SECTIONS.flatMap((s) => (s.children ? s.children.map((c) => c.id) : [s.id]));
