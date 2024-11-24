import { Button } from "@/components/ui/button";
import { SignedIn, UserButton } from "@clerk/nextjs";

export default function Home() {
  return (
    <div>
      <UserButton />
      <Button>ddd</Button>
    </div>
  );
}
