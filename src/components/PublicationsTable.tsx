import { useMemo, useState } from 'react';
import { ArrowDown, ArrowUp, ArrowUpDown, Building2, GraduationCap } from 'lucide-react';
import { PUBLICATIONS, type Publication } from '@/data/dashboard';
import { ExportButton } from './common/ExportButton';
import { cn } from '@/lib/utils';

type SortKey = 'title' | 'altmetric' | 'citations';
type SortDir = 'asc' | 'desc';

const VISIBLE_COUNT = 2;

function SortableHeader({
  label,
  sortKey,
  active,
  dir,
  onClick,
}: {
  label: string;
  sortKey: SortKey;
  active: boolean;
  dir: SortDir;
  onClick: (key: SortKey) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onClick(sortKey)}
      className="group flex items-center gap-1 text-left text-sm font-semibold text-[var(--color-foreground)]"
    >
      {label}
      <span className={cn('text-[var(--color-muted-foreground)] transition-colors', active && 'text-[var(--color-primary)]')}>
        {active ? (
          dir === 'desc' ? <ArrowDown className="size-3.5" /> : <ArrowUp className="size-3.5" />
        ) : (
          <ArrowUpDown className="size-3.5 opacity-0 transition-opacity group-hover:opacity-60" />
        )}
      </span>
    </button>
  );
}

function OrgRow({ org }: { org: Publication['organisations'][number] }) {
  const Icon = org.icon === 'building' ? Building2 : GraduationCap;
  return (
    <div className="flex items-center gap-1.5 text-sm text-[var(--color-foreground)]">
      <Icon className="size-3.5 shrink-0 text-[var(--color-muted-foreground)]" />
      <span className="font-medium">{org.name}</span>
      {org.extra > 0 ? <span className="text-[var(--color-muted-foreground)]">(+{org.extra} more)</span> : null}
    </div>
  );
}

export function PublicationsTable() {
  const [sortKey, setSortKey] = useState<SortKey>('altmetric');
  const [sortDir, setSortDir] = useState<SortDir>('desc');
  const [expanded, setExpanded] = useState(false);

  function handleSort(key: SortKey) {
    if (key === sortKey) {
      setSortDir((d) => (d === 'desc' ? 'asc' : 'desc'));
    } else {
      setSortKey(key);
      setSortDir('desc');
    }
  }

  const sorted = useMemo(() => {
    const rows = [...PUBLICATIONS];
    rows.sort((a, b) => {
      const result = sortKey === 'title' ? a.title.localeCompare(b.title) : a[sortKey] - b[sortKey];
      return sortDir === 'desc' ? -result : result;
    });
    return rows;
  }, [sortKey, sortDir]);

  const visible = expanded ? sorted : sorted.slice(0, VISIBLE_COUNT);

  return (
    <section className="rounded-xl border border-[var(--color-border)] bg-white">
      <div className="flex items-center justify-between px-5 pt-5 pb-3">
        <h2 className="font-heading text-lg font-bold text-[var(--color-foreground)]">Top performing publications</h2>
        <ExportButton />
      </div>

      <div className="overflow-x-auto">
        {/* Fixed layout with explicit column widths — otherwise the
            browser's auto layout recomputes column widths from whatever
            rows happen to be visible, so expanding "Show more" would
            shift the existing rows' columns sideways along with it. */}
        <table className="w-full border-collapse" style={{ tableLayout: 'fixed' }}>
          <colgroup>
            <col style={{ width: '30%' }} />
            <col style={{ width: '7%' }} />
            <col style={{ width: '19%' }} />
            <col style={{ width: '26%' }} />
            <col style={{ width: '9%' }} />
            <col style={{ width: '9%' }} />
          </colgroup>
          <thead>
            <tr className="border-b border-[var(--color-border)] text-left">
              <th className="px-5 py-2.5">
                <SortableHeader label="Publication title" sortKey="title" active={sortKey === 'title'} dir={sortDir} onClick={handleSort} />
              </th>
              <th className="px-3 py-2.5 text-sm font-semibold text-[var(--color-foreground)]">Date</th>
              <th className="px-3 py-2.5 text-sm font-semibold text-[var(--color-foreground)]">Journal</th>
              <th className="px-3 py-2.5 text-sm font-semibold text-[var(--color-foreground)]">Organisations</th>
              <th className="px-3 py-2.5">
                <SortableHeader label="Altmetric" sortKey="altmetric" active={sortKey === 'altmetric'} dir={sortDir} onClick={handleSort} />
              </th>
              <th className="px-5 py-2.5">
                <SortableHeader label="Citations" sortKey="citations" active={sortKey === 'citations'} dir={sortDir} onClick={handleSort} />
              </th>
            </tr>
          </thead>
          <tbody>
            {visible.map((pub, i) => (
              <tr
                key={pub.id}
                className={cn(
                  'border-b border-[var(--color-border)] transition-colors last:border-b-0 hover:bg-[var(--color-primary-soft)]/40',
                  i >= VISIBLE_COUNT && 'row-reveal',
                )}
              >
                <td className="px-5 py-3.5 text-sm font-medium break-words text-[var(--color-foreground)]">{pub.title}</td>
                <td className="px-3 py-3.5 text-sm text-[var(--color-muted-foreground)]">{pub.year}</td>
                <td className="px-3 py-3.5 text-sm text-[var(--color-muted-foreground)]">{pub.journal}</td>
                <td className="px-3 py-3.5">
                  <div className="flex flex-col gap-1">
                    {pub.organisations.map((org) => (
                      <OrgRow key={org.name} org={org} />
                    ))}
                  </div>
                </td>
                <td className="px-3 py-3.5 text-sm font-semibold tabular-nums text-[var(--color-foreground)]">{pub.altmetric.toLocaleString()}</td>
                <td className="px-5 py-3.5 text-sm font-semibold tabular-nums text-[var(--color-foreground)]">{pub.citations.toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex justify-center border-t border-[var(--color-border)] py-2.5">
        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          className="rounded-[4px] border border-[var(--color-border)] bg-white px-3.5 py-1.5 text-sm font-semibold text-[var(--color-primary)] transition-colors hover:bg-[var(--color-primary-soft)]"
        >
          {expanded ? 'Show less' : 'Show more'}
        </button>
      </div>
    </section>
  );
}
