import { Font, StyleSheet } from '@react-pdf/renderer';

// Vendored locally (src/assets/fonts) rather than fetched at export time —
// reliable offline, no per-export network dependency. Deliberately plain
// WOFF, not WOFF2: fontkit's TTF subsetter (used when embedding fonts
// into the PDF) throws a DataView range error on these WOFF2 files
// specifically — confirmed by isolating it in a standalone repro — while
// plain WOFF (zlib, not brotli, compression) embeds correctly.
import InterRegular from '../assets/fonts/Inter-Regular.woff';
import InterMedium from '../assets/fonts/Inter-Medium.woff';
import InterSemiBold from '../assets/fonts/Inter-SemiBold.woff';
import InterBold from '../assets/fonts/Inter-Bold.woff';

Font.register({
  family: 'Inter',
  fonts: [
    { src: InterRegular, fontWeight: 400 },
    { src: InterMedium, fontWeight: 500 },
    { src: InterSemiBold, fontWeight: 600 },
    { src: InterBold, fontWeight: 700 },
  ],
});

// Mirrors src/index.css's CSS custom properties — hand-kept-in-sync since
// react-pdf has no CSS-variable mechanism of its own. If the app's tokens
// change, update both places.
export const colors = {
  background: '#f7f7fb',
  card: '#ffffff',
  border: '#e5e6ef',
  foreground: '#16181d',
  mutedForeground: '#6b7280',
  primary: '#5b4fe0',
  primarySoft: '#eef0fc',
  reach: '#2bb0e6',
  engagement: '#e3488f',
  impact: '#5b4ae6',
  scientific: '#f1a644',
} as const;

export const PAGE_MARGIN = 18 * 2.835; // ~18mm, in PDF points (1mm ≈ 2.835pt)

export const styles = StyleSheet.create({
  page: {
    fontFamily: 'Inter',
    fontSize: 10,
    color: colors.foreground,
    backgroundColor: '#ffffff',
    paddingTop: PAGE_MARGIN,
    paddingBottom: PAGE_MARGIN + 24,
    paddingHorizontal: PAGE_MARGIN,
  },
  h1: { fontSize: 22, fontWeight: 700, marginBottom: 6 },
  h2: { fontSize: 15, fontWeight: 700, marginBottom: 10 },
  h3: { fontSize: 11, fontWeight: 600, marginBottom: 6 },
  body: { fontSize: 10, lineHeight: 1.5, color: colors.foreground },
  muted: { fontSize: 9, color: colors.mutedForeground },
  divider: { borderBottomWidth: 1, borderBottomColor: colors.border, marginVertical: 14 },
  footer: {
    position: 'absolute',
    bottom: 14,
    left: PAGE_MARGIN,
    right: PAGE_MARGIN,
    flexDirection: 'row',
    justifyContent: 'space-between',
    fontSize: 8,
    color: colors.mutedForeground,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: 6,
  },
  header: {
    position: 'absolute',
    top: 14,
    left: PAGE_MARGIN,
    right: PAGE_MARGIN,
    flexDirection: 'row',
    justifyContent: 'space-between',
    fontSize: 8,
    color: colors.mutedForeground,
  },
});
