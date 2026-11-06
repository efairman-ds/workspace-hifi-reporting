import { Text, View } from '@react-pdf/renderer';
import type { ReportData } from '@/data/report/buildReportData';
import { REPORT_AVAILABILITY } from '@/data/report/reportAvailability';
import { PageShell } from './components/PageShell';
import { colors, styles } from './theme';

/** Benchmarks have no organisation/category/grouping field in the app's
 *  data model (only name, value, description, savedAt) — this table
 *  shows exactly those real fields, nothing invented. Benchmark rows
 *  also don't carry a distinct per-benchmark colour on screen (only the
 *  4 segment colours are fixed/shared across every row), so no fabricated
 *  colour-coding is introduced here either. */
export function BenchmarksPage({ data }: { data: ReportData }) {
  return (
    <PageShell workspaceName={data.workspaceName} exportedAt={data.exportedAt}>
      <Text style={styles.h1}>Benchmarks</Text>
      <Text style={{ ...styles.muted, marginBottom: 16 }}>{REPORT_AVAILABILITY.benchmarkFieldsNote}</Text>

      {data.calculatingCount > 0 ? (
        <View style={{ backgroundColor: colors.primarySoft, padding: 10, borderRadius: 4, marginBottom: 16 }}>
          <Text style={{ fontSize: 9 }}>
            {data.calculatingCount} benchmark{data.calculatingCount === 1 ? '' : 's'} excluded below — still calculating at export time, not
            represented as zero.
          </Text>
        </View>
      ) : null}

      {data.benchmarks.length === 0 ? (
        <Text style={styles.muted}>No benchmarks are currently saved in this workspace.</Text>
      ) : (
        <View>
          <TableHeader />
          {data.benchmarks.map((b) => (
            <View key={b.id} style={{ flexDirection: 'row', paddingVertical: 6, borderBottomWidth: 1, borderBottomColor: colors.border }}>
              <Text style={{ width: 140, fontSize: 9, fontWeight: 600 }}>{b.name}</Text>
              <Text style={{ width: 70, fontSize: 9 }}>{b.value.toLocaleString()}</Text>
              <Text style={{ flex: 1, fontSize: 9, color: colors.mutedForeground }}>{b.description}</Text>
              <Text style={{ width: 70, fontSize: 9, color: colors.mutedForeground, textAlign: 'right' }}>{b.savedAt}</Text>
            </View>
          ))}
        </View>
      )}
    </PageShell>
  );
}

function TableHeader() {
  return (
    <View style={{ flexDirection: 'row', paddingVertical: 6, borderBottomWidth: 2, borderBottomColor: colors.foreground }}>
      <Text style={{ width: 140, fontSize: 8, fontWeight: 700, color: colors.mutedForeground }}>NAME</Text>
      <Text style={{ width: 70, fontSize: 8, fontWeight: 700, color: colors.mutedForeground }}>VALUE</Text>
      <Text style={{ flex: 1, fontSize: 8, fontWeight: 700, color: colors.mutedForeground }}>DESCRIPTION</Text>
      <Text style={{ width: 70, fontSize: 8, fontWeight: 700, color: colors.mutedForeground, textAlign: 'right' }}>SAVED</Text>
    </View>
  );
}
