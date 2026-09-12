import Link from "next/link";
import { categoryLabel, NAV_CATEGORY_SLUGS } from "@/lib/categories";

const linkClass =
  "whitespace-nowrap rounded-sm border border-transparent px-2 py-1.5 text-sm hover:border-white";

// Secondary dark row under the main header. Apart from the Wish List, every
// link lands on the listing page (/s), which handles search, category and
// deals via URL params.
export function NavBar() {
  return (
    <nav
      aria-label="Shop by category"
      className="flex items-center gap-1 overflow-x-auto bg-amz-navy-light px-2 py-1 text-white [scrollbar-width:none]"
    >
      <Link href="/s" className={`${linkClass} flex items-center gap-1 font-bold`}>
        <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
          <path d="M2 4h14M2 9h14M2 14h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
        All
      </Link>
      <Link href="/s?deals=true" className={`${linkClass} font-bold text-amz-yellow`}>
        Today&apos;s Deals
      </Link>
      <Link href="/wishlist" className={linkClass}>
        Wish List
      </Link>
      {NAV_CATEGORY_SLUGS.map((slug) => (
        <Link key={slug} href={`/s?category=${slug}`} className={linkClass}>
          {categoryLabel(slug)}
        </Link>
      ))}
    </nav>
  );
}
