import "dotenv/config";
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";

// console.log("Neon url", NEON_DB_DIRECT);
const sql = neon(process.env.NEON_DB_DIRECT);

export const db = drizzle(sql);
