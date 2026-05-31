import { useEffect, useState, RefObject } from 'react';

export default function useOnScreen<T extends Element>(
  ref: RefObject<T | null>,
  rootMargin = '0px',
  threshold: number | number[] = 0.5,
) {
  const [isIntersecting, setIntersecting] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === 'undefined') return;

    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          setIntersecting(entry.isIntersecting && entry.intersectionRatio >= (Array.isArray(threshold) ? threshold[0] : threshold));
        });
      },
      { root: null, rootMargin, threshold },
    );

    obs.observe(el as Element);
    return () => obs.disconnect();
  }, [ref, rootMargin, threshold]);

  return isIntersecting;
}
