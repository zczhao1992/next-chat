"use client";

import ItemList from "@/components/shared/item-list/ItemList";
import ConversationFallback from "@/components/shared/conversation/ConversationFallback";

const FriendsPage = () => {
  return (
    <>
      <ItemList title="好友">FriendsPage</ItemList>

      <ConversationFallback />
    </>
  );
};

export default FriendsPage;
