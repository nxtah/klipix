import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { Slot } from "radix-ui"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "group/button inline-flex shrink-0 items-center justify-center gap-2 rounded-xl border-2 border-border text-sm font-semibold whitespace-nowrap transition-[transform,box-shadow,background-color] duration-150 outline-none select-none focus-visible:ring-2 focus-visible:ring-ring/60 hover:-rotate-1 hover:translate-x-0.5 hover:translate-y-0.5 active:translate-x-1 active:translate-y-1 active:shadow-none disabled:pointer-events-none disabled:opacity-60 aria-invalid:border-destructive aria-invalid:ring-2 aria-invalid:ring-destructive/30 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground shadow-neo-sm",
        outline:
          "bg-background shadow-neo-sm hover:bg-muted aria-expanded:bg-muted",
        secondary:
          "bg-secondary text-secondary-foreground shadow-neo-sm hover:bg-secondary/80 aria-expanded:bg-secondary",
        ghost:
          "border-transparent bg-transparent shadow-none hover:bg-muted",
        destructive:
          "bg-destructive text-white shadow-neo-sm hover:bg-destructive/90 focus-visible:ring-destructive/40",
        link:
          "border-transparent bg-transparent shadow-none text-foreground underline-offset-4 hover:underline",
      },
      size: {
        default:
          "h-11 gap-2 px-5 text-base has-data-[icon=inline-end]:pr-4 has-data-[icon=inline-start]:pl-4",
        xs: "h-6 gap-1 rounded-[min(var(--radius-md),10px)] px-2 text-xs in-data-[slot=button-group]:rounded-lg has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 [&_svg:not([class*='size-'])]:size-3",
        sm: "h-9 gap-2 px-4 text-sm",
        lg: "h-12 gap-2 px-6 text-base",
        icon: "size-8",
        "icon-xs":
          "size-6 rounded-[min(var(--radius-md),10px)] in-data-[slot=button-group]:rounded-lg [&_svg:not([class*='size-'])]:size-3",
        "icon-sm":
          "size-7 rounded-[min(var(--radius-md),12px)] in-data-[slot=button-group]:rounded-lg",
        "icon-lg": "size-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant = "default",
  size = "default",
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot.Root : "button"

  return (
    <Comp
      data-slot="button"
      data-variant={variant}
      data-size={size}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
