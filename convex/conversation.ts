import { ConvexError, v } from "convex/values";
import { mutation, query } from "./_generated/server";
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
      throw new ConvexError("用户没找到");
    }

    const conversation = await ctx.db.get(args.id);

    if (!conversation) {
      throw new ConvexError("聊天没找到");
    }

    const membership = await ctx.db
      .query("conversationMembers")
      .withIndex("by_memberId_conversationId", (q) =>
        q.eq("memberId", currentUser._id).eq("conversationId", conversation._id)
      )
      .unique();

    if (!membership) {
      throw new ConvexError("您不是此对话的成员");
    }

    const allConversationMemberships = await ctx.db
      .query("conversationMembers")
      .withIndex("by_conversationId", (q) => q.eq("conversationId", args.id))
      .collect();

    if (!conversation.isGroup) {
      const otherMembership = allConversationMemberships.filter(
        (membership) => membership.memberId !== currentUser._id
      )[0];

      const otherMemberDetails = await ctx.db.get(otherMembership.memberId);

      return {
        ...conversation,
        otherMember: {
          ...otherMemberDetails,
          lastSeenMessageId: otherMembership.lastSeenMessage,
        },
        otherMembers: null,
      };
    } else {
      const otherMembers = await Promise.all(
        allConversationMemberships
          .filter((membership) => membership.memberId !== currentUser._id)
          .map(async (membership) => {
            const member = await ctx.db.get(membership.memberId);

            if (!member) {
              throw new ConvexError("找不到成员");
            }

            return {
              _id: member._id,
              username: member.username,
              lastSeenMessageId: membership.lastSeenMessage,
            };
          })
      );

      return { ...conversation, otherMembers, otherMember: null };
    }
  },
});

export const markRead = mutation({
  args: {
    conversationId: v.id("conversations"),
    messageId: v.id("messages"),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new ConvexError("账户错误");
    }

    const currentUser = await getUserByClerkId({
      ctx,
      clerkId: identity.subject,
    });

    if (!currentUser) {
      throw new ConvexError("用户没找到");
    }

    const membership = await ctx.db
      .query("conversationMembers")
      .withIndex("by_memberId_conversationId", (q) =>
        q
          .eq("memberId", currentUser._id)
          .eq("conversationId", args.conversationId)
      )
      .unique();

    if (!membership) {
      throw new ConvexError("您不是此对话的成员");
    }

    const lastMessage = await ctx.db.get(args.messageId);

    await ctx.db.patch(membership._id, {
      lastSeenMessage: lastMessage ? lastMessage._id : undefined,
    });
  },
});

export const createGroup = mutation({
  args: {
    members: v.array(v.id("users")),
    name: v.string(),
  },
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
      throw new ConvexError("用户没找到");
    }

    const conversationId = await ctx.db.insert("conversations", {
      isGroup: true,
      name: args.name,
    });

    await Promise.all(
      [...args.members, currentUser._id].map(
        async (memberId) =>
          await ctx.db.insert("conversationMembers", {
            memberId,
            conversationId,
          })
      )
    );
  },
});

export const deleteGroup = mutation({
  args: {
    conversationId: v.id("conversations"),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new ConvexError("账户错误");
    }

    const curentUser = await getUserByClerkId({
      ctx,
      clerkId: identity.subject,
    });

    if (!curentUser) {
      throw new ConvexError("用户没找到");
    }

    const conversation = await ctx.db.get(args.conversationId);

    if (!conversation) {
      throw new ConvexError("未找到对话");
    }

    const memberships = await ctx.db
      .query("conversationMembers")
      .withIndex("by_conversationId", (q) =>
        q.eq("conversationId", args.conversationId)
      )
      .collect();

    if (!memberships || memberships.length <= 1) {
      throw new ConvexError("此对话没有任何成员");
    }

    const messages = await ctx.db
      .query("messages")
      .withIndex("by_conversationId", (q) =>
        q.eq("conversationId", args.conversationId)
      )
      .collect();

    // Delete conversation
    await ctx.db.delete(args.conversationId);

    // Delete conversation memberships
    await Promise.all(
      memberships.map(async (membership) => {
        await ctx.db.delete(membership._id);
      })
    );

    // Delete conversation messages
    await Promise.all(
      messages.map(async (message) => {
        await ctx.db.delete(message._id);
      })
    );
  },
});

export const leaveGroup = mutation({
  args: {
    conversationId: v.id("conversations"),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new ConvexError("账户错误");
    }

    const curentUser = await getUserByClerkId({
      ctx,
      clerkId: identity.subject,
    });

    if (!curentUser) {
      throw new ConvexError("用户没找到");
    }

    const conversation = await ctx.db.get(args.conversationId);

    if (!conversation) {
      throw new ConvexError("未找到对话");
    }

    const membership = await ctx.db
      .query("conversationMembers")
      .withIndex("by_memberId_conversationId", (q) =>
        q
          .eq("memberId", curentUser._id)
          .eq("conversationId", args.conversationId)
      )
      .unique();

    if (!membership) {
      throw new ConvexError("您不是此群的成员");
    }

    // Delete conversation memberships
    await ctx.db.delete(membership._id);
  },
});
