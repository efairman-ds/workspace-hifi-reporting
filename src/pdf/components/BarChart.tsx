import { Rect, Svg, Text, View } from '@react-pdf/renderer';
import { SEGMENTS, type MetricChartData, type RowId, type Segments } from '@/data/dashboard';
import { computeWidths, getTicks } from '@/lib/chartGeometry';
import { colors } from '../theme';

const ROW_LABEL_WIDTH = 130;
const TOTAL_LABEL_WIDTH = 55;
const PLOT_WIDTH = 300;
const BAR_HEIGHT = 16;
const ROW_GAP = 26;

/** Vector redraw of the on-screen stacked bar chart, using the exact same
 *  `computeWidths`/`getTicks` math `PerformanceChart.tsx` uses on screen
 *  (extracted to `@/lib/chartGeometry` so both can never silently
 *  diverge) — drawn as real SVG rectangles, not a screenshot. Every
 *  segment's value and the row's total are permanently visible as text
 *  (the live chart only reveals a segment's exact value on hover; that
 *  can't exist in a static PDF, so it becomes always-on labels here). */
export function BarChart({ data, axisLabel }: { data: MetricChartData; axisLabel: string }) {
  const widths: Record<RowId, Segments> = computeWidths(data, PLOT_WIDTH);
  const ticks = getTicks(data.axisMax, data.axisStep);

  return (
    <View>
      <View style={{ flexDirection: 'row' }}>
        <View style={{ width: ROW_LABEL_WIDTH }} />
        <View style={{ width: PLOT_WIDTH, height: 12, position: 'relative' }}>
          {ticks.map((tick) => (
            <Text
              key={tick}
              style={{
                position: 'absolute',
                left: (tick / data.axisMax) * PLOT_WIDTH - 12,
                width: 24,
                fontSize: 7,
                color: colors.mutedForeground,
                textAlign: 'center',
              }}
            >
              {tick.toLocaleString()}
            </Text>
          ))}
        </View>
      </View>

      {data.rows.map((row) => {
        const rowWidths = widths[row.rowId];
        let x = 0;
        return (
          <View key={row.rowId} style={{ marginBottom: ROW_GAP }}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text style={{ width: ROW_LABEL_WIDTH, fontSize: 9, fontWeight: row.isWorkspace ? 700 : 500 }}>{row.label}</Text>
              <Svg width={PLOT_WIDTH} height={BAR_HEIGHT}>
                <Rect x={0} y={0} width={PLOT_WIDTH} height={BAR_HEIGHT} fill={colors.border} opacity={0.4} />
                {SEGMENTS.map((seg) => {
                  const w = rowWidths[seg.key];
                  const rectX = x;
                  x += w;
                  if (w <= 0) return null;
                  return <Rect key={seg.key} x={rectX} y={0} width={w} height={BAR_HEIGHT} fill={seg.color} />;
                })}
              </Svg>
              <Text style={{ width: TOTAL_LABEL_WIDTH, fontSize: 10, fontWeight: 700, textAlign: 'right' }}>{row.total.toLocaleString()}</Text>
            </View>
            {/* Permanently-visible per-segment values — the tooltip is the
                only place this appears on screen; here it must be static. */}
            <View style={{ flexDirection: 'row', marginTop: 3 }}>
              <View style={{ width: ROW_LABEL_WIDTH }} />
              <Text style={{ width: PLOT_WIDTH, fontSize: 7, color: colors.mutedForeground }}>
                {SEGMENTS.map((seg) => `${seg.label} ${row.segments[seg.key].toLocaleString()}`).join('   ·   ')}
              </Text>
            </View>
          </View>
        );
      })}

      <View style={{ flexDirection: 'row', marginTop: 2 }}>
        <View style={{ width: ROW_LABEL_WIDTH }} />
        <Text style={{ width: PLOT_WIDTH, fontSize: 8, color: colors.mutedForeground, textAlign: 'center' }}>{axisLabel}</Text>
      </View>

      <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginTop: 12, gap: 12 }}>
        {SEGMENTS.map((seg) => (
          <View key={seg.key} style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
            <Svg width={8} height={8}>
              <Rect x={0} y={0} width={8} height={8} fill={seg.color} />
            </Svg>
            <Text style={{ fontSize: 8 }}>{seg.label}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}
