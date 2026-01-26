"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
  Cloud,
  Search,
  Bell,
  LogOut,
  Settings,
  User,
  Zap,
  ChevronDown,
  Sparkles,
} from "lucide-react";
import { useSession, signOut } from "@/lib/auth-client";
import Image from "next/image";
import SignInBtn from "./SignInBtn";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Navbar = () => {
  const { data } = useSession();

  return (
    <nav className="fixed top-0 w-full z-50 bg-black/40 backdrop-blur-md border-b border-white/8 saturate-150">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="flex items-center gap-2.5 group cursor-pointer"
          >
            <div className="relative">
              <div className="absolute inset-0 bg-indigo-500 blur-lg opacity-20 group-hover:opacity-40 transition-opacity" />
              <div className="relative bg-linear-to-br from-indigo-500 to-purple-600 p-2 rounded-xl border border-white/20 shadow-xl">
                <Cloud className="text-white w-5 h-5" />
              </div>
            </div>
            <span className="text-xl font-bold text-white tracking-tight">
              Neura
              <span className="bg-clip-text text-transparent bg-linear-to-r from-indigo-400 to-purple-400">
                Drive
              </span>
            </span>
          </motion.div>

          <div className="hidden md:flex flex-1 max-w-md mx-8">
            <div className="relative w-full group">
              <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-slate-500 group-focus-within:text-indigo-400 transition-colors" />
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-12 py-2 bg-white/3 border border-white/8 rounded-2xl text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500/50 focus:bg-white/6transition-all duration-500"
                placeholder="Ask AI or search files..."
              />
              <div className="absolute inset-y-0 right-3 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-indigo-500/50" />
                <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-medium text-slate-500 bg-white/5 border border-white/10 rounded-md">
                  ⌘K
                </kbd>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {data?.user ? (
              <>
                <button className="relative p-2 text-slate-400 hover:text-white hover:bg-white/5 rounded-full transition-all">
                  <Bell className="w-5 h-5" />
                  <span className="absolute top-2 right-2 w-2 h-2 bg-indigo-500 rounded-full border-2 border-black" />
                </button>

                <DropdownMenu>
                  <DropdownMenuTrigger className="flex items-center gap-2 p-1 pr-3 rounded-full hover:bg-white/5 border border-transparent hover:border-white/10 transition-all focus:outline-none cursor-pointer">
                    <div className="relative">
                      <Image
                        src={data.user.image || "/images/default-avatar.png"}
                        width={32}
                        height={32}
                        alt="User"
                        className="rounded-full ring-1 ring-white/20"
                      />
                      <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 border-2 border-black rounded-full" />
                    </div>
                    <ChevronDown className="w-4 h-4 text-slate-500 group-hover:text-slate-300" />
                  </DropdownMenuTrigger>

                  <DropdownMenuContent
                    align="end"
                    className="w-64 mt-2 bg-[#0a0a0c] border-white/10 text-slate-200 shadow-[0_20px_50px_rgba(0,0,0,0.5)] backdrop-blur-2xl rounded-2xl p-2 overflow-hidden"
                  >
                    <DropdownMenuLabel className="p-3">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-semibold text-white">
                          {data.user.name}
                        </p>
                        <p className="text-xs text-slate-500 font-medium">
                          {data.user.email}
                        </p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator className="bg-white/5 mx-2" />
                    <div className="space-y-1 p-1">
                      <DropdownMenuItem className="rounded-lg py-2.5 focus:bg-white/5 cursor-pointer gap-3">
                        <User className="w-4 h-4 text-slate-400" /> Profile
                      </DropdownMenuItem>
                      <DropdownMenuItem className="rounded-lg py-2.5 focus:bg-indigo-500/10 focus:text-indigo-400 cursor-pointer gap-3">
                        <Zap className="w-4 h-4 text-indigo-400" /> Upgrade to
                        Pro
                      </DropdownMenuItem>
                      <DropdownMenuItem className="rounded-lg py-2.5 focus:bg-white/5 cursor-pointer gap-3">
                        <Settings className="w-4 h-4 text-slate-400" /> Settings
                      </DropdownMenuItem>
                    </div>
                    <DropdownMenuSeparator className="bg-white/5 mx-2" />
                    <DropdownMenuItem
                      onClick={() => signOut()}
                      className="m-1 rounded-lg py-2.5 focus:bg-red-500/10 focus:text-red-400 text-red-400 cursor-pointer gap-3"
                    >
                      <LogOut className="w-4 h-4" /> Sign Out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <SignInBtn />
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
