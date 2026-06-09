import { formatDistanceToNow } from "date-fns"
import {
  ArrowRight,
  CheckCircle2,
  FolderPlus,
  Lightbulb,
  Sparkles,
} from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Doodle } from "@/components/ui/doodle"
import { Link } from "@/lib/i18n-navigation"
import { getSupabaseServerClient } from "@/lib/supabase/server"

const statusLabels = {
  idea: "Idea",
  scripting: "Scripting",
  shooting: "Shooting",
  editing: "Editing",
  posted: "Posted",
} as const

function formatSoon(date: string | null) {
  if (!date) return "No deadline"

  return formatDistanceToNow(new Date(date), { addSuffix: true })
}

export default async function DashboardPage() {
  const supabase = await getSupabaseServerClient()

  const [{ data: ideas }, { data: projects }] = await Promise.all([
    supabase
      .from("ideas")
      .select("id, content, created_at, is_promoted, promoted_to_project_id")
      .order("created_at", { ascending: false }),
    supabase
      .from("projects")
      .select("id, title, status, deadline, updated_at")
      .order("updated_at", { ascending: false }),
  ])

  const allIdeas = ideas ?? []
  const allProjects = projects ?? []
  const activeIdeas = allIdeas.filter((idea) => !idea.is_promoted)
  const promotedIdeas = allIdeas.filter((idea) => idea.is_promoted)
  const dueSoonProjects = [...allProjects]
    .filter((project) => project.deadline)
    .sort((a, b) => new Date(a.deadline ?? 0).getTime() - new Date(b.deadline ?? 0).getTime())
    .slice(0, 3)

  const stats = [
    {
      label: "Ideas in inbox",
      value: allIdeas.length,
      hint: activeIdeas.length ? `${activeIdeas.length} still waiting for action` : "Inbox is fully cleared",
      icon: Lightbulb,
    },
    {
      label: "Active projects",
      value: allProjects.length,
      hint: dueSoonProjects.length ? `${dueSoonProjects.length} deadlines coming up` : "No deadlines in view",
      icon: FolderPlus,
    },
    {
      label: "Promoted ideas",
      value: promotedIdeas.length,
      hint: promotedIdeas.length ? "Already linked to projects" : "None promoted yet",
      icon: Sparkles,
    },
  ] as const

  const checklist = [
    {
      title: "Capture one sharp idea",
      done: allIdeas.length > 0,
      description: "Keep hooks, angles, or references in the inbox before they disappear.",
    },
    {
      title: "Turn a winning idea into a project",
      done: allProjects.length > 0,
      description: "Move promising concepts into a structured pipeline with a deadline.",
    },
    {
      title: "Review what is due soon",
      done: dueSoonProjects.length > 0,
      description: "Prioritize the next action so the board never feels overwhelming.",
    },
  ]

  return (
    <div className="space-y-8">
      <section className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <Card className="overflow-hidden">
          <CardHeader className="space-y-4 pb-4">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="space-y-2">
                <span className="neo-pill w-fit bg-primary/70">
                  <Doodle variant="sparkle" className="text-foreground" />
                  Studio overview
                </span>
                <CardTitle className="text-3xl sm:text-4xl">
                  Keep ideas moving without losing the thread.
                </CardTitle>
                <CardDescription className="max-w-2xl text-base">
                  Your workspace now shows what needs attention, what is ready to grow, and
                  what should be shipped next.
                </CardDescription>
              </div>
              <div className="rounded-2xl border-2 border-border bg-primary/60 px-4 py-3 shadow-neo-xs">
                <p className="text-xs font-semibold uppercase tracking-wide">Next focus</p>
                <p className="mt-1 text-sm font-semibold">
                  {activeIdeas.length
                    ? "Pick one idea and promote it"
                    : "Capture a fresh idea to start the flow"}
                </p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="grid gap-3 sm:grid-cols-3">
            {stats.map((stat) => {
              const Icon = stat.icon

              return (
                <div
                  key={stat.label}
                  className="rounded-2xl border-2 border-border bg-background px-4 py-4 shadow-neo-xs"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-3xl font-heading font-semibold">{stat.value}</p>
                      <p className="mt-1 text-sm font-semibold">{stat.label}</p>
                    </div>
                    <span className="inline-flex size-10 items-center justify-center rounded-2xl border-2 border-border bg-card">
                      <Icon className="h-4 w-4" />
                    </span>
                  </div>
                  <p className="mt-3 text-sm text-muted-foreground">{stat.hint}</p>
                </div>
              )
            })}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex-row items-center justify-between">
            <div>
              <CardTitle>What to do next</CardTitle>
              <CardDescription>Simple steps for people opening the app for the first time.</CardDescription>
            </div>
            <Doodle variant="star" className="text-secondary" />
          </CardHeader>
          <CardContent className="space-y-3">
            {checklist.map((item, index) => (
              <div
                key={item.title}
                className={`flex items-start gap-3 rounded-2xl border-2 px-4 py-4 shadow-neo-xs ${
                  item.done ? "border-border bg-primary/15" : "border-border bg-background"
                }`}
              >
                <div className="mt-0.5 inline-flex size-8 items-center justify-center rounded-full border-2 border-border bg-card">
                  {item.done ? (
                    <CheckCircle2 className="h-4 w-4" />
                  ) : (
                    <span className="text-xs font-bold">{index + 1}</span>
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-semibold">{item.title}</p>
                  <p className="text-sm text-muted-foreground">{item.description}</p>
                </div>
              </div>
            ))}
            <div className="flex flex-wrap gap-3 pt-2">
              <Button asChild>
                <Link href="/dashboard/ideas">
                  Add idea
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/dashboard/projects">Open projects</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <Card>
          <CardHeader className="flex-row items-center justify-between">
            <div>
              <CardTitle>Fresh ideas</CardTitle>
              <CardDescription>{activeIdeas.length} ideas still waiting in the inbox.</CardDescription>
            </div>
            <Doodle variant="sparkle" className="text-accent" />
          </CardHeader>
          <CardContent className="space-y-3">
            {allIdeas.length ? (
              allIdeas.slice(0, 5).map((idea) => (
                <div
                  key={idea.id}
                  className="rounded-2xl border-2 border-border bg-background px-4 py-4 shadow-neo-xs"
                >
                  <div className="flex items-start justify-between gap-3">
                    <p className="text-sm font-semibold break-words">{idea.content}</p>
                    <Badge className={idea.is_promoted ? "bg-secondary/80" : "bg-primary/70"}>
                      {idea.is_promoted ? "Promoted" : "Inbox"}
                    </Badge>
                  </div>
                  <p className="mt-2 text-xs text-muted-foreground">
                    Added {formatSoon(idea.created_at)}
                  </p>
                  {idea.promoted_to_project_id ? (
                    <div className="mt-3">
                      <Button asChild size="sm" variant="outline" className="min-h-11">
                        <Link href={`/dashboard/projects/${idea.promoted_to_project_id}`}>
                          View linked project
                        </Link>
                      </Button>
                    </div>
                  ) : null}
                </div>
              ))
            ) : (
              <div className="rounded-2xl border-2 border-dashed border-border bg-background px-4 py-8 text-center">
                <p className="font-semibold">Your inbox is empty.</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Add a hook, reference, or angle to begin.
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex-row items-center justify-between">
            <div>
              <CardTitle>Projects that need attention</CardTitle>
              <CardDescription>
                Upcoming deadlines and recent projects stay visible here.
              </CardDescription>
            </div>
            <Doodle variant="arrow" className="text-primary" />
          </CardHeader>
          <CardContent className="space-y-3">
            {dueSoonProjects.length ? (
              dueSoonProjects.map((project) => (
                <Link
                  key={project.id}
                  href={`/dashboard/projects/${project.id}`}
                  className="block rounded-2xl border-2 border-border bg-background px-4 py-4 shadow-neo-xs transition-transform hover:-rotate-1"
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-sm font-semibold break-words">{project.title}</p>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {statusLabels[project.status]} • Due {formatSoon(project.deadline)}
                      </p>
                    </div>
                    <Badge className="bg-primary/70">{statusLabels[project.status]}</Badge>
                  </div>
                </Link>
              ))
            ) : (
              <div className="rounded-2xl border-2 border-dashed border-border bg-background px-4 py-8 text-center">
                <p className="font-semibold">No deadlines yet.</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Create your first project and give it a clear deadline.
                </p>
              </div>
            )}
            <div className="flex flex-wrap gap-3 pt-2">
              <Button asChild>
                <Link href="/dashboard/projects">
                  View all projects
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  )
}
