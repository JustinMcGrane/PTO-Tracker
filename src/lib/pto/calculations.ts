import {
  addDaysUTC,
  addMonthsClampedUTC,
  addYearsClampedUTC,
  daysBetween,
  isAfter,
  isSameOrBefore,
  toUTCDate,
} from "./date-utils";
import type {
  AccrualConfig,
  AccrualFrequency,
  BalanceProjection,
  VacationImpact,
} from "./types";
import { DEFAULT_HOURS_PER_DAY_MINUTES, DEFAULT_HOURS_WORKED_PER_WEEK } from "./types";

const PERIODS_PER_YEAR: Record<Exclude<AccrualFrequency, "PER_HOUR_WORKED">, number> = {
  WEEKLY: 52,
  BIWEEKLY: 26,
  SEMIMONTHLY: 24,
  MONTHLY: 12,
  ANNUALLY: 1,
};

export function periodsPerYear(frequency: AccrualFrequency): number {
  if (frequency === "PER_HOUR_WORKED") {
    throw new Error("PER_HOUR_WORKED has no fixed periods per year");
  }
  return PERIODS_PER_YEAR[frequency];
}

/** PTO earned in a single pay period, for frequencies with a fixed schedule. */
export function accrualPerPeriodMinutes(
  annualAccrualMinutes: number,
  frequency: Exclude<AccrualFrequency, "PER_HOUR_WORKED">
): number {
  return annualAccrualMinutes / periodsPerYear(frequency);
}

/** Minutes of PTO earned per hour actually worked, for PER_HOUR_WORKED policies. */
export function perHourWorkedRateMinutes(
  annualAccrualMinutes: number,
  hoursWorkedPerWeek: number = DEFAULT_HOURS_WORKED_PER_WEEK
): number {
  return annualAccrualMinutes / (hoursWorkedPerWeek * 52);
}

function countBySteps(
  fromDate: Date,
  toDate: Date,
  step: (from: Date, n: number) => Date,
  maxIterations = 5000
): number {
  let n = 0;
  while (n < maxIterations) {
    const candidate = step(fromDate, n + 1);
    if (isSameOrBefore(candidate, toDate)) {
      n += 1;
    } else {
      break;
    }
  }
  return n;
}

function countSemimonthlyOccurrences(fromDate: Date, toDate: Date): number {
  const from = toUTCDate(fromDate);
  const to = toUTCDate(toDate);
  const monthsSpan =
    (to.getUTCFullYear() - from.getUTCFullYear()) * 12 +
    (to.getUTCMonth() - from.getUTCMonth()) +
    1;

  let count = 0;
  for (let i = 0; i < monthsSpan; i += 1) {
    const totalMonths = from.getUTCMonth() + i;
    const year = from.getUTCFullYear() + Math.floor(totalMonths / 12);
    const monthIndex0 = ((totalMonths % 12) + 12) % 12;
    for (const day of [1, 15]) {
      const candidate = new Date(Date.UTC(year, monthIndex0, day));
      if (isAfter(candidate, from) && isSameOrBefore(candidate, to)) {
        count += 1;
      }
    }
  }
  return count;
}

/** Number of completed accrual periods between two dates, for fixed-schedule frequencies. */
export function countPeriodsElapsed(
  fromDate: Date,
  toDate: Date,
  frequency: Exclude<AccrualFrequency, "PER_HOUR_WORKED">
): number {
  if (!isAfter(toDate, fromDate)) return 0;

  switch (frequency) {
    case "WEEKLY":
      return Math.floor(daysBetween(fromDate, toDate) / 7);
    case "BIWEEKLY":
      return Math.floor(daysBetween(fromDate, toDate) / 14);
    case "SEMIMONTHLY":
      return countSemimonthlyOccurrences(fromDate, toDate);
    case "MONTHLY":
      return countBySteps(fromDate, toDate, addMonthsClampedUTC);
    case "ANNUALLY":
      return countBySteps(fromDate, toDate, (from, n) => addYearsClampedUTC(from, n));
  }
}

/** Total PTO accrued between two dates under the given policy. */
export function accruedMinutesBetween(config: AccrualConfig, fromDate: Date, toDate: Date): number {
  if (!isAfter(toDate, fromDate)) return 0;

  if (config.frequency === "PER_HOUR_WORKED") {
    const hoursWorkedPerWeek = config.hoursWorkedPerWeek ?? DEFAULT_HOURS_WORKED_PER_WEEK;
    const rate = perHourWorkedRateMinutes(config.annualAccrualMinutes, hoursWorkedPerWeek);
    const days = daysBetween(fromDate, toDate);
    const hoursWorked = (hoursWorkedPerWeek / 7) * days;
    return Math.round(rate * hoursWorked);
  }

  const periods = countPeriodsElapsed(fromDate, toDate, config.frequency);
  const perPeriod = accrualPerPeriodMinutes(config.annualAccrualMinutes, config.frequency);
  return Math.round(perPeriod * periods);
}

/**
 * Projected PTO balance on `targetDate`, ignoring planned vacations.
 * Dates on or before `config.asOfDate` return the starting balance unchanged
 * — this function only projects forward.
 */
