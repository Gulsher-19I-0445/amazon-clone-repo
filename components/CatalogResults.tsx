import Link from "next/link";
import { catalogHref, PAGE_SIZE, pageCount, SORT_OPTIONS, type CatalogQuery } from "@/lib/catalog";
import { categoryLabel } from "@/lib/categories";
import { getCatalogPage, type CatalogPage } from "@/lib/products";
import { HomeSectionError } from "./HomeSectionError";
import { Pagination } from "./Pagination";
import { ProductGrid, ProductGridSkeleton } from "./ProductGrid";
import { SortDropdown } from "./SortDropdown";

type CatalogResultsProps = {
  query: CatalogQuery;
};

const resultsBarClass = "flex flex-wrap items-center justify-between gap-2 rounded-md bg-white px-4 py-2 shadow-sm";

/** "for “phone” in Laptops" — whatever part of the query the visitor typed or picked. */
function describeScope(query: CatalogQuery) {
  return (
    <>
      {query.query && (
        <>
          {" "}
          for <span className="font-bold text-amz-price">“{query.query}”</span>
        </>
      )}
      {query.category && <> in {categoryLabel(query.category)}</>}
      {query.deals && <> in Today&apos;s Deals</>}
    </>
  );
}

// Server component: runs the catalog query for the current URL. Only the
// query is guarded so render bugs still surface (same pattern as HomeProductRail).
export async function CatalogResults({ query }: CatalogResultsProps) {
  let page: CatalogPage;
  try {
    page = await getCatalogPage(query);
  } catch (error) {
    console.error("CatalogResults: failed to load products", error);
    return <HomeSectionError />;
  }

  const { products, total } = page;

  if (total === 0) {
    return (
      <div className="rounded-md bg-white p-8 shadow-sm">
        <p className="text-lg">No results{describeScope(query)}.</p>
        <p className="mt-2 text-sm text-neutral-700">
          Try checking your spelling, use more general terms, or remove some filters.
        </p>
        <Link href="/s" className="mt-4 inline-block text-sm text-amz-link hover:text-amz-link-hover hover:underline">
          Clear all filters
        </Link>
      </div>
    );
  }

  if (products.length === 0) {
    // Page number past the end of the results (e.g. a stale bookmark).
    return (
      <div className="rounded-md bg-white p-8 shadow-sm">
        <p className="text-lg">There is no page {query.page} of these results.</p>
        <p className="mt-2 text-sm text-neutral-700">
          {total.toLocaleString("en-US")} {total === 1 ? "result" : "results"} across {pageCount(total)}{" "}
          {pageCount(total) === 1 ? "page" : "pages"}.
        </p>
        <Link
          href={catalogHref(query, { page: 1 })}
          className="mt-4 inline-block text-sm text-amz-link hover:text-amz-link-hover hover:underline"
        >
          Go to the first page
        </Link>
      </div>
    );
  }

  const firstIndex = (query.page - 1) * PAGE_SIZE + 1;
  const lastIndex = firstIndex + products.length - 1;
  const sortOptions = SORT_OPTIONS.map((option) => ({
    ...option,
    href: catalogHref(query, { sort: option.value }),
  }));

  return (
    <>
      <div className={resultsBarClass}>
        <p className="text-sm text-neutral-700">
          {firstIndex}-{lastIndex} of {total.toLocaleString("en-US")} {total === 1 ? "result" : "results"}
          {describeScope(query)}
        </p>
        <SortDropdown options={sortOptions} current={query.sort} />
      </div>
      <div className="mt-3">
        <ProductGrid products={products} />
      </div>
      <Pagination query={query} total={total} />
    </>
  );
}

/** Same footprint as the results bar + grid, shown while the query runs. */
export function CatalogResultsSkeleton() {
  return (
    <>
      <div aria-hidden="true" className={`${resultsBarClass} animate-pulse`}>
        <div className="h-4 w-48 rounded bg-neutral-200" />
        <div className="h-6 w-40 rounded bg-neutral-200" />
      </div>
      <div className="mt-3">
        <ProductGridSkeleton count={PAGE_SIZE} />
      </div>
    </>
  );
}
