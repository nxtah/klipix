import { Doodle } from "@/components/ui/doodle"
import { ThemeToggle } from "@/components/ui/theme-toggle"
import { LanguageSwitcher } from "@/components/ui/language-switcher"
import { Link, redirect } from "@/lib/i18n-navigation"
import { getSupabaseServerClient } from "@/lib/supabase/server"
import { NavMenu } from "./nav-menu"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await getSupabaseServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/sign-in")
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, username, avatar_url")
    .eq("id", user.id)
    .single()

  const displayName =
    profile?.full_name ||
    user.user_metadata?.full_name ||
    user.user_metadata?.name ||
    profile?.username ||
    "Creator"
  const avatarUrl =
    profile?.avatar_url ||
    user.user_metadata?.avatar_url ||
    user.user_metadata?.picture ||
    null

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b-2 border-border bg-card">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-4 px-4 py-5 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center gap-4">
            <Link href="/" className="flex shrink-0 items-center gap-3">
              <span className="inline-flex size-12 items-center justify-center rounded-2xl border-2 border-border bg-primary shadow-neo-xs">
                <Doodle variant="sparkle" className="text-foreground h-6 w-6" />
              </span>
              <div className="min-w-0">
                <p className="text-xl font-heading font-semibold leading-none">Klipix</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Hi {displayName} 👋
                </p>
              </div>
            </Link>
            <NavMenu name={displayName} avatarUrl={avatarUrl} />
            <div className="ml-auto flex items-center gap-2">
              <LanguageSwitcher />
              <ThemeToggle />
            </div>
          </div>
        </div>
      </header>
      <main className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  )
}
