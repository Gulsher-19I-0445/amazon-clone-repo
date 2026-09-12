import Link from "next/link";

// Wordmark with the orange "smile" arrow beneath it, drawn inline so no image assets are needed.
export function Logo() {
  return (
    <Link
      href="/"
      aria-label="Amazon clone home"
      className="flex items-start rounded-sm border border-transparent px-2 py-1 text-white hover:border-white"
    >
      <span className="flex flex-col">
        <span className="text-[26px] font-bold leading-none tracking-tight">amazon</span>
        <svg width="78" height="10" viewBox="0 0 78 10" aria-hidden="true" className="-mt-[3px]">
          <path
            d="M3 2.5 C 22 11, 52 11, 70 4"
            fill="none"
            stroke="#ff9900"
            strokeWidth="2.4"
            strokeLinecap="round"
          />
          <path
            d="M66 1.5 L 71.5 3.8 L 67.5 7.5"
            fill="none"
            stroke="#ff9900"
            strokeWidth="2.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
      <span className="mt-[2px] text-[11px] leading-none">.com</span>
    </Link>
  );
}
