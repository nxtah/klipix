"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { ChevronDown, LogOut, Menu, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Link, usePathname } from "@/lib/i18n-navigation"
import { signOut } from "@/app/[locale]/(auth)/actions"

const MENU_ITEMS = [
  { href: "/dashboard", label: "Overview" },
  { href: "/dashboard/ideas", label: "Ideas" },
  { href: "/dashboard/projects", label: "Projects" },
]

function getInitials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("")
}

export function NavMenu({
  name,
  avatarUrl,
}: {
  name: string
  avatarUrl: string | null
}) {
  const pathname = usePathname()
  const [profileOpen, setProfileOpen] = useState(false)
  const [mobileNavOpen, setMobileNavOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement | null>(null)

  const initials = useMemo(() => getInitials(name), [name])

  useEffect(() => {
    const handlePointerDown = (event: PointerEvent) => {
      if (!menuRef.current?.contains(event.target as Node)) {
        setProfileOpen(false)
      }
    }

    document.addEventListener("pointerdown", handlePointerDown)
    return () => document.removeEventListener("pointerdown", handlePointerDown)
  }, [])

  useEffect(() => {
    setMobileNavOpen(false)
    setProfileOpen(false)
  }, [pathname])

  return (
    <>
      {/* Desktop nav pills */}
      <nav className="hidden md:inline-flex max-w-full flex-wrap items-center gap-1 rounded-full border-2 border-border bg-card p-1 text-sm font-semibold shadow-neo-xs">
        {MENU_ITEMS.map((item) => {
          const isActive = pathname === item.href

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`rounded-full px-2.5 py-1.5 transition-all hover:bg-accent/10 active:scale-95 ${
                isActive
                  ? "bg-primary/70 text-foreground shadow-neo-xs"
                  : "text-foreground/80"
              }`}
            >
              {item.label}
            </Link>
          )
        })}
      </nav>

      {/* Mobile hamburger */}
      <button
        type="button"
        className="md:hidden inline-flex size-10 items-center justify-center rounded-full border-2 border-border bg-card shadow-neo-xs"
        onClick={() => setMobileNavOpen(true)}
        aria-label="Open menu"
      >
        <Menu className="h-5 w-5" />
      </button>

      {/* Mobile nav overlay */}
      {mobileNavOpen && (
        <div className="fixed inset-0 z-[100] md:hidden">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setMobileNavOpen(false)}
          />
          <div className="absolute right-0 top-0 flex h-full w-72 max-w-[80vw] flex-col border-l-2 border-border bg-card p-6 shadow-neo-lg">
            <div className="flex items-center justify-between mb-8">
              <span className="text-lg font-heading font-semibold">Menu</span>
              <button
                type="button"
                className="inline-flex size-8 items-center justify-center rounded-full border-2 border-border"
                onClick={() => setMobileNavOpen(false)}
                aria-label="Close menu"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <nav className="flex flex-col gap-2">
              {MENU_ITEMS.map((item) => {
                const isActive = pathname === item.href

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`rounded-2xl px-4 py-3 text-sm font-semibold transition-all hover:bg-accent/10 active:scale-95 ${
                      isActive
                        ? "bg-primary/70 text-foreground shadow-neo-xs"
                        : "text-foreground/80"
                    }`}
                  >
                    {item.label}
                  </Link>
                )
              })}
            </nav>

            <div className="mt-auto border-t-2 border-border pt-4">
              <div className="flex items-center gap-3 mb-4">
                <span className="inline-flex size-10 items-center justify-center overflow-hidden rounded-full border-2 border-border bg-muted">
                  {avatarUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={avatarUrl} alt={name} className="size-full object-cover" />
                  ) : (
                    <span className="text-xs font-bold">{initials || "C"}</span>
                  )}
                </span>
                <div className="min-w-0">
                  <p className="text-sm font-semibold truncate">{name}</p>
                  <p className="text-xs text-muted-foreground">Signed in profile</p>
                </div>
              </div>
              <form action={signOut}>
                <Button
                  type="submit"
                  variant="outline"
                  className="w-full justify-start gap-2 rounded-xl"
                >
                  <LogOut className="h-4 w-4" />
                  Sign out
                </Button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Profile dropdown (desktop only) */}
      <div className="relative shrink-0 hidden md:block" ref={menuRef}>
        <Button
          type="button"
          variant="outline"
          className="h-10 gap-2 rounded-full px-2.5"
          onClick={() => setProfileOpen((value) => !value)}
        >
          <span className="inline-flex size-8 items-center justify-center overflow-hidden rounded-full border-2 border-border bg-muted">
            {avatarUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={avatarUrl} alt={name} className="size-full object-cover" />
            ) : (
              <span className="text-xs font-bold">{initials || "C"}</span>
            )}
          </span>
          <span className="max-w-28 truncate text-sm font-semibold">{name}</span>
          <ChevronDown className="h-4 w-4 shrink-0" />
        </Button>

        {profileOpen ? (
          <div className="absolute right-0 top-full z-50 mt-2 w-52 rounded-2xl border-2 border-border bg-card p-2 shadow-neo-sm">
            <div className="px-3 py-2">
              <p className="text-sm font-semibold truncate">{name}</p>
              <p className="text-xs text-muted-foreground">Signed in profile</p>
            </div>
            <form action={signOut}>
              <Button
                type="submit"
                variant="ghost"
                className="w-full justify-start gap-2 rounded-xl px-3 py-2"
              >
                <LogOut className="h-4 w-4" />
                Sign out
              </Button>
            </form>
          </div>
        ) : null}
      </div>
    </>
  )
}
