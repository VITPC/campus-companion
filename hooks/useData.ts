import data from "../mocks/data.json";

export function useData() {
  return {
    announcements: data.announcements,
    assignments: data.assignments,
    courses: data.courses,
    // Mock "current time". Swap for the real clock when there is an API.
    now: data.meta.now,
  };
}
