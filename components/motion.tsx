"use client";

import type { CSSProperties, ReactNode } from "react";
import { useEffect, useRef, useState } from "react";

type RevealVariant = "fade-up" | "parallax";

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
  const [isReady, setIsReady] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const isDesktopOnlyDisabled = desktopOnly && window.matchMedia("(max-width: 1023px)").matches;
    const isParallaxDisabled = variant === "parallax" && window.matchMedia("(max-width: 1023px)").matches;

    if (prefersReducedMotion || isDesktopOnlyDisabled || isParallaxDisabled) {
      const frame = window.requestAnimationFrame(() => {
        setIsReady(true);
        setIsVisible(true);
      });
      return () => window.cancelAnimationFrame(frame);
    }

    const markReady = () => setIsReady(true);
    const rect = node.getBoundingClientRect();
    const isAlreadyInView = rect.top < window.innerHeight * 0.96 && rect.bottom > 0;

    if (isAlreadyInView) {
      setIsVisible(true);
      const frame = window.requestAnimationFrame(markReady);
      return () => window.cancelAnimationFrame(frame);
    }

    markReady();

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
  }, [desktopOnly, threshold, variant]);

  useEffect(() => {
    const node = ref.current;
    if (!node || variant !== "parallax") return;

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const isMobile = window.matchMedia("(max-width: 1023px)").matches;

    if (prefersReducedMotion || isMobile) {
      node.style.setProperty("--motion-parallax-y", "0px");
      return;
    }

    let frame = 0;

    const update = () => {
      frame = 0;
      const rect = node.getBoundingClientRect();
      const viewport = window.innerHeight || 1;
      const midpoint = rect.top + rect.height / 2;
      const progress = (midpoint - viewport / 2) / (viewport / 2 + rect.height / 2);
      const clamped = Math.max(-1, Math.min(1, progress));

      node.style.setProperty("--motion-parallax-y", `${Math.round(clamped * -12)}px`);
    };

    const requestUpdate = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", requestUpdate, { passive: true });
    window.addEventListener("resize", requestUpdate);

    return () => {
      if (frame) window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", requestUpdate);
      window.removeEventListener("resize", requestUpdate);
      node.style.removeProperty("--motion-parallax-y");
    };
  }, [variant]);

  return (
    <div
      ref={ref}
      data-motion-ready={isReady ? "true" : "false"}
      data-motion-visible={isVisible ? "true" : "false"}
      data-motion-variant={variant}
      className={`motion-reveal ${className}`}
      style={{ "--motion-delay": `${delay}ms` } as CSSProperties}
    >
      {children}
    </div>
  );
}
