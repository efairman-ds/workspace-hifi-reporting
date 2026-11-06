import { Download } from 'lucide-react';
import { Dropdown } from './Dropdown';

const FORMATS = [
  { id: 'csv', label: 'Export as CSV' },
  { id: 'png', label: 'Export as PNG' },
  { id: 'pdf', label: 'Export as PDF' },
];

export function ExportButton() {
  return (
    <Dropdown
      options={FORMATS}
      onSelect={() => {}}
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
  );
}
