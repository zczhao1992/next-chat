"use client";

import ItemList from "@/components/shared/item-list/ItemList";

const ConversationsLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <>
      <ItemList title="聊天"></ItemList>
      {children}
    </>
  );
};

export default ConversationsLayout;
