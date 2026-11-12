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

const START: AsyncState<never> = { data: null, loading: true, error: null };

function sameDeps(a: DependencyList, b: DependencyList): boolean {
  return a.length === b.length && a.every((value, i) => Object.is(value, b[i]));
}

export function useAsync<T>(
  fn: () => Promise<T>,
  deps: DependencyList = [],
): AsyncResult<T> {
  const [state, setState] = useState<AsyncState<T>>(START);

  // When deps change (e.g. another course id), the data we hold belongs to the
  // old value, so go back to the starting state straight away. Doing it here,
  // during render, means the screen never shows old data with new deps.
  // https://react.dev/learn/you-might-not-need-an-effect#adjusting-some-state-when-a-prop-changes
  const [currentDeps, setCurrentDeps] = useState(deps);
  if (!sameDeps(currentDeps, deps)) {
    setCurrentDeps(deps);
    setState(START);
  }

  // Screens pass a new arrow function on every render. Keeping the latest one
  // in a ref lets us call it without re-fetching on every render; `deps`
  // decides when to fetch again.
  const fnRef = useRef(fn);
  useEffect(() => {
    fnRef.current = fn;
  });

  // Each request gets a number. When a request finishes, its result is only
  // used if no newer request has started since, so a slow old response can't
  // overwrite a newer one (e.g. switching course quickly). It's an object so
  // the effect cleanup below can hold on to it.
  const requests = useRef({ latest: 0 });

  // Fetch and store the result. Only touches state after the request settles.
  const load = useCallback(async () => {
    const counter = requests.current;
    const request = ++counter.latest;
    try {
      const data = await fnRef.current();
      if (request === counter.latest) {
        setState({ data, loading: false, error: null });
      }
    } catch (e) {
      if (request === counter.latest) {
        const error = e instanceof Error ? e : new Error(String(e));
        setState((prev) => ({ data: prev.data, loading: false, error }));
      }
    }
  }, []);

  // For pull to refresh and "Try again" buttons: show loading, keep the data.
  const reload = useCallback(async () => {
    setState((prev) => ({ ...prev, loading: true, error: null }));
    await load();
  }, [load]);

  // The linters (Biome and ESLint) can't check a dependency list passed in by
  // the caller, so their dependency rule is switched off for this one effect.
  // That's intended: the caller decides when to fetch again.
  /* eslint-disable react-hooks/exhaustive-deps */
  useEffect(
    () => {
      const counter = requests.current;
      load();
      // Leaving the screen (or deps changing) makes any request still in
      // flight out of date, so its result is ignored.
      return () => {
        counter.latest++;
      };
    },
    // biome-ignore lint/correctness/useExhaustiveDependencies: deps come from the caller
    deps,
  );
  /* eslint-enable react-hooks/exhaustive-deps */

  return { ...state, reload };
}
