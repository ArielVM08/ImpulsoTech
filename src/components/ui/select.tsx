import type { SelectHTMLAttributes } from "react";

type SelectProps = SelectHTMLAttributes<HTMLSelectElement>;

export default function Select({ className = "", ...props }: SelectProps) {
  return (
    <select
      className={`h-12 w-full rounded-xl border border-border bg-surface px-4 text-sm text-text shadow-sm outline-none transition hover:border-border-strong focus-visible:border-accent focus-visible:ring-4 focus-visible:ring-accent-ring ${className}`}
      {...props}
    />
  );
}
