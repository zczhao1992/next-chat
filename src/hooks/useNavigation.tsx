import { useMemo } from "react";
import { usePathname } from "next/navigation";

import { MessageSquare, Users } from "lucide-react";
// import { useQuery } from "convex/react";
// import { api } from "../../convex/_generated/api";

export const useNavigation = () => {
  const pathname = usePathname();

  // const requestsCount = useQuery(api.requests.count);
  // const conversations = useQuery(api.conversations.get);

  // const unseenMessagesCount = useMemo(() => {
  //   return conversations?.reduce((acc, curr) => {
  //     return acc + curr.unseenCount;
  //   }, 0);
  // }, [conversations]);

  const paths = useMemo(
    () => [
      {
        name: "聊天",
        href: "/conversations",
        icon: <MessageSquare />,
        active: pathname.startsWith("/conversations"),
        // count: unseenMessagesCount,
      },
      {
        name: "朋友",
        href: "/friends",
        icon: <Users />,
        active: pathname === "/friends",
        // count: requestsCount,
      },
    ],
    [pathname]
  );

  return paths;
};
