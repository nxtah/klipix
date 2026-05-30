import { BackButton } from "@/components/ui/back-button"
import { getSupabaseServerClient } from "@/lib/supabase/server"
import { ProjectsContent } from "./projects-content"

interface Project {
  id: string
  title: string
  status: string
  platforms: string[] | null
  deadline: string | null
}

export default async function ProjectsPage() {
  const supabase = await getSupabaseServerClient()
  const { data: projects } = await supabase
    .from("projects")
    .select("id, title, status, platforms, deadline")
    .order("updated_at", { ascending: false })

  const typedProjects = (projects || []) as Project[]

  return (
    <>
      <BackButton />
      <ProjectsContent projects={typedProjects} />
    </>
  )
}
