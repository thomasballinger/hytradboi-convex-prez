import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  accounts: defineTable({
    name: v.string(),
    value: v.number(),
    owner: v.id("users"),
  }).index("by_owner", ["owner"]),

  users: defineTable({
    name: v.string(),
    subject: v.string(),
  }).index("by_subject", ["subject"]),

  messages: defineTable({
    author: v.string(),
    body: v.string(),
  }),
});
