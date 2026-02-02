"use client";

import { motion } from "framer-motion";
import { ArrowRight, Upload, Brain, Search, Cloud } from "lucide-react";

const steps = [
  {
    title: "Upload Files",
    desc: "Drag and drop your files. NeuraDrive accepts all formats with neural scanning.",
    icon: Upload,
    color: "text-indigo-400",
  },
  {
    title: "AI Processing",
    desc: "Our neural network analyzes content and extracts deep context.",
    icon: Brain,
    color: "text-purple-400",
  },
  {
    title: "Smart Organization",
    desc: "Files are automatically categorized for instant retrieval.",
    icon: Cloud,
    color: "text-violet-400",
  },
  {
    title: "Intelligent Search",
    desc: "Ask questions about your documents using natural language.",
    icon: Search,
    color: "text-blue-400",
  },
];

const HowItWorks = () => {
  return (
    <section className="relative py-16 md:py-24 overflow-hidden bg-black">
      {/* Background Glows - Optimized for mobile performance */}
      <div className="absolute inset-0 -z-10 pointer-events-none">
        <motion.div
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.03, 0.06, 0.03],
          }}
          transition={{ duration: 10, repeat: Infinity }}
          className="absolute top-[-10%] left-[-10%] w-[70%] md:w-[50%] h-[50%] bg-violet-700 blur-[80px] md:blur-[140px] rounded-full"
        />
        <motion.div
          animate={{
            scale: [1.1, 1, 1.1],
            opacity: [0.02, 0.05, 0.02],
          }}
          transition={{ duration: 14, repeat: Infinity }}
          className="absolute bottom-0 right-[-10%] w-[60%] md:w-[40%] h-[40%] bg-indigo-600 blur-[80px] md:blur-[140px] rounded-full"
        />
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16 md:mb-20"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white mb-6 tracking-tighter">
            How It <br className="sm:hidden" />
            <span className="text-transparent bg-clip-text bg-linear-to-b from-indigo-400 via-purple-400 to-violet-500">
              Works
            </span>
          </h2>
          <p className="text-slate-500 text-base md:text-lg max-w-xl mx-auto font-light leading-relaxed">
            Four simple steps to transform your static storage into a living
            digital brain.
          </p>
        </motion.div>

        <div className="relative">
          {/* Desktop connecting line - hidden on tablet/mobile */}
          <div className="hidden lg:block absolute top-18 left-1/2 -translate-x-1/2 w-full max-w-5xl px-12">
            <motion.div
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1.5, delay: 0.5 }}
              className="h-px bg-linear-to-r from-transparent via-white/10 to-transparent origin-center"
            />
          </div>

          {/* Grid Layout: 1 col on mobile, 2 on tablet, 4 on desktop */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {steps.map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="relative group"
              >
                {/* Step Number Badge */}
                <div className="absolute -top-3 -left-2 w-7 h-7 bg-white text-black rounded-full flex items-center justify-center text-xs font-bold z-20 border border-white/20 shadow-lg">
                  {i + 1}
                </div>

                <motion.div
                  whileHover={{ y: -5 }}
                  className="relative h-full p-6 md:p-8 rounded-[2rem] bg-white/1 border border-white/5 hover:bg-white/3 hover:border-white/10 transition-all duration-300 backdrop-blur-sm overflow-hidden flex flex-col items-start"
                >
                  <div className="absolute inset-0 bg-linear-to-br from-indigo-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="relative z-10 w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-white/3 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-white/5 transition-all duration-300 border border-white/5">
                    <step.icon
                      className={`w-6 h-6 md:w-7 md:h-7 ${step.color}`}
                    />
                  </div>

                  <div className="relative z-10">
                    <h3 className="text-lg md:text-xl font-bold text-white mb-3 tracking-tight group-hover:text-indigo-200 transition-colors">
                      {step.title}
                    </h3>
                    <p className="text-slate-500 text-sm leading-relaxed group-hover:text-slate-400 transition-colors">
                      {step.desc}
                    </p>
                  </div>

                  {i < steps.length - 1 && (
                    <div className="hidden lg:flex absolute -right-5 top-16 items-center justify-center">
                      <motion.div
                        animate={{ x: [0, 4, 0] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="p-1 rounded-full bg-black border border-white/10"
                      >
                        <ArrowRight className="w-3 h-3 text-slate-600" />
                      </motion.div>
                    </div>
                  )}
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
