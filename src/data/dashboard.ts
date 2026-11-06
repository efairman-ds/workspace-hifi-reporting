// All dummy data for the prototype lives here, kept deliberately separate
// from the components that render it (see project brief, "keep chart data
// separate from presentation"). Where the reference screenshots show an
// explicit number (performance snapshot, domain breakdowns, benchmark
// card values) it's reproduced exactly; everywhere else a consistent,
// derived "realistic dummy data" value is computed instead of invented
// per metric, so the four metrics never silently disagree with each other.

export type SegmentKey = 'reach' | 'engagement' | 'impact' | 'scientific';

export interface SegmentInfo {
  key: SegmentKey;
  label: string;
  color: string;
}

export const SEGMENTS: SegmentInfo[] = [
  { key: 'reach', label: 'Reach', color: '#2bb0e6' },
  { key: 'engagement', label: 'Engagement', color: '#e3488f' },
  { key: 'impact', label: 'Impact', color: '#5b4ae6' },
  { key: 'scientific', label: 'Scientific Impact', color: '#f1a644' },
];

export type Segments = Record<SegmentKey, number>;

export type MetricId = 'total_mentions' | 'altmetric_score' | 'citations' | 'clinical_guidelines';

export const METRICS: { id: MetricId; label: string; axisLabel: string }[] = [
  { id: 'total_mentions', label: 'Total mentions', axisLabel: 'Total mentions (mean)' },
  { id: 'altmetric_score', label: 'Altmetric score', axisLabel: 'Altmetric score (mean)' },
  { id: 'citations', label: 'Citations', axisLabel: 'Citations (mean)' },
  { id: 'clinical_guidelines', label: 'Clinical guidelines citations', axisLabel: 'Clinical guideline citations (mean)' },
];

// A plain string, not a closed union, because user-created benchmarks
// (see `withCustomRows` below) add their own row ids at runtime —
// 'workspace_library' etc. are still the only ids CHART_ROWS itself uses.
export type RowId = string;

export interface ChartRow {
  id: RowId;
  label: string;
  isWorkspace: boolean;
}

export const CHART_ROWS: ChartRow[] = [
  { id: 'workspace_library', label: 'Workspace library performance', isWorkspace: true },
  { id: 'competitor_average', label: 'Competitor average', isWorkspace: false },
  { id: 'top_quartile', label: 'Top-quartile', isWorkspace: false },
  { id: 'oncology_average', label: 'Oncology average', isWorkspace: false },
];

// Segment *shape* (proportions of the row's total) for "Total mentions" —
// the only metric with directly-sourced numbers (workspace library's
// segments are taken straight from the "Total mentions across domains"
// section: Engagement 920, Impact 540, Scientific Impact 260, with Reach
// as the remainder of the 2900 total). The other three rows' shapes are
// read off the reference chart's relative segment widths.
const TOTAL_MENTIONS_SEGMENTS: Record<RowId, Segments> = {
  workspace_library: { reach: 1180, engagement: 920, impact: 540, scientific: 260 }, // sums to 2900
  competitor_average: { reach: 1850, engagement: 480, impact: 560, scientific: 260 }, // sums to 3150
  top_quartile: { reach: 900, engagement: 120, impact: 1000, scientific: 330 }, // sums to 2350
  oncology_average: { reach: 300, engagement: 900, impact: 740, scientific: 260 }, // sums to 2200
};

type ShapeTuple = readonly [number, number, number, number]; // [reach, engagement, impact, scientific], each sums to 1

// Each metric gets its own segment *shape*, not just Total mentions'
// shape rescaled — otherwise switching metrics would only ever change
// the bars' length, never which channel dominates them. The shapes below
// are chosen to match what each metric actually measures: Altmetric score
// skews toward Engagement (it's largely social-mention-driven), Citations
// and Clinical guidelines citations skew toward Scientific Impact and
// Impact respectively, since that's literally what those domains count.
const METRIC_SHAPES: Record<Exclude<MetricId, 'total_mentions'>, Record<RowId, ShapeTuple>> = {
  altmetric_score: {
    workspace_library: [0.2, 0.55, 0.15, 0.1],
    competitor_average: [0.25, 0.5, 0.15, 0.1],
    top_quartile: [0.15, 0.6, 0.15, 0.1],
    oncology_average: [0.1, 0.65, 0.15, 0.1],
  },
  citations: {
    workspace_library: [0.1, 0.1, 0.2, 0.6],
    competitor_average: [0.12, 0.08, 0.25, 0.55],
    top_quartile: [0.08, 0.07, 0.25, 0.6],
    oncology_average: [0.15, 0.1, 0.2, 0.55],
  },
  clinical_guidelines: {
    workspace_library: [0.1, 0.1, 0.65, 0.15],
    competitor_average: [0.12, 0.13, 0.6, 0.15],
    top_quartile: [0.08, 0.07, 0.7, 0.15],
    oncology_average: [0.15, 0.15, 0.55, 0.15],
  },
};

