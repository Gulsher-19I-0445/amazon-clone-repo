"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import type { ProductListItem } from "@/lib/types";
import { CarouselProductCard, type CarouselVariant } from "./CarouselProductCard";

type ProductCarouselProps = {
  title: string;
  products: ProductListItem[];
  seeAllHref: string;
  variant?: CarouselVariant;
};

const arrowClass =
  "absolute top-1/2 hidden h-24 w-11 -translate-y-1/2 items-center justify-center rounded-sm border border-amz-border bg-white/95 text-neutral-700 shadow-md hover:bg-white sm:flex";

// Horizontal scroll rail with arrow buttons. The arrows only appear once the
// rail is known to overflow, measured after mount (reading scrollWidth during
// render would mismatch the server-rendered HTML).
export function ProductCarousel({ title, products, seeAllHref, variant = "default" }: ProductCarouselProps) {
  const railRef = useRef<HTMLUListElement>(null);
  const [overflows, setOverflows] = useState(false);

  useEffect(() => {
    const rail = railRef.current;
    if (rail === null) return;

    const measure = () => setOverflows(rail.scrollWidth > rail.clientWidth + 1);
    measure();

    const observer = new ResizeObserver(measure);
    observer.observe(rail);
    return () => observer.disconnect();
  }, [products.length]);

  const scrollByPage = (direction: -1 | 1) => {
    const rail = railRef.current;
    if (rail === null) return;
    rail.scrollBy({ left: direction * rail.clientWidth * 0.8, behavior: "smooth" });
  };

  return (
    <section aria-roledescription="carousel" aria-label={title} className="bg-white p-5 shadow-sm">
      <div className="flex items-baseline gap-4">
        <h2 className="text-xl font-bold">{title}</h2>
        <Link href={seeAllHref} className="text-sm text-amz-link hover:text-amz-link-hover hover:underline">
          See all
        </Link>
      </div>

      <div className="relative mt-3">
        <ul
          ref={railRef}
          className="flex snap-x gap-4 overflow-x-auto scroll-smooth pb-2 [scrollbar-width:thin]"
        >
          {products.map((product) => (
            <li key={product.id} className="flex">
              <CarouselProductCard product={product} variant={variant} />
            </li>
          ))}
        </ul>

        {overflows && (
          <>
            <button
              type="button"
              onClick={() => scrollByPage(-1)}
              aria-label={`Scroll ${title} left`}
              className={`${arrowClass} -left-3`}
            >
              <Chevron direction="left" />
            </button>
            <button
              type="button"
              onClick={() => scrollByPage(1)}
              aria-label={`Scroll ${title} right`}
              className={`${arrowClass} -right-3`}
            >
              <Chevron direction="right" />
            </button>
          </>
        )}
      </div>
    </section>
  );
}

function Chevron({ direction }: { direction: "left" | "right" }) {
  const points = direction === "left" ? "14 4 6 12 14 20" : "6 4 14 12 6 20";
  return (
    <svg width="20" height="24" viewBox="0 0 20 24" aria-hidden="true">
      <polyline points={points} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

/** Same footprint as a rail, shown while its products stream in. */
export function ProductCarouselSkeleton({ count = 6 }: { count?: number }) {
  return (
    <section aria-busy="true" aria-label="Loading products" className="animate-pulse bg-white p-5 shadow-sm">
      <div className="h-6 w-48 rounded bg-neutral-200" />
      <ul className="mt-3 flex gap-4 overflow-hidden">
        {Array.from({ length: count }, (_, i) => (
          <li key={i} className="w-[180px] shrink-0 sm:w-[210px]">
            <div className="aspect-square w-full rounded bg-neutral-200" />
            <div className="mt-2 h-5 w-1/2 rounded bg-neutral-200" />
            <div className="mt-2 h-4 w-5/6 rounded bg-neutral-200" />
          </li>
        ))}
      </ul>
    </section>
  );
}
