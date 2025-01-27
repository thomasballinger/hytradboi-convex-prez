import { v } from "convex/values";
import { query, mutation } from "./_generated/server";

export const list = query({
    args: {},
    handler: async (ctx) => {
      return await ctx.db.query("messages").collect();
    }
});

export const list2 = query({
    args: { condition: v.boolean() },
    handler: async (ctx, { condition }) => {
      if (condition) {
        return await ctx.db.query("messages").collect();
      } else {
        const users = await ctx.db.query("users").collect();
        const messages = await ctx.db.query("messages").collect();
        return { users, messages };
      }
    }
});

export const list3 = query({
    args: { num: v.number() },
    handler: async (ctx, { num }) => {
      switch (num) {
        case 1: return await ctx.db.query('messages').collect();
        case 2: return 17;
        case 3: return await someExternalFunction(3);
        case 4: return { another: 'type', of: 'object'}
        default: return 1
      }
    }
});




function someExternalFunction(num: number){
    return 'messages' as 'messages' | 'users';
}