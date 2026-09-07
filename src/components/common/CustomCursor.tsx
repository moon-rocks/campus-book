import React, { useEffect, useState, useRef } from 'react';
import gsap from 'gsap';

export const CustomCursor: React.FC = () => {
  const [enabled, setEnabled] = useState(false);
  const [hoverLabel, setHoverLabel] = useState<string>('');
  const [isHovered, setIsHovered] = useState(false);

  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Disable on touch devices or screens smaller than 1024px
    const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    const isMobile = window.innerWidth < 1024;
    if (isTouch || isMobile) {
      setEnabled(false);
      return;
    }
    setEnabled(true);

    const pos = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    const mouse = { x: pos.x, y: pos.y };

    const onMouseMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;

      if (dotRef.current) {
        gsap.to(dotRef.current, {
          x: mouse.x,
          y: mouse.y,
          duration: 0.1,
          ease: 'power2.out',
        });
      }
    };

    const ticker = () => {
      // Ring smoothly chases the dot
      pos.x += (mouse.x - pos.x) * 0.15;
      pos.y += (mouse.y - pos.y) * 0.15;

      if (ringRef.current) {
        gsap.set(ringRef.current, { x: pos.x, y: pos.y });
      }
      if (labelRef.current) {
        gsap.set(labelRef.current, { x: pos.x, y: pos.y });
      }
    };

    gsap.ticker.add(ticker);
    window.addEventListener('mousemove', onMouseMove);

    // Track hovered elements
    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;

      const interactive = target.closest('a, button, [role="button"], input, select, textarea, .cursor-hover-target');
      if (interactive) {
        setIsHovered(true);
        const customLabel = interactive.getAttribute('data-cursor-label') || '';
        setHoverLabel(customLabel);
      } else {
        setIsHovered(false);
        setHoverLabel('');
      }
    };

    window.addEventListener('mouseover', handleMouseOver);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseover', handleMouseOver);
      gsap.ticker.remove(ticker);
    };
  }, []);

  if (!enabled) return null;

  return (
    <>
      <div ref={dotRef} className="custom-cursor-dot" />
      <div
        ref={ringRef}
        className={`custom-cursor-ring ${isHovered ? 'active-hover' : ''}`}
      />
      <div
        ref={labelRef}
        className={`custom-cursor-label ${hoverLabel ? 'visible' : ''}`}
      >
        {hoverLabel}
      </div>
    </>
  );
};
