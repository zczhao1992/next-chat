"use client";

import ItemList from "@/components/shared/item-list/ItemList";

type ConversationsLayoutProps = React.PropsWithChildren<{}>;

const ConversationsLayout = ({ children }: ConversationsLayoutProps) => {
  return (
    <>
      <ItemList title="聊天"></ItemList>
      {children}
    </>
  );
};

export default ConversationsLayout;
