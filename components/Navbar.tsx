"use client";

import {
  Cloud,
  Search,
  Bell,
  LogOut,
  Settings,
  User,
  Zap,
  ChevronDown,
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
    <nav className="fixed top-0 w-full z-50 bg-slate-950/70 backdrop-blur-xl border-b border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-2 group cursor-pointer">
            <div className="bg-indigo-500 p-1.5 rounded-xl shadow-[0_0_15px_rgba(99,102,241,0.4)] group-hover:scale-110 transition-transform duration-300">
              <Cloud className="text-white w-5 h-5" />
            </div>
            <span className="text-xl font-bold text-white tracking-tight">
              Neura<span className="text-indigo-400">Drive</span>
            </span>
          </div>

          <div className="hidden md:flex flex-1 max-w-md mx-8">
            <div className="relative w-full group">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-slate-500 group-focus-within:text-indigo-400 transition-colors" />
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-3 py-2 bg-slate-900/50 border border-white/10 rounded-xl text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all duration-300"
                placeholder="Ask AI or search files..."
              />
              <div className="absolute inset-y-0 right-3 flex items-center">
                <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-medium text-slate-500 bg-slate-800 border border-slate-700 rounded-md">
                  ⌘K
                </kbd>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {data?.user ? (
              <>
                <button className="p-2 text-slate-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors">
                  <Bell className="w-5 h-5" />
                </button>

                <DropdownMenu>
                  <DropdownMenuTrigger className="flex items-center gap-2 p-1 pr-2 rounded-full hover:bg-white/5 transition-all focus:outline-none cursor-pointer">
                    <div className="relative">
                      <Image
                        src={data.user.image || "/images/default-avatar.png"}
                        width={32}
                        height={32}
                        alt="User"
                        className="rounded-full border border-white/10"
                      />
                      <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-slate-950 rounded-full"></div>
                    </div>
                    <ChevronDown className="w-4 h-4 text-slate-500" />
                  </DropdownMenuTrigger>

                  <DropdownMenuContent className="w-56 mt-2 bg-slate-900 border-white/10 text-slate-200 shadow-2xl animate-in fade-in zoom-in duration-200">
                    <DropdownMenuLabel className="font-normal">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none text-white">
                          {data.user.name}
                        </p>
                        <p className="text-xs leading-none text-slate-500">
                          {data.user.email}
                        </p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator className="bg-white/5" />
                    <DropdownMenuItem className="focus:bg-white/5 focus:text-white cursor-pointer gap-2">
                      <User className="w-4 h-4" /> Profile
                    </DropdownMenuItem>
                    <DropdownMenuItem className="focus:bg-white/5 focus:text-indigo-400 cursor-pointer gap-2">
                      <Zap className="w-4 h-4" /> Upgrade to Pro
                    </DropdownMenuItem>
                    <DropdownMenuItem className="focus:bg-white/5 focus:text-white cursor-pointer gap-2">
                      <Settings className="w-4 h-4" /> Settings
                    </DropdownMenuItem>
                    <DropdownMenuSeparator className="bg-white/5" />
                    <DropdownMenuItem
                      onClick={() => signOut()}
                      className="focus:bg-red-500/10 focus:text-red-400 text-red-400 cursor-pointer gap-2"
                    >
                      <LogOut className="w-4 h-4" /> Sign Out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <div className="hover:scale-105 transition-transform duration-200">
                <SignInBtn />
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
