// Static stub of Amazon's "Deliver to" location picker.
export function DeliverTo() {
  return (
    <div className="hidden items-end gap-1 rounded-sm border border-transparent px-2 py-1 text-white hover:border-white lg:flex">
      <svg width="16" height="20" viewBox="0 0 16 20" aria-hidden="true" className="mb-[3px]">
        <path
          d="M8 0a6 6 0 0 0-6 6c0 4.5 6 12 6 12s6-7.5 6-12a6 6 0 0 0-6-6zm0 8.5A2.5 2.5 0 1 1 8 3.5a2.5 2.5 0 0 1 0 5z"
          fill="currentColor"
        />
      </svg>
      <div className="leading-tight">
        <div className="text-xs text-neutral-300">Deliver to</div>
        <div className="text-sm font-bold">United States</div>
      </div>
    </div>
  );
}
