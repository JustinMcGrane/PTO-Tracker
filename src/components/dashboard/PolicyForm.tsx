"use client";

import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { savePolicy, type ActionState } from "@/app/dashboard/actions";
import { ACCRUAL_FREQUENCY_LABELS } from "@/lib/pto/types";
import type { AccrualFrequency } from "@/lib/pto/types";
import { Button } from "@/components/ui/Button";
import { FieldGroup, HelpText, Input, Label, Select } from "@/components/ui/Field";

const initialState: ActionState = { error: null };

export interface PolicyFormDefaults {
  name: string;
  hoursPerDay: number;
  employmentStartDate: string;
  startingBalanceHours: number;
  annualAccrualHours: number;
  accrualFrequency: AccrualFrequency;
  hoursWorkedPerWeek: number;
  maxBalanceHours: string;
  nextAccrualDate: string;
}

const EMPTY_DEFAULTS: PolicyFormDefaults = {
  name: "My PTO Policy",
  hoursPerDay: 8,
  employmentStartDate: "",
  startingBalanceHours: 0,
  annualAccrualHours: 120,
  accrualFrequency: "BIWEEKLY",
  hoursWorkedPerWeek: 40,
  maxBalanceHours: "",
  nextAccrualDate: "",
};

export function PolicyForm({
  defaults = EMPTY_DEFAULTS,
  submitLabel = "Save and continue",
  redirectOnSuccess,
}: {
  defaults?: PolicyFormDefaults;
  submitLabel?: string;
  redirectOnSuccess?: string;
}) {
  const [state, formAction, isPending] = useActionState(savePolicy, initialState);
  const router = useRouter();

  useEffect(() => {
    if (state.success && redirectOnSuccess) {
      router.push(redirectOnSuccess);
    }
  }, [state.success, redirectOnSuccess, router]);

  return (
    <form action={formAction} className="space-y-1">
      <FieldGroup>
        <Label htmlFor="name">Policy name</Label>
        <Input id="name" name="name" defaultValue={defaults.name} required />
      </FieldGroup>

      <div className="grid gap-6 sm:grid-cols-2">
        <FieldGroup>
          <Label htmlFor="startingBalanceHours">Current PTO balance (hours)</Label>
          <Input
            id="startingBalanceHours"
            name="startingBalanceHours"
            type="number"
            inputMode="decimal"
            min={0}
            defaultValue={defaults.startingBalanceHours}
            required
          />
        </FieldGroup>

        <FieldGroup>
          <Label htmlFor="annualAccrualHours">Annual PTO allowance (hours)</Label>
          <Input
            id="annualAccrualHours"
            name="annualAccrualHours"
            type="number"
            inputMode="decimal"
            min={0}
            defaultValue={defaults.annualAccrualHours}
            required
          />
        </FieldGroup>

        <FieldGroup>
          <Label htmlFor="accrualFrequency">Accrual frequency</Label>
          <Select id="accrualFrequency" name="accrualFrequency" defaultValue={defaults.accrualFrequency}>
            {Object.entries(ACCRUAL_FREQUENCY_LABELS).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </Select>
        </FieldGroup>

        <FieldGroup>
          <Label htmlFor="hoursWorkedPerWeek">Hours worked per week</Label>
          <Input
            id="hoursWorkedPerWeek"
            name="hoursWorkedPerWeek"
            type="number"
            inputMode="decimal"
            min={1}
            max={80}
            defaultValue={defaults.hoursWorkedPerWeek}
          />
          <HelpText>Only used for &quot;per hour worked&quot; accrual.</HelpText>
        </FieldGroup>

        <FieldGroup>
          <Label htmlFor="hoursPerDay">Hours in a workday</Label>
          <Input
            id="hoursPerDay"
            name="hoursPerDay"
            type="number"
            inputMode="decimal"
            min={1}
            max={24}
            defaultValue={defaults.hoursPerDay}
            required
          />
        </FieldGroup>

        <FieldGroup>
          <Label htmlFor="maxBalanceHours">Maximum PTO balance (hours, optional)</Label>
          <Input
            id="maxBalanceHours"
            name="maxBalanceHours"
            type="number"
            inputMode="decimal"
            min={0}
            placeholder="No cap"
            defaultValue={defaults.maxBalanceHours}
          />
        </FieldGroup>

        <FieldGroup>
          <Label htmlFor="employmentStartDate">Employment start date (optional)</Label>
          <Input
            id="employmentStartDate"
            name="employmentStartDate"
            type="date"
            defaultValue={defaults.employmentStartDate}
          />
        </FieldGroup>

        <FieldGroup>
          <Label htmlFor="nextAccrualDate">Next accrual date (optional)</Label>
          <Input id="nextAccrualDate" name="nextAccrualDate" type="date" defaultValue={defaults.nextAccrualDate} />
        </FieldGroup>
      </div>

      {state.error && <p className="mb-4 text-sm text-red-600">{state.error}</p>}
      {state.success && !redirectOnSuccess && <p className="mb-4 text-sm text-brand-700">Saved.</p>}

      <Button type="submit" disabled={isPending}>
        {isPending ? "Saving…" : submitLabel}
      </Button>
    </form>
  );
}
