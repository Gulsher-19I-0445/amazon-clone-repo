import Link from "next/link";
import { Suspense } from "react";
import { AccountMenuStub } from "./AccountMenuStub";
import { CartIcon } from "./CartIcon";
import { DeliverTo } from "./DeliverTo";
import { Logo } from "./Logo";
import { NavBar } from "./NavBar";
import { SearchBar } from "./SearchBar";

// SearchBar reads useSearchParams, which requires a Suspense boundary for
// static rendering; the fallback is an identical-looking empty box.
function SearchBarFallback() {
  return <div className="h-10 w-full rounded-md bg-white" aria-hidden="true" />;
}

export function Header() {
  return (
    <header className="sticky top-0 z-40 text-white">
      <div className="bg-amz-navy px-2 py-1">
        <div className="flex items-center gap-1 md:gap-2">
          <Logo />
          <DeliverTo />

          <div className="hidden flex-1 md:block">
            <Suspense fallback={<SearchBarFallback />}>
              <SearchBar />
            </Suspense>
          </div>

          <div className="ml-auto flex items-center gap-1">
            <AccountMenuStub />
            <Link
              href="/cart"
              className="hidden flex-col rounded-sm border border-transparent px-2 py-1 leading-tight hover:border-white lg:flex"
            >
              <span className="text-xs">Returns</span>
              <span className="text-sm font-bold">&amp; Orders</span>
            </Link>
            <CartIcon />
          </div>
        </div>

        {/* Search drops to its own full-width row on small screens. */}
        <div className="pb-1 pt-1 md:hidden">
          <Suspense fallback={<SearchBarFallback />}>
            <SearchBar />
          </Suspense>
        </div>
      </div>

      <NavBar />
    </header>
  );
}
