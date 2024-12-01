"use client";

import ItemList from "@/components/shared/item-list/ItemList";
import ConversationFallback from "@/components/shared/conversation/ConversationFallback";
import AddFriendDialog from "./_components/AddFriendDialog";
import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import Request from "./_components/Request";
import { Loader2 } from "lucide-react";

const FriendsPage = () => {
  const requests = useQuery(api.requests.get);

  return (
    <>
      <ItemList title="好友" action={<AddFriendDialog />}>
        {requests ? (
          requests.length === 0 ? (
            <p className="w-full h-full flex items-center justify-center">
              无好友申请
            </p>
          ) : (
            requests.map((request) => {
              return (
                <Request
                  key={request.request._id}
                  id={request.request._id}
                  imageUrl={request.sender.imageUrl}
                  username={request.sender.username}
                  email={request.sender.email}
                />
              );
            })
          )
        ) : (
          <Loader2 className="h-8 w-8" />
        )}
      </ItemList>

      <ConversationFallback />
    </>
  );
};

export default FriendsPage;
