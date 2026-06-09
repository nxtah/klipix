import createMiddleware from "next-intl/middleware";
import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";

const locales = ["en", "es", "id"];
const defaultLocale = "en";

const intlMiddleware = createMiddleware({
  locales,
  defaultLocale,
  localePrefix: "as-needed",
});

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Apply i18n middleware first
  const intlResponse = intlMiddleware(request);

  // Get locale from pathname or use default
  let locale = defaultLocale;
  for (const loc of locales) {
    if (pathname.startsWith(`/${loc}/`) || pathname === `/${loc}`) {
      locale = loc;
      break;
    }
  }

  // Get path without locale prefix
  let pathWithoutLocale = pathname;
  if (pathname.startsWith(`/${locale}/`)) {
    pathWithoutLocale = pathname.slice(`/${locale}`.length) || "/";
  }

  // Check auth for protected routes
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            intlResponse.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Redirect authenticated users away from auth pages
  if (user && pathWithoutLocale.startsWith("/sign-")) {
    const redirectUrl =
      locale === defaultLocale ? "/dashboard" : `/${locale}/dashboard`;
    return NextResponse.redirect(new URL(redirectUrl, request.url));
  }

  // Redirect unauthenticated users trying to access dashboard
  if (!user && pathWithoutLocale.startsWith("/dashboard")) {
    const redirectUrl =
      locale === defaultLocale ? "/sign-in" : `/${locale}/sign-in`;
    return NextResponse.redirect(new URL(redirectUrl, request.url));
  }

  return intlResponse;
}

export const config = {
  matcher: ["/((?!_next|.*\\..*|api|auth).*)"],
};
