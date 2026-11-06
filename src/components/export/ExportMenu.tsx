import { useState } from 'react';
import { Download } from 'lucide-react';
import type { BenchmarkEntry } from '@/data/dashboard';
import { Dropdown } from '../common/Dropdown';
import { ExportReportModal } from './ExportReportModal';

const FORMATS = [
  { id: 'pdf', label: 'PDF Report (.pdf)' },
  { id: 'ppt', label: 'PowerPoint (.ppt)', disabled: true, caption: 'Coming soon' },
];

/** Header entry point — matches the existing decorative `ExportButton`'s
 *  exact styling (same classes), but this one is real: selecting "PDF
 *  Report" opens the export configuration modal. */
export function ExportMenu({ benchmarks }: { benchmarks: BenchmarkEntry[] }) {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <>
      <Dropdown
        options={FORMATS}
        panelWidthClassName="w-72"
        onSelect={(id) => {
          if (id === 'pdf') setModalOpen(true);
        }}
        trigger={(open) => (
          <span
            className={`flex items-center gap-1.5 rounded-md border border-[var(--color-border)] bg-transparent px-3 py-1.5 text-sm font-medium text-[var(--color-foreground)] transition-colors hover:bg-gray-50 ${
              open ? 'bg-gray-50' : ''
            }`}
          >
            <Download className="size-3.5" />
            Export
          </span>
        )}
      />
      <ExportReportModal open={modalOpen} onClose={() => setModalOpen(false)} benchmarks={benchmarks} />
    </>
  );
}