function segmentsFromShape(shape: ShapeTuple, targetTotal: number): Segments {
  const raw = shape.map((p) => Math.round(p * targetTotal));
  // Rounding four independent proportions can land a point or two off the
  // target sum — absorbed by the largest segment, same as elsewhere.
  const drift = targetTotal - raw.reduce((a, b) => a + b, 0);
  raw[raw.indexOf(Math.max(...raw))] += drift;
  return { reach: raw[0], engagement: raw[1], impact: raw[2], scientific: raw[3] };
}

// Workspace library's real value for each metric (performance snapshot) —
// used to derive that metric's ratio to Total mentions, then applied
// uniformly to the other three rows so every metric stays internally
// consistent with the one we have real numbers for.
const WORKSPACE_LIBRARY_METRIC_TOTALS: Record<MetricId, number> = {
  total_mentions: 2900,
  altmetric_score: 1480,
  citations: 620,
  clinical_guidelines: 240,
};

function segmentTotal(segments: Segments): number {
  return segments.reach + segments.engagement + segments.impact + segments.scientific;
}

export interface MetricRowData {
  rowId: RowId;
  label: string;
  isWorkspace: boolean;
  segments: Segments;
  total: number;
}

export interface MetricChartData {
  metric: MetricId;
  axisMax: number;
  axisStep: number;
  rows: MetricRowData[];
}

function buildMetricData(metric: MetricId): MetricChartData {
  const ratio = WORKSPACE_LIBRARY_METRIC_TOTALS[metric] / WORKSPACE_LIBRARY_METRIC_TOTALS.total_mentions;
  const rows: MetricRowData[] = CHART_ROWS.map((row) => {
    if (metric === 'total_mentions') {
      const segments = TOTAL_MENTIONS_SEGMENTS[row.id];
      return { rowId: row.id, label: row.label, isWorkspace: row.isWorkspace, segments, total: segmentTotal(segments) };
    }
    const baseTotal = segmentTotal(TOTAL_MENTIONS_SEGMENTS[row.id]);
    const targetTotal = Math.round(baseTotal * ratio);
    const segments = segmentsFromShape(METRIC_SHAPES[metric][row.id], targetTotal);
    return { rowId: row.id, label: row.label, isWorkspace: row.isWorkspace, segments, total: segmentTotal(segments) };
  });

  const highest = Math.max(...rows.map((r) => r.total));
  const { axisMax, axisStep } = niceAxis(highest);
  return { metric, axisMax, axisStep, rows };
}

function niceAxis(highest: number): { axisMax: number; axisStep: number } {
  // Headroom above the longest bar, then a classic "nice numbers" tick
  // step (1/2/2.5/5 x 10^k) aiming for ~7 gridlines — mirrors the
  // reference chart's 0..4000 / 500 axis for Total mentions.
  const target = highest * 1.2;
  const rawStep = target / 8;
  const magnitude = 10 ** Math.floor(Math.log10(rawStep));
  const normalised = rawStep / magnitude;
  const niceNormalised = [1, 2, 2.5, 5, 10].find((n) => n >= normalised) ?? 10;
  const step = niceNormalised * magnitude;
  const max = Math.ceil(target / step) * step;
  return { axisMax: max, axisStep: step };
}

export const METRIC_DATA: Record<MetricId, MetricChartData> = {
  total_mentions: buildMetricData('total_mentions'),
  altmetric_score: buildMetricData('altmetric_score'),
  citations: buildMetricData('citations'),
  clinical_guidelines: buildMetricData('clinical_guidelines'),
};

// A single shape for every user-created benchmark — there's no real
// per-criteria breakdown to read off a reference chart for these, unlike
// the four fixed rows above, so one representative skew stands in for
// all of them rather than inventing a distinct one per benchmark.
const CUSTOM_ROW_SHAPE: ShapeTuple = [0.42, 0.2, 0.26, 0.12];

