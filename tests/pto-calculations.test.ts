import { describe, expect, it } from "vitest";
import {
  accruedMinutesBetween,
  calculatePtoPayout,
  calculateVacationPlan,
  countPeriodsElapsed,
  daysToMinutes,
  hourlyRateFromSalary,
  hoursToMinutes,
  minutesToDays,
  minutesToHours,
  periodsPerYear,
  projectBalanceMinutes,
  projectBalanceWithVacations,
} from "@/lib/pto/calculations";
import { formatBalanceSummary } from "@/lib/pto/format";
import type { AccrualConfig } from "@/lib/pto/types";

const d = (iso: string) => new Date(`${iso}T00:00:00.000Z`);

describe("periodsPerYear", () => {
  it("returns the standard payroll period counts", () => {
    expect(periodsPerYear("WEEKLY")).toBe(52);
    expect(periodsPerYear("BIWEEKLY")).toBe(26);
    expect(periodsPerYear("SEMIMONTHLY")).toBe(24);
    expect(periodsPerYear("MONTHLY")).toBe(12);
    expect(periodsPerYear("ANNUALLY")).toBe(1);
  });

  it("throws for PER_HOUR_WORKED, which has no fixed schedule", () => {
    expect(() => periodsPerYear("PER_HOUR_WORKED")).toThrow();
  });
});

describe("countPeriodsElapsed", () => {
  it("counts weekly periods by whole 7-day chunks", () => {
    expect(countPeriodsElapsed(d("2026-01-01"), d("2026-01-15"), "WEEKLY")).toBe(2);
    expect(countPeriodsElapsed(d("2026-01-01"), d("2026-01-07"), "WEEKLY")).toBe(0);
    expect(countPeriodsElapsed(d("2026-01-01"), d("2026-01-08"), "WEEKLY")).toBe(1);
  });

  it("counts biweekly periods by whole 14-day chunks", () => {
    expect(countPeriodsElapsed(d("2026-01-01"), d("2026-01-29"), "BIWEEKLY")).toBe(2);
  });

  it("counts the 1st and 15th of each month for semimonthly", () => {
    // Jan 1 (exclusive) through Feb 1 (inclusive): Jan 15 and Feb 1
    expect(countPeriodsElapsed(d("2026-01-01"), d("2026-02-01"), "SEMIMONTHLY")).toBe(2);
    expect(countPeriodsElapsed(d("2026-01-01"), d("2026-01-14"), "SEMIMONTHLY")).toBe(0);
    expect(countPeriodsElapsed(d("2026-01-01"), d("2026-12-31"), "SEMIMONTHLY")).toBe(23);
  });

  it("counts monthly anniversaries, clamping short months", () => {
    expect(countPeriodsElapsed(d("2026-01-15"), d("2026-04-15"), "MONTHLY")).toBe(3);
    // Each monthly anniversary is clamped independently from the Jan 31
    // anchor (2026 is not a leap year), so month 1 lands on Feb 28.
    expect(countPeriodsElapsed(d("2026-01-31"), d("2026-02-28"), "MONTHLY")).toBe(1);
    expect(countPeriodsElapsed(d("2026-01-31"), d("2026-02-27"), "MONTHLY")).toBe(0);
  });

  it("counts annual anniversaries, clamping leap days", () => {
    expect(countPeriodsElapsed(d("2024-02-29"), d("2027-03-01"), "ANNUALLY")).toBe(3);
  });

  it("returns 0 when the target date is not after the anchor date", () => {
    expect(countPeriodsElapsed(d("2026-01-01"), d("2026-01-01"), "WEEKLY")).toBe(0);
    expect(countPeriodsElapsed(d("2026-01-10"), d("2026-01-01"), "MONTHLY")).toBe(0);
  });
});

describe("accruedMinutesBetween", () => {
  it("matches perPeriod * periodsElapsed for fixed-schedule frequencies", () => {
    const config: AccrualConfig = {
      startingBalanceMinutes: 0,
      asOfDate: d("2026-01-01"),
      annualAccrualMinutes: hoursToMinutes(120),
      frequency: "MONTHLY",
    };
    // 4 monthly periods elapsed by May 1 * (7200/12 = 600/period) = 2400
    expect(accruedMinutesBetween(config, config.asOfDate, d("2026-05-01"))).toBe(2400);
  });

  it("derives an hourly accrual rate for PER_HOUR_WORKED that matches a 40-hour week", () => {
    const config: AccrualConfig = {
      startingBalanceMinutes: 0,
      asOfDate: d("2026-01-01"),
      annualAccrualMinutes: hoursToMinutes(80),
      frequency: "PER_HOUR_WORKED",
      hoursWorkedPerWeek: 40,
    };
    // A full 40-hour work week should accrue ~ annual/52, same as WEEKLY.
    const weekly = accruedMinutesBetween(config, config.asOfDate, d("2026-01-08"));
    expect(weekly).toBe(Math.round(hoursToMinutes(80) / 52));
  });
});

