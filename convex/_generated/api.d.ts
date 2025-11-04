/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as accounts from "../accounts.js";
import type * as http from "../http.js";
import type * as installations from "../installations.js";
import type * as projects from "../projects.js";
import type * as repos from "../repos.js";
import type * as validators_projects from "../validators/projects.js";
import type * as webhook from "../webhook.js";
import type * as wnode from "../wnode.js";
import type * as workflows from "../workflows.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

/**
 * A utility for referencing Convex functions in your app's API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
declare const fullApi: ApiFromModules<{
  accounts: typeof accounts;
  http: typeof http;
  installations: typeof installations;
  projects: typeof projects;
  repos: typeof repos;
  "validators/projects": typeof validators_projects;
  webhook: typeof webhook;
  wnode: typeof wnode;
  workflows: typeof workflows;
}>;
declare const fullApiWithMounts: typeof fullApi;

export declare const api: FilterApi<
  typeof fullApiWithMounts,
  FunctionReference<any, "public">
>;
export declare const internal: FilterApi<
  typeof fullApiWithMounts,
  FunctionReference<any, "internal">
>;

export declare const components: {};
