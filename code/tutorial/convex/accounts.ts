import { ConvexError, v } from "convex/values";
import { internalQuery, mutation, query, QueryCtx } from "./_generated/server";
import { currentUserMayDepositTo, currentUserOwns } from "./permissions";
import { Doc } from "./_generated/dataModel";

export const transfer = mutation({
  args: {
    fromId: v.id("accounts"),
    toId: v.id("accounts"),
    amount: v.number(),
  },
  handler: async (ctx, { fromId, toId, amount }) => {
    if (!currentUserOwns(ctx, fromId) || !currentUserMayDepositTo(ctx, toId)) {
      throw new Error("Not allowed");
    }
    const from = await ctx.db.get(fromId);
    const to = await ctx.db.get(fromId);
    if (!from || !to) throw new Error("bad ids");
    if (from.value < amount) throw new ConvexError("Insufficient funds");

    await ctx.db.patch(fromId, { value: from.value - amount });
    await ctx.db.patch(toId, { value: to.value + amount });
  },
});

/** Show a list of balances */
export const accountsForCurrentUser = query(async (ctx) => {
  const user = await getUser(ctx);
  const myAccounts = await ctx.db
    .query("accounts")
    .withIndex("by_owner", (q) => q.eq("owner", user._id));
  return myAccounts;
});

async function getUser(ctx: QueryCtx) {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) throw new Error();
  const user = await ctx.db
    .query("users")
    .withIndex("by_subject", (q) => q.eq("subject", identity?.subject))
    .unique();
  if (!user) throw new Error("User does not exist");
  return user;
}


export const usersWithAccounts = internalQuery(async (ctx) => {
  const users = await ctx.db.query("users").collect();
  const usersWithAccounts = await Promise.all(
    users.map(async (user) => {
      const accounts = await ctx.db
        .query("accounts")
        .withIndex("by_owner", (q) => q.eq("owner", user._id))
        .collect();
      return { ...user, accounts };
    })
  );
  return usersWithAccounts;
});


export const usersWithAccountsWithHelper = internalQuery(async (ctx) => {
  const users = await ctx.db.query("users").collect();
  return await accountsForUsers(ctx, users);
});

async function accountsForUsers(ctx: QueryCtx, users: Doc<"users">[]) {
  return await Promise.all(
    users.map(async (user) => {
      const accounts = await ctx.db
        .query("accounts")
        .withIndex("by_owner", (q) => q.eq("owner", user._id))
        .collect();
      return { ...user, accounts };
    })
  );
}