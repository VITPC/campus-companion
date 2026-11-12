// services/api.ts
// Every screen gets its data from these functions, never from mocks/data.json.
// Today they read the mock file and wait a moment to feel like a network call.
// When the real API exists, only the bodies here change: the function names,
// arguments and return types stay the same, so no screen has to be touched.
import { db } from "@/mocks/db";
import type {
  Announcement,
  Assignment,
  AssignmentStatus,
  Break,
  Course,
  CourseResult,
  Language,
  Note,
  NoteCategory,
  Semester,
  Settings,
  Student,
  TimetableSlot,
  Weekday,
} from "@/types/models";

/** How long every fake request takes. Long enough to see loading states. */
export const FAKE_DELAY_MS = 400;

/** Thrown when asking for something that doesn't exist, like an HTTP 404. */
export class NotFoundError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "NotFoundError";
  }
}

function wait(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// Wait, then hand back a deep copy. A real API sends new objects on every
// request; copying here does the same, so a screen that changes what it got
// can't change the mock data for every other screen.
async function respond<T>(value: T): Promise<T> {
  await wait(FAKE_DELAY_MS);
  return JSON.parse(JSON.stringify(value)) as T;
}

// ---------- Student ----------

export async function getStudent(): Promise<Student> {
  return respond(db.student);
}

export async function getSettings(): Promise<Settings> {
  return respond(db.settings);
}

export async function getLanguages(): Promise<Language[]> {
  return respond(db.languages);
}

export async function getSemester(): Promise<Semester> {
  return respond(db.semester);
}

// ---------- Home ----------

export async function getAnnouncements(): Promise<Announcement[]> {
  return respond(db.announcements);
}

/** Classes for one day, or the whole week if no day is given. */
export async function getTimetable(day?: Weekday): Promise<TimetableSlot[]> {
  const slots = day
    ? db.timetable.filter((slot) => slot.day === day)
    : db.timetable;
  return respond(slots);
}

/** Breaks (lunch, free periods) for one day, or the whole week. */
export async function getBreaks(day?: Weekday): Promise<Break[]> {
  const breaks = day ? db.breaks.filter((b) => b.day === day) : db.breaks;
  return respond(breaks);
}

// ---------- Courses ----------

export async function getCourses(): Promise<Course[]> {
  return respond(db.courses);
}

/** Rejects with NotFoundError if there is no course with this id. */
export async function getCourse(id: string): Promise<Course> {
  const course = db.courses.find((c) => c.id === id);
  if (!course) {
    await wait(FAKE_DELAY_MS);
    throw new NotFoundError(`No course with id "${id}"`);
  }
  return respond(course);
}

/** A course's results, or null if nothing has been recorded for it yet. */
export async function getResults(
  courseId: string,
): Promise<CourseResult | null> {
  const result = db.results.find((r) => r.courseId === courseId);
  return respond(result ?? null);
}

/** Notes for one course, optionally only one category (lectures, ...). */
export async function getNotes(
  courseId: string,
  category?: NoteCategory,
): Promise<Note[]> {
  const notes = db.notes.filter(
    (n) => n.courseId === courseId && (!category || n.category === category),
  );
  return respond(notes);
}

/** Assignments for one course, optionally only one status (todo, ...). */
export async function getAssignments(
  courseId: string,
  status?: AssignmentStatus,
): Promise<Assignment[]> {
  const assignments = db.assignments.filter(
    (a) => a.courseId === courseId && (!status || a.status === status),
  );
  return respond(assignments);
}

/**
 * Assignments across every course, optionally only one status.
 * Lets the Courses list count "N due" for all rows in one request
 * instead of one request per course.
 */
export async function getAllAssignments(
  status?: AssignmentStatus,
): Promise<Assignment[]> {
  const assignments = status
    ? db.assignments.filter((a) => a.status === status)
    : db.assignments;
  return respond(assignments);
}
