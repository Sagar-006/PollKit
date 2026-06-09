import {
  pgTable,
  uuid,
  varchar,
  boolean,
  timestamp,
  text,
} from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: uuid("id").defaultRandom().primaryKey(),

  name: varchar("name", { length: 50 }).notNull(),

  email: varchar("email", { length: 255 }).notNull().unique(),

  password: varchar("password", { length: 255 }).notNull(),

  refreshToken: text("refreshToken"),

  createdAt: timestamp("createdAt").defaultNow(),

  updatedAt: timestamp("updatedAt").defaultNow(),
});

export default users