export interface CustomBenchmarkRow {
  id: string;
  label: string;
  /** The row's Total-mentions-equivalent value — same baseline the four
   *  fixed rows' `value`s represent — scaled per metric the same way. */
  value: number;
  calculating: boolean;
}

/** Merges user-created benchmarks into a metric's chart data as extra
 *  rows. A still-calculating row gets a zeroed-out total (so it can't
 *  stretch the axis before its real value is known) and is rendered as
 *  a placeholder by the chart itself, not by faking its data here.
 *  Benchmarks whose id already matches one of the chart's own fixed rows
 *  (the three seeded entries below share ids with CHART_ROWS precisely so
 *  this can detect them) are skipped — they're already rendered natively,
 *  and adding them again would duplicate the row. */
export function withCustomRows(metric: MetricId, data: MetricChartData, customRows: CustomBenchmarkRow[]): MetricChartData {
  const existingIds = new Set(data.rows.map((r) => r.rowId));
  const newRows = customRows.filter((r) => !existingIds.has(r.id));
  if (newRows.length === 0) return data;
  const ratio = WORKSPACE_LIBRARY_METRIC_TOTALS[metric] / WORKSPACE_LIBRARY_METRIC_TOTALS.total_mentions;
  const extraRows: MetricRowData[] = newRows.map((row) => {
    if (row.calculating) {
      return { rowId: row.id, label: row.label, isWorkspace: false, segments: { reach: 0, engagement: 0, impact: 0, scientific: 0 }, total: 0 };
    }
    const targetTotal = metric === 'total_mentions' ? row.value : Math.round(row.value * ratio);
    const segments = segmentsFromShape(CUSTOM_ROW_SHAPE, targetTotal);
    return { rowId: row.id, label: row.label, isWorkspace: false, segments, total: segmentTotal(segments) };
  });

  const rows = [...data.rows, ...extraRows];
  const highest = Math.max(...rows.map((r) => r.total));
  const { axisMax, axisStep } = niceAxis(highest);
  return { metric: data.metric, axisMax, axisStep, rows };
}

// ---------------------------------------------------------------------
// Top performing publications
// ---------------------------------------------------------------------

export interface Publication {
  id: string;
  title: string;
  year: number;
  journal: string;
  organisations: { name: string; extra: number; icon: 'building' | 'school' }[];
  altmetric: number;
  citations: number;
}

export const PUBLICATIONS: Publication[] = [
  {
    id: 'pub-1',
    title: 'Dabrafenib in Patients with BRAF V600E–Mutant Advanced NSCLC',
    year: 2015,
    journal: 'New England Journal of Medicine',
    organisations: [
      { name: 'Cancer Research UK', extra: 3, icon: 'building' },
      { name: 'Harvard Medical School', extra: 3, icon: 'school' },
    ],
    altmetric: 3450,
    citations: 3450,
  },
  {
    id: 'pub-2',
    title: 'Real-World Outcomes of First-Line Pembrolizumab in Advanced Non–Small Cell Lung Cancer',
    year: 2023,
    journal: 'The Lancet Oncology',
    organisations: [
      { name: 'Cancer Research UK', extra: 3, icon: 'building' },
      { name: 'Harvard Medical School', extra: 3, icon: 'school' },
    ],
    altmetric: 3200,
    citations: 3200,
  },
  {
    id: 'pub-3',
    title: 'Osimertinib as Adjuvant Therapy in EGFR-Mutated Resected Non-Small Cell Lung Cancer',
    year: 2021,
    journal: 'New England Journal of Medicine',
    organisations: [
      { name: 'Memorial Sloan Kettering', extra: 2, icon: 'building' },
      { name: 'University of Oxford', extra: 4, icon: 'school' },
    ],
    altmetric: 2870,
    citations: 2910,
  },
  {
    id: 'pub-4',
    title: 'Atezolizumab Plus Chemotherapy in Extensive-Stage Small-Cell Lung Cancer',
    year: 2018,
    journal: 'The Lancet Oncology',
    organisations: [
      { name: 'Dana-Farber Cancer Institute', extra: 1, icon: 'building' },
      { name: 'Johns Hopkins University', extra: 2, icon: 'school' },
    ],
    altmetric: 2340,
    citations: 2510,
  },
  {
    id: 'pub-5',
    title: 'Five-Year Survival Outcomes with Nivolumab in Advanced Melanoma',
    year: 2020,
    journal: 'Journal of Clinical Oncology',
    organisations: [
      { name: 'MD Anderson Cancer Center', extra: 2, icon: 'building' },
      { name: 'Karolinska Institute', extra: 1, icon: 'school' },
    ],
    altmetric: 1980,
    citations: 2110,
  },
];

