// mocks/db.ts
// The only file in the app that imports mocks/data.json.
// Everything else reads mock data through services/api.ts (or utils/time.ts
// for the fake clock), so swapping in a real API later only touches services/.
import type { MockData } from "@/types/models";
import data from "./data.json";

// TypeScript reads JSON values loosely: "mon" becomes `string`, not `Weekday`.
// The cast tells it to trust that the file matches our models. TypeScript
// still rejects the cast if a field has a completely wrong type (e.g. a
// number where we expect a string), but it can't spot a field that is
// missing from the JSON, so keep data.json and types/models.ts in sync.
export const db = data as MockData;
