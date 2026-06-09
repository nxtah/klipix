"use server"

import { revalidatePath } from "next/cache"

import { getSupabaseServerClient } from "@/lib/supabase/server"
import { ideaSchema } from "@/lib/validators"

export type IdeaActionState = {
  status: "idle" | "error" | "success"
  message?: string
}

const errorState = (message: string): IdeaActionState => ({
  status: "error",
  message,
})

const successState = (message: string): IdeaActionState => ({
  status: "success",
  message,
})

export async function createIdea(
  _prevState: IdeaActionState,
  formData: FormData
): Promise<IdeaActionState> {
  const parsed = ideaSchema.safeParse({
    content: formData.get("content"),
    referenceUrl: formData.get("reference_url") || undefined,
  })

  if (!parsed.success) {
    return errorState(parsed.error.issues[0]?.message ?? "Invalid idea.")
  }

  const supabase = await getSupabaseServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return errorState("Please sign in again.")
  }

  const { error } = await supabase.from("ideas").insert({
    user_id: user.id,
    content: parsed.data.content,
    reference_url: parsed.data.referenceUrl || null,
  })

  if (error) {
    return errorState(error.message)
  }

  revalidatePath("/dashboard/ideas")
  revalidatePath("/dashboard")
  return successState("Idea added.")
}

export async function deleteIdea(formData: FormData) {
  const ideaId = String(formData.get("idea_id") ?? "")
  if (!ideaId) {
    return
  }

  const supabase = await getSupabaseServerClient()
  await supabase.from("ideas").delete().eq("id", ideaId)
  revalidatePath("/dashboard/ideas")
  revalidatePath("/dashboard")
}

export async function promoteIdea(formData: FormData) {
  const ideaId = String(formData.get("idea_id") ?? "")
  if (!ideaId) {
    return
  }

  const supabase = await getSupabaseServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return
  }
  const { data: idea, error: ideaError } = await supabase
    .from("ideas")
    .select("content")
    .eq("id", ideaId)
    .single()

  if (ideaError || !idea) {
    return
  }

  const title = idea.content.split("\n")[0]?.slice(0, 80) || "New project"

  const { data: project, error: projectError } = await supabase
    .from("projects")
    .insert({
      user_id: user.id,
      title,
      description: idea.content,
      status: "idea",
    })
    .select("id")
    .single()

  if (projectError || !project) {
    return
  }

  await supabase
    .from("ideas")
    .update({ is_promoted: true, promoted_to_project_id: project.id })
    .eq("id", ideaId)

  revalidatePath("/dashboard/ideas")
  revalidatePath("/dashboard/projects")
  revalidatePath("/dashboard")
}
