import { Page, Text, View } from '@react-pdf/renderer';
import type { ReportData } from '@/data/report/buildReportData';
import { REPORT_AVAILABILITY } from '@/data/report/reportAvailability';
import { colors, styles } from './theme';

/** Dedicated report cover — text-only branding per instruction (no logo
 *  graphic), restrained editorial layout. Still carries the real page
 *  footer/number so pagination stays accurate from page 1. */
export function CoverPage({ data }: { data: ReportData }) {
  return (
    <Page size="A4" style={styles.page}>
      <View style={{ marginTop: 160 }}>
        <Text style={{ fontSize: 11, fontWeight: 600, color: colors.primary, letterSpacing: 1.5 }}>COMPASS</Text>
        <Text style={{ fontSize: 9, color: colors.mutedForeground, marginBottom: 36 }}>By Dimensions | Digital Science</Text>

        <Text style={{ fontSize: 30, fontWeight: 700, marginBottom: 8 }}>Workspace Report</Text>
        <Text style={{ fontSize: 16, fontWeight: 500, color: colors.mutedForeground, marginBottom: 28 }}>{data.workspaceName}</Text>

        <View style={{ ...styles.divider, marginVertical: 0, marginBottom: 20, width: 80, borderBottomColor: colors.primary, borderBottomWidth: 2 }} />

        <SummaryRow label="Report generated" value={data.exportedAt.toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })} />
        <SummaryRow label="Publications included" value={String(data.publications.length)} />
        <SummaryRow label="Benchmarks included" value={String(data.benchmarks.length)} />
        {data.calculatingCount > 0 ? (
          <SummaryRow label="Benchmarks excluded (still calculating)" value={String(data.calculatingCount)} />
        ) : null}
      </View>

      <View style={{ position: 'absolute', bottom: 60, left: 0, right: 0, paddingHorizontal: 18 * 2.835 }}>
        <Text style={{ fontSize: 8, color: colors.mutedForeground, lineHeight: 1.5 }}>{REPORT_AVAILABILITY.reportingPeriodNote}</Text>
      </View>

      <View style={styles.footer} fixed>
        <Text>Generated {data.exportedAt.toLocaleDateString()}</Text>
        <Text render={({ pageNumber, totalPages }) => `Page ${pageNumber} of ${totalPages}`} />
      </View>
    </Page>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={{ flexDirection: 'row', marginBottom: 8 }}>
      <Text style={{ width: 220, fontSize: 10, color: colors.mutedForeground }}>{label}</Text>
      <Text style={{ fontSize: 10, fontWeight: 600 }}>{value}</Text>
    </View>
  );
}
