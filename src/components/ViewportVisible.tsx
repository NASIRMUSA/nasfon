import React, { useState, useEffect, useRef } from 'react';

interface ViewportVisibleProps {
  children: React.ReactNode;
  rootMargin?: string;
  threshold?: number | number[];
  placeholderHeight?: string | number;
  className?: string;
  once?: boolean;
  initialVisible?: boolean;
}

/**
 * ViewportVisible component only renders its children when they enter the viewport.
 * This helps improve performance by reducing the number of DOM elements and 
 * components being processed at initial load or off-screen.
 */
export default function ViewportVisible({ 
  children, 
  rootMargin = '200px', 
  threshold = 0.01,
  placeholderHeight = 'auto',
  className = '',
  once = true,
  initialVisible = false
}: ViewportVisibleProps) {
  const [isVisible, setIsVisible] = useState(initialVisible);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (initialVisible && once) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (once) {
            observer.disconnect();
          }
        } else if (!once) {
          setIsVisible(false);
        }
      },
      { rootMargin, threshold }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, [rootMargin, threshold, once]);

  return (
    <div 
      ref={containerRef} 
      className={className}
      style={{ minHeight: isVisible ? 'auto' : placeholderHeight }}
    >
      {isVisible ? children : null}
    </div>
  );
}
