"use client";

import { useRouter } from "next/navigation";
import { useId } from "react";

export type SortDropdownOption = {
  value: string;
  label: string;
  /** Full /s URL for this sort; built server-side so this bundle stays tiny. */
  href: string;
};

type SortDropdownProps = {
  options: SortDropdownOption[];
  current: string;
};

export function SortDropdown({ options, current }: SortDropdownProps) {
  const router = useRouter();
  const id = useId();

  return (
    <label htmlFor={id} className="flex items-center gap-2 text-xs text-neutral-700">
      <span className="whitespace-nowrap">Sort by:</span>
      <select
        id={id}
        value={current}
        onChange={(event) => {
          const target = options.find((option) => option.value === event.target.value);
          if (target) router.push(target.href);
        }}
        className="cursor-pointer rounded-lg border border-amz-border bg-[#f0f2f2] px-2 py-1 text-xs text-neutral-900 shadow-sm hover:bg-neutral-200"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}
