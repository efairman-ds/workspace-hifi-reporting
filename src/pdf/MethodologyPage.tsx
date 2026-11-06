import { Text, View } from '@react-pdf/renderer';
import type { ReportData } from '@/data/report/buildReportData';
import { DOMAIN_CARDS, METRICS, SEGMENTS } from '@/data/dashboard';
import { REPORT_AVAILABILITY, segmentDefinition } from '@/data/report/reportAvailability';
import { PageShell } from './components/PageShell';
import { colors, styles } from './theme';

/** Only describes real, verifiable things — the 4 segment definitions
 *  (derived from DOMAIN_CARDS' own channel lists, never hand-typed) and
 *  the 4 metric ids. Everything the app genuinely doesn't document
 *  (data sources, benchmark methodology, limitations, exclusions,
 *  last-refresh date) is explicitly stated as unavailable rather than
 *  invented — this is the report's own transparency requirement. */
export function MethodologyPage({ data }: { data: ReportData }) {
  return (
    <PageShell workspaceName={data.workspaceName} exportedAt={data.exportedAt}>
      <Text style={styles.h1}>Methodology and Data Sources</Text>
      <Text style={{ ...styles.body, marginBottom: 16 }}>{REPORT_AVAILABILITY.methodologyUnavailableNote}</Text>

      <Text style={styles.h3}>Segment definitions</Text>
      <View style={{ marginBottom: 16 }}>
        {SEGMENTS.map((seg) => {
          const card = DOMAIN_CARDS.find((c) => c.key === seg.key);
          return (
            <View key={seg.key} style={{ flexDirection: 'row', marginBottom: 6 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5, width: 110 }}>
                <View style={{ width: 8, height: 8, backgroundColor: seg.color, borderRadius: 2 }} />
                <Text style={{ fontSize: 9, fontWeight: 600 }}>{seg.label}</Text>
              </View>
              <Text style={{ fontSize: 9, flex: 1, color: colors.mutedForeground }}>
                {card ? segmentDefinition(card.channels) : 'No channel breakdown available.'}
              </Text>
            </View>
          );
        })}
      </View>

      <Text style={styles.h3}>Reported metrics</Text>
      <View style={{ marginBottom: 16 }}>
        {METRICS.map((m) => (
          <Text key={m.id} style={{ fontSize: 9, marginBottom: 3 }}>
            {m.label} — {m.axisLabel}
          </Text>
        ))}
      </View>

      <Text style={styles.h3}>Reporting period</Text>
      <Text style={{ ...styles.body, marginBottom: 16 }}>{REPORT_AVAILABILITY.reportingPeriodNote}</Text>

      <Text style={styles.h3}>Data snapshot</Text>
      <Text style={styles.body}>{REPORT_AVAILABILITY.dataSnapshotNote(data.exportedAt)}</Text>
    </PageShell>
  );
}
