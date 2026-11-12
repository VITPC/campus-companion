// hooks/useAsync.ts
// Runs an async function (like getCourses) when the screen mounts and keeps
// track of its result, so screens don't each re-write the same
// loading / error / data state.
//
//   const { data, loading, error, reload } = useAsync(() => getCourses());
//
// When the function uses a value that can change (a route param, a filter),
// list that value in `deps` so the data is fetched again when it changes:
//
//   const { data } = useAsync(() => getCourse(id), [id]);
import {
  type DependencyList,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

export type AsyncState<T> = {
  /** The last successful result. null until the first request finishes. */
  data: T | null;
  /** True while a request is running, including during reload(). */
  loading: boolean;
  /** Set when the last request failed, cleared when a new one starts. */
  error: Error | null;
};

export type AsyncResult<T> = AsyncState<T> & {
  /** Run the request again, e.g. for pull to refresh. Keeps the old data
   *  on screen while it loads. */
  reload: () => Promise<void>;
};

export function useAsync<T>(
  fn: () => Promise<T>,
  deps: DependencyList = [],
): AsyncResult<T> {
  const [state, setState] = useState<AsyncState<T>>({
    data: null,
    loading: true,
    error: null,
  });

  // Screens pass a new arrow function on every render. Keeping the latest one
  // in a ref lets us call it without re-fetching on every render; `deps`
  // decides when to fetch again.
  const fnRef = useRef(fn);
  useEffect(() => {
    fnRef.current = fn;
  });

  // Each request gets a number. When a request finishes, its result is only
  // used if no newer request has started since, so a slow old response can't
  // overwrite a newer one (e.g. switching course quickly).
  const latestRequest = useRef(0);

  const run = useCallback(async () => {
    const request = ++latestRequest.current;
    setState((prev) => ({ ...prev, loading: true, error: null }));
    try {
      const data = await fnRef.current();
      if (request === latestRequest.current) {
        setState({ data, loading: false, error: null });
      }
    } catch (e) {
      if (request === latestRequest.current) {
        const error = e instanceof Error ? e : new Error(String(e));
        setState((prev) => ({ data: prev.data, loading: false, error }));
      }
    }
  }, []);

  // biome-ignore lint/correctness/useExhaustiveDependencies: the caller chooses when to re-fetch through `deps`
  useEffect(() => {
    run();
    // Leaving the screen (or deps changing) makes any request still in
    // flight out of date, so its result is ignored.
    return () => {
      latestRequest.current++;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return { ...state, reload: run };
}
