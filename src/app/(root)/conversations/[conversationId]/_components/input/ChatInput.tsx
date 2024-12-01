"use client";

import { z } from "zod";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { Card } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { api } from "../../../../../../../convex/_generated/api";
import { useMutationState } from "@/hooks/useMutationState";
import { SendHorizonal } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { ConvexError } from "convex/values";
import TextareaAutosize from "react-textarea-autosize";
import { useConversation } from "@/hooks/useConversation";

const chatMessageSchema = z.object({
  content: z.string().min(1, { message: "消息不可为空" }),
});

const ChatInput = () => {
  const emojiPickerRef = useRef<any>(null);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const [emojiPickerOpen, setEmojiPickerOpen] = useState(false);
  const [cursorPosition, setCursorPosition] = useState(0);

  const { conversationId } = useConversation();

  const { mutate: createMessage, pending } = useMutationState(
    api.message.create
  );

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        emojiPickerRef.current &&
        !emojiPickerRef.current.contains(event.target)
      ) {
        setEmojiPickerOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const form = useForm<z.infer<typeof chatMessageSchema>>({
    resolver: zodResolver(chatMessageSchema),
    defaultValues: {
      content: "",
    },
  });

  const handleInputChange = (event: any) => {
    const { value, selectionStart } = event.target;
    if (selectionStart !== null) {
      form.setValue("content", value);
      setCursorPosition(selectionStart);
    }
  };

  const handleSubmit = async (values: z.infer<typeof chatMessageSchema>) => {
    createMessage({
      content: [values.content],
      type: "text",
      conversationId,
    })
      .then(() => {
        form.reset();
        textareaRef.current?.focus();
      })
      .catch((error) => {
        toast.error(error instanceof ConvexError ? error.data : "发生错误");
      });
  };

  return (
    <Card className="w-full p-2 rounded-lg relative">
      <div className="absolute bottom-16" ref={emojiPickerRef}></div>

      <div className="flex gap-2 items-end w-full">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="flex gap-2 items-end w-full"
          >
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem className="h-full w-full">
                  <FormControl>
                    <TextareaAutosize
                      onKeyDown={async (e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault();
                          await form.handleSubmit(handleSubmit)();
                        }
                      }}
                      rows={1}
                      maxRows={3}
                      {...field}
                      onChange={handleInputChange}
                      onClick={handleInputChange}
                      placeholder="输入信息..."
                      className="min-h-full w-full resize-none border-0 outline-0 bg-card text-card-foreground placeholder:text-muted-foreground p-1.5"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button disabled={pending} size="icon" type="submit">
              <SendHorizonal />
            </Button>
          </form>
        </Form>
      </div>
    </Card>
  );
};

export default ChatInput;
