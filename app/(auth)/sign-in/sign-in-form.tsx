"use client"

import { useActionState } from "react"

import { FormMessage } from "@/components/forms/form-message"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

import { type AuthActionState, signIn } from "../actions"

const initialState: AuthActionState = { status: "idle" }

export function SignInForm() {
  const [state, formAction] = useActionState(signIn, initialState)

  return (
    <form className="space-y-4" action={formAction}>
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input id="email" name="email" type="email" autoComplete="email" required />
      </div>
      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
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
      <Button className="w-full" size="lg" type="submit">
        Sign in
      </Button>
    </form>
  )
}
