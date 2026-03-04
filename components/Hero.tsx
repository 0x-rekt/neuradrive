"use client";

import { signIn, useSession } from "@/lib/auth-client";
import { motion } from "framer-motion";
import { Zap, Sparkles, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";

const Hero = () => {
  const { data } = useSession();
  const router = useRouter();

  return (
    <section className="relative pt-28 pb-24 overflow-hidden bg-black">
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.1, 0.15, 0.1],
            x: [0, 50, 0],
            y: [0, -30, 0],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-indigo-600 blur-[140px] rounded-full"
        />
        <motion.div
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.08, 0.12, 0.08],
            x: [0, -40, 0],
            y: [0, 40, 0],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-0 right-[-10%] w-[40%] h-[40%] bg-violet-700 blur-[140px] rounded-full"
        />
        <motion.div
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.06, 0.1, 0.06],
            rotate: [0, 90, 0],
          }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60%] h-[60%] bg-purple-600 blur-[160px] rounded-full"
        />

        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            animate={{
              y: [0, -30, 0],
              opacity: [0.2, 0.5, 0.2],
            }}
            transition={{
              duration: 3 + Math.random() * 4,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
            className="absolute w-1 h-1 bg-indigo-400 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
          />
        ))}

        {/* Grid overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-size - [4rem_4rem] mask-[radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_110%)]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 text-center relative">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-linear-to-r from-indigo-500/10 via-purple-500/10 to-violet-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-medium mb-8 backdrop-blur-md relative group"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            className="relative"
          >
            <Zap className="w-3.5 h-3.5 fill-indigo-400 text-indigo-400" />
          </motion.div>
          <span className="tracking-wider uppercase relative">
            Neural Engine v1.0 Active
          </span>
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <Sparkles className="w-3 h-3 text-indigo-400" />
          </motion.div>
        </motion.div>

        {/* Main heading with enhanced effects */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="text-5xl sm:text-6xl md:text-8xl font-black text-white mb-8 tracking-tighter relative"
        >
          <span className="relative inline-block">
            Storage with
            <motion.div
              animate={{
                opacity: [0.5, 1, 0.5],
                scale: [0.98, 1.02, 0.98],
              }}
              transition={{ duration: 3, repeat: Infinity }}
              className="absolute -inset-4 bg-indigo-500/20 blur-3xl rounded-full -z-10"
            />
          </span>
          <br />
          <span className="relative inline-block text-transparent bg-clip-text bg-linear-to-b from-indigo-400 via-purple-400 to-violet-500">
            A Higher Mind.
            <motion.div
              animate={{
                opacity: [0.3, 0.6, 0.3],
                scale: [1, 1.05, 1],
              }}
              transition={{ duration: 4, repeat: Infinity }}
              className="absolute -inset-8 bg-linear-to-r from-indigo-500/30 via-purple-500/30 to-violet-500/30 blur-3xl rounded-full -z-10"
            />
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-slate-400 text-base sm:text-lg md:text-xl max-w-2xl mx-auto mb-12 font-light leading-relaxed"
        >
          Experience NeuraDrive. A void-black ecosystem where your files don't
          just exist—they{" "}
          <span className="text-indigo-400 font-medium">evolve</span> through
          Gemini-powered intelligence.
        </motion.p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="relative group"
          >
            {/* Glowing border effect */}
            <div className="absolute -inset-1 bg-linear-to-r from-indigo-500 via-purple-500 to-violet-500 rounded-full blur-lg opacity-60 group-hover:opacity-100 transition duration-500 group-hover:duration-200 animate-pulse" />
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="relative px-10 py-4 bg-white text-black rounded-full font-bold transition-all shadow-[0_0_40px_rgba(255,255,255,0.1)] hover:shadow-[0_0_60px_rgba(255,255,255,0.3)] cursor-pointer flex items-center gap-2 group"
              onClick={
                data
                  ? () => {
                      router.push("/drive");
                    }
                  : () => {
                      signIn.social({
                        provider: "google",
                        callbackURL: "/drive",
                      });
                    }
              }
            >
              {data ? "Go to Drive" : "Get Started"}
              <motion.div
                animate={{ x: [0, 4, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                <ArrowRight className="w-5 h-5" />
              </motion.div>
            </motion.button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
          >
            <motion.a
              href="#features"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="relative px-10 py-4 bg-white/5 backdrop-blur-sm text-white rounded-full font-semibold transition-all border border-white/10 hover:border-indigo-500/50 hover:bg-white/10 cursor-pointer inline-flex items-center gap-2 group"
            >
              Explore Features
              <Sparkles className="w-4 h-4 group-hover:text-indigo-400 transition-colors" />
            </motion.a>
          </motion.div>
        </div>

        <motion.div
          animate={{
            y: [0, -20, 0],
            rotate: [0, 5, 0],
          }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-20 left-10 w-20 h-20 border border-indigo-500/20 rounded-full blur-sm hidden lg:block"
        />
        <motion.div
          animate={{
            y: [0, 20, 0],
            rotate: [0, -5, 0],
          }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-20 right-10 w-32 h-32 border border-purple-500/20 rounded-full blur-sm hidden lg:block"
        />
      </div>
    </section>
  );
};

export default Hero;
