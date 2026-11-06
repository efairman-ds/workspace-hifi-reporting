import { useEffect, useRef, useState } from 'react';

/** Tracks an element's rendered content width via ResizeObserver, so the
 *  chart can convert data values to pixel widths itself (needed because a
 *  stacked bar's own width is content-driven — percentage widths don't
 *  resolve sensibly against a fit-content parent). */
export function useElementWidth<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [width, setWidth] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (entry) setWidth(entry.contentRect.width);
    });
    observer.observe(el);
    setWidth(el.getBoundingClientRect().width);
    return () => observer.disconnect();
  }, []);

  return { ref, width };
}
