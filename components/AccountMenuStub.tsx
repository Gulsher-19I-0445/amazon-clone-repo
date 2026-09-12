"use client";

import Link from "next/link";
import { useId, useState } from "react";

// Visual stub of "Hello, sign in / Account & Lists". Real authentication is an
// intentional scope cut (feature_list.json S2); the dropdown says so.
export function AccountMenuStub() {
  const [open, setOpen] = useState(false);
  const menuId = useId();

  return (
    <div
      className="relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      onFocus={() => setOpen(true)}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) {
          setOpen(false);
        }
      }}
    >
      <button
        type="button"
        aria-haspopup="true"
        aria-expanded={open}
        aria-controls={menuId}
        className="flex flex-col items-start rounded-sm border border-transparent px-2 py-1 text-left leading-tight text-white hover:border-white"
      >
        <span className="text-xs">Hello, sign in</span>
        <span className="text-sm font-bold">
          Account &amp; Lists <span aria-hidden="true" className="text-neutral-400">▾</span>
        </span>
      </button>

      {open && (
        <div
          id={menuId}
          role="menu"
          className="absolute right-0 top-full z-50 w-64 rounded-sm bg-white p-4 text-neutral-900 shadow-lg"
        >
          <div
            aria-hidden="true"
            className="absolute -top-2 right-10 h-0 w-0 border-x-8 border-b-8 border-x-transparent border-b-white"
          />
          <button
            type="button"
            className="w-full rounded-lg bg-amz-yellow px-4 py-2 text-sm font-medium shadow-sm hover:bg-amz-yellow-hover"
          >
            Sign in
          </button>
          <p className="mt-2 text-center text-xs">
            New customer?{" "}
            <span className="cursor-pointer text-amz-link hover:text-amz-link-hover hover:underline">
              Start here.
            </span>
          </p>
          <div className="mt-3 border-t border-neutral-200 pt-3">
            <p className="text-sm font-bold">Your Lists</p>
            <Link
              href="/wishlist"
              role="menuitem"
              className="mt-1 block text-xs text-neutral-700 hover:text-amz-link-hover hover:underline"
            >
              Wish List
            </Link>
          </div>
          <p className="mt-3 border-t border-neutral-200 pt-3 text-xs text-neutral-600">
            This is a demo store — no account is needed. Browse, add to cart, and check out as a
            guest.
          </p>
        </div>
      )}
    </div>
  );
}
