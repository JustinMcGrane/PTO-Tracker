"use client";

import { useActionState } from "react";
import { createVacation, type ActionState } from "@/app/dashboard/actions";
import { Button } from "@/components/ui/Button";
import { FieldGroup, Input, Label } from "@/components/ui/Field";

const initialState: ActionState = { error: null };

export function VacationForm({ disabled }: { disabled?: boolean }) {
  const [state, formAction, isPending] = useActionState(createVacation, initialState);

  return (
    <form action={formAction} className="space-y-1">
      <FieldGroup>
        <Label htmlFor="v-name">Trip name</Label>
        <Input id="v-name" name="name" placeholder="Summer trip to Portugal" required disabled={disabled} />
      </FieldGroup>
      <div className="grid gap-4 sm:grid-cols-3">
        <FieldGroup>
          <Label htmlFor="v-start">Start date</Label>
          <Input id="v-start" name="startDate" type="date" required disabled={disabled} />
        </FieldGroup>
        <FieldGroup>
          <Label htmlFor="v-end">End date</Label>
          <Input id="v-end" name="endDate" type="date" required disabled={disabled} />
        </FieldGroup>
        <FieldGroup>
          <Label htmlFor="v-hours">PTO hours needed</Label>
          <Input id="v-hours" name="hoursRequired" type="number" inputMode="decimal" min={0.5} step={0.5} required disabled={disabled} />
        </FieldGroup>
      </div>

      {state.error && <p className="mb-4 text-sm text-red-600">{state.error}</p>}

      <Button type="submit" disabled={isPending || disabled}>
        {isPending ? "Saving…" : "Add vacation"}
      </Button>
    </form>
  );
}
