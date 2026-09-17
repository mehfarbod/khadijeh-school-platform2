/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as account from "../account.js";
import type * as admin from "../admin.js";
import type * as adminSettings from "../adminSettings.js";
import type * as adminTables from "../adminTables.js";
import type * as auth from "../auth.js";
import type * as auth_emailOtp from "../auth/emailOtp.js";
import type * as authHelpers from "../authHelpers.js";
import type * as http from "../http.js";
import type * as portal from "../portal.js";
import type * as public_ from "../public.js";
import type * as public2 from "../public2.js";
import type * as school from "../school.js";
import type * as schoolExtra from "../schoolExtra.js";
import type * as seed from "../seed.js";
import type * as seedContent from "../seedContent.js";
import type * as seedContent2 from "../seedContent2.js";
import type * as seedPeople from "../seedPeople.js";
import type * as users from "../users.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  account: typeof account;
  admin: typeof admin;
  adminSettings: typeof adminSettings;
  adminTables: typeof adminTables;
  auth: typeof auth;
  "auth/emailOtp": typeof auth_emailOtp;
  authHelpers: typeof authHelpers;
  http: typeof http;
  portal: typeof portal;
  public: typeof public_;
  public2: typeof public2;
  school: typeof school;
  schoolExtra: typeof schoolExtra;
  seed: typeof seed;
  seedContent: typeof seedContent;
  seedContent2: typeof seedContent2;
  seedPeople: typeof seedPeople;
  users: typeof users;
}>;

/**
 * A utility for referencing Convex functions in your app's public API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;

/**
 * A utility for referencing Convex functions in your app's internal API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = internal.myModule.myFunction;
 * ```
 */
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;

export declare const components: {};
