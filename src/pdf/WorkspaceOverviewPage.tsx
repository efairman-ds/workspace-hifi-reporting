import { Text, View } from '@react-pdf/renderer';
import type { ReportData } from '@/data/report/buildReportData';
import { REPORT_AVAILABILITY } from '@/data/report/reportAvailability';
import { PageShell } from './components/PageShell';
import { colors, styles } from './theme';

export function WorkspaceOverviewPage({ data }: { data: ReportData }) {
  return (
    <PageShell workspaceName={data.workspaceName} exportedAt={data.exportedAt}>
      <Text style={styles.h1}>Workspace Overview</Text>
      <Text style={{ ...styles.muted, marginBottom: 4 }}>{data.workspaceName}</Text>
      <Text style={{ ...styles.muted, marginBottom: 18 }}>{REPORT_AVAILABILITY.noSelectionSubsetNote}</Text>

      <Text style={styles.h3}>Key summary metrics</Text>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 18 }}>
        {data.domainCards.map((card) => (
          <View key={card.key} style={{ width: '48%', borderWidth: 1, borderColor: colors.border, borderRadius: 4, padding: 10 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5, marginBottom: 4 }}>
              <View style={{ width: 8, height: 8, backgroundColor: card.color, borderRadius: 2 }} />
              <Text style={{ fontSize: 9, fontWeight: 600 }}>{card.label}</Text>
            </View>
            <Text style={{ fontSize: 8, color: colors.mutedForeground }}>
              {card.channels.map((c) => `${c.label} ${c.value.toLocaleString()}`).join('   ·   ')}
            </Text>
          </View>
        ))}
      </View>

      <Text style={styles.h3}>Publications in this workspace</Text>
      <Text style={{ ...styles.muted, marginBottom: 8 }}>{data.publications.length} publication{data.publications.length === 1 ? '' : 's'}</Text>
      <View style={{ marginBottom: 18 }}>
        {data.publications.map((p) => (
          <Text key={p.id} style={{ fontSize: 9, marginBottom: 3 }}>
            {p.title} — {p.journal}, {p.year}
          </Text>
        ))}
      </View>

      <Text style={styles.h3}>Benchmarks in this workspace</Text>
      <Text style={{ ...styles.muted, marginBottom: 8 }}>{data.benchmarks.length} benchmark{data.benchmarks.length === 1 ? '' : 's'}</Text>
      {data.benchmarks.map((b) => (
        <Text key={b.id} style={{ fontSize: 9, marginBottom: 3 }}>
          {b.name} — {b.description}
        </Text>
      ))}
    </PageShell>
  );
}
