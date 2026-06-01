"use client";

import React, { useEffect, useRef, useState } from "react";

type Props = React.HTMLAttributes<HTMLDivElement> & {
  children: React.ReactNode;
};

function parseRGB(input: string) {
  const m = input.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([0-9.]+))?\)/i);
  if (!m) return null;
  return { r: Number(m[1]), g: Number(m[2]), b: Number(m[3]), a: m[4] ? Number(m[4]) : 1 };
}

export default function ContrastText({ children, className = "", ...rest }: Props) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [isDark, setIsDark] = useState(false);

  const getBackgroundFromNode = (node: Element | null) => {
    while (node && node !== document.documentElement) {
      const bg = getComputedStyle(node).backgroundColor;
      if (bg && bg !== "transparent" && bg !== "rgba(0, 0, 0, 0)") return bg;
      node = node.parentElement;
    }
    return getComputedStyle(document.documentElement).backgroundColor || "rgb(255, 255, 255)";
  };

  const checkContrast = () => {
    const el = ref.current;
    if (!el) return;
    const bg = getBackgroundFromNode(el);
    const rgb = parseRGB(bg);
    if (!rgb) return setIsDark(false);
    // Perceived brightness formula
    const brightness = (rgb.r * 299 + rgb.g * 587 + rgb.b * 114) / 1000;
    setIsDark(brightness < 140);
  };

  useEffect(() => {
    checkContrast();

    const onResize = () => checkContrast();
    window.addEventListener("resize", onResize);

    const mo = new MutationObserver(() => checkContrast());
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ["class", "style"] });

    return () => {
      window.removeEventListener("resize", onResize);
      mo.disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const style = isDark ? { color: "#ffffff" } : undefined;

  return (
    <div ref={ref} className={className} style={style} {...rest}>
      {children}
    </div>
  );
}
