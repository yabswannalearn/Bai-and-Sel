import { time } from "console";
import { datetime } from "drizzle-orm/mysql-core";
import { pgTable, serial, varchar, integer, text, timestamp, foreignKey, boolean} from "drizzle-orm/pg-core";

export const users = pgTable("users", {
    id: serial("id").primaryKey(),
    name: varchar("name", { length: 256 }).notNull(),
    email: varchar("email", {length: 256}).notNull().unique(),
    password_hash: varchar("password_hash", {length: 256}).notNull(),
});

export const items = pgTable("items", {
    id: serial("id").primaryKey(),
    // userId: integer("user_id").notNull().reference() => users,
    name: varchar("name", {length: 256}).notNull(),
    description: text("description").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull()
})