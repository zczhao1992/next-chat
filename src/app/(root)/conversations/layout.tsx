import React from "react";

type ConversationsLayoutProps = React.PropsWithChildren<{}>;

const ConversationsLayout = ({ children }: ConversationsLayoutProps) => {
  return <div>{children}</div>;
};

export default ConversationsLayout;
