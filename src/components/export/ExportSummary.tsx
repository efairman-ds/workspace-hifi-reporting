import { estimateExport } from '@/data/report/estimate';

/** Export summary block — format/size/time/workspace name/description.
 *  Size and time are always a range (never a fabricated precise number),
 *  recomputed live from the current section selection. */
export function ExportSummary({ workspaceName, selectedIds }: { workspaceName: string; selectedIds: Set<string> }) {
  const { sizeLabel, timeLabel } = estimateExport(selectedIds);

  return (
    <div className="flex flex-col gap-2 rounded-lg border border-[var(--color-border)] bg-gray-50 p-4">
      <SummaryRow label="File format" value="PDF" />
      <SummaryRow label="Workspace" value={workspaceName} />
      <SummaryRow label="Estimated file size" value={sizeLabel} />
      <SummaryRow label="Estimated processing time" value={timeLabel} />
      <p className="mt-1 text-xs leading-relaxed text-[var(--color-muted-foreground)]">
        The report will contain the selected workspace information, publication performance and benchmarking data below.
      </p>
    </div>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="text-sm text-[var(--color-muted-foreground)]">{label}</span>
      <span className="text-sm font-semibold text-[var(--color-foreground)]">{value}</span>
    </div>
  );
}
