"use client";
import { motion } from "framer-motion";
import { signIn } from "@/lib/auth-client";

const SignInBtn = () => {
  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => signIn.social({ provider: "google", callbackURL: "/" })}
      className="px-4 py-2 bg-white text-black rounded-full font-bold transition-all hover:shadow-[0_0_30px_rgba(255,255,255,0.2)] cursor-pointer"
    >
      Get Started
    </motion.button>
  );
};

export default SignInBtn;
