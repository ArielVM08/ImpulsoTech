import type { InputHTMLAttributes } from "react";

type InputProps = InputHTMLAttributes<HTMLInputElement>;

export default function Input({ className = "", ...props }: InputProps) {
  return (
    <input
      className={`h-12 w-full rounded-xl border border-border bg-surface px-4 text-sm text-text shadow-sm outline-none transition placeholder:text-placeholder hover:border-border-strong focus-visible:border-accent focus-visible:ring-4 focus-visible:ring-accent-ring aria-[invalid=true]:border-error aria-[invalid=true]:ring-error-ring ${className}`}
      {...props}
    />
  );
}
