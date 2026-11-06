/** Single source of truth for the downloaded report's filename —
 *  sanitized workspace name + export date, e.g.
 *  "Oncology-Workspace-2026-11-06-Report.pdf". */
export function reportFilename(workspaceName: string, exportedAt: Date): string {
  const safeName = workspaceName
    .trim()
    .replace(/[^a-zA-Z0-9\s-]/g, '')
    .replace(/\s+/g, '-');
  const date = exportedAt.toISOString().slice(0, 10);
  return `${safeName}-${date}-Report.pdf`;
}
