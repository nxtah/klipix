"use server"

import { revalidatePath } from "next/cache"

import { getSupabaseServerClient } from "@/lib/supabase/server"
import { projectUpdateSchema, sceneSchema, scriptSchema } from "@/lib/validators"

export type DetailActionState = {
  status: "idle" | "error" | "success"
  message?: string
}

const errorState = (message: string): DetailActionState => ({
  status: "error",
  message,
})

const successState = (message: string): DetailActionState => ({
  status: "success",
  message,
})

export async function updateProjectMeta(
  _prevState: DetailActionState,
  formData: FormData
): Promise<DetailActionState> {
  const platformsRaw = formData.get("platforms")
  let platforms: string[] | undefined
  try {
    platforms = platformsRaw ? JSON.parse(platformsRaw as string) : undefined
  } catch {
    platforms = undefined
  }

  const parsed = projectUpdateSchema.safeParse({
    projectId: formData.get("project_id"),
    title: formData.get("title"),
    description: formData.get("description") || undefined,
    status: formData.get("status"),
    platforms: platforms,
    deadline: formData.get("deadline") || undefined,
  })

  if (!parsed.success) {
    return errorState(parsed.error.issues[0]?.message ?? "Invalid project data.")
  }

  const supabase = await getSupabaseServerClient()
  const shouldSetPostedAt = parsed.data.status === "posted"

  const { error } = await supabase
    .from("projects")
    .update({
      title: parsed.data.title,
      description: parsed.data.description || null,
      status: parsed.data.status,
      platforms: parsed.data.platforms && parsed.data.platforms.length > 0 ? parsed.data.platforms : null,
      deadline: parsed.data.deadline || null,
      posted_at: shouldSetPostedAt ? new Date().toISOString() : null,
    })
    .eq("id", parsed.data.projectId)

  if (error) {
    return errorState(error.message)
  }

  revalidatePath(`/dashboard/projects/${parsed.data.projectId}`)
  revalidatePath("/dashboard/projects")
  revalidatePath("/dashboard")
  return successState("Project updated.")
}

export async function upsertScript(
  _prevState: DetailActionState,
  formData: FormData
): Promise<DetailActionState> {
  const parsed = scriptSchema.safeParse({
    projectId: formData.get("project_id"),
    content: formData.get("content") || undefined,
  })

  if (!parsed.success) {
    return errorState(parsed.error.issues[0]?.message ?? "Invalid script.")
  }

  const supabase = await getSupabaseServerClient()
  const { error } = await supabase.from("scripts").upsert(
    {
      project_id: parsed.data.projectId,
      content: parsed.data.content || null,
    },
    { onConflict: "project_id" }
  )

  if (error) {
    return errorState(error.message)
  }

  revalidatePath(`/dashboard/projects/${parsed.data.projectId}`)
  return successState("Script saved.")
}

export async function createScene(
  _prevState: DetailActionState,
  formData: FormData
): Promise<DetailActionState> {
  const parsed = sceneSchema.safeParse({
    projectId: formData.get("project_id"),
    title: formData.get("title") || undefined,
    description: formData.get("description") || undefined,
    durationSeconds: formData.get("duration_seconds") || undefined,
  })

  if (!parsed.success) {
    return errorState(parsed.error.issues[0]?.message ?? "Invalid scene.")
  }

  const supabase = await getSupabaseServerClient()
  const { data: lastScene } = await supabase
    .from("scenes")
    .select("order_index")
    .eq("project_id", parsed.data.projectId)
    .order("order_index", { ascending: false })
    .limit(1)
    .maybeSingle()

  const nextIndex = (lastScene?.order_index ?? 0) + 1
  const durationValue = parsed.data.durationSeconds
    ? Number.parseInt(parsed.data.durationSeconds, 10)
    : null
  const durationSeconds =
    durationValue && durationValue > 0 && !Number.isNaN(durationValue) ? durationValue : null

  const { error } = await supabase.from("scenes").insert({
    project_id: parsed.data.projectId,
    order_index: nextIndex,
    title: parsed.data.title || null,
    description: parsed.data.description || null,
    duration_seconds: durationSeconds,
  })

  if (error) {
    return errorState(error.message)
  }

  revalidatePath(`/dashboard/projects/${parsed.data.projectId}`)
  return successState("Scene added.")
}

