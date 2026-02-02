import { Brain, Search, MessageSquare, Zap } from "lucide-react";
import { motion } from "framer-motion";

const features = [
  {
    title: "Semantic Search",
    desc: "Search by meaning, not just filenames. Find 'that one tax doc' instantly.",
    icon: Search,
    color: "text-blue-400",
  },
  {
    title: "Document Chat",
    desc: "Ask your PDFs questions. Get summaries, key points, and translations in seconds.",
    icon: MessageSquare,
    color: "text-purple-400",
  },
  {
    title: "Auto-Organize",
    desc: "AI intelligently tags and moves files into relevant folders based on content.",
    icon: Brain,
    color: "text-indigo-400",
  },
  {
    title: "Neural OCR",
    desc: "Convert handwritten notes and images into searchable, digital text effortlessly.",
    icon: Zap,
    color: "text-amber-400",
  },
];

const Features = () => {
  return (
    <section className="relative py-24 overflow-hidden bg-black">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10">
        <motion.div
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.06, 0.08, 0.06],
          }}
          transition={{ duration: 12, repeat: Infinity }}
          className="absolute top-[10%] left-[-15%] w-[45%] h-[45%] bg-indigo-600 blur-[160px] rounded-full"
        />
        <motion.div
          animate={{
            scale: [1.1, 1, 1.1],
            opacity: [0.04, 0.07, 0.04],
          }}
          transition={{ duration: 15, repeat: Infinity }}
          className="absolute bottom-[10%] right-[-15%] w-[35%] h-[35%] bg-violet-700 blur-[160px] rounded-full"
        />
      </div>

      <div className="max-w-7xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-black text-white mb-6 tracking-tighter">
            Powered by <br />
            <span className="text-transparent bg-clip-text bg-linear-to-b from-indigo-400 via-purple-400 to-violet-500">
              Neural Intelligence
            </span>
          </h2>
          <p className="text-slate-500 text-lg max-w-2xl mx-auto font-light leading-relaxed">
            Every feature is designed with cutting-edge AI to make file
            management effortless and intelligent.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((f, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              whileHover={{ y: -8, scale: 1.02 }}
              className="relative p-8 rounded-3xl bg-white/2 border border-white/8 hover:border-indigo-500/30 transition-all group backdrop-blur-sm overflow-hidden"
            >
              <div className="absolute inset-0 bg-linear-to-br from-indigo-500/5 via-transparent to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              <div
                className={`relative w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform border border-white/5`}
              >
                <f.icon className={`w-6 h-6 ${f.color}`} />
              </div>
              <h3 className="relative text-xl font-bold text-white mb-3 group-hover:text-indigo-200 transition-colors">
                {f.title}
              </h3>
              <p className="relative text-slate-400 text-sm leading-relaxed group-hover:text-slate-300 transition-colors">
                {f.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
