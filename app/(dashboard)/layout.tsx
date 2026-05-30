import Link from "next/link"
import { redirect } from "next/navigation"

import { Button } from "@/components/ui/button"
import { Doodle } from "@/components/ui/doodle"
import { Separator } from "@/components/ui/separator"
import { ThemeToggle } from "@/components/ui/theme-toggle"
import { getSupabaseServerClient } from "@/lib/supabase/server"
import { signOut } from "@/app/(auth)/actions"
import { NavMenu } from "./nav-menu"

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = await getSupabaseServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/sign-in")
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, username")
    .eq("id", user.id)
    .single()

  const displayName = profile?.full_name || profile?.username || "Creator"

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b-2 border-border bg-card">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-8 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <Link href="/" className="flex items-center gap-4">
              <span className="inline-flex size-14 items-center justify-center rounded-2xl border-2 border-border bg-primary shadow-neo-xs">
                <Doodle variant="sparkle" className="text-foreground h-7 w-7" />
              </span>
              <div>
                <p className="text-2xl font-heading font-semibold">Klipix</p>
                <p className="text-base text-muted-foreground">Hi {displayName} 👋</p>
              </div>
            </Link>
            <div className="flex items-center gap-2">
              <ThemeToggle />
              <form action={signOut}>
                <Button variant="outline" size="lg" type="submit">
                  Sign out
                </Button>
              </form>
            </div>
          </div>
          <NavMenu />
        </div>
      </header>
      <Separator />
      <main className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  )
}
