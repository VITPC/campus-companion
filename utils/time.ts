// utils/time.ts
// The app's clock. Always call now() instead of `new Date()` when you need
// the current time, so development and production behave the same way.
import { db } from "@/mocks/db";
import type { Weekday } from "@/types/models";

/**
 * The current time.
 *
 * In development this is the fixed time in mocks/data.json (meta.now,
 * Monday 9 November 2026 at 09:35). That is during the Data Structures class,
 * so the Home "Now" card always has something to show and screens look like
 * the designs, whatever the real date is. In production builds it is the
 * real time.
 */
export function now(): Date {
  return __DEV__ ? new Date(db.meta.now) : new Date();
}

// Indexed by Date.getDay(): 0 is Sunday.
const WEEKDAYS: Weekday[] = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];

/**
 * The timetable day key for a date, e.g. "mon".
 * Use it with getTimetable: `getTimetable(weekdayOf(now()))`.
 * Uses the phone's time zone.
 */
export function weekdayOf(date: Date): Weekday {
  return WEEKDAYS[date.getDay()];
}
