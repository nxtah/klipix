"use client";

import { useActionState } from "react";
import { useTranslations } from "next-intl";

import { FormMessage } from "@/components/forms/form-message";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { GoogleIcon } from "@/components/ui/google-icon";
import { Link } from "@/lib/i18n-navigation";

import { type AuthActionState, signIn } from "../actions";

const initialState: AuthActionState = { status: "idle" };

export function SignInForm() {
  const t = useTranslations("auth");
  const [state, formAction, isPending] = useActionState(signIn, initialState);

  return (
    <div className="space-y-4">
      <form className="space-y-4" action={formAction}>
        <div className="space-y-2">
          <Label htmlFor="email">{t("signIn.email")}</Label>
          <Input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">{t("signIn.password")}</Label>
          <Input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            required
          />
        </div>
        {state.status === "error" && state.message ? (
          <FormMessage>{state.message}</FormMessage>
        ) : null}
        {state.status === "success" && state.message ? (
          <FormMessage tone="success">{state.message}</FormMessage>
        ) : null}
        <Button className="w-full" size="lg" type="submit" disabled={isPending}>
          {t("signIn.submit")}
        </Button>
      </form>

      <div className="relative flex items-center gap-3">
        <div className="h-0.5 flex-1 bg-border" />
        <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
          {t("orWith")}
        </span>
        <div className="h-0.5 flex-1 bg-border" />
      </div>

      <Button variant="outline" size="lg" className="w-full gap-3" asChild>
        <Link href="/auth/google">
          <GoogleIcon />
          {t("continueWithGoogle")}
        </Link>
      </Button>
    </div>
  );
}
