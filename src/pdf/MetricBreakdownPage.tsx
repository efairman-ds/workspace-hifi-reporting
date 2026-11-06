import { Text, View } from '@react-pdf/renderer';
import type { ReportData } from '@/data/report/buildReportData';
import { PageShell } from './components/PageShell';
import { colors, styles } from './theme';

/** Full channel-level breakdown per domain (the detailed companion to
 *  Workspace Overview's condensed summary) — real `DOMAIN_CARDS` data,
 *  nothing derived or estimated. */
export function MetricBreakdownPage({ data }: { data: ReportData }) {
  return (
    <PageShell workspaceName={data.workspaceName} exportedAt={data.exportedAt}>
      <Text style={styles.h1}>Metric Breakdowns and Supporting Data</Text>
      <Text style={{ ...styles.muted, marginBottom: 18 }}>Channel-level breakdown of the workspace's total-mentions domains.</Text>

      {data.domainCards.map((card) => (
        <View key={card.key} style={{ marginBottom: 16 }} wrap={false}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 6 }}>
            <View style={{ width: 9, height: 9, backgroundColor: card.color, borderRadius: 2 }} />
            <Text style={{ fontSize: 11, fontWeight: 700 }}>{card.label}</Text>
            {card.total !== null ? <Text style={{ fontSize: 9, color: colors.mutedForeground }}>({card.total.toLocaleString()} total)</Text> : null}
          </View>
          {card.channels.map((c) => (
            <View
              key={c.label}
              style={{ flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 3, borderBottomWidth: 1, borderBottomColor: colors.border }}
            >
              <Text style={{ fontSize: 9 }}>{c.label}</Text>
              <Text style={{ fontSize: 9, fontWeight: 600 }}>{c.value.toLocaleString()}</Text>
            </View>
          ))}
        </View>
      ))}
    </PageShell>
  );
}
