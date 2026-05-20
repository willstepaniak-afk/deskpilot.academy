import * as React from "react";
import { cn } from "../../lib/utils";

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "primary" | "success" | "warning" | "error" | "outline";
}

function Badge({ className, variant = "default", ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md px-2.5 py-0.5 text-xs font-medium",
        {
          "bg-accent/15 text-accent": variant === "default",
          "bg-primary/15 text-primary": variant === "primary",
          "bg-emerald-500/15 text-emerald-400": variant === "success",
          "bg-amber-500/15 text-amber-400": variant === "warning",
          "bg-red-500/15 text-red-400": variant === "error",
          "border border-border text-muted-foreground": variant === "outline",
        },
        className
      )}
      {...props}
    />
  );
}

export { Badge };
