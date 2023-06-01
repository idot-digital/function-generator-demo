import { Connection } from "@planetscale/database";
import { UserData } from "./generated/interfaces/index.js";
import { FunctionResponse, FunctionResults } from "./resultTypes.js";
import { Redis } from "@upstash/redis";

export { HttpMethod } from "@azure/functions";

export type FunctionRequest = {};

export type FunctionServer<
  REQ extends FunctionRequest,
  RES extends FunctionResults
> = (body: REQ, user?: UserData) => Promise<FunctionResponse<RES>>;

export enum AuthLevel {
  /**
   * Default auth level. No API key required.
   */
  anonymous = "anonymous",
  /**
   * Function specific API key required.
   */
  function = "function",
  /**
   * Admin API key required.
   */
  admin = "admin",
}

export type ServiceType = "planetscale" | "redis"; // | "idot";

export type Services<T extends ServiceType[]> = {
  [K in T[number]]: K extends "planetscale"
    ? Connection
    : K extends "redis"
    ? Redis
    : never;
};
