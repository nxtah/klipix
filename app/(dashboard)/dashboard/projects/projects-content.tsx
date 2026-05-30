"use client"

import { useState, useMemo } from "react"
import Link from "next/link"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Doodle } from "@/components/ui/doodle"

import { deleteProject } from "./actions"
import { ProjectForm } from "./project-form"
import { DateFilter } from "./date-filter"

const statusLabel: Record<string, string> = {
  idea: "Idea",
  scripting: "Scripting",
  shooting: "Shooting",
  editing: "Editing",
  posted: "Posted",
}

interface Project {
  id: string
  title: string
  status: string
  platforms: string[] | null
  deadline: string | null
}

export function ProjectsContent({ projects: initialProjects }: { projects: Project[] | null }) {
  const [filterDate, setFilterDate] = useState<string | null>(null)

  const filteredProjects = useMemo(() => {
    if (!initialProjects) return null

    return initialProjects.filter((project) => {
      if (!filterDate) return true
      if (!project.deadline) return true

      const projectDate = new Date(project.deadline).toDateString()
      const selectedDate = new Date(filterDate).toDateString()

      return projectDate === selectedDate
    })
  }, [initialProjects, filterDate])

  return (
    <div className="grid gap-4 sm:gap-8 lg:grid-cols-[1fr_1.2fr]">
      <Card>
        <CardHeader className="flex-row items-center justify-between">
          <CardTitle>New project</CardTitle>
          <Doodle variant="sparkle" className="text-primary" />
        </CardHeader>
        <CardContent>
          <ProjectForm />
        </CardContent>
      </Card>

      <div className="space-y-4">
        <DateFilter 
          onFilterChange={(date) => {
            setFilterDate(date)
          }}
        />

        <Card>
          <CardHeader className="flex-row items-center justify-between">
            <CardTitle>Project board</CardTitle>
            <Doodle variant="arrow" className="text-accent" />
          </CardHeader>
          <CardContent className="space-y-4">
            {filteredProjects?.length ? (
              filteredProjects.map((project) => (
                <div
                  key={project.id}
                  className="flex flex-col gap-3 rounded-2xl border-2 border-border bg-background px-4 py-4 shadow-neo-xs"
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold break-words">{project.title}</p>
                      <p className="text-xs text-muted-foreground break-words">
                        {project.platforms && project.platforms.length > 0
                          ? project.platforms.map(p => p.replace(/_/g, " ")).join(", ")
                          : "No platform"}
                        {project.deadline ? ` • Due ${project.deadline}` : ""}
                      </p>
                    </div>
                    <Badge className="bg-primary/70 whitespace-nowrap flex-shrink-0">{statusLabel[project.status]}</Badge>
                  </div>
                  <div className="flex flex-wrap gap-2 sm:gap-3">
                    <Button asChild size="sm" className="flex-1 sm:flex-none min-h-11">
                      <Link href={`/dashboard/projects/${project.id}`}>Open</Link>
                    </Button>
                    <form action={deleteProject} className="flex-1 sm:flex-none">
                      <input type="hidden" name="project_id" value={project.id} />
                      <Button size="sm" variant="outline" type="submit" className="w-full sm:w-auto min-h-11">
                        Delete
                      </Button>
                    </form>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground">
                {initialProjects?.length ? "No projects match the selected date range." : "No projects yet. Create one to start your workflow."}
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
