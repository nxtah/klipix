"use client"

import { usePathname } from "next/navigation"
import Link from "next/link"

const MENU_ITEMS = [
  { href: "/dashboard", label: "Overview" },
  { href: "/dashboard/ideas", label: "Ideas" },
  { href: "/dashboard/projects", label: "Projects" },
]

export function NavMenu() {
  const pathname = usePathname()

  return (
    <nav className="flex flex-wrap gap-4 text-base font-semibold">
      {MENU_ITEMS.map((item) => {
        const isActive = pathname === item.href
        
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`neo-pill transition-all hover:scale-105 active:scale-95 ${
              isActive
                ? "bg-primary/70 shadow-neo-sm"
                : "bg-background border-2 border-border hover:bg-accent/10"
            }`}
          >
            {item.label}
          </Link>
        )
      })}
    </nav>
  )
}
