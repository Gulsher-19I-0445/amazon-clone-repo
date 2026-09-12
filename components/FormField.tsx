import type { ReactNode } from "react";

type FormFieldProps = {
  id: string;
  label: string;
  error?: string;
  hint?: string;
  children: (control: { id: string; describedBy: string | undefined; invalid: boolean }) => ReactNode;
};

// Label + control + error message, wired together with aria attributes.
// The child renders its own <input>/<select> so any control type can be used.
export function FormField({ id, label, error, hint, children }: FormFieldProps) {
  const errorId = `${id}-error`;
  const hintId = `${id}-hint`;
  const describedBy = [error ? errorId : null, hint ? hintId : null].filter(Boolean).join(" ") || undefined;

  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={id} className="text-sm font-bold">
        {label}
      </label>
      {children({ id, describedBy, invalid: error !== undefined })}
      {hint && !error && (
        <p id={hintId} className="text-xs text-neutral-600">
          {hint}
        </p>
      )}
      {error && (
        <p id={errorId} className="flex items-start gap-1 text-xs text-amz-price">
          <span aria-hidden="true" className="font-bold">
            !
          </span>
          {error}
        </p>
      )}
    </div>
  );
}

/** Shared input styling so every text field and select on the form matches. */
export function fieldClass(invalid: boolean): string {
  return [
    "w-full rounded-sm border px-2 py-1.5 text-sm shadow-inner outline-none",
    "focus:border-amz-orange focus:ring-2 focus:ring-amz-search/60",
    invalid ? "border-amz-price bg-red-50" : "border-neutral-400 bg-white",
  ].join(" ");
}
