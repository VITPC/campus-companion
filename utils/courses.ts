// utils/courses.ts
// Pure helpers for the Courses list: no React, no data fetching.
// Keeping them here makes them easy to test and reuse (e.g. Home could
// use countDueThisWeek for a badge later).
import type { Assignment, Course, CourseType, Semester } from "@/types/models";

/** The filter chips on the Courses screen. "all" shows every course. */
export type CourseFilter = "all" | CourseType;

// Lower-case and drop spaces so "csc201", "CSC 201" and "csc 201" all match
// the code "CSC 201". Students rarely type the space.
function normalise(text: string): string {
  return text.toLowerCase().replace(/\s+/g, "");
}

/** True if the search text appears in the course title or code (any case). */
export function matchesSearch(course: Course, query: string): boolean {
  const q = normalise(query);
  if (q === "") return true;
  return (
    normalise(course.title).includes(q) || normalise(course.code).includes(q)
  );
}

/** The courses to show for the current search text and chip. Both apply. */
export function filterCourses(
  courses: Course[],
  query: string,
  filter: CourseFilter,
): Course[] {
  return courses.filter(
    (course) =>
      (filter === "all" || course.type === filter) &&
      matchesSearch(course, query),
  );
}

/**
 * How many `todo` assignments each course has due this week.
 * Returns { courseId: count }; courses with nothing due are left out.
 *
 * Compares calendar days, not exact times: "2026-11-13T23:59:00+01:00" is
 * due on 13 November, which is inside a week that ends on "2026-11-13".
 * The date part of the string is used as written (school time), so the
 * result doesn't change with the phone's time zone.
 */
export function countDueThisWeek(
  assignments: Assignment[],
  week: Semester["currentWeek"],
): Record<string, number> {
  const counts: Record<string, number> = {};
  for (const assignment of assignments) {
    if (assignment.status !== "todo") continue;
    const dueDay = assignment.dueAt.slice(0, 10); // "YYYY-MM-DD"
    // ISO dates compare correctly as plain strings.
    if (dueDay < week.start || dueDay > week.end) continue;
    counts[assignment.courseId] = (counts[assignment.courseId] ?? 0) + 1;
  }
  return counts;
}

/** "CSC 201" → { prefix: "CSC", number: "201" } for the two-line code tile. */
export function splitCourseCode(code: string): {
  prefix: string;
  number: string;
} {
  const match = code.trim().match(/^([A-Za-z]+)\s*(.*)$/);
  if (!match) return { prefix: code, number: "" };
  return { prefix: match[1], number: match[2] };
}
