"use client";

import Image from "next/image";
import { useState } from "react";

type ImageGalleryProps = {
  images: string[];
  /** Used when `images` is empty so the page never renders an empty frame. */
  fallback: string;
  alt: string;
};

// Amazon-style gallery: a strip of thumbnails (column on wide screens, row on
// phones) that swaps the large image on hover or click.
export function ImageGallery({ images, fallback, alt }: ImageGalleryProps) {
  const sources = images.length > 0 ? images : [fallback];
  const [selected, setSelected] = useState(0);
  const current = sources[selected] ?? sources[0] ?? fallback;

  return (
    <div className="flex flex-col-reverse gap-3 md:flex-row">
      {sources.length > 1 && (
        <ul className="flex gap-2 overflow-x-auto md:w-14 md:flex-col md:overflow-visible" aria-label="Product images">
          {sources.map((src, index) => {
            const isSelected = index === selected;
            return (
              <li key={src} className="shrink-0">
                <button
                  type="button"
                  onClick={() => setSelected(index)}
                  onMouseEnter={() => setSelected(index)}
                  aria-label={`Image ${index + 1} of ${sources.length}`}
                  aria-pressed={isSelected}
                  className={`relative block h-12 w-12 overflow-hidden rounded-md border bg-white ${
                    isSelected ? "border-amz-orange-dark ring-2 ring-amz-search" : "border-amz-border hover:border-neutral-400"
                  }`}
                >
                  <Image src={src} alt="" fill sizes="48px" className="object-contain" />
                </button>
              </li>
            );
          })}
        </ul>
      )}

      <div className="relative aspect-square w-full flex-1 bg-white">
        <Image
          src={current}
          alt={alt}
          fill
          priority
          sizes="(max-width: 768px) 100vw, 40vw"
          className="object-contain"
        />
      </div>
    </div>
  );
}
