import { Page, Text, View } from '@react-pdf/renderer';
import { styles } from '../theme';

/** Shared header/footer + genuine "Page X of Y" — react-pdf's own
 *  `render` callback on <Text> receives real pageNumber/totalPages at
 *  render time, so this is never a fabricated count. */
export function PageShell({
  workspaceName,
  exportedAt,
  children,
}: {
  workspaceName: string;
  exportedAt: Date;
  children: React.ReactNode;
}) {
  return (
    <Page size="A4" style={styles.page}>
      <View style={styles.header} fixed>
        <Text>{workspaceName}</Text>
        <Text>Compass by Dimensions | Digital Science</Text>
      </View>

      {children}

      <View style={styles.footer} fixed>
        <Text>Generated {exportedAt.toLocaleDateString()}</Text>
        <Text render={({ pageNumber, totalPages }) => `Page ${pageNumber} of ${totalPages}`} />
      </View>
    </Page>
  );
}
