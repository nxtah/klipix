import Link from "next/link"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Doodle } from "@/components/ui/doodle"
import { Separator } from "@/components/ui/separator"
import { getSupabaseServerClient } from "@/lib/supabase/server"

const statusLabels = {
  idea: "Idea",
  scripting: "Scripting",
  shooting: "Shooting",
  editing: "Editing",
  posted: "Posted",
} as const

export default async function DashboardPage() {
  const supabase = await getSupabaseServerClient()

  const [{ data: ideas }, { data: projects }] = await Promise.all([
    supabase.from("ideas").select("id, content, created_at, is_promoted").order("created_at", {
      ascending: false,
    }),
    supabase
      .from("projects")
      .select("id, title, status, deadline")
      .order("updated_at", { ascending: false }),
  ])

  const activeIdeas = ideas?.filter((idea) => !idea.is_promoted) ?? []
  const projectCounts = (projects ?? []).reduce<Record<string, number>>((acc, project) => {
    acc[project.status] = (acc[project.status] ?? 0) + 1
    return acc
  }, {})

  return (
    <div className="space-y-10">
      <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <Card>
          <CardHeader className="flex-row items-center justify-between">
            <CardTitle>Pipeline pulse</CardTitle>
            <Doodle variant="sparkle" className="text-accent" />
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-wrap gap-3">
              {Object.entries(statusLabels).map(([status, label]) => (
                <Badge key={status} className="bg-primary/70">
                  {label}: {projectCounts[status] ?? 0}
                </Badge>
              ))}
            </div>
            <Separator />
            <div className="flex flex-wrap gap-3">
              <Button asChild>
                <Link href="/dashboard/projects">Open projects</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/dashboard/ideas">Capture ideas</Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex-row items-center justify-between">
            <CardTitle>Fresh ideas</CardTitle>
            <Doodle variant="star" className="text-secondary" />
          </CardHeader>
          <CardContent className="space-y-3">
            {activeIdeas.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                Your inbox is clear. Add a new idea to get started.
              </p>
            ) : (
              activeIdeas.slice(0, 4).map((idea) => (
                <div
                  key={idea.id}
                  className="rounded-xl border-2 border-border bg-background px-4 py-3 shadow-neo-xs"
                >
                  <p className="text-sm font-semibold">{idea.content}</p>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader className="flex-row items-center justify-between">
            <CardTitle>Latest projects</CardTitle>
            <Doodle variant="arrow" className="text-accent" />
          </CardHeader>
          <CardContent className="space-y-3">
            {projects?.length ? (
              projects.slice(0, 4).map((project) => (
                <Link
                  key={project.id}
                  href={`/dashboard/projects/${project.id}`}
                  className="flex flex-col gap-1 rounded-xl border-2 border-border bg-background px-4 py-3 shadow-neo-xs transition-transform hover:-rotate-1"
                >
                  <span className="text-sm font-semibold">{project.title}</span>
                  <span className="text-xs text-muted-foreground">
                    Status: {statusLabels[project.status]}
                    {project.deadline ? ` • Due ${project.deadline}` : ""}
                  </span>
                </Link>
              ))
            ) : (
              <p className="text-sm text-muted-foreground">
                No projects yet. Start your first one from the Projects tab.
              </p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex-row items-center justify-between">
            <CardTitle>Quick actions</CardTitle>
            <Doodle variant="sparkle" className="text-primary" />
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Jump straight into your weekly workflow.
            </p>
            <div className="flex flex-wrap gap-3">
              <Button asChild>
                <Link href="/dashboard/ideas">Add idea</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/dashboard/projects">Create project</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  )
}
