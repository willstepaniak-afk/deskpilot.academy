import * as React from "react";
import { cn } from "../../lib/utils";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "primary" | "outline" | "ghost" | "destructive" | "link";
  size?: "sm" | "md" | "lg" | "icon";
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "md", ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center gap-2 rounded-md font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50",
          {
            // Bold orange-red CTA — visually dominant, high urgency
            "bg-accent text-accent-foreground shadow-lg shadow-accent/25 hover:bg-[hsl(12,90%,48%)] hover:shadow-xl hover:shadow-accent/30 hover:-translate-y-0.5 active:translate-y-0 active:shadow-md": variant === "default",
            // Electric blue primary — trust, professional actions
            "bg-primary text-primary-foreground shadow-md shadow-primary/20 hover:bg-[hsl(217,91%,52%)] hover:shadow-lg hover:shadow-primary/25 hover:-translate-y-0.5 active:translate-y-0": variant === "primary",
            // Outlined — secondary actions
            "border border-border bg-transparent text-foreground hover:bg-secondary hover:border-primary/50": variant === "outline",
            // Ghost — tertiary actions
            "bg-transparent text-foreground hover:bg-secondary": variant === "ghost",
            // Destructive
            "bg-destructive text-destructive-foreground hover:bg-red-500": variant === "destructive",
            // Link
            "text-primary underline-offset-4 hover:underline p-0 h-auto": variant === "link",
          },
          {
            "h-8 px-3 text-sm": size === "sm",
            "h-10 px-5 text-sm": size === "md",
            "h-12 px-8 text-base": size === "lg",
            "h-10 w-10 p-0": size === "icon",
          },
          className
        )}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button };
