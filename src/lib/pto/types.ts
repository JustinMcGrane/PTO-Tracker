export type AccrualFrequency =
  | "WEEKLY"
  | "BIWEEKLY"
  | "SEMIMONTHLY"
  | "MONTHLY"
  | "ANNUALLY"
  | "PER_HOUR_WORKED";

export const ACCRUAL_FREQUENCY_LABELS: Record<AccrualFrequency, string> = {
  WEEKLY: "Weekly",
  BIWEEKLY: "Every 2 weeks",
  SEMIMONTHLY: "Twice a month",
  MONTHLY: "Monthly",
  ANNUALLY: "Once a year",
  PER_HOUR_WORKED: "Per hour worked",
};

export const DEFAULT_HOURS_PER_DAY_MINUTES = 480;
export const DEFAULT_HOURS_WORKED_PER_WEEK = 40;

/**
 * All balances/accrual amounts are in integer minutes. A single fixed-point
 * unit avoids the float drift that comes from repeatedly adding fractional
 * hours across many pay periods.
 */
export interface AccrualConfig {
  /** PTO balance known to be accurate as of `asOfDate`, in minutes. */
  startingBalanceMinutes: number;
  asOfDate: Date;
  /** Total PTO granted per year, in minutes. Drives the per-period rate
   * for every frequency, including PER_HOUR_WORKED (via hoursWorkedPerWeek). */
  annualAccrualMinutes: number;
  frequency: AccrualFrequency;
  /** Cap on the balance; omit or null for uncapped. */
  maxBalanceMinutes?: number | null;
  hoursPerDayMinutes?: number;
  /** Only used for PER_HOUR_WORKED to translate the annual grant into a
   * per-hour-worked rate. Defaults to a standard 40-hour week. */
  hoursWorkedPerWeek?: number;
}

export interface VacationImpact {
  startDate: Date;
  hoursRequiredMinutes: number;
}

export interface BalanceProjection {
  date: Date;
  balanceMinutes: number;
}
