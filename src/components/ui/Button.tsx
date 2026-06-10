import React from "react";
import { cn } from "../../utils/cn";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "outline";
  size?: "sm" | "md" | "lg";
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", children, ...props }, ref) => {
    const variants = {
      primary:
        "bg-primary text-white border-t border-white/20 hover:bg-primary/90 shadow-sm active:scale-[0.98] transition-all",
      secondary: "bg-surface-variant text-on-surface hover:bg-surface-dim",
      ghost: "hover:bg-surface-container text-on-surface",
      outline: "border border-outline-variant bg-transparent hover:bg-surface-container text-on-surface",
    };

    const sizes = {
      sm: "h-8 px-3 text-sm",
      md: "h-11 px-5 font-medium",
      lg: "h-14 px-8 text-lg font-semibold",
    };

    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center rounded-md transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none",
          variants[variant],
          sizes[size],
          className
        )}
        {...props}
      >
        {children}
      </button>
    );
  }
);
Button.displayName = "Button";
