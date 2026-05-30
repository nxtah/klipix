import Link from "next/link"

import { Button } from "@/components/ui/button"
import { BackButton } from "@/components/ui/back-button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Doodle } from "@/components/ui/doodle"
import { getSupabaseServerClient } from "@/lib/supabase/server"

import { deleteIdea, promoteIdea } from "./actions"
import { IdeaForm } from "./idea-form"

export default async function IdeasPage() {
  const supabase = await getSupabaseServerClient()
  const { data: ideas } = await supabase
    .from("ideas")
    .select("id, content, reference_url, is_promoted, promoted_to_project_id, created_at")
    .order("created_at", { ascending: false })

  return (
    <>
      <BackButton />
      <div className="grid gap-4 sm:gap-8 lg:grid-cols-[1fr_1.2fr]">
        <Card>
          <CardHeader className="flex-row items-center justify-between">
            <CardTitle>Capture an idea</CardTitle>
            <Doodle variant="sparkle" className="text-accent" />
          </CardHeader>
          <CardContent>
            <IdeaForm />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex-row items-center justify-between">
            <CardTitle>Idea inbox</CardTitle>
            <Doodle variant="star" className="text-secondary" />
          </CardHeader>
          <CardContent className="space-y-4">
            {ideas?.length ? (
              ideas.map((idea) => (
                <div
                  key={idea.id}
                  className="space-y-3 rounded-2xl border-2 border-border bg-background px-4 py-4 shadow-neo-xs"
                >
                  <p className="text-sm font-semibold break-words">{idea.content}</p>
                  {idea.reference_url ? (
                    <Link
                      href={idea.reference_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-semibold text-accent underline-offset-4 hover:underline break-all"
                    >
                      {idea.reference_url}
                    </Link>
                  ) : null}
                  <div className="flex flex-wrap gap-2 sm:gap-3">
                    {idea.is_promoted && idea.promoted_to_project_id ? (
                      <Button asChild size="sm" className="flex-1 sm:flex-none min-h-11">
                        <Link href={`/dashboard/projects/${idea.promoted_to_project_id}`}>
                          View project
                        </Link>
                      </Button>
                    ) : (
                      <form action={promoteIdea} className="flex-1 sm:flex-none">
                        <input type="hidden" name="idea_id" value={idea.id} />
                        <Button size="sm" type="submit" className="w-full sm:w-auto min-h-11">
                          Promote to project
                        </Button>
                      </form>
                    )}
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
              <p className="text-sm text-muted-foreground">
                Inbox empty. Capture your first hook or trend.
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  )
}
