import type { TextareaHTMLAttributes } from "react";

type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement>;

export default function Textarea({ className = "", ...props }: TextareaProps) {
  return (
    <textarea
      className={`min-h-28 w-full resize-none rounded-xl border border-border bg-surface px-4 py-3 text-sm text-text shadow-sm outline-none transition placeholder:text-placeholder hover:border-border-strong focus-visible:border-accent focus-visible:ring-4 focus-visible:ring-accent-ring ${className}`}
      {...props}
    />
  );
}
