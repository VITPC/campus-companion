/* eslint-disable */
import * as Router from 'expo-router';

export * from 'expo-router';

declare module 'expo-router' {
  export namespace ExpoRouter {
    export interface __routes<T extends string | object = string> {
      hrefInputParams: { pathname: Router.RelativePathString, params?: Router.UnknownInputParams } | { pathname: Router.ExternalPathString, params?: Router.UnknownInputParams } | { pathname: `/_sitemap`; params?: Router.UnknownInputParams; } | { pathname: `${'/(tabs)'}/home` | `/home`; params?: Router.UnknownInputParams; } | { pathname: `${'/(tabs)'}/profile` | `/profile`; params?: Router.UnknownInputParams; } | { pathname: `${'/(tabs)'}/courses` | `/courses`; params?: Router.UnknownInputParams; } | { pathname: `${'/(tabs)'}/courses/[courseId]/assignments` | `/courses/[courseId]/assignments`, params: Router.UnknownInputParams & { courseId: string | number; } };
      hrefOutputParams: { pathname: Router.RelativePathString, params?: Router.UnknownOutputParams } | { pathname: Router.ExternalPathString, params?: Router.UnknownOutputParams } | { pathname: `/_sitemap`; params?: Router.UnknownOutputParams; } | { pathname: `${'/(tabs)'}/home` | `/home`; params?: Router.UnknownOutputParams; } | { pathname: `${'/(tabs)'}/profile` | `/profile`; params?: Router.UnknownOutputParams; } | { pathname: `${'/(tabs)'}/courses` | `/courses`; params?: Router.UnknownOutputParams; } | { pathname: `${'/(tabs)'}/courses/[courseId]/assignments` | `/courses/[courseId]/assignments`, params: Router.UnknownOutputParams & { courseId: string; } };
      href: Router.RelativePathString | Router.ExternalPathString | `/_sitemap${`?${string}` | `#${string}` | ''}` | `${'/(tabs)'}/home${`?${string}` | `#${string}` | ''}` | `/home${`?${string}` | `#${string}` | ''}` | `${'/(tabs)'}/profile${`?${string}` | `#${string}` | ''}` | `/profile${`?${string}` | `#${string}` | ''}` | `${'/(tabs)'}/courses${`?${string}` | `#${string}` | ''}` | `/courses${`?${string}` | `#${string}` | ''}` | { pathname: Router.RelativePathString | Router.ExternalPathString | `/_sitemap` | `${'/(tabs)'}/home` | `/home` | `${'/(tabs)'}/profile` | `/profile` | `${'/(tabs)'}/courses` | `/courses`; params?: Router.UnknownInputParams; } | `${'/(tabs)'}/courses/${Router.SingleRoutePart<T>}/assignments${`?${string}` | `#${string}` | ''}` | `/courses/${Router.SingleRoutePart<T>}/assignments${`?${string}` | `#${string}` | ''}` | { pathname: `${'/(tabs)'}/courses/[courseId]/assignments` | `/courses/[courseId]/assignments`, params: Router.UnknownInputParams & { courseId: string | number; } };
    }
  }
}
