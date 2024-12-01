import React from "react";
import { format } from "date-fns";
import { zhCN } from "date-fns/locale";
// import ImagePreview from "./ImagePreview";
// import FilePreview from "./FilePreview";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

type MessageProps = {
  fromCurrentUser: boolean;
  senderImage: string;
  senderName: string;
  lastByUser: boolean;
  content: string[];
  createdAt: number;
  seen?: React.ReactNode;
  type: string;
};

const Message = ({
  fromCurrentUser,
  senderImage,
  senderName,
  lastByUser,
  content,
  createdAt,
  seen,
  type,
}: MessageProps) => {
  const formatTime = (timestamp: number) => {
    return format(timestamp, "HH:mm", { locale: zhCN });
  };

  return (
    <div
      className={cn("flex items-end", {
        "justify-end": fromCurrentUser,
      })}
    >
      <div
        className={cn("flex flex-col w-full mx-2", {
          "order-1 items-end": fromCurrentUser,
          "order-2 items-start": !fromCurrentUser,
        })}
      >
        <div
          className={cn("flex items-end gap-2 w-full my-1 text-gray-500", {
            "justify-end": fromCurrentUser,
          })}
        >
          <div
            className={cn(`text-xs flex`, {
              "justify-end": fromCurrentUser,
              "justify-start": !fromCurrentUser,
            })}
          >
            {senderName}
          </div>
          <p
            className={cn(`text-xs flex`, {
              "justify-end": fromCurrentUser,
              "justify-start": !fromCurrentUser,
            })}
          >
            {formatTime(createdAt)}
          </p>
        </div>

        <div
          className={cn("px-4 py-2 rounded-lg max-w-[70%]", {
            "bg-primary text-primary-foreground": fromCurrentUser,
            "bg-secondary text-secondary-foreground": !fromCurrentUser,
            "rounded-br-none": !lastByUser && fromCurrentUser,
            "rounded-bl-none": !lastByUser && !fromCurrentUser,
          })}
        >
          {type === "text" ? (
            <p className="text-wrap break-words whitespace-pre-wrap break-all">
              {content}
            </p>
          ) : null}
          {/* {type === "file" ? <FilePreview url={content[0]} /> : null}
          {type === "image" ? <ImagePreview urls={content} /> : null} */}
          {type === "call" ? (
            <Badge variant="secondary">Joined Call</Badge>
          ) : null}
        </div>
        {seen}
      </div>

      <Avatar
        className={cn("relative w-8 h-8", {
          "order-2": fromCurrentUser,
          "order-1": !fromCurrentUser,
          invisible: lastByUser,
        })}
      >
        <AvatarImage src={senderImage} />
        <AvatarFallback>{senderName.substring(0, 1)}</AvatarFallback>
      </Avatar>
    </div>
  );
};

export default Message;
