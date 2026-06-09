"use client"

import { useTranslations } from "next-intl"
import { useLocale } from "next-intl"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Doodle } from "@/components/ui/doodle"
import { Link } from "@/lib/i18n-navigation"

import { SignUpForm } from "./sign-up-form"

export default function SignUpPage() {
  const t = useTranslations("auth")
  const locale = useLocale()

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="space-y-2">
        <div className="flex items-center justify-between">
          <CardTitle>{t("signUp.title")}</CardTitle>
          <Doodle variant="star" className="text-primary" />
        </div>
        <p className="text-sm text-muted-foreground">
          {t("signUp.description")}
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <SignUpForm />
        <p className="text-sm text-muted-foreground">
          {t("signUp.haveAccount")}{" "}
          <Link className="font-semibold text-foreground underline-offset-4 hover:underline" href={`/${locale}/sign-in`}>
            {t("signUp.signIn")}
          </Link>
          .
        </p>
      </CardContent>
    </Card>
  )
}
