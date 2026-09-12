import Link from "next/link";
import { useId } from "react";
import { catalogHref, PRICE_BUCKETS, type CatalogQuery } from "@/lib/catalog";
import { CATEGORIES } from "@/lib/categories";

type FilterSidebarProps = {
  query: CatalogQuery;
};

const linkClass = "block py-0.5 text-sm text-neutral-900 hover:text-amz-link-hover";
const activeClass = "block py-0.5 text-sm font-bold text-neutral-900";

// Server component: every filter is a plain link, and the custom price range
// is a GET form, so the page works without JavaScript.
export function FilterSidebar({ query }: FilterSidebarProps) {
  const id = useId();
  const minId = `${id}-min`;
  const maxId = `${id}-max`;

  const hasPriceFilter = query.minPrice !== undefined || query.maxPrice !== undefined;

  return (
    <div className="flex flex-col gap-5 text-sm">
      <section>
        <h2 className="mb-1 font-bold">Department</h2>
        <ul>
          <li>
            <Link href={catalogHref(query, { category: "" })} className={query.category ? linkClass : activeClass}>
              Any Department
            </Link>
          </li>
          {CATEGORIES.map((category) => (
            <li key={category.slug} className="pl-3">
              <Link
                href={catalogHref(query, { category: category.slug })}
                className={query.category === category.slug ? activeClass : linkClass}
                aria-current={query.category === category.slug ? "true" : undefined}
              >
                {category.label}
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2 className="mb-1 font-bold">Price</h2>
        <ul>
          {hasPriceFilter && (
            <li>
              <Link href={catalogHref(query, { minPrice: undefined, maxPrice: undefined })} className={linkClass}>
                Any Price
              </Link>
            </li>
          )}
          {PRICE_BUCKETS.map((bucket) => {
            const active = query.minPrice === bucket.min && query.maxPrice === bucket.max;
            return (
              <li key={bucket.label}>
                <Link
                  href={catalogHref(query, { minPrice: bucket.min, maxPrice: bucket.max })}
                  className={active ? activeClass : linkClass}
                >
                  {bucket.label}
                </Link>
              </li>
            );
          })}
        </ul>

        <form action="/s" method="get" className="mt-2 flex items-center gap-1">
          {/* Only the filters currently in play are carried over, so the URL stays clean. */}
          {query.query && <input type="hidden" name="k" value={query.query} />}
          {query.category && <input type="hidden" name="category" value={query.category} />}
          {query.sort !== "featured" && <input type="hidden" name="sort" value={query.sort} />}
          {query.deals && <input type="hidden" name="deals" value="true" />}

          <label htmlFor={minId} className="sr-only">
            Minimum price
          </label>
          <input
            id={minId}
            name="minPrice"
            type="number"
            min={0}
            step="any"
            inputMode="decimal"
            placeholder="$ Min"
            defaultValue={query.minPrice}
            className="w-20 rounded-md border border-neutral-400 px-2 py-1 text-sm shadow-inner"
          />
          <label htmlFor={maxId} className="sr-only">
            Maximum price
          </label>
          <input
            id={maxId}
            name="maxPrice"
            type="number"
            min={0}
            step="any"
            inputMode="decimal"
            placeholder="$ Max"
            defaultValue={query.maxPrice}
            className="w-20 rounded-md border border-neutral-400 px-2 py-1 text-sm shadow-inner"
          />
          <button
            type="submit"
            className="rounded-full border border-neutral-400 bg-white px-3 py-1 text-sm hover:bg-neutral-100"
          >
            Go
          </button>
        </form>
      </section>
    </div>
  );
}