// ---------------------------------------------------------------------
// Benchmarks card
// ---------------------------------------------------------------------

export interface BenchmarkEntry {
  id: string;
  name: string;
  value: number;
  description: string;
  savedAt: string;
  /** True for a newly created benchmark whose performance data is still
   *  being processed — see `withCustomRows` and the Benchmarks card. */
  calculating?: boolean;
}

// Ids deliberately match CHART_ROWS' ids (see `withCustomRows`), and
// values are read straight off those same rows' Total mentions totals —
// so the card can never drift out of sync with what the graph shows.
export const BENCHMARKS: BenchmarkEntry[] = [
  {
    id: 'competitor_average',
    name: 'Competitor average',
    value: segmentTotal(TOTAL_MENTIONS_SEGMENTS.competitor_average),
    description: 'Astrazeneca, Keytruda, Roche (+3 more)',
    savedAt: '2026-08-13',
  },
  {
    id: 'top_quartile',
    name: 'Top-quartile',
    value: segmentTotal(TOTAL_MENTIONS_SEGMENTS.top_quartile),
    description: 'Multiple Sclerosis, Novartis',
    savedAt: '2026-08-13',
  },
  {
    id: 'oncology_average',
    name: 'Oncology average',
    value: segmentTotal(TOTAL_MENTIONS_SEGMENTS.oncology_average),
    description: 'Chronic Obstructive Pulmonary Disease, Pfizer (+3 more)',
    savedAt: '2026-08-13',
  },
];

// ---------------------------------------------------------------------
// Performance snapshot — identical numbers to the workspace library row
// of each metric, so the two sections of the dashboard never disagree.
// ---------------------------------------------------------------------

export const PERFORMANCE_SNAPSHOT = METRICS.map((m) => ({
  id: m.id,
  label: m.id === 'clinical_guidelines' ? 'Clinical guideline citations' : m.label,
  value: WORKSPACE_LIBRARY_METRIC_TOTALS[m.id],
}));

// ---------------------------------------------------------------------
// Total mentions across domains
// ---------------------------------------------------------------------

export interface DomainChannel {
  label: string;
  icon: 'news' | 'blog' | 'wiki' | 'twitter' | 'bluesky' | 'facebook' | 'reddit' | 'podcast' | 'guidelines' | 'policy' | 'patents' | 'citations' | 'mendeley';
  value: number;
}

export interface DomainCard {
  key: SegmentKey;
  label: string;
  color: string;
  total: number | null;
  channels: DomainChannel[];
}

export const DOMAIN_CARDS: DomainCard[] = [
  {
    key: 'reach',
    label: 'Reach',
    color: '#2bb0e6',
    total: null,
    channels: [
      { label: 'News', icon: 'news', value: 460 },
      { label: 'Blogs', icon: 'blog', value: 360 },
      { label: 'Wikipedia', icon: 'wiki', value: 330 },
    ],
  },
  {
    key: 'engagement',
    label: 'Engagement',
    color: '#e3488f',
    total: 920,
    channels: [
      { label: 'X/Twitter', icon: 'twitter', value: 360 },
      { label: 'Bluesky', icon: 'bluesky', value: 140 },
      { label: 'Facebook', icon: 'facebook', value: 210 },
      { label: 'Reddit', icon: 'reddit', value: 170 },
      { label: 'Podcasts', icon: 'podcast', value: 40 },
    ],
  },
  {
    key: 'impact',
    label: 'Impact',
    color: '#5b4ae6',
    total: 540,
    channels: [
      { label: 'Clinical guidelines', icon: 'guidelines', value: 230 },
      { label: 'Policy', icon: 'policy', value: 180 },
      { label: 'Patents', icon: 'patents', value: 130 },
    ],
  },
  {
    key: 'scientific',
    label: 'Scientific Impact',
    color: '#f1a644',
    total: 260,
    channels: [
      { label: 'Citations', icon: 'citations', value: 200 },
      { label: 'Mendeley', icon: 'mendeley', value: 60 },
    ],
  },
];
