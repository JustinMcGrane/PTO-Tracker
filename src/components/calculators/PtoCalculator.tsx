"use client";

import { useEffect, useMemo, useState } from "react";
import { hoursToMinutes, minutesToDays, minutesToHours } from "@/lib/pto/calculations";
import { track } from "@/lib/analytics";
import { Card } from "@/components/ui/Card";
import { FieldGroup, HelpText, Input, Label } from "@/components/ui/Field";
import { ButtonLink } from "@/components/ui/Button";

export function PtoCalculator() {
  const [hoursPerDay, setHoursPerDay] = useState("8");
  const [earnedHours, setEarnedHours] = useState("120");
  const [usedHours, setUsedHours] = useState("40");
  const [hasInteracted, setHasInteracted] = useState(false);

  useEffect(() => {
    track({ name: "calculator_viewed", calculator: "pto" });
  }, []);

  const result = useMemo(() => {
    const earnedMinutes = hoursToMinutes(num(earnedHours));
    const usedMinutes = hoursToMinutes(num(usedHours));
    const availableMinutes = earnedMinutes - usedMinutes;
    const perDayMinutes = hoursToMinutes(num(hoursPerDay)) || 480;
    return {
      availableHours: minutesToHours(availableMinutes),
      availableDays: minutesToDays(availableMinutes, perDayMinutes),
    };
  }, [earnedHours, usedHours, hoursPerDay]);

  function onChange(setter: (v: string) => void) {
    return (v: string) => {
      setter(v);
      if (!hasInteracted) {
        setHasInteracted(true);
        track({ name: "calculator_completed", calculator: "pto" });
      }
    };
  }

  return (
    <Card>
      <div className="grid gap-6 sm:grid-cols-3">
        <FieldGroup>
          <Label htmlFor="earned">PTO you&apos;ve earned (hours)</Label>
          <Input
            id="earned"
            type="number"
            inputMode="decimal"
            min={0}
            value={earnedHours}
            onChange={(e) => onChange(setEarnedHours)(e.target.value)}
          />
        </FieldGroup>
        <FieldGroup>
          <Label htmlFor="used">PTO you&apos;ve used (hours)</Label>
          <Input
            id="used"
            type="number"
            inputMode="decimal"
            min={0}
            value={usedHours}
            onChange={(e) => onChange(setUsedHours)(e.target.value)}
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
            onChange={(e) => onChange(setHoursPerDay)(e.target.value)}
          />
          <HelpText>Most full-time schedules use 8. Change this if yours is different.</HelpText>
        </FieldGroup>
      </div>

      <div className="mt-2 rounded-xl bg-brand-50 p-6 text-center">
        <p className="text-sm font-medium text-brand-800">You have available</p>
        <p className="mt-1 text-4xl font-semibold text-brand-900">
          {result.availableHours.toFixed(1)} <span className="text-xl font-medium">PTO hours</span>
        </p>
        <p className="mt-1 text-brand-700">
          Approximately <strong>{result.availableDays.toFixed(1)} workdays</strong>
        </p>
      </div>

      <div className="mt-6 flex flex-col items-center gap-2 text-center">
        <p className="text-sm text-ink-600">Save this and see how it grows over time.</p>
        <ButtonLink href="/signup" size="sm">
          Track my PTO
        </ButtonLink>
      </div>
    </Card>
  );
}

function num(value: string): number {
  const n = Number(value);
  return Number.isFinite(n) ? n : 0;
}
