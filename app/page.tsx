import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Doodle } from "@/components/ui/doodle"

const features = [
  {
    title: "Idea Inbox",
    description: "Capture sparks fast and turn them into structured projects.",
    doodle: "sparkle" as const,
    tone: "bg-secondary/80",
  },
  {
    title: "Script to Scene",
    description: "Draft, split, and schedule scenes with clear next steps.",
    doodle: "squiggle" as const,
    tone: "bg-accent/20",
  },
  {
    title: "Publish Flow",
    description: "Track status from idea → script → edit → posted.",
    doodle: "arrow" as const,
    tone: "bg-primary/70",
  },
]

export default function Home() {
  return (
    <div className="flex flex-1 flex-col">
      <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-16 px-4 py-14 sm:px-6 lg:px-8">
        <section className="grid items-center gap-12 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-6">
            <span className="neo-pill">
              <Doodle variant="sparkle" className="text-accent" />
              Built for short-form creators
            </span>
            <h1 className="text-4xl font-heading font-semibold leading-tight sm:text-5xl lg:text-6xl">
              Turn ideas into{" "}
              <span className="inline-flex rounded-2xl border-2 border-border bg-primary px-2 py-1 shadow-neo-xs">
                published shorts
              </span>{" "}
              without the chaos.
            </h1>
            <p className="max-w-xl text-lg text-muted-foreground">
              Klipix keeps your entire content pipeline playful, visible, and moving. Capture
              ideas, build scripts, and ship consistently—all in one joyful space.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button size="lg" asChild>
                <Link href="/sign-up">Start your pipeline</Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link href="/sign-in">See it in action</Link>
              </Button>
            </div>
            <div className="flex flex-wrap items-center gap-4 text-sm font-semibold">
              <span className="inline-flex items-center gap-2">
                <Doodle variant="star" className="text-secondary" />
                3-7 videos per week planning
              </span>
              <span className="inline-flex items-center gap-2">
                <Doodle variant="sparkle" className="text-accent" />
                Built for solo creators
              </span>
            </div>
          </div>

          <div className="grid gap-6">
            <Card className="relative overflow-hidden">
              <CardHeader className="flex-row items-center justify-between">
                <CardTitle>Today in Klipix</CardTitle>
                <Doodle variant="star" className="text-primary" />
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between rounded-xl border-2 border-border bg-background px-4 py-3 shadow-neo-xs">
                  <div>
                    <p className="font-semibold">Storyboard: “Morning Routine”</p>
                    <p className="text-sm text-muted-foreground">Scenes 3/6 ready</p>
                  </div>
                  <span className="rounded-full border-2 border-border bg-secondary px-3 py-1 text-xs font-semibold shadow-neo-xs">
                    Editing
                  </span>
                </div>
                <div className="flex items-center justify-between rounded-xl border-2 border-border bg-background px-4 py-3 shadow-neo-xs">
                  <div>
                    <p className="font-semibold">Idea: “3 camera tricks”</p>
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
                <CardTitle>Quick capture</CardTitle>
                <Doodle variant="squiggle" className="text-accent" />
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Capture ideas in seconds, then promote them into full projects.
                </p>
                <div className="flex flex-wrap gap-3">
                  <Button size="sm" asChild>
                    <Link href="/sign-up">Try quick capture</Link>
                  </Button>
                  <Button size="sm" variant="outline" asChild>
                    <Link href="/sign-up">Draft a script</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-3">
          {features.map((feature) => (
            <Card key={feature.title} className="group">
              <CardHeader className="flex-row items-center justify-between">
                <CardTitle>{feature.title}</CardTitle>
                <span
                  className={`inline-flex size-10 items-center justify-center rounded-2xl border-2 border-border ${feature.tone} shadow-neo-xs`}
                >
                  <Doodle variant={feature.doodle} className="text-foreground" />
                </span>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </section>

        <section className="neo-card flex flex-col items-start justify-between gap-6 p-8 lg:flex-row lg:items-center">
          <div className="space-y-2">
            <h2 className="text-2xl font-heading font-semibold">Keep your pipeline playful.</h2>
            <p className="text-muted-foreground">
              Organize your week, delight your audience, and never lose an idea again.
            </p>
          </div>
          <div className="flex w-full max-w-md flex-col gap-3 sm:flex-row">
            <Button size="lg" asChild>
              <Link href="/sign-up">Join the beta</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/sign-in">I already have an account</Link>
            </Button>
          </div>
        </section>
      </main>
    </div>
  )
}
