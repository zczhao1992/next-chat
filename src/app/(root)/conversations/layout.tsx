"use client";

import ItemList from "@/components/shared/item-list/ItemList";
import { api } from "../../../../convex/_generated/api";
import { useQuery } from "convex/react";
import DMConversationItem from "./_components/DMConversationItem";
import { Loader2 } from "lucide-react";

const ConversationsLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const conversations = useQuery(api.conversations.get);

  return (
    <>
      <ItemList title="聊天">
        {conversations ? (
          conversations.length === 0 ? (
            <p className="w-full h-full flex items-center justify-center">
              未找到聊天
            </p>
          ) : (
            conversations.map((conversation) => {
              return conversation.conversation.isGroup ? (
                <></>
              ) : (
                // <GroupConversationItem
                //   key={conversation.conversation._id}
                //   id={conversation.conversation._id}
                //   name={conversation.conversation.name || ""}
                //   lastMessageSender={conversation.lastMessage?.sender}
                //   lastMessageContent={conversation.lastMessage?.content}
                //   unseenCount={conversation.unseenCount}
                // />
                <DMConversationItem
                  key={conversation.conversation._id}
                  id={conversation.conversation._id}
                  username={conversation.otherMember?.username || ""}
                  imageUrl={conversation.otherMember?.imageUrl || ""}
                  lastMessageSender={conversation.lastMessage?.sender}
                  lastMessageContent={conversation.lastMessage?.content}
                  unseenCount={conversation.unseenCount}
                />
              );
            })
          )
        ) : (
          <Loader2 className="h-8 w-8" />
        )}
      </ItemList>
      {children}
    </>
  );
};

export default ConversationsLayout;
