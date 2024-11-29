"use client";

import ItemList from "@/components/shared/item-list/ItemList";
import ConversationFallback from "@/components/shared/conversation/ConversationFallback";
import AddFriendDialog from "./_components/AddFriendDialog";
import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Loader2 } from "lucide-react";

const FriendsPage = () => {
  const requests = useQuery(api.requests.get);

  return (
    <>
      <ItemList title="好友" action={<AddFriendDialog />}>
        {requests ? null : <Loader2 className="h-8 w-8" />}
      </ItemList>

      <ConversationFallback />
    </>
  );
};

export default FriendsPage;
