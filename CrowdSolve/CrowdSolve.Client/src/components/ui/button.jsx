import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva } from "class-variance-authority";

import { cn } from "@/lib/utils"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground shadow hover:bg-primary/90",
        destructive:
          "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",
        outline:
          "border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground",
        outlineDestructive:
          "border border-red-600/50 ring-red-600 text-red-600/50 hover:bg-red-600/10 hover:text-red-600 dark:hover:bg-red-500/10 dark:hover:text-red-500 dark:ring-red-500 dark:text-red-500 dark:border-red-500/20",
        secondary:
          "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        ghostWarning: "hover:bg-yellow-600/10 text-yellow-600 group-hover:no-underline dark:hover:bg-yellow-500/10 dark:text-yellow-500 dark:ring-yellow-500/20",
        ghostSuccess: "hover:bg-lime-600/10 text-lime-600 group-hover:no-underline dark:hover:bg-lime-500/10 dark:text-lime-500 dark:ring-lime-500/20",
        ghostDestructive: "hover:bg-red-600/10 text-red-600 group-hover:no-underline dark:hover:bg-red-500/10 dark:text-red-500 dark:ring-red-500/20",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-10 rounded-md px-8",
        icon: "h-9 w-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

const Button = React.forwardRef(({ className, variant, size, asChild = false, tooltip = null, ...props }, ref) => {
  const Comp = asChild ? Slot : "button"
  return (
    ((tooltip ? <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild><Comp
          className={cn(buttonVariants({ variant, size, className }))}
          ref={ref}
          {...props} /></TooltipTrigger>
        <TooltipContent>
          <p>{tooltip}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider> : <Comp
      className={cn(buttonVariants({ variant, size, className }))}
      ref={ref}
      {...props} />)
    )
  );
})
Button.displayName = "Button"

export { Button, buttonVariants }
