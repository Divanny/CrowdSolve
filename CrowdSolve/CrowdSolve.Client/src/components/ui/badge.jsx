import * as React from "react"
import { cva } from "class-variance-authority";

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground shadow",
        secondary:
          "border-transparent bg-foreground/10 text-secondary-foreground",
        destructive:
          "bg-red-600/10 text-red-600 ring-1 ring-inset ring-red-500 group-hover:no-underline dark:bg-red-500/10 dark:text-red-500 dark:ring-red-500/20",
        outline: "text-foreground",
        success:
          "bg-lime-600/10 text-lime-600 ring-1 ring-inset ring-lime-500 group-hover:no-underline dark:bg-lime-500/10 dark:text-lime-500 dark:ring-lime-500/20",
        warning:
          "bg-yellow-600/10 text-yellow-600 ring-1 ring-inset ring-yellow-500 group-hover:no-underline dark:bg-yellow-500/10 dark:text-yellow-500 dark:ring-yellow-500/20",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function Badge({
  className,
  variant,
  ...props
}) {
  return (<div className={cn(badgeVariants({ variant }), className)} {...props} />);
}

export { Badge, badgeVariants }
