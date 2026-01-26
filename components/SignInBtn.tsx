"use client";
import { signIn } from "@/lib/auth-client";
import { Button } from "./ui/button";

const SignInBtn = () => {
  return (
    <Button
      onClick={() => signIn.social({ provider: "google", callbackURL: "/" })}
      className="bg-white text-slate-950 hover:bg-slate-200 rounded-full px-6 font-medium shadow-[0_0_20px_rgba(255,255,255,0.1)] transition-all cursor-pointer"
    >
      Get Started
    </Button>
  );
};

export default SignInBtn;
