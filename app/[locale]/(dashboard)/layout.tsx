import { Doodle } from "@/components/ui/doodle"
import { ThemeToggle } from "@/components/ui/theme-toggle"
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
    redirect({ href: "/sign-in", locale: "en" })
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, username, avatar_url")
    .eq("id", user!.id)
    .single()

  const displayName =
    profile?.full_name ||
    user!.user_metadata?.full_name ||
    user!.user_metadata?.name ||
    profile?.username ||
    "Creator"
  const avatarUrl =
    profile?.avatar_url ||
    user!.user_metadata?.avatar_url ||
    user!.user_metadata?.picture ||
    null

  return (
    <div className="landing-bg flex min-h-screen flex-col">
      <div className="landing-dots" />
      <header className="sticky top-0 z-50 border-b-2 border-border bg-card/80 backdrop-blur-sm">
        <div className="mx-auto flex w-full max-w-7xl items-center gap-3 px-4 py-3 sm:px-6 lg:px-8">
          <Link href="/" className="flex shrink-0 items-center gap-2 md:gap-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo.png" alt="Klipix" className="h-10 w-10 md:h-16 md:w-16 object-contain" />
            <div className="min-w-0">
              <p className="text-base md:text-xl font-heading font-semibold leading-none">Klipix</p>
              <p className="hidden md:mt-1 md:block text-sm text-muted-foreground">
                Hi {displayName} 👋
              </p>
            </div>
          </Link>

          <div className="flex items-center gap-2 ml-auto">
            <NavMenu name={displayName} avatarUrl={avatarUrl} />
            <ThemeToggle />
          </div>
        </div>
      </header>
      <main className="relative z-10 mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        {children}
      </main>
      <footer className="relative z-10 mx-auto mt-auto w-full max-w-7xl border-t-2 border-border px-4 py-6 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-3 text-center sm:flex-row sm:text-left">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} Natah-Genesis
          </p>
          <div className="flex items-center gap-4">
            <a
              href="https://www.instagram.com/ykzirnathaniel/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              @ykzirnathaniel
            </a>
            <a
              href="https://www.linkedin.com/in/rizky-nathaniel-lukas/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              LinkedIn
            </a>
          </div>
        </div>
      </footer>
    </div>
  )
}
