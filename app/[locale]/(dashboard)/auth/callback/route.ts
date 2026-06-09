import { NextResponse } from "next/server"
import { getSupabaseServerClient } from "@/lib/supabase/server"

export async function GET(
  request: Request,
  { params }: { params: { locale: string } },
) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get("code")
  const { locale } = params

  if (code) {
    const supabase = await getSupabaseServerClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)

    if (!error) {
      return NextResponse.redirect(`${origin}/${locale}/dashboard`)
    }
  }

  // Something went wrong — redirect back to sign-in with an error hint
  return NextResponse.redirect(`${origin}/${locale}/sign-in?error=auth`)
}
