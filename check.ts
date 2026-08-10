import { db } from "./lib/neon";
import { sql } from "drizzle-orm";

async function main() {
  try {
    const result = await db.execute(sql`SELECT is_suspended FROM "user" LIMIT 1`);
    console.log("Success", result);
  } catch(e) {
    console.error("Failed", e);
  }
}
main();
