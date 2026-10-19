import { useEffect, useRef, type RefObject } from 'react';

/**
 * True while the observed element is near the viewport and the tab is visible.
 * rAF-driven animations gate their heavy work on this so offscreen loops stop
 * repainting while staying mounted and ready to resume.
 */
export function useRafActivity<T extends Element>(ref: RefObject<T | null>) {
  const activeRef = useRef(true);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let visible = true;
    const update = () => {
      activeRef.current = visible && !document.hidden;
    };

    // Observe the nearest section, not the element itself: the hero characters
    // start off-screen inside an overflow-hidden section, so observing the
    // element would report "not intersecting" and freeze the loop that would
    // move them into view.
    const target = (el.closest && el.closest('section')) || el;

    const io = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
        update();
      },
      { rootMargin: '250px' }
    );
    io.observe(target);
    document.addEventListener('visibilitychange', update);
    update();

    return () => {
      io.disconnect();
      document.removeEventListener('visibilitychange', update);
    };
  }, [ref]);

  return activeRef;
}
