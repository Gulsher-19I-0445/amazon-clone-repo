"use client";

type AddToCartButtonProps = {
  disabled?: boolean;
  onClick: () => void;
};

export function AddToCartButton({ disabled = false, onClick }: AddToCartButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="w-full rounded-full bg-amz-yellow px-4 py-2 text-sm shadow-sm hover:bg-amz-yellow-hover disabled:cursor-not-allowed disabled:bg-neutral-200 disabled:text-neutral-500"
    >
      Add to Cart
    </button>
  );
}
