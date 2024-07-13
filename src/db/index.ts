import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

// @ts-expect-error doesn't know about process.env
// eslint-disable-next-line
const client = postgres(process.env.DATABASE_URL!);
export const db = drizzle(client, { schema });
