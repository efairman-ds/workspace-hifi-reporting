import { SEGMENTS, type SegmentKey } from '@/data/dashboard';
import { mutedTone } from '@/lib/utils';

export interface HoveredSegment {
  rowId: string;
  key: SegmentKey;
}

const FULL = Object.fromEntries(SEGMENTS.map((s) => [s.key, s.color])) as Record<SegmentKey, string>;
const MUTED = Object.fromEntries(SEGMENTS.map((s) => [s.key, mutedTone(s.color)])) as Record<SegmentKey, string>;

export function fullColor(key: SegmentKey): string {
  return FULL[key];
}

export function mutedColor(key: SegmentKey): string {
  return MUTED[key];
}

/** The single source of truth for segment colour, given hover state.
 *  See the project brief's "Hover and focus behaviour" section — the
 *  workspace library row defaults to full colour and dims on its own
 *  hover; benchmark rows default to muted and only the hovered segment
 *  lifts to full colour. Hovering a benchmark segment never affects the
 *  workspace library row, and vice versa only affects its own row. */
export function segmentColor(rowId: string, isWorkspaceRow: boolean, key: SegmentKey, hovered: HoveredSegment | null): string {
  const isThisSegmentHovered = hovered?.rowId === rowId && hovered.key === key;
  if (isWorkspaceRow) {
    if (!hovered) return FULL[key];
    const hoveringOwnRow = hovered.rowId === rowId;
    if (!hoveringOwnRow) return FULL[key]; // unaffected by benchmark hover
    return isThisSegmentHovered ? FULL[key] : MUTED[key];
  }
  return isThisSegmentHovered ? FULL[key] : MUTED[key];
}
