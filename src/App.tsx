import { useRef, useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { WorkspaceHeader } from './components/WorkspaceHeader';
import { PublicationsTable } from './components/PublicationsTable';
import { PerformanceAnalysisTabs, type MainTab } from './components/PerformanceAnalysisTabs';
import { PerformanceChart } from './components/chart/PerformanceChart';
import { BenchmarksCard } from './components/BenchmarksCard';
import { SnapshotCard } from './components/SnapshotCard';
import { DomainCards } from './components/DomainCards';
import { BackToTop } from './components/BackToTop';
import { BENCHMARKS, type BenchmarkEntry } from '@/data/dashboard';
import type { CreatedBenchmark } from './components/benchmark/CreateBenchmarkFlyout';
// The workspace's full library size — independent of how many rows sit in
// the "Top performing publications" table below, which only ever shows a
// handful of highlights.
const LIBRARY_PUBLICATION_COUNT = 435;
// How long a newly created benchmark stays in its "Calculating…" state
// before its real value is revealed in both the Benchmarks card and the
// Workspace performance chart.
const CALCULATION_MS = 60_000;
let nextCustomBenchmarkId = 1;

export default function App() {
  const [mainTab, setMainTab] = useState<MainTab>('performance');
  const [dateRange, setDateRange] = useState('past-year');
  // Owned here, not inside BenchmarksCard, so the chart below can render
  // the same "Calculating…" placeholder row and stay in sync with it.
  const [benchmarks, setBenchmarks] = useState<BenchmarkEntry[]>(BENCHMARKS);

  function handleCreateBenchmark(benchmark: CreatedBenchmark) {
    const id = `custom-${nextCustomBenchmarkId++}`;
    setBenchmarks((prev) => [
      {
        id,
        name: benchmark.name,
        value: benchmark.value,
        description: benchmark.description,
        savedAt: new Date().toISOString().slice(0, 10),
        calculating: true,
      },
      ...prev,
    ]);
    setTimeout(() => {
      setBenchmarks((prev) => prev.map((b) => (b.id === id ? { ...b, calculating: false } : b)));
    }, CALCULATION_MS);
  }

  function handleRemoveBenchmark(id: string) {
    setBenchmarks((prev) => prev.filter((b) => b.id !== id));
  }

  // Performance and Analysis have very different content heights, so
  // swapping between them can shift (or even clamp) the scroll position
  // even though nothing asked the page to move. Remembering each tab's
  // own scroll offset independently — rather than just the current
  // scrollY at click time — matters because the short Analysis view
  // forces a clamp to 0; reading "current scrollY" on the way back would
  // read that clamped 0, not the Performance position the user actually
  // had. Keyed per tab, the real Performance offset survives the trip.
  const scrollPositions = useRef<Record<MainTab, number>>({ performance: 0, analysis: 0 });
  function handleTabChange(tab: MainTab) {
    scrollPositions.current[mainTab] = window.scrollY;
    setMainTab(tab);
    // A single rAF isn't reliably after the new tab's content has
    // actually committed and laid out — same unreliability as the
    // chart's own draw-in animation elsewhere in this app. A real-time
    // timeout, long enough to be safely after that layout settles,
    // doesn't have that race.
    setTimeout(() => window.scrollTo(0, scrollPositions.current[tab]), 30);
  }

  return (
    <div className="min-h-screen w-full">
      <Sidebar />

      {/* ml-[70px] matches the fixed sidebar's own width — it's no longer
          a flex sibling, so this is what keeps content starting right
          after it instead of underneath it. */}
      <main className="min-w-0 ml-[70px] px-10 py-8">
        <div className="mx-auto flex max-w-[1400px] flex-col gap-6">
          <WorkspaceHeader dateRange={dateRange} onDateRangeChange={setDateRange} publicationCount={LIBRARY_PUBLICATION_COUNT} benchmarks={benchmarks} />

          <PublicationsTable />

          {/* Tighter gap than the page's usual gap-6 rhythm — the graph
              should sit close to the control that switches its metric,
              not spaced like an unrelated section. */}
          <div className="flex flex-col gap-2">
            <PerformanceAnalysisTabs active={mainTab} onChange={handleTabChange} />
            {mainTab === 'performance' ? <PerformanceChart benchmarks={benchmarks} /> : null}
          </div>

          {mainTab === 'performance' ? (
            <>
              <div className="flex flex-col gap-4 sm:flex-row">
                <BenchmarksCard benchmarks={benchmarks} onCreateBenchmark={handleCreateBenchmark} onRemoveBenchmark={handleRemoveBenchmark} />
                <SnapshotCard />
              </div>

              <DomainCards />
            </>
          ) : (
            <div className="rounded-xl border border-dashed border-[var(--color-border)] bg-white py-20 text-center text-sm text-[var(--color-muted-foreground)]">
              Analysis view is not part of this prototype.
            </div>
          )}

          <BackToTop />
        </div>
      </main>
    </div>
  );
}
