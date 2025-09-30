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
  userId: integer("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  name: varchar("name", { length: 256 }).notNull(),
  description: text("description").notNull(),
  image: varchar("image", { length: 512 }), // stores file path/URL
  createdAt: timestamp("created_at").defaultNow().notNull(),
  category: varchar("category", { length: 256 }).notNull(),
  price: integer("price").notNull(),
  location: varchar("location", { length: 256}).notNull()
});

export const favorites = pgTable("favorites", {
  id: serial("id").primaryKey(),
  userId: integer("user_id")
    .notNull()
    .references(() => users.id, {onDelete: "cascade"}),
  itemId: integer("item_id")
    .notNull()
    .references(() => items.id, {onDelete: "cascade"}),
  createdAt: timestamp("created_at").defaultNow().notNull(),
})