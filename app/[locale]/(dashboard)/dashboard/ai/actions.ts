"use server"

import { revalidatePath } from "next/cache"

import { generateContent } from "@/lib/ai/gemini"
import { getSupabaseServerClient } from "@/lib/supabase/server"

export type AiActionState = {
  status: "idle" | "loading" | "error" | "success"
  message?: string
  ideas?: string[]
}

export type AiScriptState = {
  status: "idle" | "loading" | "error" | "success"
  message?: string
  script?: string
}

export type AiSceneState = {
  status: "idle" | "loading" | "error" | "success"
  message?: string
  scenes?: { title: string; description: string; duration: number; script: string }[]
}

export async function generateIdeas(
  _prevState: AiActionState,
  formData: FormData,
): Promise<AiActionState> {
  const topic = String(formData.get("topic") ?? "").trim()
  const platform = String(formData.get("platform") ?? "").trim()
  const tone = String(formData.get("tone") ?? "").trim()
  const language = String(formData.get("language") ?? "English").trim()

  if (!topic || topic.length < 2) {
    return { status: "error", message: "Topic must be at least 2 characters." }
  }

  const platformHint = platform ? ` for ${platform}` : ""
  const toneHint = tone ? ` with a ${tone} tone` : ""

  const prompt = `You are a creative content strategist for short-form video creators.

Generate exactly 8 unique, viral-worthy content ideas for the topic: "${topic}"${platformHint}${toneHint}.

CRITICAL: All output MUST be written in ${language}. Do not use any other language.

Requirements:
- Each idea must be a single, punchy sentence (under 15 words)
- Focus on hooks, angles, and story formats that grab attention
- Mix of educational, entertaining, and emotional angles
- Consider trending formats (stitches, duets, before/after, POV, etc.)

Return ONLY a JSON array of strings, nothing else. No markdown, no explanation.
Example format: ["Idea 1", "Idea 2", "Idea 3"]`

  try {
    const raw = await generateContent(prompt)
    const cleaned = raw.replace(/```json\n?|\n?```/g, "").trim()
    const ideas = JSON.parse(cleaned) as string[]

    if (!Array.isArray(ideas) || ideas.length === 0) {
      return { status: "error", message: "AI returned an unexpected format. Try again." }
    }

    return { status: "success", ideas }
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err)
    if (msg.includes("OPENROUTER_API_KEY")) {
      return { status: "error", message: "API key not configured. Add OPENROUTER_API_KEY to your .env.local and restart the server." }
    }
    return {
      status: "error",
      message: `AI error: ${msg.slice(0, 200)}`,
    }
  }
}

export async function addAiIdea(
  content: string,
): Promise<{ status: "error" | "success"; message: string }> {
  if (!content || content.length < 3) {
    return { status: "error", message: "Idea content is too short." }
  }

  const supabase = await getSupabaseServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { status: "error", message: "Please sign in again." }
  }

  const { error } = await supabase.from("ideas").insert({
    user_id: user.id,
    content,
  })

  if (error) {
    return { status: "error", message: error.message }
  }

  revalidatePath("/dashboard/ideas")
  revalidatePath("/dashboard")
  return { status: "success", message: "Idea added to inbox." }
}

export async function addAllAiIdeas(
  ideas: string[],
): Promise<{ status: "error" | "success"; message: string }> {
  if (!ideas.length) {
    return { status: "error", message: "No ideas to add." }
  }

  const supabase = await getSupabaseServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { status: "error", message: "Please sign in again." }
  }

  const rows = ideas.map((content) => ({
    user_id: user.id,
    content,
  }))

  const { error } = await supabase.from("ideas").insert(rows)

  if (error) {
    return { status: "error", message: error.message }
  }

  revalidatePath("/dashboard/ideas")
  revalidatePath("/dashboard")
  return { status: "success", message: `${ideas.length} ideas added to inbox.` }
}

