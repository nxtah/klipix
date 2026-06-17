"use client"

import { useEffect, useState } from "react"
import { useTranslations } from "next-intl"
import { User } from "@supabase/supabase-js"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Doodle } from "@/components/ui/doodle"
import { ThemeToggle } from "@/components/ui/theme-toggle"
import { Link } from "@/lib/i18n-navigation"
import { getSupabaseBrowserClient } from "@/lib/supabase/browser"
import { Sparkles, Wand2, BrainCircuit, Zap } from "lucide-react"

function getInitials(name: string | null | undefined) {
  if (!name) return "K"
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("")
}

export default function Home() {
  const t = useTranslations()
  const [user, setUser] = useState<User | null>(null)
  const [fullName, setFullName] = useState<string | null>(null)
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null)

  useEffect(() => {
    const supabase = getSupabaseBrowserClient()
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user)
      if (user) {
        supabase
          .from("profiles")
          .select("full_name, avatar_url")
          .eq("id", user.id)
          .single()
          .then(({ data }) => {
            setFullName(
              data?.full_name ||
                user.user_metadata?.full_name ||
                user.user_metadata?.name ||
                null,
            )
            setAvatarUrl(
              data?.avatar_url ||
                user.user_metadata?.avatar_url ||
                user.user_metadata?.picture ||
                null,
            )
          })
      }
    })
  }, [])

  const initials = getInitials(fullName)

  return (
    <div className="landing-bg flex flex-1 flex-col">
      <div className="landing-dots" />

      <header className="sticky top-0 z-50 border-b-2 border-border bg-card/80 backdrop-blur-sm">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo.png" alt="Klipix" className="h-14 w-14 object-contain" />
            <span className="text-xl font-heading font-semibold">Klipix</span>
          </Link>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            {user ? (
              <Button size="lg" asChild>
                <Link href="/dashboard">
                  <span className="inline-flex size-7 items-center justify-center overflow-hidden rounded-full border-2 border-border bg-muted">
                    {avatarUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={avatarUrl} alt={fullName || "User"} className="size-full object-cover" />
                    ) : (
                      <span className="text-xs font-bold">{initials}</span>
                    )}
                  </span>
                  Dashboard
                </Link>
              </Button>
            ) : (
              <Button size="lg" asChild>
                <Link href="/sign-up">{t("landing.cta1")}</Link>
              </Button>
            )}
          </div>
        </div>
      </header>

      <main className="relative z-10 mx-auto flex w-full max-w-7xl flex-1 flex-col gap-16 px-4 py-14 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <section className="grid items-center gap-12 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-6">
            <span className="neo-pill">
              <Doodle variant="sparkle" className="text-accent" />
              {t("landing.subtitle")}
            </span>
            <h1 className="text-4xl font-heading font-semibold leading-tight sm:text-5xl lg:text-6xl">
              {t("landing.headline").split(t("landing.headlineBold"))[0]}
              <span className="inline-flex rounded-2xl border-2 border-border bg-primary px-2 py-1 shadow-neo-xs">{t("landing.headlineBold")}</span>
              {t("landing.headline").split(t("landing.headlineBold"))[1]}
            </h1>
            <p className="max-w-xl text-lg text-muted-foreground">
              {t("landing.description")}
            </p>
            <div className="flex flex-wrap gap-4">
              <Button size="lg" asChild>
                <Link href="/sign-up">{t("landing.cta1")}</Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link href="/sign-in">{t("landing.cta2")}</Link>
              </Button>
            </div>
            <div className="flex flex-wrap items-center gap-4 text-sm font-semibold">
              <span className="inline-flex items-center gap-2">
                <Doodle variant="star" className="text-secondary" />
                {t("landing.stat1")}
              </span>
              <span className="inline-flex items-center gap-2">
                <Doodle variant="sparkle" className="text-accent" />
                {t("landing.stat2")}
              </span>
            </div>
          </div>

          <div className="grid gap-6">
            <Card className="relative overflow-hidden">
              <CardHeader className="flex-row items-center justify-between">
                <CardTitle>{t("landing.cardTitle1")}</CardTitle>
                <Doodle variant="star" className="text-primary" />
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between rounded-xl border-2 border-border bg-background px-4 py-3 shadow-neo-xs">
                  <div>
                    <p className="font-semibold">Storyboard: &ldquo;Morning Routine&rdquo;</p>
                    <p className="text-sm text-muted-foreground">{t("landing.cardDesc1")}</p>
                  </div>
                  <span className="rounded-full border-2 border-border bg-secondary px-3 py-1 text-xs font-semibold shadow-neo-xs">
                    {t("dashboard.editing")}
                  </span>
                </div>
                <div className="flex items-center justify-between rounded-xl border-2 border-border bg-background px-4 py-3 shadow-neo-xs">
                  <div>
                    <p className="font-semibold">Idea: &ldquo;3 camera tricks&rdquo;</p>
                    <p className="text-sm text-muted-foreground">Captured 12m ago</p>
                  </div>
                  <span className="rounded-full border-2 border-border bg-primary px-3 py-1 text-xs font-semibold shadow-neo-xs">
                    Inbox
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card className="relative overflow-hidden">
              <CardHeader className="flex-row items-center justify-between">
                <CardTitle>{t("landing.cardTitle2")}</CardTitle>
                <Doodle variant="squiggle" className="text-accent" />
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  {t("landing.cardDesc2")}
                </p>
                <div className="flex flex-wrap gap-3">
                  <Button size="sm" asChild>
                    <Link href="/sign-up">{t("landing.btnStart")}</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Core Features */}
        <section className="space-y-8">
          <div className="space-y-2">
            <h2 className="text-3xl font-heading font-semibold">{t("landing.coreFeatures")}</h2>
            <p className="text-muted-foreground">{t("landing.coreDesc")}</p>
          </div>
          <div className="grid gap-6 lg:grid-cols-4">
            {([
              { title: "landing.aiIdeaGenerator", desc: "landing.aiIdeaDesc", icon: "sparkle", bg: "bg-accent/20" },
              { title: "landing.ideaInbox", desc: "landing.ideaDesc", icon: "star", bg: "bg-secondary/80" },
              { title: "landing.scriptScene", desc: "landing.scriptDesc", icon: "squiggle", bg: "bg-accent/20" },
              { title: "landing.publishFlow", desc: "landing.publishDesc", icon: "arrow", bg: "bg-primary/70" },
            ] as const).map((feature, idx) => (
              <Card key={idx} className="group hover:shadow-neo-sm transition-shadow">
                <CardHeader className="flex-row items-center justify-between">
                  <CardTitle>{t(feature.title)}</CardTitle>
                  <span
                    className={`inline-flex size-10 items-center justify-center rounded-2xl border-2 border-border ${feature.bg} shadow-neo-xs`}
                  >
                    <Doodle variant={feature.icon} className="text-foreground" />
                  </span>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{t(feature.desc)}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* AI Feature Showcase */}
        <section className="space-y-8">
          <div className="space-y-2">
            <span className="neo-pill w-fit bg-accent/20">
              <Sparkles className="h-4 w-4 text-accent" />
              AI-Powered
            </span>
            <h2 className="text-3xl font-heading font-semibold">Never run out of ideas again</h2>
            <p className="max-w-2xl text-muted-foreground">
              Klipix is built-in with Google Gemini AI to help you brainstorm content ideas,
              write scripts, and plan scenes — all in seconds.
            </p>
          </div>
          <div className="grid gap-6 lg:grid-cols-3">
            {[
              {
                title: "AI Idea Generator",
                desc: "Enter a topic, pick a platform and tone, and get 8 viral-worthy content ideas instantly.",
                icon: BrainCircuit,
                bg: "bg-accent/20",
              },
              {
                title: "AI Script Writer",
                desc: "Generate complete video scripts with hooks, main content, and calls to action — tailored to your project.",
                icon: Wand2,
                bg: "bg-primary/20",
              },
              {
                title: "AI Scene Planner",
                desc: "Auto-break your project into scenes with titles, descriptions, and duration estimates.",
                icon: Zap,
                bg: "bg-secondary/40",
              },
            ].map((feature) => {
              const Icon = feature.icon
              return (
                <Card key={feature.title} className="group border-accent/30 hover:shadow-neo-sm transition-shadow">
                  <CardHeader className="flex-row items-center justify-between">
                    <CardTitle className="text-lg">{feature.title}</CardTitle>
                    <span
                      className={`inline-flex size-10 items-center justify-center rounded-2xl border-2 border-border ${feature.bg} shadow-neo-xs`}
                    >
                      <Icon className="h-5 w-5 text-foreground" />
                    </span>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">{feature.desc}</p>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </section>

        {/* All Benefits Grid */}
        <section className="space-y-8">
          <div className="space-y-2">
            <h2 className="text-3xl font-heading font-semibold">{t("landing.whyCreators")}</h2>
            <p className="text-muted-foreground">{t("landing.whyDesc")}</p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {([
              { title: "landing.multiPlatform", desc: "landing.multiDesc", icon: "star" },
              { title: "landing.dragDrop", desc: "landing.dragDesc", icon: "sparkle" },
              { title: "landing.realTime", desc: "landing.realDesc", icon: "arrow" },
              { title: "landing.scriptLib", desc: "landing.scriptLibDesc", icon: "star" },
              { title: "landing.deadline", desc: "landing.deadlineDesc", icon: "sparkle" },
              { title: "landing.playful", desc: "landing.playfulDesc", icon: "arrow" },
            ] as const).map((benefit, idx) => (
              <div key={idx} className="neo-card flex flex-col gap-3 p-6">
                <div className="inline-flex size-12 items-center justify-center rounded-2xl border-2 border-border bg-accent/20 shadow-neo-xs">
                  <Doodle variant={benefit.icon} className="text-foreground" />
                </div>
                <h3 className="font-semibold">{t(benefit.title)}</h3>
                <p className="text-sm text-muted-foreground">{t(benefit.desc)}</p>
              </div>
            ))}
          </div>
        </section>

        {/* How It Works */}
        <section className="space-y-8">
          <div className="space-y-2">
            <h2 className="text-3xl font-heading font-semibold">{t("landing.pipeline")}</h2>
            <p className="text-muted-foreground">{t("landing.pipelineDesc")}</p>
          </div>
          <div className="grid gap-6 md:grid-cols-4">
            {([
              { step: "1", title: "landing.step1", desc: "landing.step1Desc" },
              { step: "2", title: "landing.step2", desc: "landing.step2Desc" },
              { step: "3", title: "landing.step3", desc: "landing.step3Desc" },
              { step: "4", title: "landing.step4", desc: "landing.step4Desc" },
            ] as const).map((item, idx) => (
              <div key={idx} className="flex flex-col items-center gap-3">
                <div className="inline-flex size-14 items-center justify-center rounded-2xl border-2 border-border bg-primary shadow-neo-xs">
                  <span className="text-xl font-heading font-bold">{item.step}</span>
                </div>
                <h4 className="font-semibold text-center">{t(item.title)}</h4>
                <p className="text-sm text-muted-foreground text-center">{t(item.desc)}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Stats/Social Proof */}
        <section className="space-y-8">
          <div className="space-y-2">
            <h2 className="text-2xl font-heading font-semibold">{t("landing.builtGrowing")}</h2>
            <p className="text-muted-foreground">{t("landing.builtDesc")}</p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {([
              { number: "1000+", label: "landing.ideasCaptured", desc: "landing.fromSpark", bg: "bg-yellow-100/60 dark:bg-blue-900/50", icon: "sparkle" },
              { number: "5000+", label: "landing.scenesOrganized", desc: "landing.structured", bg: "bg-orange-100/60 dark:bg-emerald-900/50", icon: "arrow" },
              { number: "98%", label: "landing.onTime", desc: "landing.neverMiss", bg: "bg-rose-100/60 dark:bg-purple-900/50", icon: "star" },
            ] as const).map((stat, idx) => (
              <div key={idx} className={`neo-card ${stat.bg} flex flex-col gap-4 p-6 hover:shadow-neo-sm transition-shadow`}>
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-4xl font-heading font-bold text-primary">{stat.number}</p>
                    <p className="text-sm font-semibold text-foreground mt-1">{t(stat.label)}</p>
                  </div>
                  <div className="inline-flex size-12 items-center justify-center rounded-2xl border-2 border-border bg-background shadow-neo-xs">
                    <Doodle variant={stat.icon} className="text-foreground" />
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">{t(stat.desc)}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section className="neo-card flex flex-col items-center justify-center gap-6 p-8 text-center lg:p-12">
          <div className="space-y-3 max-w-2xl">
            <h2 className="text-3xl font-heading font-semibold">{t("landing.readyOrganize")}</h2>
            <p className="text-lg text-muted-foreground">
              {t("landing.readyDesc")}
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-4">
            <Button size="lg" asChild>
              <Link href="/sign-up">{t("landing.joinFree")}</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/sign-in">{t("landing.alreadyMember")}</Link>
            </Button>
          </div>
          <p className="text-sm text-muted-foreground">{t("landing.noCreditCard")}</p>
        </section>
      </main>
    </div>
  )
}