export function projectBalanceMinutes(config: AccrualConfig, targetDate: Date): number {
  const accrued = accruedMinutesBetween(config, config.asOfDate, targetDate);
  const raw = config.startingBalanceMinutes + accrued;
  if (config.maxBalanceMinutes != null) {
    return Math.min(raw, config.maxBalanceMinutes);
  }
  return raw;
}

/**
 * Projected balance on `targetDate` after subtracting any planned vacation
 * that starts on or before that date. Intentionally not clamped at zero, so
 * a shortfall shows up as a negative number the UI can warn about.
 */
export function projectBalanceWithVacations(
  config: AccrualConfig,
  targetDate: Date,
  vacations: VacationImpact[]
): number {
  const base = projectBalanceMinutes(config, targetDate);
  const consumed = vacations
    .filter((v) => isSameOrBefore(v.startDate, targetDate))
    .reduce((sum, v) => sum + v.hoursRequiredMinutes, 0);
  return base - consumed;
}

export interface VacationPlanResult {
  balanceBeforeMinutes: number;
  hoursRequiredMinutes: number;
  balanceAfterMinutes: number;
}

/** Projects the balance impact of one planned vacation, accounting for any
 * other vacations that fall before it. */
export function calculateVacationPlan(
  config: AccrualConfig,
  vacation: VacationImpact,
  otherVacations: VacationImpact[]
): VacationPlanResult {
  const priorVacations = otherVacations.filter((v) => isSameOrBefore(v.startDate, vacation.startDate));
  const balanceBeforeMinutes = projectBalanceWithVacations(config, vacation.startDate, priorVacations);
  const balanceAfterMinutes = balanceBeforeMinutes - vacation.hoursRequiredMinutes;
  return {
    balanceBeforeMinutes,
    hoursRequiredMinutes: vacation.hoursRequiredMinutes,
    balanceAfterMinutes,
  };
}

/** A series of balance points for charting, from `fromDate` to `toDate`. */
export function projectBalanceSeries(
  config: AccrualConfig,
  fromDate: Date,
  toDate: Date,
  stepDays = 30,
  vacations: VacationImpact[] = []
): BalanceProjection[] {
  const points: BalanceProjection[] = [];
  let cursor = toUTCDate(fromDate);
  const end = toUTCDate(toDate);

  while (isAfter(end, cursor)) {
    points.push({ date: cursor, balanceMinutes: projectBalanceWithVacations(config, cursor, vacations) });
    cursor = new Date(cursor.getTime() + stepDays * 86_400_000);
  }
  points.push({ date: end, balanceMinutes: projectBalanceWithVacations(config, end, vacations) });
  return points;
}

/**
 * Estimated date of the next accrual event on or after `fromDate`, for
 * fixed-schedule frequencies anchored to `config.asOfDate`. Semimonthly is
 * calendar-anchored (the 1st/15th) rather than anchored to that date.
 * Returns null for PER_HOUR_WORKED, which has no fixed schedule.
 */
export function estimateNextAccrualDate(config: AccrualConfig, fromDate: Date): Date | null {
  const anchor = toUTCDate(config.asOfDate);
  const from = toUTCDate(fromDate);

  if (config.frequency === "PER_HOUR_WORKED") return null;

  if (config.frequency === "SEMIMONTHLY") {
    let candidate = addDaysUTC(from, 1);
    for (let i = 0; i < 40; i += 1) {
      const day = candidate.getUTCDate();
      if (day === 1 || day === 15) return candidate;
      candidate = addDaysUTC(candidate, 1);
    }
    return candidate;
  }

  const periodsSoFar = countPeriodsElapsed(anchor, from, config.frequency);
  const nextIndex = periodsSoFar + 1;

  switch (config.frequency) {
    case "WEEKLY":
      return addDaysUTC(anchor, nextIndex * 7);
    case "BIWEEKLY":
      return addDaysUTC(anchor, nextIndex * 14);
    case "MONTHLY":
      return addMonthsClampedUTC(anchor, nextIndex);
    case "ANNUALLY":
      return addYearsClampedUTC(anchor, nextIndex);
  }
}

// --- Unit conversions -------------------------------------------------

export function minutesToHours(minutes: number): number {
  return minutes / 60;
}

export function hoursToMinutes(hours: number): number {
  return Math.round(hours * 60);
}

export function minutesToDays(
  minutes: number,
  hoursPerDayMinutes: number = DEFAULT_HOURS_PER_DAY_MINUTES
): number {
  return minutes / hoursPerDayMinutes;
}

export function daysToMinutes(
  days: number,
  hoursPerDayMinutes: number = DEFAULT_HOURS_PER_DAY_MINUTES
): number {
  return Math.round(days * hoursPerDayMinutes);
}

// --- Payout -------------------------------------------------------------

export function hourlyRateFromSalary(annualSalaryDollars: number, weeklyHours: number): number {
  if (weeklyHours <= 0) return 0;
  return annualSalaryDollars / (weeklyHours * 52);
}

/** Gross PTO payout value, rounded to the nearest cent. */
export function calculatePtoPayout(ptoHours: number, hourlyRateDollars: number): number {
  return Math.round(ptoHours * hourlyRateDollars * 100) / 100;
}
