import { NextResponse } from "next/server"
import { getSupabaseServerClient } from "@/lib/supabase/server"

export async function GET(request: Request) {
  const { origin, searchParams } = new URL(request.url)
  const locale = searchParams.get("locale") ?? "en"

  const supabase = await getSupabaseServerClient()
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${origin}/auth/callback?locale=${locale}`,
    },
  })

  if (error || !data.url) {
    return NextResponse.redirect(`${origin}/${locale}/sign-in?error=oauth`)
  }

  return NextResponse.redirect(data.url)
}
