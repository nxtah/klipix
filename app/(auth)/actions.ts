"use server"

import { redirect } from "next/navigation"

import { getSupabaseServerClient } from "@/lib/supabase/server"
import { signInSchema, signUpSchema } from "@/lib/validators"

export type AuthActionState = {
  status: "idle" | "error" | "success"
  message?: string
}

const errorState = (message: string): AuthActionState => ({
  status: "error",
  message,
})

const successState = (message: string): AuthActionState => ({
  status: "success",
  message,
})

export async function signIn(
  _prevState: AuthActionState,
  formData: FormData
): Promise<AuthActionState> {
  const parsed = signInSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  })

  if (!parsed.success) {
    return errorState(parsed.error.issues[0]?.message ?? "Invalid credentials.")
  }

  const supabase = await getSupabaseServerClient()
  const { error } = await supabase.auth.signInWithPassword(parsed.data)

  if (error) {
    return errorState(error.message)
  }

  redirect("/dashboard")
}

export async function signUp(
  _prevState: AuthActionState,
  formData: FormData
): Promise<AuthActionState> {
  const parsed = signUpSchema.safeParse({
    fullName: formData.get("full_name"),
    email: formData.get("email"),
    password: formData.get("password"),
  })

  if (!parsed.success) {
    return errorState(parsed.error.issues[0]?.message ?? "Please check your input.")
  }

  const supabase = await getSupabaseServerClient()
  const { data, error } = await supabase.auth.signUp({
    email: parsed.data.email,
    password: parsed.data.password,
    options: {
      data: {
        full_name: parsed.data.fullName,
      },
    },
  })

  if (error) {
    return errorState(error.message)
  }

  if (!data.session) {
    return successState("Check your email to confirm your account.")
  }

  redirect("/dashboard")
}

export async function signOut() {
  const supabase = await getSupabaseServerClient()
  await supabase.auth.signOut()
  redirect("/sign-in")
}
