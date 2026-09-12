"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useId, useRef, useState, type FormEvent } from "react";
import { CATEGORIES } from "@/lib/categories";

export function SearchBar() {
  const router = useRouter();
  const params = useSearchParams();
  const inputRef = useRef<HTMLInputElement>(null);
  // The bar is rendered twice (desktop and mobile slots), so ids must be unique.
  const id = useId();
  const categoryId = `${id}-category`;
  const inputId = `${id}-input`;

  const [query, setQuery] = useState(params.get("k") ?? "");
  const [category, setCategory] = useState(params.get("category") ?? "");

  // Keep the box in sync when navigation happens elsewhere (nav links, back button).
  useEffect(() => {
    setQuery(params.get("k") ?? "");
    setCategory(params.get("category") ?? "");
  }, [params]);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
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

  return (
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
        onChange={(event) => setCategory(event.target.value)}
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
        onChange={(event) => setQuery(event.target.value)}
        placeholder="Search Amazon"
        autoComplete="off"
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
  );
}
