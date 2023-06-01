import { HttpRequest } from "@azure/functions";
import { FunctionRequest, ServiceType, Services } from "./types.js";
import Joi from "joi";
import jwt from "jsonwebtoken";
import { UserData } from "./generated/interfaces/index.js";
import { public_jwt_key } from "./settings.js";
import { Redis } from "@upstash/redis";
import { connect } from "@planetscale/database";

/*
 * This file contains helper functions used by the builded functions.
 * If necessary, you can change them here. Please do not remove them or change their signatures.
 */

export async function parseRequest<REQ extends FunctionRequest>(
  request: HttpRequest,
  schema: Joi.Schema
): Promise<{ error: string } | { error: undefined; body: REQ }> {
  let body: unknown;

  try {
    body = await request.json();
  } catch (error) {
    if (!schema.validate({})) {
      console.log("------------------ ERROR ON PARSE BODY ------------------");
      console.log(error);
      console.log("------------------ ERROR ON PARSE BODY ------------------");
      console.info('User got "400: Invalid JSON body" response');
      return { error: "Invalid JSON body" };
    }
  }
  const { error, value } = schema.validate(body || {});

  if (error)
    return {
      error: error.message,
    };

  return {
    error: undefined,
    body: value as REQ,
  };
}

export async function parseUser(
  request: HttpRequest
): Promise<UserData | undefined> {
  return new Promise((resolve, reject) => {
    const token = request.headers
      .get("Authorization")
      ?.replace("Bearer ", "")
      .replace("bearer ", "");
    if (!token) return resolve(undefined);
    jwt.verify(token, public_jwt_key, (err, decoded) => {
      if (err) return resolve(undefined);
      resolve(decoded as UserData);
    });
  });
}

export function assertLoggedIn(
  user: UserData | undefined
): asserts user is UserData {
  if (user === undefined) throw new Error("Unauthorized");
}

export async function getServices<T extends ServiceType>(
  services: T[]
): Promise<Services<T[]>> {
  const result: any = {};

  await Promise.all(
    services.map(async (service) => {
      switch (service) {
        case "planetscale":
          result.planetscale = connect({
            host: process.env.PLANTESCALE_HOST || "",
            username: process.env.PLANETSCALE_USERNAME || "",
            password: process.env.PLANETSCALE_PASSWORD,
          });
          break;
        case "redis":
          result.redis = new Redis({
            url: process.env.REDIS_URL || "",
            token: process.env.REDIS_TOKEN || "",
          });
          break;
      }
    })
  );

  return result;
}

/**
 * Rate limit an action
 * @param rateLimiterTTL The time in seconds until the rate limiter will return false
 * @param keyParts The key parts. If you want to limit actions per user, the first could be the action name and the second the user id
 * @returns true if there is no rate limit, false if there is
 */
export async function checkRateLimiting(
  rateLimiterTTL: number,
  ...keyParts: string[]
): Promise<boolean> {
  const redis = (await getServices(["redis"])).redis;

  const key = keyParts.join(":");
  try {
    if (
      Boolean(
        (
          await redis
            .pipeline()
            .get(key)
            .setnx(key, 1)
            .expire(key, rateLimiterTTL)
            .exec()
        )[0]
      )
    )
      return true;
    else return false;
  } catch (error) {
    return false;
  }
}

/*
 * End of helper functions. Here you can add your own helper functions
 */
