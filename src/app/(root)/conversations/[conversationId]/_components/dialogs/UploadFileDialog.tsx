"use client";

import Uploader from "@/components/shared/uploader";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { api } from "../../../../../../../convex/_generated/api";
import { useConversation } from "@/hooks/useConversation";
import { useMutationState } from "@/hooks/useMutationState";
import { zodResolver } from "@hookform/resolvers/zod";
import { ConvexError } from "convex/values";
import { File, Image } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

type Props = {
  open: boolean;
  toggle: (newState: boolean) => void;
  type: "image" | "file";
};

const uploadFileSchema = z.object({
  files: z.string().array().min(1, { message: "您必须选择至少一个文件" }),
});

const UploadFileDialog = ({ open, toggle, type }: Props) => {
  const form = useForm<z.infer<typeof uploadFileSchema>>({
    resolver: zodResolver(uploadFileSchema),
    defaultValues: {
      files: [],
    },
  });

  const { conversationId } = useConversation();

  const files = form.watch("files");

  const { mutate: createMessage, pending } = useMutationState(
    api.message.create
  );

  const handleSubmit = async (values: z.infer<typeof uploadFileSchema>) => {
    createMessage({
      content: values.files,
      type,
      conversationId,
    })
      .then(() => {
        form.reset();
        toggle(false);
      })
      .catch((error) => {
        toast.error(error instanceof ConvexError ? error.data : "发生错误");
      });
  };

  return (
    <Dialog open={open} onOpenChange={(open) => toggle(open)}>
      <DialogTrigger asChild>
        <Button size="icon" variant="outline">
          {type === "image" ? <Image /> : <File />}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>上传文件</DialogTitle>
          <DialogDescription>
            {type === "image" ? "上传图片或者视频" : "传图片、视频、音频、PDF!"}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)}>
            <FormField
              control={form.control}
              name="files"
              render={() => (
                <FormItem>
                  <FormControl>
                    <div className="py-4">
                      <Uploader
                        type={type}
                        onChange={(urls) =>
                          form.setValue("files", [...files, ...urls])
                        }
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button disabled={!files.length || pending} type="submit">
                发送
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default UploadFileDialog;
