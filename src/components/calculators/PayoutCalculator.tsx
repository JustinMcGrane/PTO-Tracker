"use client";

import { useMemo, useState } from "react";
import { calculatePtoPayout, hourlyRateFromSalary } from "@/lib/pto/calculations";
import { formatCurrency } from "@/lib/pto/format";
import { track } from "@/lib/analytics";
import { Card } from "@/components/ui/Card";
import { FieldGroup, HelpText, Input, Label } from "@/components/ui/Field";
import { ButtonLink } from "@/components/ui/Button";
import { clsx } from "@/lib/clsx";

type Mode = "rate" | "salary";

export function PayoutCalculator() {
  const [mode, setMode] = useState<Mode>("rate");
  const [ptoHours, setPtoHours] = useState("40");
  const [hourlyRate, setHourlyRate] = useState("25");
  const [annualSalary, setAnnualSalary] = useState("65000");
  const [weeklyHours, setWeeklyHours] = useState("40");
  const [hasInteracted, setHasInteracted] = useState(false);

  const derivedHourlyRate = useMemo(() => {
    if (mode === "rate") return num(hourlyRate);
    return hourlyRateFromSalary(num(annualSalary), num(weeklyHours) || 40);
  }, [mode, hourlyRate, annualSalary, weeklyHours]);

  const payout = calculatePtoPayout(num(ptoHours), derivedHourlyRate);

  function markCompleted() {
    if (!hasInteracted) {
      setHasInteracted(true);
      track({ name: "calculator_completed", calculator: "payout" });
    }
  }

  return (
    <Card>
      <div className="mb-6 inline-flex rounded-full border border-ink-200 p-1 text-sm">
        <ModeButton active={mode === "rate"} onClick={() => setMode("rate")}>
          I know my hourly rate
        </ModeButton>
        <ModeButton active={mode === "salary"} onClick={() => setMode("salary")}>
          I know my salary
        </ModeButton>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <FieldGroup>
          <Label htmlFor="ptoHours">Current PTO hours</Label>
          <Input
            id="ptoHours"
            type="number"
            inputMode="decimal"
            min={0}
            value={ptoHours}
            onChange={(e) => {
              setPtoHours(e.target.value);
              markCompleted();
            }}
          />
        </FieldGroup>

        {mode === "rate" ? (
          <FieldGroup>
            <Label htmlFor="hourlyRate">Hourly rate ($)</Label>
            <Input
              id="hourlyRate"
              type="number"
              inputMode="decimal"
              min={0}
              value={hourlyRate}
              onChange={(e) => {
                setHourlyRate(e.target.value);
                markCompleted();
              }}
            />
          </FieldGroup>
        ) : (
          <>
            <FieldGroup>
              <Label htmlFor="salary">Annual salary ($)</Label>
              <Input
                id="salary"
                type="number"
                inputMode="decimal"
                min={0}
                value={annualSalary}
                onChange={(e) => {
                  setAnnualSalary(e.target.value);
                  markCompleted();
                }}
              />
            </FieldGroup>
            <FieldGroup>
              <Label htmlFor="weeklyHours">Hours worked per week</Label>
              <Input
                id="weeklyHours"
                type="number"
                inputMode="decimal"
                min={1}
                max={80}
                value={weeklyHours}
                onChange={(e) => {
                  setWeeklyHours(e.target.value);
                  markCompleted();
                }}
              />
            </FieldGroup>
          </>
        )}
      </div>

      {mode === "salary" && (
        <HelpText>Estimated hourly rate: {formatCurrency(derivedHourlyRate)}/hr</HelpText>
      )}

      <div className="mt-6 rounded-xl bg-brand-50 p-6 text-center">
        <p className="text-sm font-medium text-brand-800">Estimated gross PTO payout</p>
        <p className="mt-1 text-4xl font-semibold text-brand-900">{formatCurrency(payout)}</p>
        <p className="mt-1 text-brand-700">
          {num(ptoHours).toFixed(1)} hours × {formatCurrency(derivedHourlyRate)}/hr, before taxes
        </p>
      </div>

      <p className="mt-4 text-xs text-ink-500">
        This is an informational estimate only, not legal or tax advice. Whether your employer must
        pay out unused PTO — and how it&apos;s calculated — depends on your employer&apos;s policy
        and your state or country&apos;s laws. Check your employee handbook or local labor
        regulations for your specific situation.
      </p>

      <div className="mt-6 flex flex-col items-center gap-2 text-center">
        <ButtonLink href="/signup" size="sm">
          Track my PTO free
        </ButtonLink>
      </div>
    </Card>
  );
}

function ModeButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={clsx(
        "rounded-full px-4 py-1.5 font-medium transition-colors",
        active ? "bg-brand-600 text-white" : "text-ink-600 hover:text-ink-900"
      )}
    >
      {children}
    </button>
  );
}

function num(value: string): number {
  const n = Number(value);
  return Number.isFinite(n) ? n : 0;
}
