"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { HERO_SLIDES } from "@/lib/homepage";

const AUTO_ADVANCE_MS = 6000;

// Amazon's hero: a tall banner that fades into the page background so the
// category tiles below can overlap its lower half.
export function HeroBanner() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const count = HERO_SLIDES.length;

  const goTo = (next: number) => setIndex((next + count) % count);

  useEffect(() => {
    if (paused) return;
    const timer = setInterval(() => setIndex((i) => (i + 1) % count), AUTO_ADVANCE_MS);
    return () => clearInterval(timer);
  }, [paused, count]);

  const slide = HERO_SLIDES[index];

  return (
    <section
      aria-roledescription="carousel"
      aria-label="Featured promotions"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      className={`relative h-[300px] overflow-hidden transition-colors duration-500 lg:h-[600px] ${slide.background}`}
    >
      <div className="mx-auto flex h-full max-w-[1500px] items-start px-14 pt-8 lg:pt-16">
        <div className="max-w-xl text-white drop-shadow-md" aria-live="polite">
          <h1 className="text-3xl font-bold leading-tight lg:text-5xl">{slide.title}</h1>
          <p className="mt-2 text-sm lg:mt-4 lg:text-lg">{slide.subtitle}</p>
          <Link
            href={slide.href}
            className="mt-4 inline-block rounded-lg bg-amz-yellow px-6 py-2 text-sm font-medium text-neutral-900 drop-shadow-none hover:bg-amz-yellow-hover lg:mt-6"
          >
            {slide.ctaLabel}
          </Link>
        </div>
      </div>

      {/* Fade into the page background so the tiles below look layered on top. */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-b from-transparent to-amz-bg" />

      <button
        type="button"
        onClick={() => goTo(index - 1)}
        aria-label="Previous slide"
        className="absolute left-0 top-0 flex h-1/2 w-14 items-center justify-center text-white/80 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-white"
      >
        <Chevron direction="left" />
      </button>
      <button
        type="button"
        onClick={() => goTo(index + 1)}
        aria-label="Next slide"
        className="absolute right-0 top-0 flex h-1/2 w-14 items-center justify-center text-white/80 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-white"
      >
        <Chevron direction="right" />
      </button>
    </section>
  );
}

function Chevron({ direction }: { direction: "left" | "right" }) {
  const points = direction === "left" ? "18 4 6 16 18 28" : "6 4 18 16 6 28";
  return (
    <svg width="28" height="36" viewBox="0 0 24 32" aria-hidden="true">
      <polyline points={points} fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  );
}
