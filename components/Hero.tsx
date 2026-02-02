"use client";

import { motion } from "framer-motion";
import { Zap } from "lucide-react";

const Hero = () => {
  return (
    <section className="relative pt-40 pb-24 overflow-hidden bg-black">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.08, 0.12, 0.08],
          }}
          transition={{ duration: 8, repeat: Infinity }}
          className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-indigo-600 blur-[140px] rounded-full"
        />
        <motion.div
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.05, 0.1, 0.05],
          }}
          transition={{ duration: 10, repeat: Infinity }}
          className="absolute bottom-0 right-[-10%] w-[40%] h-[40%] bg-violet-700 blur-[140px] rounded-full"
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/3 border border-white/8 text-indigo-300 text-xs font-medium mb-8 backdrop-blur-md"
        >
          <Zap className="w-3.5 h-3.5 fill-indigo-400" />
          <span className="tracking-wider uppercase">
            Neural Engine v2.0 Active
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="text-6xl md:text-8xl font-black text-white mb-8 tracking-tighter"
        >
          Storage with <br />
          <span className="text-transparent bg-clip-text bg-linear-to-b from-indigo-400 via-purple-400 to-violet-500">
            A Higher Mind.
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-slate-500 text-lg md:text-xl max-w-2xl mx-auto mb-12 font-light leading-relaxed"
        >
          Experience NeuraDrive. A void-black ecosystem where your files don't
          just exist—they evolve through Gemini-powered intelligence.
        </motion.p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="px-10 py-4 bg-white text-black rounded-full font-bold transition-all hover:shadow-[0_0_30px_rgba(255,255,255,0.2)] cursor-pointer"
          >
            Deploy NeuraDrive
          </motion.button>
          <button className="px-10 py-4 bg-transparent text-white rounded-full font-medium border border-white/10 hover:bg-white/5 transition-all cursor-pointer">
            System Overview
          </button>
        </div>
      </div>
    </section>
  );
};

export default Hero;
