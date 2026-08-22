"use client";

import { useEffect, useMemo, useState } from "react";
import {
  accrualPerPeriodMinutes,
  hoursToMinutes,
  minutesToDays,
  minutesToHours,
  perHourWorkedRateMinutes,
  periodsPerYear,
  projectBalanceMinutes,
} from "@/lib/pto/calculations";
import type { AccrualFrequency } from "@/lib/pto/types";
import { ACCRUAL_FREQUENCY_LABELS } from "@/lib/pto/types";
import { track } from "@/lib/analytics";
import { Card } from "@/components/ui/Card";
import { FieldGroup, HelpText, Input, Label, Select } from "@/components/ui/Field";
import { ButtonLink } from "@/components/ui/Button";

const todayISO = () => new Date().toISOString().slice(0, 10);

export function AccrualCalculator() {
  const [startingBalance, setStartingBalance] = useState("0");
  const [annualAccrual, setAnnualAccrual] = useState("120");
  const [frequency, setFrequency] = useState<AccrualFrequency>("BIWEEKLY");
  const [hoursWorkedPerWeek, setHoursWorkedPerWeek] = useState("40");
  const [employmentStartDate, setEmploymentStartDate] = useState(oneYearAgoISO());
  const [calculationDate, setCalculationDate] = useState(todayISO());
  const [maxBalance, setMaxBalance] = useState("");
  const [hoursPerDay, setHoursPerDay] = useState("8");
  const [hasInteracted, setHasInteracted] = useState(false);

  useEffect(() => {
    track({ name: "calculator_viewed", calculator: "accrual" });
  }, []);

  const config = useMemo(
    () => ({
      startingBalanceMinutes: hoursToMinutes(num(startingBalance)),
      asOfDate: new Date(`${employmentStartDate}T00:00:00.000Z`),
      annualAccrualMinutes: hoursToMinutes(num(annualAccrual)),
      frequency,
      maxBalanceMinutes: maxBalance ? hoursToMinutes(num(maxBalance)) : null,
      hoursWorkedPerWeek: num(hoursWorkedPerWeek) || 40,
    }),
    [startingBalance, employmentStartDate, annualAccrual, frequency, maxBalance, hoursWorkedPerWeek]
  );

  const hoursPerDayMinutes = hoursToMinutes(num(hoursPerDay) || 8);
  const target = new Date(`${calculationDate}T00:00:00.000Z`);

  const currentBalanceMinutes = projectBalanceMinutes(config, target);
  const perPeriodMinutes =
    frequency === "PER_HOUR_WORKED"
      ? null
      : accrualPerPeriodMinutes(config.annualAccrualMinutes, frequency);
  const perHourMinutes =
    frequency === "PER_HOUR_WORKED"
      ? perHourWorkedRateMinutes(config.annualAccrualMinutes, config.hoursWorkedPerWeek)
      : null;

  const projections = [
    { label: "In 30 days", date: addDays(target, 30) },
    { label: "In 90 days", date: addDays(target, 90) },
    { label: "In 1 year", date: addDays(target, 365) },
  ].map((p) => ({ ...p, minutes: projectBalanceMinutes(config, p.date) }));

  function markCompleted() {
    if (!hasInteracted) {
      setHasInteracted(true);
      track({ name: "calculator_completed", calculator: "accrual" });
    }
  }

  return (
    <Card>
      <div className="grid gap-6 sm:grid-cols-2">
        <FieldGroup>
          <Label htmlFor="starting">Starting PTO balance (hours)</Label>
          <Input
            id="starting"
            type="number"
            inputMode="decimal"
            min={0}
            value={startingBalance}
            onChange={(e) => {
              setStartingBalance(e.target.value);
              markCompleted();
            }}
          />
          <HelpText>Your balance as of your employment start date. Often 0.</HelpText>
        </FieldGroup>

        <FieldGroup>
          <Label htmlFor="annual">PTO earned per year (hours)</Label>
          <Input
            id="annual"
            type="number"
            inputMode="decimal"
            min={0}
            value={annualAccrual}
            onChange={(e) => {
              setAnnualAccrual(e.target.value);
              markCompleted();
            }}
          />
        </FieldGroup>

        <FieldGroup>
          <Label htmlFor="frequency">Accrual frequency</Label>
          <Select
            id="frequency"
            value={frequency}
            onChange={(e) => {
              setFrequency(e.target.value as AccrualFrequency);
              markCompleted();
            }}
          >
            {Object.entries(ACCRUAL_FREQUENCY_LABELS).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </Select>
        </FieldGroup>

        {frequency === "PER_HOUR_WORKED" && (
          <FieldGroup>
            <Label htmlFor="hoursWorked">Hours worked per week</Label>
            <Input
              id="hoursWorked"
              type="number"
              inputMode="decimal"
              min={1}
              max={80}
              value={hoursWorkedPerWeek}
              onChange={(e) => {
                setHoursWorkedPerWeek(e.target.value);
                markCompleted();
              }}
            />
          </FieldGroup>
        )}

        <FieldGroup>
          <Label htmlFor="startDate">Employment start date</Label>
          <Input
            id="startDate"
            type="date"
            value={employmentStartDate}
            onChange={(e) => {
              setEmploymentStartDate(e.target.value);
              markCompleted();
            }}
          />
        </FieldGroup>

        <FieldGroup>
          <Label htmlFor="calcDate">Calculate balance as of</Label>
          <Input
            id="calcDate"
            type="date"
            value={calculationDate}
            onChange={(e) => {
              setCalculationDate(e.target.value);
              markCompleted();
            }}
          />
        </FieldGroup>

        <FieldGroup>
          <Label htmlFor="max">Maximum PTO balance (hours, optional)</Label>
          <Input
            id="max"
            type="number"
            inputMode="decimal"
            min={0}
            placeholder="No cap"
            value={maxBalance}
            onChange={(e) => {
              setMaxBalance(e.target.value);
              markCompleted();
            }}
          />
        </FieldGroup>

        <FieldGroup>
          <Label htmlFor="hpd">Hours in a workday</Label>
          <Input
            id="hpd"
            type="number"
            inputMode="decimal"
            min={1}
            max={24}
            value={hoursPerDay}
            onChange={(e) => {
              setHoursPerDay(e.target.value);
              markCompleted();
            }}
          />
        </FieldGroup>
      </div>

      <div className="mt-2 rounded-xl bg-brand-50 p-6 text-center">
        <p className="text-sm font-medium text-brand-800">
          Estimated balance as of {formatISO(calculationDate)}
        </p>
        <p className="mt-1 text-4xl font-semibold text-brand-900">
          {minutesToHours(currentBalanceMinutes).toFixed(1)}{" "}
          <span className="text-xl font-medium">PTO hours</span>
        </p>
        <p className="mt-1 text-brand-700">
          Approximately{" "}
          <strong>{minutesToDays(currentBalanceMinutes, hoursPerDayMinutes).toFixed(1)} workdays</strong>
        </p>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <Stat
          label="PTO earned per pay period"
          value={
            perPeriodMinutes != null
              ? `${minutesToHours(perPeriodMinutes).toFixed(2)} hrs / ${periodsPerYear(frequency)} periods per year`
              : `${minutesToHours(perHourMinutes ?? 0).toFixed(3)} hrs per hour worked`
          }
        />
        <Stat label="Annual PTO" value={`${num(annualAccrual).toFixed(1)} hrs / year`} />
      </div>

      <div className="mt-8">
        <p className="mb-3 text-sm font-medium text-ink-700">Future PTO projections</p>
        <div className="overflow-hidden rounded-lg border border-ink-200">
          {projections.map((p, i) => (
            <div
              key={p.label}
              className={`flex items-center justify-between px-4 py-3 text-sm ${
                i > 0 ? "border-t border-ink-200" : ""
              }`}
            >
              <span className="text-ink-600">
                {p.label} ({formatISO(p.date.toISOString().slice(0, 10))})
              </span>
              <span className="font-medium text-ink-900">
                {minutesToHours(p.minutes).toFixed(1)} hrs ·{" "}
                {minutesToDays(p.minutes, hoursPerDayMinutes).toFixed(1)} days
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-6 flex flex-col items-center gap-2 text-center">
        <p className="text-sm text-ink-600">
          Save this policy and we&apos;ll keep these projections up to date automatically.
        </p>
        <ButtonLink href="/signup" size="sm">
          Track my PTO free
        </ButtonLink>
      </div>
    </Card>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-ink-200 p-4">
      <p className="text-xs font-medium uppercase tracking-wide text-ink-500">{label}</p>
      <p className="mt-1 text-sm font-semibold text-ink-900">{value}</p>
    </div>
  );
}

function num(value: string): number {
  const n = Number(value);
  return Number.isFinite(n) ? n : 0;
}

function addDays(date: Date, days: number): Date {
  return new Date(date.getTime() + days * 86_400_000);
}

function oneYearAgoISO(): string {
  const d = new Date();
  d.setUTCFullYear(d.getUTCFullYear() - 1);
  return d.toISOString().slice(0, 10);
}

function formatISO(iso: string): string {
  return new Intl.DateTimeFormat("en-US", { year: "numeric", month: "short", day: "numeric", timeZone: "UTC" }).format(
    new Date(`${iso}T00:00:00.000Z`)
  );
}
