"use client";

import { ReactNode, useEffect, useState } from "react";

type ResponsiveCanvasProps = {
  children: ReactNode;
  designHeight: number;
  designWidth?: number;
};

export default function ResponsiveCanvas({
  children,
  designHeight,
  designWidth = 1440,
}: ResponsiveCanvasProps) {
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const updateScale = () => {
      setScale(Math.min(1, window.innerWidth / designWidth));
    };

    updateScale();
    window.addEventListener("resize", updateScale);
    return () => window.removeEventListener("resize", updateScale);
  }, [designWidth]);

  return (
    <div
      className="relative w-full overflow-hidden"
      style={{ height: designHeight * scale }}
    >
      <div
        className="absolute left-1/2 top-0"
        style={{
          width: designWidth,
          minHeight: designHeight,
          transform: `translateX(-50%) scale(${scale})`,
          transformOrigin: "top center",
        }}
      >
        {children}
      </div>
    </div>
  );
}
