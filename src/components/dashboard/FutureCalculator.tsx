"use client";

import { useMemo, useState } from "react";
import { minutesToDays, minutesToHours, projectBalanceWithVacations } from "@/lib/pto/calculations";
import type { AccrualConfig, VacationImpact } from "@/lib/pto/types";
import { formatDate } from "@/lib/pto/format";
import { Card } from "@/components/ui/Card";
import { FieldGroup, Input, Label } from "@/components/ui/Field";

function defaultDate(): string {
  const d = new Date();
  d.setUTCDate(d.getUTCDate() + 30);
  return d.toISOString().slice(0, 10);
}

export function FutureCalculator({ config, vacations }: { config: AccrualConfig; vacations: VacationImpact[] }) {
  const [dateInput, setDateInput] = useState(defaultDate());

  const targetDate = useMemo(() => new Date(`${dateInput}T00:00:00.000Z`), [dateInput]);
  const balanceMinutes = useMemo(
    () => projectBalanceWithVacations(config, targetDate, vacations),
    [config, targetDate, vacations]
  );

  return (
    <Card>
      <FieldGroup>
        <Label htmlFor="futureDate">Calculate my balance as of</Label>
        <Input
          id="futureDate"
          type="date"
          value={dateInput}
          onChange={(e) => setDateInput(e.target.value)}
          className="max-w-xs"
        />
      </FieldGroup>

      <div className="mt-2 rounded-xl bg-brand-50 p-6 text-center">
        <p className="text-sm font-medium text-brand-800">Projected balance on {formatDate(targetDate)}</p>
        <p className="mt-1 text-4xl font-semibold text-brand-900">
          {minutesToHours(balanceMinutes).toFixed(1)} <span className="text-xl font-medium">hours</span>
        </p>
        <p className="mt-1 text-brand-700">
          Approximately{" "}
          <strong>{minutesToDays(balanceMinutes, config.hoursPerDayMinutes).toFixed(1)} days</strong>
        </p>
      </div>

      <p className="mt-4 text-xs text-ink-500">
        Includes accrual between now and this date, subtracts any planned vacations that start on or
        before it, and respects your policy&apos;s maximum balance if set.
      </p>
    </Card>
  );
}
