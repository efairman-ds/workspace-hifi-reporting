import { Text, View } from '@react-pdf/renderer';
import type { ReportData } from '@/data/report/buildReportData';
import { METRIC_DATA } from '@/data/dashboard';
import { REPORT_AVAILABILITY } from '@/data/report/reportAvailability';
import { PageShell } from './components/PageShell';
import { colors, styles } from './theme';

/** Restates real, already-calculated numbers only — no generated
 *  narrative/insight text. "Comparisons" here are plain arithmetic
 *  (percentage difference against a named benchmark row), explicitly
 *  labeled as calculated, never a fabricated conclusion. */
export function ExecutiveSummaryPage({ data }: { data: ReportData }) {
  const workspaceTotalMentions = METRIC_DATA.total_mentions.rows.find((r) => r.isWorkspace)!.total;

  return (
    <PageShell workspaceName={data.workspaceName} exportedAt={data.exportedAt}>
      <Text style={styles.h1}>Executive Summary</Text>
      <Text style={{ ...styles.muted, marginBottom: 18 }}>{REPORT_AVAILABILITY.reportingPeriodNote}</Text>

      <View style={{ flexDirection: 'row', marginBottom: 20, gap: 14 }}>
        <SummaryStat label="Publications analysed" value={String(data.publications.length)} />
        <SummaryStat label="Benchmarks included" value={String(data.benchmarks.length)} />
        <SummaryStat label="Performance metrics reported" value={String(data.performanceCharts.length)} />
      </View>

      <Text style={styles.h3}>Key performance metrics</Text>
      <View style={{ marginBottom: 16 }}>
        {data.performanceSnapshot.map((m) => (
          <Row key={m.id} label={m.label} value={m.value.toLocaleString()} />
        ))}
      </View>

      {data.benchmarks.length > 0 ? (
        <>
          <Text style={styles.h3}>Benchmark comparison — Total Mentions</Text>
          <Text style={{ ...styles.muted, marginBottom: 8 }}>Calculated as percentage difference from the workspace library's own total.</Text>
          <View style={{ marginBottom: 16 }}>
            {data.benchmarks.map((b) => {
              const row = METRIC_DATA.total_mentions.rows.find((r) => r.rowId === b.id);
              if (!row) return null;
              const diffPct = Math.round(((workspaceTotalMentions - row.total) / row.total) * 100);
              const sign = diffPct > 0 ? '+' : '';
              return <Row key={b.id} label={b.name} value={`${row.total.toLocaleString()}  (${sign}${diffPct}% vs workspace)`} />;
            })}
          </View>
        </>
      ) : null}

      {data.calculatingCount > 0 ? (
        <View style={{ backgroundColor: colors.primarySoft, padding: 10, borderRadius: 4, marginBottom: 16 }}>
          <Text style={{ fontSize: 9 }}>
            {data.calculatingCount} benchmark{data.calculatingCount === 1 ? '' : 's'} excluded from this report — still calculating at export time.
          </Text>
        </View>
      ) : null}

      <Text style={styles.h3}>Data limitations</Text>
      <Text style={styles.muted}>{REPORT_AVAILABILITY.methodologyUnavailableNote}</Text>
    </PageShell>
  );
}

function SummaryStat({ label, value }: { label: string; value: string }) {
  return (
    <View style={{ flex: 1, borderWidth: 1, borderColor: colors.border, borderRadius: 4, padding: 10 }}>
      <Text style={{ fontSize: 16, fontWeight: 700 }}>{value}</Text>
      <Text style={{ fontSize: 8, color: colors.mutedForeground, marginTop: 2 }}>{label}</Text>
    </View>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 4, borderBottomWidth: 1, borderBottomColor: colors.border }}>
      <Text style={{ fontSize: 9 }}>{label}</Text>
      <Text style={{ fontSize: 9, fontWeight: 600 }}>{value}</Text>
    </View>
  );
}
