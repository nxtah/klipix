import { formatDistanceToNow } from "date-fns"
import { ArrowRight, CheckCircle2, Inbox, Lightbulb, Wand2 } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { BackButton } from "@/components/ui/back-button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Doodle } from "@/components/ui/doodle"
import { Link } from "@/lib/i18n-navigation"
import { getSupabaseServerClient } from "@/lib/supabase/server"

import { deleteIdea, promoteIdea } from "./actions"
import { IdeaForm } from "./idea-form"

function formatAge(date: string) {
  return formatDistanceToNow(new Date(date), { addSuffix: true })
}

export default async function IdeasPage() {
  const supabase = await getSupabaseServerClient()
  const { data: ideas } = await supabase
    .from("ideas")
    .select("id, content, reference_url, is_promoted, promoted_to_project_id, created_at")
    .order("created_at", { ascending: false })

  const allIdeas = ideas ?? []
  const inboxIdeas = allIdeas.filter((idea) => !idea.is_promoted)
  const promotedIdeas = allIdeas.filter((idea) => idea.is_promoted)

  const tips = [
    {
      title: "Write the hook, not the whole script",
      description: "Capture a single sharp angle so the inbox stays fast.",
    },
    {
      title: "Attach a reference when needed",
      description: "A link helps you remember the trend, creator, or style later.",
    },
    {
      title: "Promote only what has momentum",
      description: "Move a strong idea into a project once it deserves structure.",
    },
  ]

  return (
    <div className="space-y-8">
      <BackButton />

      <section className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
        <Card className="overflow-hidden">
          <CardHeader className="space-y-4">
            <span className="neo-pill w-fit bg-primary/70">
              <Lightbulb className="h-4 w-4" />
              Idea inbox
            </span>
            <div className="space-y-2">
              <CardTitle className="text-3xl">Catch ideas before they vanish.</CardTitle>
              <CardDescription className="text-base">
                Keep hooks, trends, and references in one place, then promote the winners
                into real projects.
              </CardDescription>
            </div>
            <div className="flex flex-wrap gap-2">
              <Badge className="bg-primary/70">{allIdeas.length} total</Badge>
              <Badge className="bg-secondary/80">{inboxIdeas.length} in inbox</Badge>
              <Badge className="bg-accent/70">{promotedIdeas.length} promoted</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <IdeaForm />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex-row items-center justify-between">
            <div>
              <CardTitle>How to use this page</CardTitle>
              <CardDescription>Short guidance for new users.</CardDescription>
            </div>
            <Doodle variant="sparkle" className="text-accent" />
          </CardHeader>
          <CardContent className="space-y-3">
            {tips.map((tip) => (
              <div
                key={tip.title}
                className="rounded-2xl border-2 border-border bg-background px-4 py-4 shadow-neo-xs"
              >
                <div className="flex items-start gap-3">
                  <span className="inline-flex size-8 items-center justify-center rounded-full border-2 border-border bg-primary/70">
                    <Wand2 className="h-4 w-4" />
                  </span>
                  <div>
                    <p className="font-semibold">{tip.title}</p>
                    <p className="text-sm text-muted-foreground">{tip.description}</p>
                  </div>
                </div>
              </div>
            ))}
            <div className="rounded-2xl border-2 border-border bg-primary/15 px-4 py-4 shadow-neo-xs">
              <p className="text-sm font-semibold">Tip</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Promote ideas that are ready for structure, then manage them from Projects.
              </p>
              <div className="mt-3">
                <Button asChild variant="outline" size="sm" className="min-h-11">
                  <Link href="/dashboard/projects">
                    Go to projects
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-6 xl:grid-cols-2">
        <Card>
          <CardHeader className="flex-row items-center justify-between">
            <div>
              <CardTitle>Inbox</CardTitle>
              <CardDescription>Ideas waiting for action.</CardDescription>
            </div>
            <Inbox className="h-5 w-5" />
          </CardHeader>
          <CardContent className="space-y-3">
            {inboxIdeas.length ? (
              inboxIdeas.map((idea) => (
                <div
                  key={idea.id}
                  className="rounded-2xl border-2 border-border bg-background px-4 py-4 shadow-neo-xs"
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold break-words">{idea.content}</p>
                      <p className="mt-2 text-xs text-muted-foreground">
                        Added {formatAge(idea.created_at)}
                      </p>
                    </div>
                    <Badge className="bg-primary/70">Ready</Badge>
                  </div>
                  {idea.reference_url ? (
                    <a
                      href={idea.reference_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-3 block text-xs font-semibold text-accent underline-offset-4 hover:underline break-all"
                    >
                      {idea.reference_url}
                    </a>
                  ) : null}
                  <div className="mt-3 flex flex-wrap gap-2">
                    <form action={promoteIdea} className="flex-1 sm:flex-none">
                      <input type="hidden" name="idea_id" value={idea.id} />
                      <Button size="sm" type="submit" className="w-full sm:w-auto min-h-11">
                        Promote
                      </Button>
                    </form>
                    <form action={deleteIdea} className="flex-1 sm:flex-none">
                      <input type="hidden" name="idea_id" value={idea.id} />
                      <Button size="sm" type="submit" variant="outline" className="w-full sm:w-auto min-h-11">
                        Delete
                      </Button>
                    </form>
                  </div>
                </div>
              ))
            ) : (
              <div className="rounded-2xl border-2 border-dashed border-border bg-background px-4 py-8 text-center">
                <p className="font-semibold">Inbox empty.</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Add your first idea using the form above.
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex-row items-center justify-between">
            <div>
              <CardTitle>Promoted ideas</CardTitle>
              <CardDescription>Ideas already turned into projects.</CardDescription>
            </div>
            <CheckCircle2 className="h-5 w-5" />
          </CardHeader>
          <CardContent className="space-y-3">
            {promotedIdeas.length ? (
              promotedIdeas.map((idea) => (
                <div
                  key={idea.id}
                  className="rounded-2xl border-2 border-border bg-background px-4 py-4 shadow-neo-xs"
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold break-words">{idea.content}</p>
                      <p className="mt-2 text-xs text-muted-foreground">
                        Added {formatAge(idea.created_at)}
                      </p>
                    </div>
                    <Badge className="bg-secondary/80">Promoted</Badge>
                  </div>
                  {idea.promoted_to_project_id ? (
                    <div className="mt-3">
                      <Button asChild size="sm" variant="outline" className="min-h-11">
                        <Link href={`/dashboard/projects/${idea.promoted_to_project_id}`}>
                          View project
                        </Link>
                      </Button>
                    </div>
                  ) : null}
                </div>
              ))
            ) : (
              <div className="rounded-2xl border-2 border-dashed border-border bg-background px-4 py-8 text-center">
                <p className="font-semibold">Nothing promoted yet.</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Promote a strong idea after it gets momentum.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </section>
    </div>
  )
}
