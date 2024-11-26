import { Card } from "@/components/ui/card";

const ConversationFallback = () => {
  return (
    <Card className="hidden lg:flex h-full w-full p-2 items-center justify-center bg-secondary text-secondary-foreground">
      选择一个好友开始聊天
    </Card>
  );
};

export default ConversationFallback;
