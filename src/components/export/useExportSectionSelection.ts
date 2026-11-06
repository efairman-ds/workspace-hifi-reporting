import { useState } from 'react';
import { ALL_LEAF_IDS, PERFORMANCE_LEAVES } from '@/data/report/reportSections';

const PERFORMANCE_LEAF_IDS = PERFORMANCE_LEAVES.map((l) => l.id);

/** Flat `Set<string>` of selected leaf ids — same pattern as
 *  `CreateBenchmarkFlyout`'s `toggle()`: toggling the "Workspace
 *  performance" parent toggles its 4 metric leaves together; the
 *  parent's own check-state is always *derived*, never stored. */
export function useExportSectionSelection() {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set(ALL_LEAF_IDS));

  function toggle(id: string) {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (id === 'workspace_performance') {
        const allSelected = PERFORMANCE_LEAF_IDS.every((leafId) => next.has(leafId));
        for (const leafId of PERFORMANCE_LEAF_IDS) {
          if (allSelected) next.delete(leafId);
          else next.add(leafId);
        }
        return next;
      }
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function reset() {
    setSelectedIds(new Set(ALL_LEAF_IDS));
  }

  return { selectedIds, toggle, reset };
}
