import { UserData } from "./generated/interfaces/index.js";
import { FunctionResponse, FunctionResults } from "./resultTypes";

export { HttpMethod } from "@azure/functions";

export type FunctionRequest = {};

export type AuthenticatedFunctionServer<
  REQ extends FunctionRequest,
  RES extends FunctionResults
> = (body: REQ, user: UserData) => Promise<FunctionResponse<RES>>;
export type UnauthenticatedFunctionServer<
  REQ extends FunctionRequest,
  RES extends FunctionResults
> = (body: REQ) => Promise<FunctionResponse<RES>>;

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
