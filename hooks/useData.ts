import data from "../mocks/data.json";

export function useData() {
  function getCourse(id: string) {
    return data.courses.find((course) => course.id === id);
  }

  function getResults(courseId: string) {
    return data.results.find(
      (result) => result.courseId === courseId
    );
  }

  function getTimetable(courseId: string) {
    return data.timetable.filter(
      (item) => item.courseId === courseId
    );
  }

  function getNotes(courseId: string) {
    return data.notes.filter(
      (note) => note.courseId === courseId
    );
  }

  function getAssignments(courseId: string) {
    return data.assignments.filter(
      (assignment) => assignment.courseId === courseId
    );
  }

  return {
    courses: data.courses,
    announcements: data.announcements,
    getCourse,
    getResults,
    getTimetable,
    getNotes,
    getAssignments,
  };
}