describe("projectBalanceMinutes", () => {
  const baseConfig: AccrualConfig = {
    startingBalanceMinutes: hoursToMinutes(40),
    asOfDate: d("2026-01-01"),
    annualAccrualMinutes: hoursToMinutes(80),
    frequency: "MONTHLY",
  };

  it("adds accrued PTO to the starting balance", () => {
    // 3 months elapsed by Apr 1 * (4800/12=400/month) = 1200, + starting 2400 = 3600
    expect(projectBalanceMinutes(baseConfig, d("2026-04-01"))).toBe(3600);
  });

  it("caps the projected balance at the configured maximum", () => {
    const capped: AccrualConfig = { ...baseConfig, maxBalanceMinutes: hoursToMinutes(60) };
    // Far enough out that uncapped balance would exceed the cap
    expect(projectBalanceMinutes(capped, d("2027-06-01"))).toBe(hoursToMinutes(60));
  });

  it("does not project backward before asOfDate", () => {
    expect(projectBalanceMinutes(baseConfig, d("2025-12-01"))).toBe(baseConfig.startingBalanceMinutes);
  });
});

describe("projectBalanceWithVacations and calculateVacationPlan", () => {
  const config: AccrualConfig = {
    startingBalanceMinutes: hoursToMinutes(80),
    asOfDate: d("2026-01-01"),
    annualAccrualMinutes: hoursToMinutes(120),
    frequency: "MONTHLY",
  };

  it("subtracts vacations that start on or before the target date", () => {
    const vacations = [{ startDate: d("2026-03-01"), hoursRequiredMinutes: hoursToMinutes(24) }];
    const beforeVacationStarts = projectBalanceWithVacations(config, d("2026-02-01"), vacations);
    const onVacationStartDate = projectBalanceWithVacations(config, d("2026-03-01"), vacations);
    // Not yet subtracted: the vacation hasn't started as of Feb 1.
    expect(beforeVacationStarts).toBe(projectBalanceMinutes(config, d("2026-02-01")));
    // Subtracted once the target date reaches the vacation's start date.
    expect(onVacationStartDate).toBe(projectBalanceMinutes(config, d("2026-03-01")) - hoursToMinutes(24));
  });

  it("computes before/after balances for a planned vacation", () => {
    const vacation = { startDate: d("2026-05-01"), hoursRequiredMinutes: hoursToMinutes(40) };
    const result = calculateVacationPlan(config, vacation, []);
    // 4 monthly periods elapsed * 600/month = 2400 accrued, + 4800 starting = 7200
    expect(result.balanceBeforeMinutes).toBe(7200);
    expect(result.hoursRequiredMinutes).toBe(hoursToMinutes(40));
    expect(result.balanceAfterMinutes).toBe(7200 - hoursToMinutes(40));
  });

  it("accounts for an earlier vacation when planning a later one", () => {
    const earlier = { startDate: d("2026-02-01"), hoursRequiredMinutes: hoursToMinutes(16) };
    const later = { startDate: d("2026-05-01"), hoursRequiredMinutes: hoursToMinutes(40) };
    const withoutEarlier = calculateVacationPlan(config, later, []);
    const withEarlier = calculateVacationPlan(config, later, [earlier]);
    expect(withEarlier.balanceBeforeMinutes).toBe(
      withoutEarlier.balanceBeforeMinutes - hoursToMinutes(16)
    );
  });

  it("allows a negative remaining balance to signal a shortfall", () => {
    const vacation = { startDate: d("2026-02-01"), hoursRequiredMinutes: hoursToMinutes(1000) };
    const result = calculateVacationPlan(config, vacation, []);
    expect(result.balanceAfterMinutes).toBeLessThan(0);
  });
});

describe("unit conversions", () => {
  it("converts hours and minutes both ways", () => {
    expect(hoursToMinutes(1)).toBe(60);
    expect(minutesToHours(90)).toBe(1.5);
  });

  it("converts days and minutes using hours-per-day", () => {
    expect(daysToMinutes(2, 480)).toBe(960);
    expect(minutesToDays(480, 480)).toBe(1);
    expect(minutesToDays(720, 480)).toBe(1.5);
  });

  it("formats a balance as human-friendly hours and days", () => {
    const summary = formatBalanceSummary(hoursToMinutes(83.125), 480);
    expect(summary.hours).toBe("83.1");
    expect(summary.days).toBe("10.4");
  });
});

describe("PTO payout", () => {
  it("derives an hourly rate from an annual salary", () => {
    expect(hourlyRateFromSalary(52000, 40)).toBe(25);
  });

  it("returns 0 for a zero-hour work week instead of dividing by zero", () => {
    expect(hourlyRateFromSalary(52000, 0)).toBe(0);
  });

  it("computes a gross payout rounded to the nearest cent", () => {
    expect(calculatePtoPayout(10, 25)).toBe(250);
    expect(calculatePtoPayout(3.333, 20.005)).toBeCloseTo(66.68, 2);
  });
});
