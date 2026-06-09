import {
  pgTable,
  uuid,
  varchar,
  boolean,
  timestamp,
  text,
} from "drizzle-orm/pg-core";

import users from "../auth/auth.model.js";

export const pools = pgTable("pools", {
  id: uuid("id").defaultRandom().primaryKey(),

  userId: uuid("userId")
    .notNull()
    .references(() => users.id),

  question: varchar("question", { length: 500 }).notNull(),

  isActive: boolean("isActive").default(true),

  isPublished: boolean("isPublished").default(false),

  anonymousVoting: boolean("anonymousVoting"),

  createdAt: timestamp("createdAt").defaultNow(),
  
  expiresAt: timestamp("expiresAt").notNull(),
});

export const options = pgTable("options", {
    id: uuid("id").defaultRandom().primaryKey(),
    
    option: varchar("option", { length: 155 }).notNull(),
    
    poolId: uuid("poolId")
    .notNull()
    .references(() => pools.id, { onDelete: "cascade" }),

    createdAt: timestamp("createdAt").defaultNow(),
});

export const votes = pgTable("votes", {
  id: uuid("id").defaultRandom().primaryKey(),

  optionId: uuid("optionId")
    .notNull()
    .references(() => options.id, { onDelete: "cascade" }),

  pollId: uuid("pollId")
    .notNull()
    .references(() => pools.id, { onDelete: "cascade" }),

  userId: uuid("userId").references(() => users.id),

  ipAddress: varchar("ipAddress", { length: 55 }),

  createdAt: timestamp("createdAt").defaultNow(),
});
export default { pools, options, votes };
