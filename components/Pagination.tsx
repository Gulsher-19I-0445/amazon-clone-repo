import Link from "next/link";
import { catalogHref, pageCount, type CatalogQuery } from "@/lib/catalog";

type PaginationProps = {
  query: CatalogQuery;
  total: number;
};

const pill = "flex h-10 min-w-10 items-center justify-center rounded-md px-3 text-sm";
const linkPill = `${pill} text-neutral-900 hover:bg-neutral-100 hover:underline`;
const disabledPill = `${pill} cursor-default text-neutral-400`;

// Amazon-style pager. The catalog is small (max 9 pages), so every page is
// listed; a single page renders nothing at all.
export function Pagination({ query, total }: PaginationProps) {
  const pages = pageCount(total);
  if (pages <= 1) return null;

  const current = query.page;
  const hasPrevious = current > 1;
  const hasNext = current < pages;

  return (
    <nav aria-label="Pagination" className="mt-6 flex justify-center">
      <ul className="flex flex-wrap items-center gap-1 rounded-lg bg-white p-1 shadow-sm">
        <li>
          {hasPrevious ? (
            <Link rel="prev" href={catalogHref(query, { page: current - 1 })} className={linkPill}>
              ← Previous
            </Link>
          ) : (
            <span aria-disabled="true" className={disabledPill}>
              ← Previous
            </span>
          )}
        </li>

        {Array.from({ length: pages }, (_, i) => i + 1).map((page) => (
          <li key={page}>
            {page === current ? (
              <span aria-current="page" className={`${pill} border border-neutral-900 font-bold`}>
                {page}
              </span>
            ) : (
              <Link href={catalogHref(query, { page })} className={linkPill}>
                {page}
              </Link>
            )}
          </li>
        ))}

        <li>
          {hasNext ? (
            <Link rel="next" href={catalogHref(query, { page: current + 1 })} className={linkPill}>
              Next →
            </Link>
          ) : (
            <span aria-disabled="true" className={disabledPill}>
              Next →
            </span>
          )}
        </li>
      </ul>
    </nav>
  );
}