export async function generateScript(
  _prevState: AiScriptState,
  formData: FormData,
): Promise<AiScriptState> {
  const projectTitle = String(formData.get("title") ?? "").trim()
  const projectDescription = String(formData.get("description") ?? "").trim()
  const existingScript = String(formData.get("existing_script") ?? "").trim()
  const style = String(formData.get("style") ?? "").trim()

  if (!projectTitle) {
    return { status: "error", message: "Project title is required." }
  }

  const styleHint = style ? ` Use a ${style} style.` : ""
  const context = projectDescription
    ? `\nProject description: "${projectDescription}"`
    : ""
  const existingHint = existingScript
    ? `\n\nExisting script to improve/continue:\n"${existingScript}"`
    : ""

  const prompt = `You are a professional video scriptwriter who writes engaging, viral content scripts.

Write a complete video script for: "${projectTitle}"${context}${existingHint}${styleHint}

The script should include:
1. A hook (first 3 seconds that grab attention)
2. Main content (clear, engaging storytelling)
3. Call to action (end with impact)

Format the script as clean text with natural line breaks. Keep it concise (150-300 words, suitable for a 60-90 second video). Use conversational language. Do NOT use markdown formatting or bullet points - write it as a spoken script.`

  try {
    const raw = await generateContent(prompt)
    const script = raw.trim()

    if (!script) {
      return { status: "error", message: "AI returned empty script. Try again." }
    }

    return { status: "success", script }
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err)
    if (msg.includes("OPENROUTER_API_KEY")) {
      return { status: "error", message: "API key not configured. Add OPENROUTER_API_KEY to your .env.local and restart the server." }
    }
    return {
      status: "error",
      message: `AI error: ${msg.slice(0, 200)}`,
    }
  }
}

export async function generateScenesWithScripts(
  _prevState: AiSceneState,
  formData: FormData,
): Promise<AiSceneState> {
  const projectTitle = String(formData.get("title") ?? "").trim()
  const projectDescription = String(formData.get("description") ?? "").trim()
  const style = String(formData.get("style") ?? "").trim()
  const language = String(formData.get("language") ?? "English").trim()

  if (!projectTitle) {
    return { status: "error", message: "Project title is required." }
  }

  const context = projectDescription
    ? `\nProject description: "${projectDescription}"`
    : ""
  const styleHint = style ? `\nUse a ${style} tone/style throughout.` : ""

  const prompt = `You are a professional video scriptwriter and production planner.

Break down this video concept into scenes, each with its own spoken script.

Project: "${projectTitle}"${context}${styleHint}

CRITICAL: ALL output — titles, descriptions, and scripts — MUST be written entirely in ${language}. Do not use any other language.

Generate exactly 4-6 scenes. Each scene is a distinct segment of the video.

Return ONLY a JSON array, no markdown, no explanation.
Each object must have:
- "title" (string, 3-8 words) - the scene title
- "description" (string, 1-2 sentences) - what happens in this scene
- "duration" (number, seconds between 5-45) - estimated duration
- "script" (string) - the spoken/narrated script for this scene (2-5 sentences, conversational tone, what the creator actually says on camera)

The scripts should flow naturally from scene to scene as one cohesive video. Each script should be written as spoken language, not written text.

Example format:
[{"title": "Opening Hook", "description": "Bold statement to grab attention.", "duration": 10, "script": "Stop scrolling. You're wasting hours every week on something that takes 5 minutes to fix."}]`

  try {
    const raw = await generateContent(prompt)
    const cleaned = raw.replace(/```json\n?|\n?```/g, "").trim()
    const scenes = JSON.parse(cleaned) as {
      title: string
      description: string
      duration: number
      script: string
    }[]

    if (!Array.isArray(scenes) || scenes.length === 0) {
      return { status: "error", message: "AI returned an unexpected format. Try again." }
    }

    return { status: "success", scenes }
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err)
    if (msg.includes("OPENROUTER_API_KEY")) {
      return { status: "error", message: "API key not configured. Add OPENROUTER_API_KEY to your .env.local and restart the server." }
    }
    return {
      status: "error",
      message: `AI error: ${msg.slice(0, 200)}`,
    }
  }
}
