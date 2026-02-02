"use client";

import { motion } from "framer-motion";
import { Github, Twitter, Mail, Heart } from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative py-16 overflow-hidden bg-black border-t border-white/8">
      <div className="absolute inset-0 bg-linear-to-t from-black via-black/95 to-black/90" />

      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10">
        <motion.div
          animate={{
            scale: [1, 1.05, 1],
            opacity: [0.02, 0.04, 0.02],
          }}
          transition={{ duration: 20, repeat: Infinity }}
          className="absolute top-[20%] left-[10%] w-[30%] h-[30%] bg-indigo-600/20 blur-[100px] rounded-full"
        />
        <motion.div
          animate={{
            scale: [1.05, 1, 1.05],
            opacity: [0.015, 0.03, 0.015],
          }}
          transition={{ duration: 25, repeat: Infinity }}
          className="absolute bottom-[20%] right-[10%] w-[25%] h-[25%] bg-violet-700/20 blur-[100px] rounded-full"
        />
      </div>

      <div className="relative max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Brand */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="md:col-span-2"
          >
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-linear-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center">
                <span className="text-white text-sm font-bold">N</span>
              </div>
              <span className="text-xl font-bold text-white tracking-tight">
                Neura
                <span className="bg-clip-text text-transparent bg-linear-to-r from-indigo-400 to-purple-400">
                  Drive
                </span>
              </span>
            </div>
            <p className="text-slate-500 text-sm leading-relaxed max-w-md">
              Experience the future of file management with AI-powered
              organization, semantic search, and intelligent document
              processing.
            </p>
          </motion.div>

          {/* Product */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <h4 className="text-white font-semibold mb-4">Product</h4>
            <ul className="space-y-2">
              {["Features", "Pricing", "Security", "API"].map((item) => (
                <li key={item}>
                  <a
                    href="#"
                    className="text-slate-500 hover:text-indigo-400 text-sm transition-colors duration-200"
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Company */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h4 className="text-white font-semibold mb-4">Company</h4>
            <ul className="space-y-2">
              {["About", "Blog", "Careers", "Contact"].map((item) => (
                <li key={item}>
                  <a
                    href="#"
                    className="text-slate-500 hover:text-indigo-400 text-sm transition-colors duration-200"
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>

        {/* Bottom section */}
        <div className="flex flex-col md:flex-row items-center justify-between pt-8 border-t border-white/5">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex items-center gap-1 text-slate-500 text-sm mb-4 md:mb-0"
          >
            <span>© {currentYear} NeuraDrive.</span>
            <span>Made with</span>
            <Heart className="w-4 h-4 text-red-500 fill-current" />
            <span>for the future.</span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex items-center gap-6"
          >
            {[
              { icon: Github, href: "#" },
              { icon: Twitter, href: "#" },
              { icon: Mail, href: "#" },
            ].map(({ icon: Icon, href }, i) => (
              <motion.a
                key={i}
                href={href}
                whileHover={{ scale: 1.1, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className="w-10 h-10 bg-white/3 border border-white/8 rounded-full flex items-center justify-center text-slate-500 hover:text-indigo-400 hover:border-indigo-500/30 transition-all duration-200"
              >
                <Icon className="w-4 h-4" />
              </motion.a>
            ))}
          </motion.div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
