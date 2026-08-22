import { minutesToDays, minutesToHours } from "./calculations";
import { DEFAULT_HOURS_PER_DAY_MINUTES } from "./types";

export function formatHours(minutes: number, fractionDigits = 1): string {
  return minutesToHours(minutes).toFixed(fractionDigits);
}

export function formatDays(
  minutes: number,
  hoursPerDayMinutes: number = DEFAULT_HOURS_PER_DAY_MINUTES,
  fractionDigits = 1
): string {
  return minutesToDays(minutes, hoursPerDayMinutes).toFixed(fractionDigits);
}

export function formatBalanceSummary(
  minutes: number,
  hoursPerDayMinutes: number = DEFAULT_HOURS_PER_DAY_MINUTES
): { hours: string; days: string } {
  return {
    hours: formatHours(minutes),
    days: formatDays(minutes, hoursPerDayMinutes),
  };
}

export function formatCurrency(dollars: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(dollars);
}

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  }).format(date);
}
