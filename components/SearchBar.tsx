"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useId, useRef, useState, type FormEvent, type KeyboardEvent } from "react";
import { CATEGORIES } from "@/lib/categories";
import { matchSuggestions } from "@/lib/suggestions";
import { useSuggestionIndex } from "@/store/useSuggestionIndex";
import { optionId, SearchSuggestions } from "./SearchSuggestions";

export function SearchBar() {
  const router = useRouter();
  const params = useSearchParams();
  const inputRef = useRef<HTMLInputElement>(null);
  // The bar is rendered twice (desktop and mobile slots), so ids must be unique.
  const id = useId();
  const categoryId = `${id}-category`;
  const inputId = `${id}-input`;
  const listId = `${id}-list`;

  const [query, setQuery] = useState(params.get("k") ?? "");
  const [category, setCategory] = useState(params.get("category") ?? "");

  // Autocomplete state. The product index is only fetched after the first focus.
  const [hasFocused, setHasFocused] = useState(false);
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const index = useSuggestionIndex(hasFocused);
  const suggestions = matchSuggestions(index ?? [], query, category);
  const showSuggestions = open && index !== null && query.trim() !== "";

  // Keep the box in sync when navigation happens elsewhere (nav links, back button).
  useEffect(() => {
    setQuery(params.get("k") ?? "");
    setCategory(params.get("category") ?? "");
    setOpen(false);
    setActiveIndex(-1);
  }, [params]);

  function closeSuggestions() {
    setOpen(false);
    setActiveIndex(-1);
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    closeSuggestions();
    const trimmed = query.trim();

    // Amazon does nothing on an empty search except keep focus in the box.
    if (!trimmed && !category) {
      inputRef.current?.focus();
      return;
    }

    const next = new URLSearchParams();
    if (trimmed) next.set("k", trimmed);
    if (category) next.set("category", category);
    router.push(`/s?${next.toString()}`);
  }

  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    switch (event.key) {
      case "ArrowDown":
        event.preventDefault();
        if (!showSuggestions) {
          setOpen(true);
        } else if (suggestions.length > 0) {
          setActiveIndex((activeIndex + 1) % suggestions.length);
        }
        break;
      case "ArrowUp":
        event.preventDefault();
        if (showSuggestions && suggestions.length > 0) {
          setActiveIndex((activeIndex - 1 + suggestions.length) % suggestions.length);
        }
        break;
      case "Enter": {
        // With a row highlighted, Enter opens that product instead of searching.
        const picked = showSuggestions ? suggestions[activeIndex] : undefined;
        if (picked) {
          event.preventDefault();
          closeSuggestions();
          router.push(`/product/${picked.id}`);
        }
        break;
      }
      case "Escape":
        // A search input natively clears on Escape; only close the panel when it is open.
        if (showSuggestions) {
          event.preventDefault();
          closeSuggestions();
        }
        break;
    }
  }

  return (
    <div className="relative w-full">
      <form
        role="search"
        onSubmit={handleSubmit}
        className="flex h-10 w-full overflow-hidden rounded-md bg-white focus-within:ring-[3px] focus-within:ring-amz-orange"
      >
        <label className="sr-only" htmlFor={categoryId}>
          Search in
        </label>
        <select
          id={categoryId}
          value={category}
          onChange={(event) => {
            setCategory(event.target.value);
            setActiveIndex(-1);
          }}
          className="hidden max-w-[10rem] cursor-pointer border-r border-amz-border bg-[#f3f3f3] px-2 text-xs text-neutral-700 outline-none hover:bg-neutral-200 sm:block"
        >
          <option value="">All</option>
          {CATEGORIES.map((c) => (
            <option key={c.slug} value={c.slug}>
              {c.label}
            </option>
          ))}
        </select>

        <label className="sr-only" htmlFor={inputId}>
          Search Amazon
        </label>
        <input
          ref={inputRef}
          id={inputId}
          type="search"
          value={query}
          onChange={(event) => {
            setQuery(event.target.value);
            setOpen(true);
            setActiveIndex(-1);
          }}
          onFocus={() => setHasFocused(true)}
          onBlur={closeSuggestions}
          onKeyDown={handleKeyDown}
          placeholder="Search Amazon"
          autoComplete="off"
          role="combobox"
          aria-autocomplete="list"
          aria-expanded={showSuggestions}
          aria-controls={listId}
          aria-activedescendant={activeIndex >= 0 ? optionId(listId, activeIndex) : undefined}
          className="min-w-0 flex-1 px-3 text-base text-neutral-900 outline-none placeholder:text-neutral-500"
        />

        <button
          type="submit"
          aria-label="Go"
          className="flex w-11 items-center justify-center bg-amz-search text-neutral-900 hover:bg-amz-search-hover"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true">
            <circle cx="10.5" cy="10.5" r="6.5" fill="none" stroke="currentColor" strokeWidth="2.2" />
            <path d="M15.5 15.5 L 21 21" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
          </svg>
        </button>
      </form>

      {showSuggestions && (
        <SearchSuggestions
          id={listId}
          suggestions={suggestions}
          query={query}
          category={category}
          activeIndex={activeIndex}
          onHover={setActiveIndex}
          onPick={closeSuggestions}
        />
      )}
    </div>
  );
}
