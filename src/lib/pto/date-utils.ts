/**
 * Calendar-date arithmetic in UTC only. Every date this module touches is
 * treated as a date-only value (no time-of-day meaning), so all math is
 * done via Date.UTC to sidestep local-timezone and DST shifts.
 */

const MS_PER_DAY = 86_400_000;

export function toUTCDate(input: Date | string): Date {
  const d = typeof input === "string" ? new Date(input) : input;
  return new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()));
}

export function daysBetween(a: Date, b: Date): number {
  return Math.round((toUTCDate(b).getTime() - toUTCDate(a).getTime()) / MS_PER_DAY);
}

export function addDaysUTC(date: Date, days: number): Date {
  const d = toUTCDate(date);
  return new Date(d.getTime() + days * MS_PER_DAY);
}

export function daysInMonth(year: number, monthIndex0: number): number {
  return new Date(Date.UTC(year, monthIndex0 + 1, 0)).getUTCDate();
}

/** Adds whole months, clamping the day so e.g. Jan 31 + 1mo = Feb 28/29. */
export function addMonthsClampedUTC(date: Date, months: number): Date {
  const d = toUTCDate(date);
  const totalMonths = d.getUTCMonth() + months;
  const year = d.getUTCFullYear() + Math.floor(totalMonths / 12);
  const monthIndex0 = ((totalMonths % 12) + 12) % 12;
  const day = Math.min(d.getUTCDate(), daysInMonth(year, monthIndex0));
  return new Date(Date.UTC(year, monthIndex0, day));
}

export function addYearsClampedUTC(date: Date, years: number): Date {
  return addMonthsClampedUTC(date, years * 12);
}

export function isAfter(a: Date, b: Date): boolean {
  return toUTCDate(a).getTime() > toUTCDate(b).getTime();
}

export function isSameOrBefore(a: Date, b: Date): boolean {
  return toUTCDate(a).getTime() <= toUTCDate(b).getTime();
}
