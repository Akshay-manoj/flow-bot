"use client";

import { useRouter } from "next/navigation";
import { GitFork, ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Home() {
  const router = useRouter();

  return (
    <div className="dark gradient-mesh min-h-screen flex flex-col items-center justify-center p-6 text-center select-none overflow-hidden relative w-full">
      <style jsx global>{`
        .gradient-mesh {
          background-color: #0c0f1d;
          background-image: radial-gradient(at 0% 0%, hsla(244, 78%, 53%, 0.15) 0, transparent 50%),
                            radial-gradient(at 50% 50%, hsla(263, 85%, 50%, 0.12) 0, transparent 50%),
                            radial-gradient(at 100% 0%, hsla(244, 78%, 53%, 0.15) 0, transparent 50%);
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-10px) rotate(3deg); }
        }
        @keyframes pulse-slow {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 0.6; transform: scale(1.05); }
        }
        .animate-float {
          animation: float 4s ease-in-out infinite;
        }
        .animate-pulse-slow {
          animation: pulse-slow 6s ease-in-out infinite;
        }
      `}</style>

      {/* Decorative background glows */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[120px] animate-pulse-slow -z-10" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-[120px] animate-pulse-slow -z-10" style={{ animationDelay: "3s" }} />

      {/* Content wrapper */}
      <div className="max-w-[450px] w-[90%] sm:w-full flex flex-col items-center space-y-8 animate-fade-in mx-auto">
        {/* Animated Icon badge */}
        <div className="animate-float">
          <div className="w-16 h-16 bg-indigo-500/10 border border-indigo-500/20 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-500/5">
            <GitFork className="w-8 h-8 text-indigo-400 rotate-90" />
          </div>
        </div>

        {/* Title */}
        <div className="space-y-3 w-full text-center">
          <div className="flex items-center justify-center gap-1.5 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 px-3.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-widest w-fit mx-auto select-none whitespace-nowrap">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            <span>Launch Campaign</span>
          </div>
          <h1 className="text-4xl font-extrabold text-white tracking-tight leading-none whitespace-nowrap">
            FlowBot <span className="text-indigo-400 font-bold">1.0</span>
          </h1>
          <p className="text-slate-400 text-xs font-semibold max-w-[350px] mx-auto leading-relaxed">
            Our next-generation conversational flow automation platform is currently wrapping up construction.
          </p>
        </div>

        {/* Coming soon counter banner */}
        <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-6 w-full max-w-[450px] flex justify-around items-center select-none shadow-xl mx-auto">
          <div className="text-center w-[120px]">
            <p className="text-2xl font-black text-white leading-none whitespace-nowrap">Coming</p>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1.5 whitespace-nowrap">Status</p>
          </div>
          <div className="h-8 w-[1px] bg-slate-800 shrink-0" />
          <div className="text-center w-[120px]">
            <p className="text-2xl font-black text-indigo-400 leading-none whitespace-nowrap">Soon</p>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1.5 whitespace-nowrap">Timeline</p>
          </div>
        </div>

        {/* Action Button */}
        <div className="w-full max-w-[450px] mx-auto">
          <Button
            onClick={() => router.push("/login")}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-6 rounded-xl font-bold transition-all hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-2 text-xs shadow-lg shadow-indigo-600/20 cursor-pointer whitespace-nowrap border-none"
          >
            <span>Enter Dashboard Portal</span>
            <ArrowRight className="w-4 h-4 shrink-0" />
          </Button>
        </div>
      </div>
    </div>
  );
}
