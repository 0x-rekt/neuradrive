"use client";

import { Button } from "@/components/ui/button";
import { signIn } from "@/lib/auth-client";

const Home = () => {
  const handleClick = async () => {
    await signIn.social({
      provider: "google",
      callbackURL: "/",
    });
  };

  return (
    <div>
      <Button variant={"default"} onClick={handleClick}>
        Click Me
      </Button>
    </div>
  );
};

export default Home;
