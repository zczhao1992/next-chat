import { ConvexError, v } from "convex/values";
import { query } from "./_generated/server";
import { getUserByClerkId } from "./_utils";

export const get = query({
  args: { id: v.id("conversations") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error("账户错误");
    }

    const currentUser = await getUserByClerkId({
      ctx,
      clerkId: identity.subject,
    });

    if (!currentUser) {
      throw new ConvexError("用户未找到");
    }

    const membership = await ctx.db
      .query("conversationMembers")
      .withIndex("by_memberId_conversationId", (q) =>
        q.eq("memberId", currentUser._id).eq("conversationId", args.id)
      );

    if (!membership) {
      throw new ConvexError("您不是此聊天的成员");
    }

    const messages = await ctx.db
      .query("messages")
      .withIndex("by_conversationId", (q) => q.eq("conversationId", args.id))
      .order("desc")
      .collect();

    const messagesWithUsers = Promise.all(
      messages.map(async (message) => {
        const messageSender = await ctx.db.get(message.senderId);

        if (!messageSender) {
          throw new ConvexError("找不到信息的发送人");
        }

        return {
          message,
          senderImage: messageSender.imageUrl,
          senderName: messageSender.username,
          isCurrentUser: messageSender?._id === currentUser._id,
        };
      })
    );

    return messagesWithUsers;
  },
});
