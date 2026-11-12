// types/models.ts
// The shape of every piece of data the app works with.
// They mirror mocks/data.json today and are the contract a real API must
// meet later. Screens import these types, never the JSON file itself.

// ---------- Shared building blocks ----------

/** An ISO 8601 timestamp with offset, e.g. "2026-11-09T09:35:00+01:00". */
export type ISODateTime = string;

/** A calendar date with no time, e.g. "2026-12-14". */
export type ISODate = string;

/** A 24-hour wall-clock time, e.g. "08:00" or "14:30". */
export type ClockTime = string;

/** Lower-case three-letter day keys, as used in the timetable. */
export type Weekday = "mon" | "tue" | "wed" | "thu" | "fri" | "sat" | "sun";

// ---------- Student and settings ----------

export type Student = {
  id: string;
  firstName: string;
  lastName: string;
  /** Shown in the avatar circle when there is no photo, e.g. "NE". */
  initials: string;
  matricule: string;
  email: string;
  programme: string;
  /** 100, 200, 300, ... */
  level: number;
  /** null until the student uploads a photo. */
  avatarUrl: string | null;
};

/** Language codes the app is translated into. */
export type LanguageCode = "en" | "fr";

export type Settings = {
  language: LanguageCode;
  classReminders: boolean;
  darkMode: boolean;
};

export type Language = {
  code: LanguageCode;
  /** Name in English, e.g. "French". */
  name: string;
  /** Name in the language itself, e.g. "Français". */
  nativeName: string;
  isDefault: boolean;
};

export type Semester = {
  id: string;
  /** Ready to display, e.g. "Semester 1 · 2026/27". */
  label: string;
  currentWeek: {
    start: ISODate;
    end: ISODate;
  };
};

// ---------Courses and timetable ----------

export type CourseType = "core" | "elective";

export type Course = {
  id: string;
  /** Display code with a space, e.g. "CSC 201". */
  code: string;
  title: string;
  lecturer: string;
  credits: number;
  type: CourseType;
  room: string;
  /** Fraction between 0 and 1, e.g. 0.92 = 92%. */
  attendance: number;
};

/** One class in the weekly timetable. */
export type TimetableSlot = {
  id: string;
  courseId: string;
  day: Weekday;
  start: ClockTime;
  end: ClockTime;
  room: string;
};

/** A gap between classes (lunch, free period) shown on the week timetable. */
export type Break = {
  day: Weekday;
  start: ClockTime;
  end: ClockTime;
  label: string;
};

// ---------- Announcements ----------

export type Announcement = {
  id: string;
  /** Free text from the school, e.g. "Exams", "Campus". */
  category: string;
  title: string;
  body: string;
  source: string;
  publishedAt: ISODateTime;
  /** Highlighted announcements use the yellow card on Home. */
  highlighted: boolean;
};

// ---------- Results ----------

export type AssessmentStatus = "published" | "pending";

export type Assessment = {
  id: string;
  title: string;
  /** null while the assessment is still pending. */
  score: number | null;
  outOf: number;
  status: AssessmentStatus;
  /** Share of the final grade, between 0 and 1. */
  weight: number;
  /** Only set on pending assessments that have a date. */
  scheduledFor?: ISODate;
};

export type CourseResult = {
  courseId: string;
  /** null when no assessment has been published yet. */
  caAverage: number | null;
  outOf: number;
  /** null when no assessment has been published yet. */
  grade: string | null;
  assessments: Assessment[];
};

// ---------- Notes ----------

export type NoteCategory = "lectures" | "tutorials" | "pastPapers";

export type NoteFileType = "pdf" | "ppt" | "doc";

export type Note = {
  id: string;
  courseId: string;
  category: NoteCategory;
  title: string;
  fileType: NoteFileType;
  sizeBytes: number;
  addedAt: ISODateTime;
  isNew: boolean;
  url: string;
};

// ---------- Assignments ----------

export type AssignmentStatus = "todo" | "submitted" | "graded";

export type Attachment = {
  name: string;
  sizeBytes: number;
  url: string;
};

export type Assignment = {
  id: string;
  courseId: string;
  title: string;
  description: string;
  dueAt: ISODateTime;
  maxScore: number;
  status: AssignmentStatus;
  /** Files from the lecturer (the brief, a design, ...). */
  attachments: Attachment[];
  /** null until the student submits. */
  submittedAt: ISODateTime | null;
  /** null until the assignment is graded. */
  score: number | null;
};

// ---------- The whole mock file ----------

/** Development-only information about the mock data. */
export type MockMeta = {
  description: string;
  /** The fake "current time" used in development. See utils/time.ts. */
  now: ISODateTime;
  /** IANA time zone the mock times are written in, e.g. "Africa/Douala". */
  timezone: string;
};

/** The full shape of mocks/data.json. Only services/ and utils/ use this. */
export type MockData = {
  meta: MockMeta;
  student: Student;
  settings: Settings;
  languages: Language[];
  semester: Semester;
  courses: Course[];
  timetable: TimetableSlot[];
  breaks: Break[];
  announcements: Announcement[];
  results: CourseResult[];
  notes: Note[];
  assignments: Assignment[];
};
