"use client"

import { useActionState } from "react"

import { FormMessage } from "@/components/forms/form-message"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

import { type AuthActionState, signUp } from "../actions"

const initialState: AuthActionState = { status: "idle" }

export function SignUpForm() {
  const [state, formAction] = useActionState(signUp, initialState)

  return (
    <form className="space-y-4" action={formAction}>
      <div className="space-y-2">
        <Label htmlFor="full_name">Full name</Label>
        <Input id="full_name" name="full_name" autoComplete="name" required />
      </div>
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input id="email" name="email" type="email" autoComplete="email" required />
      </div>
      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input id="password" name="password" type="password" autoComplete="new-password" required />
      </div>
      {state.status === "error" && state.message ? (
        <FormMessage>{state.message}</FormMessage>
      ) : null}
      {state.status === "success" && state.message ? (
        <FormMessage tone="success">{state.message}</FormMessage>
      ) : null}
      <Button className="w-full" size="lg" type="submit">
        Create account
      </Button>
    </form>
  )
}
