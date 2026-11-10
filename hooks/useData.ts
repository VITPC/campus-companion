import data from "../mocks/data.json";

export function useData() {
  return {
    announcements: data.announcements,
  };
}
