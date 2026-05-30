import Link from "next/link"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Doodle } from "@/components/ui/doodle"

import { SignUpForm } from "./sign-up-form"

export default function SignUpPage() {
  return (
    <Card className="w-full max-w-md">
      <CardHeader className="space-y-2">
        <div className="flex items-center justify-between">
          <CardTitle>Create your Klipix</CardTitle>
          <Doodle variant="star" className="text-secondary" />
        </div>
        <p className="text-sm text-muted-foreground">
          Start organizing your short-form pipeline in minutes.
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <SignUpForm />
        <p className="text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link className="font-semibold text-foreground underline-offset-4 hover:underline" href="/sign-in">
            Sign in
          </Link>
          .
        </p>
      </CardContent>
    </Card>
  )
}
