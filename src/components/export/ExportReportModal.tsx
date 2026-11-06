import { useState } from 'react';
import type { BenchmarkEntry } from '@/data/dashboard';
import { buildReportData } from '@/data/report/buildReportData';
import { generateReportPdf } from '@/pdf/generate';
import { Modal } from '../common/Modal';
import { ExportSummary } from './ExportSummary';
import { SectionTree } from './SectionTree';
import { ExportProcessingState } from './ExportProcessingState';
import { ExportCompleteState } from './ExportCompleteState';
import { ExportErrorState } from './ExportErrorState';
import { useExportSectionSelection } from './useExportSectionSelection';

type Stage = 'configure' | 'processing' | 'success' | 'error';

const WORKSPACE_NAME = 'Oncology workspace';

// Demo requirement: the processing state must stay visible for at least
// this long regardless of how fast real generation finishes — never by
// faking progress, just by holding the same indeterminate state a little
// longer before revealing a genuine result. If generation takes longer
// than this, it's never cut short — this is a floor, not a fixed delay.
const MIN_PROCESSING_MS = 3000;

function waitRemaining(startedAt: number): Promise<void> {
  const remaining = Math.max(0, MIN_PROCESSING_MS - (Date.now() - startedAt));
  return new Promise((resolve) => setTimeout(resolve, remaining));
}

export function ExportReportModal({ open, onClose, benchmarks }: { open: boolean; onClose: () => void; benchmarks: BenchmarkEntry[] }) {
  const { selectedIds, toggle } = useExportSectionSelection();
  const [stage, setStage] = useState<Stage>('configure');
  const [result, setResult] = useState<{ blob: Blob; filename: string } | null>(null);

  async function runExport() {
    setStage('processing');
    const startedAt = Date.now();
    const data = buildReportData(new Set(selectedIds), benchmarks);
    try {
      const generated = await generateReportPdf(data);
      await waitRemaining(startedAt);
      setResult(generated);
      setStage('success');
    } catch {
      await waitRemaining(startedAt);
      setStage('error');
    }
  }

  function handleClose() {
    onClose();
    // Deferred so the modal doesn't visibly reset mid-close-transition —
    // same pattern as CreateBenchmarkFlyout's handleClose.
    setTimeout(() => {
      setStage('configure');
      setResult(null);
    }, 250);
  }

  const noSectionsSelected = selectedIds.size === 0;

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title="Export workspace report"
      description={stage === 'configure' ? 'Choose what to include before generating a PDF report.' : undefined}
      footer={
        stage === 'configure' ? (
          <div className="flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={handleClose}
              className="rounded-md border border-[var(--color-border)] px-4 py-2 text-sm font-semibold text-[var(--color-foreground)] transition-colors hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={runExport}
              disabled={noSectionsSelected}
              className="rounded-md bg-[var(--color-primary)] px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-[var(--color-primary-hover)] disabled:cursor-not-allowed disabled:bg-gray-200 disabled:text-[var(--color-muted-foreground)]"
            >
              Export PDF Report
            </button>
          </div>
        ) : stage === 'success' ? (
          <div className="flex items-center justify-end">
            <button
              type="button"
              onClick={handleClose}
              className="rounded-md border border-[var(--color-border)] px-4 py-2 text-sm font-semibold text-[var(--color-foreground)] transition-colors hover:bg-gray-50"
            >
              Close
            </button>
          </div>
        ) : undefined
      }
    >
      {stage === 'configure' ? (
        <div className="flex flex-col gap-5">
          <ExportSummary workspaceName={WORKSPACE_NAME} selectedIds={selectedIds} />
          <div>
            <p className="mb-2 text-sm font-semibold text-[var(--color-foreground)]">Report contents</p>
            <SectionTree selectedIds={selectedIds} onToggle={toggle} />
          </div>
        </div>
      ) : stage === 'processing' ? (
        <ExportProcessingState />
      ) : stage === 'success' && result ? (
        <ExportCompleteState blob={result.blob} filename={result.filename} />
      ) : (
        <ExportErrorState onRetry={runExport} />
      )}
    </Modal>
  );
}
