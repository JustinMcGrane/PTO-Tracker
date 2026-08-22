"use client";

import { useActionState } from "react";
import { signUp, type AuthActionState } from "@/lib/auth-actions";
import { Button } from "@/components/ui/Button";
import { FieldGroup, HelpText, Input, Label } from "@/components/ui/Field";

const initialState: AuthActionState = { error: null };

export function SignupForm() {
  const [state, formAction, isPending] = useActionState(signUp, initialState);

  return (
    <form action={formAction} className="space-y-1">
      <FieldGroup>
        <Label htmlFor="email">Email</Label>
        <Input id="email" name="email" type="email" autoComplete="email" required />
      </FieldGroup>
      <FieldGroup>
        <Label htmlFor="password">Password</Label>
        <Input id="password" name="password" type="password" autoComplete="new-password" required minLength={8} />
        <HelpText>At least 8 characters.</HelpText>
      </FieldGroup>

      {state.error && <p className="mb-4 text-sm text-red-600">{state.error}</p>}

      <Button type="submit" className="w-full" disabled={isPending}>
        {isPending ? "Creating account…" : "Create free account"}
      </Button>
    </form>
  );
}
