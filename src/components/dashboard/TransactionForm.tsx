"use client";

import { useActionState, useState } from "react";
import { createTransaction, type ActionState } from "@/app/dashboard/actions";
import { Button } from "@/components/ui/Button";
import { FieldGroup, Input, Label, Select } from "@/components/ui/Field";

const initialState: ActionState = { error: null };

function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

export function TransactionForm() {
  const [state, formAction, isPending] = useActionState(createTransaction, initialState);
  const [type, setType] = useState<"EARNED" | "USED" | "ADJUSTMENT">("USED");

  return (
    <form action={formAction} className="space-y-1">
      <div className="grid gap-4 sm:grid-cols-2">
        <FieldGroup>
          <Label htmlFor="t-type">Type</Label>
          <Select id="t-type" name="type" value={type} onChange={(e) => setType(e.target.value as typeof type)}>
            <option value="EARNED">Earned</option>
            <option value="USED">Used</option>
            <option value="ADJUSTMENT">Adjustment</option>
          </Select>
        </FieldGroup>

        {type === "ADJUSTMENT" && (
          <FieldGroup>
            <Label htmlFor="t-direction">Direction</Label>
            <Select id="t-direction" name="direction" defaultValue="increase">
              <option value="increase">Increase balance</option>
              <option value="decrease">Decrease balance</option>
            </Select>
          </FieldGroup>
        )}

        <FieldGroup>
          <Label htmlFor="t-amount">Amount (hours)</Label>
          <Input id="t-amount" name="amountHours" type="number" inputMode="decimal" min={0.25} step={0.25} required />
        </FieldGroup>

        <FieldGroup>
          <Label htmlFor="t-date">Date</Label>
          <Input id="t-date" name="occurredOn" type="date" defaultValue={todayISO()} required />
        </FieldGroup>
      </div>

      <FieldGroup>
        <Label htmlFor="t-note">Note (optional)</Label>
        <Input id="t-note" name="note" placeholder="e.g. Long weekend" maxLength={280} />
      </FieldGroup>

      {state.error && <p className="mb-4 text-sm text-red-600">{state.error}</p>}

      <Button type="submit" disabled={isPending}>
        {isPending ? "Saving…" : "Add entry"}
      </Button>
    </form>
  );
}
