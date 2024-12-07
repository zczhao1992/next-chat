"use client";

import { useUser } from "@clerk/nextjs";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { LiveKitRoom, VideoConference } from "@livekit/components-react";

import { useMutationState } from "@/hooks/useMutationState";
import { api } from "../../../../../../../convex/_generated/api";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useConversation } from "@/hooks/useConversation";
import "@livekit/components-styles";

type CallRoomProps = {
  video: boolean;
  audio: boolean;
  handleDisconnect: () => void;
};

export const CallRoom = ({ audio, video, handleDisconnect }: CallRoomProps) => {
  const { user } = useUser();
  const [token, setToken] = useState("");

  const { conversationId } = useConversation();

  const { mutate: createMessage } = useMutationState(api.message.create);

  useEffect(() => {
    if (!user?.fullName) return;

    (async () => {
      try {
        const res = await fetch(
          `/api/livekit?room=${conversationId}&username=${
            user.fullName
          } (${Math.floor(Math.random() * 3000)})`
        );
        const data = await res.json();

        setToken(data.token);
      } catch (error) {
        toast.error("无法加入");
        console.error(error);
      }
    })();
  }, [user?.fullName, conversationId]);

  if (token === "") {
    return (
      <div className="w-full h-full flex flex-col justify-center items-center">
        <Loader2 className="animate-spin h-16 w-16 text-foreground" />
        <p className="text-sm text-foreground">加入通话...</p>
        <Button
          className="mt-4"
          variant="destructive"
          onClick={handleDisconnect}
        >
          取消
        </Button>
      </div>
    );
  }

  return (
    <div className="w-full h-full">
      <LiveKitRoom
        data-lk-theme="default"
        serverUrl={process.env.NEXT_PUBLIC_LIVEKIT_URL}
        token={token}
        connect={true}
        video={video}
        audio={audio}
        onDisconnected={() => handleDisconnect()}
        onConnected={() => {
          createMessage({
            conversationId,
            type: "call",
            content: [],
          });
        }}
      >
        <VideoConference />
      </LiveKitRoom>
    </div>
  );
};
