/** Estimated file size / processing time for the export summary. These
 *  are deliberately coarse ranges, not a fabricated precise number — a
 *  flat per-section weight table, summed over whatever's currently
 *  selected, rounded to a round figure. Never claims more precision
 *  than a client-side PDF render can actually promise up front. */

const BASE_KB: [number, number] = [40, 70]; // cover + fonts + static chrome, always included
const BASE_SEC: [number, number] = [0.5, 1];

const SECTION_WEIGHTS: Record<string, { kb: [number, number]; sec: [number, number] }> = {
  workspace_overview: { kb: [10, 20], sec: [0.1, 0.2] },
  executive_summary: { kb: [10, 20], sec: [0.1, 0.2] },
  total_mentions: { kb: [30, 50], sec: [0.2, 0.4] },
  altmetric_score: { kb: [30, 50], sec: [0.2, 0.4] },
  citations: { kb: [30, 50], sec: [0.2, 0.4] },
  clinical_guidelines: { kb: [30, 50], sec: [0.2, 0.4] },
  benchmarks: { kb: [15, 30], sec: [0.1, 0.3] },
  publications: { kb: [20, 40], sec: [0.2, 0.4] },
  metric_breakdowns: { kb: [15, 30], sec: [0.1, 0.3] },
  methodology: { kb: [10, 15], sec: [0.1, 0.1] },
};

function round(n: number, step: number): number {
  return Math.round(n / step) * step;
}

export function estimateExport(selectedLeafIds: Set<string>): { sizeLabel: string; timeLabel: string } {
  let [minKb, maxKb] = BASE_KB;
  let [minSec, maxSec] = BASE_SEC;

  for (const id of selectedLeafIds) {
    const w = SECTION_WEIGHTS[id];
    if (!w) continue;
    minKb += w.kb[0];
    maxKb += w.kb[1];
    minSec += w.sec[0];
    maxSec += w.sec[1];
  }

  minKb = round(minKb, 10);
  maxKb = round(maxKb, 10);
  minSec = Math.round(round(minSec, 0.1) * 10) / 10;
  maxSec = Math.round(round(maxSec, 0.1) * 10) / 10;

  return {
    sizeLabel: `~${minKb}–${maxKb} KB`,
    timeLabel: `~${minSec}–${maxSec} sec`,
  };
}
