import { Text, View } from '@react-pdf/renderer';
import type { ReportData } from '@/data/report/buildReportData';
import { PageShell } from './components/PageShell';
import { BarChart } from './components/BarChart';
import { styles } from './theme';

/** One dedicated page per selected performance metric — never combined,
 *  per the brief's explicit requirement that each of the 4 metrics gets
 *  its own independent graph with its own heading/legend/axis labels. */
export function PerformanceChartPage({
  data,
  chart,
}: {
  data: ReportData;
  chart: ReportData['performanceCharts'][number];
}) {
  return (
    <PageShell workspaceName={data.workspaceName} exportedAt={data.exportedAt}>
      <Text style={styles.h2}>Workspace Performance — {chart.label}</Text>
      <Text style={{ ...styles.muted, marginBottom: 18 }}>
        Comparison of the workspace library against benchmark rows, broken down by Reach, Engagement, Impact and Scientific Impact.
      </Text>
      <View style={{ marginTop: 10 }}>
        <BarChart data={chart.data} axisLabel={chart.axisLabel} />
      </View>
    </PageShell>
  );
}
