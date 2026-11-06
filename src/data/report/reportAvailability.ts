/** Single source of truth for every gap between what this report's brief
 *  assumes exists and what the app's actual data layer (`@/data/dashboard`)
 *  really contains. Every PDF page that touches one of these fields reads
 *  its note from here instead of a page inventing its own wording — this
 *  is reviewable in one place, and nothing here ever fabricates a number,
 *  a date, or a narrative conclusion the app doesn't actually produce. */

export const REPORT_AVAILABILITY = {
  /** Publication has no authors, DOI, or full publication date (only a
   *  `year`) — the publications table only ever renders real fields. */
  publicationFieldsNote: 'Shown fields reflect what is recorded in Compass: title, year, journal, organisations, Altmetric score and citations.',

  /** The app's date-range selector doesn't filter any underlying data —
   *  confirmed in App.tsx, it only changes a dropdown's own label. The
   *  report must never claim it scoped what's included. */
  reportingPeriodNote: 'This report reflects all available workspace data at the time of export. Compass does not currently apply a reporting-period filter to this data.',

  /** There is no real "last refreshed" timestamp anywhere in the data
   *  layer — the header's "Last updated today" is a static string, not
   *  a tracked value. The report uses its own real export time instead. */
  dataSnapshotNote: (exportedAt: Date) => `Data snapshot captured at export time: ${exportedAt.toLocaleString()}.`,

  /** No methodology, data-source, or data-limitations text exists
   *  anywhere in the app. Only the real, verifiable segment definitions
   *  are described; everything else is explicitly marked unavailable. */
  methodologyUnavailableNote:
    'Compass does not currently provide documented methodology, data-source, or data-limitation statements for this workspace. The definitions below are the only methodology information available within the application.',

  /** Benchmarks have no organisation/category/grouping field on the
   *  saved entry itself — only name, value, description and save date. */
  benchmarkFieldsNote: 'Shown fields reflect what is recorded in Compass for each saved benchmark: name, value, description and date saved.',

  /** There is no "selected publications" or "selected benchmarks"
   *  subset concept anywhere in the app — every publication and every
   *  non-calculating benchmark is simply part of the workspace. */
  noSelectionSubsetNote: 'Compass does not currently support selecting a subset of publications or benchmarks — all items in the workspace are included below.',

  /** Workspace has no description field in the data layer. */
  workspaceDescription: null as string | null,
} as const;

/** Real, verifiable segment definitions this report CAN state — derived
 *  from `DOMAIN_CARDS`' own channel lists (never hand-typed separately,
 *  so this can't silently drift from what the app actually tracks). */
export function segmentDefinition(channels: { label: string }[]): string {
  return `Includes: ${channels.map((c) => c.label).join(', ')}.`;
}
