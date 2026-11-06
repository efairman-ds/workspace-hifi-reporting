import { Text, View } from '@react-pdf/renderer';
import type { ReportData } from '@/data/report/buildReportData';
import { REPORT_AVAILABILITY } from '@/data/report/reportAvailability';
import { PageShell } from './components/PageShell';
import { colors, styles } from './theme';

const COLS = { title: 220, journal: 110, year: 40, altmetric: 55, citations: 55 };

/** The publications table flows naturally across as many pages as it
 *  needs (never squeezed onto one page) — the column header is marked
 *  `fixed` so react-pdf repeats it at the top of every continuation
 *  page, and each row is `wrap={false}` so a single publication's row
 *  never splits across a page break. Only real `Publication` fields are
 *  shown — no DOI/authors/full date, since none exist in the data. */
export function PublicationsPage({ data }: { data: ReportData }) {
  return (
    <PageShell workspaceName={data.workspaceName} exportedAt={data.exportedAt}>
      <Text style={styles.h1}>Publications</Text>
      <Text style={{ ...styles.muted, marginBottom: 4 }}>{REPORT_AVAILABILITY.publicationFieldsNote}</Text>
      <Text style={{ ...styles.muted, marginBottom: 14 }}>{data.publications.length} publication{data.publications.length === 1 ? '' : 's'}</Text>

      <View style={{ flexDirection: 'row', paddingBottom: 6, borderBottomWidth: 2, borderBottomColor: colors.foreground }} fixed>
        <Text style={{ width: COLS.title, fontSize: 8, fontWeight: 700, color: colors.mutedForeground }}>TITLE</Text>
        <Text style={{ width: COLS.journal, fontSize: 8, fontWeight: 700, color: colors.mutedForeground }}>JOURNAL</Text>
        <Text style={{ width: COLS.year, fontSize: 8, fontWeight: 700, color: colors.mutedForeground }}>YEAR</Text>
        <Text style={{ width: COLS.altmetric, fontSize: 8, fontWeight: 700, color: colors.mutedForeground, textAlign: 'right' }}>ALTMETRIC</Text>
        <Text style={{ width: COLS.citations, fontSize: 8, fontWeight: 700, color: colors.mutedForeground, textAlign: 'right' }}>CITATIONS</Text>
      </View>

      {data.publications.map((p) => (
        <View key={p.id} wrap={false} style={{ flexDirection: 'row', paddingVertical: 7, borderBottomWidth: 1, borderBottomColor: colors.border }}>
          <View style={{ width: COLS.title }}>
            <Text style={{ fontSize: 9, fontWeight: 600 }}>{p.title}</Text>
            <Text style={{ fontSize: 7.5, color: colors.mutedForeground, marginTop: 2 }}>
              {p.organisations.map((o) => o.name).join(', ')}
            </Text>
          </View>
          <Text style={{ width: COLS.journal, fontSize: 9, color: colors.mutedForeground }}>{p.journal}</Text>
          <Text style={{ width: COLS.year, fontSize: 9, color: colors.mutedForeground }}>{p.year}</Text>
          <Text style={{ width: COLS.altmetric, fontSize: 9, textAlign: 'right' }}>{p.altmetric.toLocaleString()}</Text>
          <Text style={{ width: COLS.citations, fontSize: 9, textAlign: 'right' }}>{p.citations.toLocaleString()}</Text>
        </View>
      ))}
    </PageShell>
  );
}
