/** Shown only on the flyout's first open, for ~2s, before the (instant,
 *  local) dummy data "arrives" — three placeholder rows sized to match
 *  real result rows exactly, so nothing shifts once they're replaced. */
export function ResultsSkeleton() {
  return (
    <div className="flex flex-col">
      {[0, 1, 2].map((i) => (
        <div key={i} className="flex items-center justify-between gap-3 px-3 py-2.5">
          <div className="h-4 animate-pulse rounded bg-gray-200" style={{ width: `${55 - i * 10}%` }} />
          <div className="size-[18px] shrink-0 animate-pulse rounded-[4px] bg-gray-200" />
        </div>
      ))}
    </div>
  );
}
