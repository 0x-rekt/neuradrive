"use client";
import { motion } from "framer-motion";
import { signIn } from "@/lib/auth-client";
import { Button } from "./ui/button";

const SignInBtn = () => {
  return (
    <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
      <Button
        onClick={() => signIn.social({ provider: "google", callbackURL: "/" })}
        className="relative overflow-hidden bg-white text-black hover:bg-slate-100 rounded-2xl px-8 py-5 font-semibold shadow-2xl transition-all cursor-pointer border-t border-white/50"
      >
        <span className="relative z-10 flex items-center gap-2">
          Get Started
        </span>
        <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/20 to-transparent -translate-x-full hover:animate-[shimmer_1.5s_infinite] transition-transform" />
      </Button>
    </motion.div>
  );
};

export default SignInBtn;
