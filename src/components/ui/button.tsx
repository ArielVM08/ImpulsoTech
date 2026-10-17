import type { ButtonHTMLAttributes } from "react";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost" | "icon" | "card";
};

const variants = {
  primary: "bg-accent text-white shadow-sm hover:bg-accent-dark",
  secondary:
    "border border-border bg-surface text-text shadow-sm hover:border-border-strong hover:bg-bg",
  ghost: "bg-transparent text-muted hover:bg-accent-light hover:text-accent-dark",
  icon: "bg-transparent text-muted hover:bg-bg hover:text-text",
  card:
    "w-full items-stretch justify-start rounded-2xl border border-border bg-surface p-5 text-left text-text shadow-card hover:-translate-y-0.5 hover:border-accent/40 hover:shadow-card-hover",
};

export default function Button({
  className = "",
  variant = "primary",
  ...props
}: ButtonProps) {
  const dimensions =
    variant === "card"
      ? ""
      : variant === "icon"
        ? "size-10 p-0"
        : "h-12 w-full px-5";

  return (
    <button
      className={`inline-flex items-center justify-center gap-2 rounded-xl text-sm font-semibold transition duration-200 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-accent-ring disabled:cursor-not-allowed disabled:opacity-60 ${dimensions} ${variants[variant]} ${className}`}
      {...props}
    />
  );
}