export async function toggleScene(formData: FormData) {
  const sceneId = String(formData.get("scene_id") ?? "")
  const projectId = String(formData.get("project_id") ?? "")
  const isCompleted = formData.get("is_completed") === "true"

  if (!sceneId || !projectId) {
    return
  }

  const supabase = await getSupabaseServerClient()
  await supabase.from("scenes").update({ is_completed: !isCompleted }).eq("id", sceneId)

  revalidatePath(`/dashboard/projects/${projectId}`)
}

export async function deleteScene(formData: FormData) {
  const sceneId = String(formData.get("scene_id") ?? "")
  const projectId = String(formData.get("project_id") ?? "")

  if (!sceneId || !projectId) {
    return
  }

  const supabase = await getSupabaseServerClient()
  await supabase.from("scenes").delete().eq("id", sceneId)

  revalidatePath(`/dashboard/projects/${projectId}`)
}

export async function moveScene(formData: FormData) {
  const sceneId = String(formData.get("scene_id") ?? "")
  const projectId = String(formData.get("project_id") ?? "")
  const direction = String(formData.get("direction") ?? "")

  if (!sceneId || !projectId || (direction !== "up" && direction !== "down")) {
    return
  }

  const supabase = await getSupabaseServerClient()
  const { data: scene } = await supabase
    .from("scenes")
    .select("id, order_index")
    .eq("id", sceneId)
    .single()

  if (!scene) {
    return
  }

  const neighborQuery = supabase
    .from("scenes")
    .select("id, order_index")
    .eq("project_id", projectId)

  const { data: neighbor } =
    direction === "down"
      ? await neighborQuery
          .gt("order_index", scene.order_index)
          .order("order_index", { ascending: true })
          .limit(1)
          .maybeSingle()
      : await neighborQuery
          .lt("order_index", scene.order_index)
          .order("order_index", { ascending: false })
          .limit(1)
          .maybeSingle()

  if (!neighbor) {
    return
  }

  await supabase
    .from("scenes")
    .update({ order_index: neighbor.order_index })
    .eq("id", scene.id)
  await supabase
    .from("scenes")
    .update({ order_index: scene.order_index })
    .eq("id", neighbor.id)

  revalidatePath(`/dashboard/projects/${projectId}`)
}

export async function createSceneWithScript(
  _prevState: DetailActionState,
  formData: FormData
): Promise<DetailActionState> {
  const projectId = String(formData.get("project_id") ?? "")
  const scriptContent = String(formData.get("script_content") ?? "")
  const sceneTitle = String(formData.get("title") ?? "") || null
  const sceneDescription = String(formData.get("description") ?? "") || null
  const sceneDuration = String(formData.get("duration_seconds") ?? "") || null

  if (!projectId) {
    return errorState("Project ID is required.")
  }

  const supabase = await getSupabaseServerClient()

  // Get next order index
  const { data: lastScene } = await supabase
    .from("scenes")
    .select("order_index")
    .eq("project_id", projectId)
    .order("order_index", { ascending: false })
    .limit(1)
    .maybeSingle()

  const nextIndex = (lastScene?.order_index ?? 0) + 1
  const durationValue = sceneDuration
    ? Number.parseInt(String(sceneDuration), 10)
    : null
  const durationSeconds =
    durationValue && durationValue > 0 && !Number.isNaN(durationValue) ? durationValue : null

  // Create scene with script_content
  const { error: sceneError } = await supabase.from("scenes").insert({
    project_id: projectId,
    order_index: nextIndex,
    title: sceneTitle || null,
    description: sceneDescription || null,
    duration_seconds: durationSeconds,
    script_content: scriptContent.trim() ? scriptContent : null,
  })

  if (sceneError) {
    return errorState(`Failed to create scene: ${sceneError.message}`)
  }

  revalidatePath(`/dashboard/projects/${projectId}`)
  return successState("Scene saved successfully!")
}
