import { Id } from "./_generated/dataModel";
import { QueryCtx } from "./_generated/server";

export function currentUserMayDepositTo(
  ctx: QueryCtx,
  account: Id<"accounts">
) {
  return true;
}

export function currentUserOwns(ctx: QueryCtx, account: Id<"accounts">) {
  return true;
}
