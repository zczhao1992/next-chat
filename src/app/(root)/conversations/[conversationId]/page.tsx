"use client";

import React, { useState } from "react";
import ConversationContainer from "@/components/shared/conversation/ConversationContainer";
import Header from "./_components/Header";
import Body from "./_components/body/Body";
import ChatInput from "./_components/input/ChatInput";
import { useQuery } from "convex/react";
import { api } from "../../../../../convex/_generated/api";
import { Id } from "../../../../../convex/_generated/dataModel";
import { Loader2 } from "lucide-react";

type Props = {
  params: {
    conversationId: Id<"conversations">;
  };
};

const ConversationPage = ({ params: { conversationId } }: Props) => {
  const conversation = useQuery(api.conversation.get, { id: conversationId });

  const [removeFriendDialogOpen, setRemoveFriendDialogOpen] = useState(false);
  const [deleteGroupDialogOpen, setDeleteGroupDialogOpen] = useState(false);
  const [leaveGroupDialogOpen, setLeaveGroupDialogOpen] = useState(false);
  const [callType, setCallType] = useState<"audio" | "video" | null>(null);

  return conversation === undefined ? (
    <div className="w-full h-full flex items-center justify-center">
      <Loader2 className="h-8 w-8" />
    </div>
  ) : conversation === null ? (
    <p className="w-full h-full flex items-center justify-center">未发现对话</p>
  ) : (
    <ConversationContainer>
      {/* <RemoveFriendDialog
        conversationId={conversationId}
        open={removeFriendDialogOpen}
        setOpen={setRemoveFriendDialogOpen}
      />
      <DeleteGroupDialog
        conversationId={conversationId}
        open={deleteGroupDialogOpen}
        setOpen={setDeleteGroupDialogOpen}
      />
      <LeaveGroupDialog
        conversationId={conversationId}
        open={leaveGroupDialogOpen}
        setOpen={setLeaveGroupDialogOpen}
      /> */}
      <Header
        name={
          (conversation.isGroup
            ? conversation.name
            : conversation.otherMember?.username) || ""
        }
        imageUrl={
          conversation.isGroup ? undefined : conversation.otherMember?.imageUrl
        }
        options={
          conversation.isGroup
            ? [
                {
                  label: "离开群聊",
                  destructive: false,
                  onClick: () => setLeaveGroupDialogOpen(true),
                },
                {
                  label: "删除群聊",
                  destructive: true,
                  onClick: () => setDeleteGroupDialogOpen(true),
                },
              ]
            : [
                {
                  label: "删除好友",
                  destructive: true,
                  onClick: () => setRemoveFriendDialogOpen(true),
                },
              ]
        }
        setCallType={setCallType}
      />
      <Body
        members={
          conversation.isGroup
            ? conversation.otherMembers
              ? conversation.otherMembers
              : []
            : conversation.otherMember
              ? [conversation.otherMember]
              : []
        }
        callType={callType}
        setCallType={setCallType}
      />
      <ChatInput />
    </ConversationContainer>
  );
};

export default ConversationPage;
