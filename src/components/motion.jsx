import { useEffect, useRef, useState } from 'react';

export function useEntrance(target) {
  const local = useRef(null);
  const ref = target || local;
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    if (!('IntersectionObserver' in window)) { setVisible(true); return; }
    const observer = new IntersectionObserver(entries => {
      if (entries.some(entry => entry.isIntersecting)) {
        setVisible(true);
        observer.disconnect();
      }
    }, { threshold: 0.15 });
    observer.observe(element);
    return () => observer.disconnect();
  }, [ref]);
  return [ref, visible];
}

export function JourneyLine({ container, visible }) {
  const [geometry, setGeometry] = useState(null);
  const [reduced, setReduced] = useState(true);
  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)');
    const updateMotion = () => setReduced(query.matches);
    updateMotion();
    query.addEventListener('change', updateMotion);
    return () => query.removeEventListener('change', updateMotion);
  }, []);
  useEffect(() => {
    const element = container.current;
    if (!element) return;
    const measure = () => {
      const parent = element.getBoundingClientRect();
      const points = [...element.querySelectorAll('.step-number')].map(node => {
        const box = node.getBoundingClientRect();
        return { x: box.x - parent.x + box.width / 2, y: box.y - parent.y + box.height / 2 };
      });
      if (points.length < 2) return;
      setGeometry({ width: parent.width, height: parent.height, path: points.map((point, index) => `${index ? 'L' : 'M'}${point.x.toFixed(2)} ${point.y.toFixed(2)}`).join(' ') });
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(element);
    return () => observer.disconnect();
  }, [container]);
  if (!geometry) return null;
  return <svg className={`journey-line${visible ? ' is-visible' : ''}`} viewBox={`0 0 ${geometry.width} ${geometry.height}`} aria-hidden="true">
    <path className="journey-track" d={geometry.path}/>
    <path className="journey-progress" d={geometry.path} pathLength="1"/>
    {visible && !reduced ? <circle className="journey-courier" r="4"><animateMotion key={geometry.path} dur="3.6s" repeatCount="1" fill="freeze" path={geometry.path}/></circle> : null}
  </svg>;
}
