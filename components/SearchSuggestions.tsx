"use client";

import Image from "next/image";
import { categoryLabel } from "@/lib/categories";
import { splitMatch } from "@/lib/suggestions";
import type { ProductSuggestion } from "@/lib/types";
import { HoverPrefetchLink } from "./HoverPrefetchLink";

type SearchSuggestionsProps = {
  /** Listbox id; the input's aria-controls points here and option ids derive from it. */
  id: string;
  suggestions: ProductSuggestion[];
  query: string;
  /** Category slug currently selected in the "All ▾" dropdown, or "". */
  category: string;
  /** Index of the keyboard-highlighted row, or -1 for none. */
  activeIndex: number;
  onHover: (index: number) => void;
  /** Called when a row is clicked, so the owner can close the panel. */
  onPick: () => void;
};

export function optionId(listId: string, index: number): string {
  return `${listId}-opt-${index}`;
}

// Dropdown under the header search box. Purely presentational: the input in
// SearchBar owns focus and keyboard state, this only draws what it is given.
export function SearchSuggestions({
  id,
  suggestions,
  query,
  category,
  activeIndex,
  onHover,
  onPick,
}: SearchSuggestionsProps) {
  return (
    <div
      className="absolute left-0 right-0 top-full z-50 overflow-hidden rounded-b-md bg-white text-neutral-900 shadow-lg"
      // Clicking inside must not blur the input, or the panel would close
      // before the row's own click navigates.
      onMouseDown={(event) => event.preventDefault()}
    >
      {suggestions.length === 0 ? (
        <p className="px-3 py-2 text-sm text-neutral-600">
          No matches for &ldquo;{query.trim()}&rdquo;
          {category && <> in {categoryLabel(category)}</>}
        </p>
      ) : (
        <ul id={id} role="listbox" aria-label="Product suggestions">
          {suggestions.map((product, index) => {
            const { before, match, after } = splitMatch(product.name, query);
            const active = index === activeIndex;

            return (
              <li
                key={product.id}
                id={optionId(id, index)}
                role="option"
                aria-selected={active}
                onMouseEnter={() => onHover(index)}
              >
                <HoverPrefetchLink
                  href={`/product/${product.id}`}
                  tabIndex={-1}
                  onClick={onPick}
                  className={`flex items-center gap-3 px-3 py-1.5 ${active ? "bg-neutral-100" : ""}`}
                >
                  <span className="relative h-10 w-10 shrink-0 bg-neutral-50">
                    <Image src={product.thumbnail} alt="" fill sizes="40px" className="object-contain" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm">
                      {before}
                      <strong className="font-bold">{match}</strong>
                      {after}
                    </span>
                    <span className="block text-xs text-neutral-500">in {categoryLabel(product.category)}</span>
                  </span>
                </HoverPrefetchLink>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
