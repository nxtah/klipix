import Link from "next/link"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Doodle } from "@/components/ui/doodle"

import { SignInForm } from "./sign-in-form"

export default function SignInPage() {
  return (
    <Card className="w-full max-w-md">
      <CardHeader className="space-y-2">
        <div className="flex items-center justify-between">
          <CardTitle>Welcome back</CardTitle>
          <Doodle variant="sparkle" className="text-accent" />
        </div>
        <p className="text-sm text-muted-foreground">
          Log in to manage your ideas, scripts, and scenes.
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <SignInForm />
        <p className="text-sm text-muted-foreground">
          New here?{" "}
          <Link className="font-semibold text-foreground underline-offset-4 hover:underline" href="/sign-up">
            Create an account
          </Link>
          .
        </p>
      </CardContent>
    </Card>
  )
}
