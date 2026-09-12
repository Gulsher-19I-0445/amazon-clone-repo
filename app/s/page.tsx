import type { Metadata } from "next";
import { Suspense } from "react";
import { CatalogResults, CatalogResultsSkeleton } from "@/components/CatalogResults";
import { FilterSidebar } from "@/components/FilterSidebar";
import { parseCatalogQuery, type RawSearchParams } from "@/lib/catalog";
import { categoryLabel } from "@/lib/categories";

type SearchPageProps = {
  searchParams: Promise<RawSearchParams>;
};

// Filters, sort and page all live in the URL, so this page renders per request.
export const dynamic = "force-dynamic";

export async function generateMetadata({ searchParams }: SearchPageProps): Promise<Metadata> {
  const query = parseCatalogQuery(await searchParams);
  const subject = query.query
    ? `“${query.query}”`
    : query.category
      ? categoryLabel(query.category)
      : query.deals
        ? "Today's Deals"
        : "All products";
  return { title: `${subject} | Amazon.com clone` };
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const query = parseCatalogQuery(await searchParams);
  const sidebar = <FilterSidebar query={query} />;

  return (
    <main className="flex-1 px-4 py-4">
      <div className="mx-auto flex max-w-[1500px] flex-col gap-4 md:flex-row">
        {/* Filters collapse behind a disclosure on phones and sit in a column from md up. */}
        <details className="rounded-md bg-white p-3 shadow-sm md:hidden">
          <summary className="cursor-pointer text-sm font-bold">Filters</summary>
          <div className="mt-3">{sidebar}</div>
        </details>
        <aside aria-label="Filters" className="hidden w-56 shrink-0 md:block">
          {sidebar}
        </aside>

        <div className="min-w-0 flex-1">
          {/* Lives above the results (not in the sidebar) so it is visible when filters are collapsed on phones. */}
          {query.invalidPriceRange && (
            <p role="alert" className="mb-3 rounded-md border border-amz-price/40 bg-red-50 px-4 py-2 text-sm text-amz-price">
              Price range ${query.invalidPriceRange.min} to ${query.invalidPriceRange.max} was ignored because the
              minimum is greater than the maximum. Showing all prices.
            </p>
          )}
          {/* Keyed so a filter/sort change shows the skeleton instead of the stale grid. */}
          <Suspense key={JSON.stringify(query)} fallback={<CatalogResultsSkeleton />}>
            <CatalogResults query={query} />
          </Suspense>
        </div>
      </div>
    </main>
  );
}
