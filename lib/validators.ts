import { z } from "zod"

export const projectStatusSchema = z.enum([
  "idea",
  "scripting",
  "shooting",
  "editing",
  "posted",
])

export const platformSchema = z.enum([
  "tiktok",
  "instagram_reels",
  "youtube_shorts",
  "youtube_long",
  "other",
])

export const signInSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
})

export const signUpSchema = z.object({
  fullName: z.string().min(2).max(80),
  email: z.string().email(),
  password: z.string().min(6),
})

export const ideaSchema = z.object({
  content: z.string().min(3).max(2000),
  referenceUrl: z
    .string()
    .trim()
    .optional()
    .refine((value) => !value || /^https?:\/\//i.test(value), {
      message: "Reference URL must start with http:// or https://",
    }),
})

export const projectCreateSchema = z.object({
  title: z.string().min(3).max(120),
  description: z.string().max(2000).optional(),
  platforms: z.array(platformSchema).optional(),
  deadline: z.string().optional(),
})

export const projectUpdateSchema = z.object({
  projectId: z.string().uuid(),
  title: z.string().min(3).max(120),
  description: z.string().max(2000).optional(),
  status: projectStatusSchema,
  platforms: z.array(platformSchema).optional(),
  deadline: z.string().optional(),
})

export const scriptSchema = z.object({
  projectId: z.string().uuid(),
  content: z.string().max(10000).optional(),
})

export const sceneSchema = z.object({
  projectId: z.string().uuid(),
  title: z.string().max(120).optional(),
  description: z.string().max(2000).optional(),
  durationSeconds: z.string().optional(),
})
