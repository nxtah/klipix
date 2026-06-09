"use server"

import { revalidatePath } from "next/cache"

import { getSupabaseServerClient } from "@/lib/supabase/server"
import { projectCreateSchema, projectUpdateSchema } from "@/lib/validators"

export type ProjectActionState = {
  status: "idle" | "error" | "success"
  message?: string
}

const errorState = (message: string): ProjectActionState => ({
  status: "error",
  message,
})

const successState = (message: string): ProjectActionState => ({
  status: "success",
  message,
})

export async function createProject(
  _prevState: ProjectActionState,
  formData: FormData
): Promise<ProjectActionState> {
  const platformsRaw = formData.get("platforms")
  let platforms: string[] | undefined
  try {
    platforms = platformsRaw ? JSON.parse(platformsRaw as string) : undefined
  } catch {
    platforms = undefined
  }

  const parsed = projectCreateSchema.safeParse({
    title: formData.get("title"),
    description: formData.get("description") || undefined,
    platforms: platforms,
    deadline: formData.get("deadline") || undefined,
  })

  if (!parsed.success) {
    return errorState(parsed.error.issues[0]?.message ?? "Invalid project.")
  }

  const supabase = await getSupabaseServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return errorState("Please sign in again.")
  }

  const { error } = await supabase.from("projects").insert({
    user_id: user.id,
    title: parsed.data.title,
    description: parsed.data.description || null,
    platforms: parsed.data.platforms && parsed.data.platforms.length > 0 ? parsed.data.platforms : null,
    deadline: parsed.data.deadline || null,
  })

  if (error) {
    return errorState(error.message)
  }

  revalidatePath("/dashboard/projects")
  revalidatePath("/dashboard")
  return successState("Project created.")
}

export async function deleteProject(formData: FormData) {
  const projectId = String(formData.get("project_id") ?? "")
  if (!projectId) {
    return
  }

  const supabase = await getSupabaseServerClient()
  await supabase.from("projects").delete().eq("id", projectId)
  revalidatePath("/dashboard/projects")
  revalidatePath("/dashboard")
}

export async function moveProjectStatus(formData: FormData): Promise<ProjectActionState> {
  const parsed = projectUpdateSchema
    .pick({ projectId: true, status: true })
    .safeParse({
      projectId: formData.get("project_id"),
      status: formData.get("status"),
    })

  if (!parsed.success) {
    return errorState(parsed.error.issues[0]?.message ?? "Invalid project status.")
  }

  const supabase = await getSupabaseServerClient()
  const shouldSetPostedAt = parsed.data.status === "posted"

  const { error } = await supabase
    .from("projects")
    .update({
      status: parsed.data.status,
      posted_at: shouldSetPostedAt ? new Date().toISOString() : null,
    })
    .eq("id", parsed.data.projectId)

  if (error) {
    return errorState(error.message)
  }

  revalidatePath(`/dashboard/projects/${parsed.data.projectId}`)
  revalidatePath("/dashboard/projects")
  revalidatePath("/dashboard")
  return successState("Project status updated.")
}
