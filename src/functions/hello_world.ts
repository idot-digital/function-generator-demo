import { Template } from "../generated/interfaces/index.js";
import { TemplateSchema } from "../schemas/schemas.js";
import { TemplateResult } from "../resultTypes.js";
import { UnauthenticatedFunctionServer, HttpMethod } from "../types.js";
import { AuthLevel } from "../types.js";

export type RequestInterface = Template;
export const requestSchema = TemplateSchema;
export type ResponseType = TemplateResult;
export const method: HttpMethod = "POST";
export const authLevel: AuthLevel = AuthLevel.anonymous;

type Function = UnauthenticatedFunctionServer<RequestInterface, ResponseType>;
export const hello_world: Function = async ({}): ReturnType<Function> => {
  return {
    status: 200,
    body: "Hello World!",
  };
};
