import { connect } from "@planetscale/database";
import { Redis } from "@upstash/redis";
import fs from "fs";

const env = JSON.parse(fs.readFileSync("local.settings.json", "utf-8")).Values;

const planetscale = connect({
  host: env.PLANTESCALE_HOST,
  username: env.PLANETSCALE_USERNAME,
  password: env.PLANETSCALE_PASSWORD,
});

const redis = new Redis({
  url: env.REDIS_URL,
  token: env.REDIS_TOKEN,
});

await planetscale.execute(`
  SELECT 1;
`);

console.log("Migration complete!");
