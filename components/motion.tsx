"use client";

import type { CSSProperties, ReactNode } from "react";
import { useEffect, useRef, useState } from "react";

type RevealVariant = "fade-up" | "image-mask" | "parallax";

type RevealProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
  threshold?: number;
  variant?: RevealVariant;
  desktopOnly?: boolean;
};

export function Reveal({
  children,
  className = "",
  delay = 0,
  threshold = 0.14,
  variant = "fade-up",
  desktopOnly = false,
}: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const isDesktopOnlyDisabled = desktopOnly && window.matchMedia("(max-width: 1023px)").matches;

    if (prefersReducedMotion || isDesktopOnlyDisabled) {
      const frame = window.requestAnimationFrame(() => setIsVisible(true));
      return () => window.cancelAnimationFrame(frame);
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setIsVisible(true);
        observer.disconnect();
      },
      { rootMargin: "0px 0px -8% 0px", threshold }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [desktopOnly, threshold]);

  return (
    <div
      ref={ref}
      data-motion-visible={isVisible ? "true" : "false"}
      data-motion-variant={variant}
      className={`motion-reveal ${className}`}
      style={{ "--motion-delay": `${delay}ms` } as CSSProperties}
    >
      {children}
    </div>
  );
}
