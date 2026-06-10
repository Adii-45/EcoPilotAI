import React from "react";
import { cn } from "../../utils/cn";

export function Badge({
  children,
  className,
  variant = "default",
}: {
  children: React.ReactNode;
  className?: string;
  variant?: "default" | "success" | "outline" | "secondary";
}) {
  const variants = {
    default: "bg-primary-container text-on-primary-container",
    success: "bg-primary text-white",
    outline: "border border-outline-variant text-on-surface-variant",
    secondary: "bg-surface-variant text-on-surface",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold font-mono",
        variants[variant],
        className
      )}
    >
      {children}
    </span>
  );
}
