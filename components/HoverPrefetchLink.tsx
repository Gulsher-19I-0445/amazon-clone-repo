"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { useState } from "react";

type HoverPrefetchLinkProps = {
  href: string;
  className?: string;
  tabIndex?: number;
  onClick?: () => void;
  children: ReactNode;
};

// Link to a product page. The PDP streams behind app/product/[id]/loading.tsx,
// which makes every prefetch render up to that boundary (including
// generateMetadata, a Neon read). A catalog page has dozens of product links in
// view, so instead of prefetching them all as they scroll by, prefetch only the
// one the visitor hovers: a click then shows the skeleton instantly, and the
// links they never touch cost nothing.
export function HoverPrefetchLink({ href, className, tabIndex, onClick, children }: HoverPrefetchLinkProps) {
  const [active, setActive] = useState(false);

  return (
    <Link
      href={href}
      className={className}
      tabIndex={tabIndex}
      onClick={onClick}
      prefetch={active ? null : false}
      onMouseEnter={() => setActive(true)}
    >
      {children}
    </Link>
  );
}
