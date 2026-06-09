"use client"

import { useTranslations } from "next-intl"
import { useLocale } from "next-intl"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Doodle } from "@/components/ui/doodle"
import { Link } from "@/lib/i18n-navigation"

import { SignInForm } from "./sign-in-form"

export default function SignInPage() {
  const t = useTranslations("auth")
  const locale = useLocale()

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="space-y-2">
        <div className="flex items-center justify-between">
          <CardTitle>{t("signIn.title")}</CardTitle>
          <Doodle variant="sparkle" className="text-accent" />
        </div>
        <p className="text-sm text-muted-foreground">
          {t("signIn.description")}
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <SignInForm />
        <p className="text-sm text-muted-foreground">
          {t("signIn.newUser")}{" "}
          <Link className="font-semibold text-foreground underline-offset-4 hover:underline" href={`/${locale}/sign-up`}>
            {t("signIn.createAccount")}
          </Link>
          .
        </p>
      </CardContent>
    </Card>
  )
}
