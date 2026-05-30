"use server"

import { revalidatePath } from "next/cache"

import { getSupabaseServerClient } from "@/lib/supabase/server"
import { projectCreateSchema } from "@/lib/validators"

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
