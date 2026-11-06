import { pdf } from '@react-pdf/renderer';
import type { ReportData } from '@/data/report/buildReportData';
import { ReportDocument } from './ReportDocument';
import { reportFilename } from './filename';

/** Wraps `@react-pdf/renderer`'s `pdf(...).toBlob()` — note this gives no
 *  real progress callback, so callers must show an honest indeterminate
 *  processing state rather than a fabricated percentage. */
export async function generateReportPdf(data: ReportData): Promise<{ blob: Blob; filename: string }> {
  const blob = await pdf(<ReportDocument data={data} />).toBlob();
  return { blob, filename: reportFilename(data.workspaceName, data.exportedAt) };
}
