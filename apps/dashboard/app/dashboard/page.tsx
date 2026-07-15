"use client";

import { useState } from "react";
import Header from "../../components/Header";
import {
  Plus,
  Compass,
  MessageSquare,
  Send,
  Users,
  Clock,
  TrendingUp,
  TrendingDown,
  Activity,
  ChevronRight,
  Sparkles,
  BookOpen,
  EyeOff,
  Flame,
  Mail,
  ArrowUpRight,
  TrendingUp as ArrowUp,
  TrendingDown as ArrowDown
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function DashboardPage() {
  const [showEmptyState, setShowEmptyState] = useState(false);

  const handleCreateBot = () => {
    alert("Flow Creation Modal placeholder (Redirecting to Flow Builder)");
  };

  return (
    <div className="lg:ml-[260px] flex-grow flex flex-col h-screen overflow-hidden bg-slate-50/50">
      <Header onCreateBot={handleCreateBot} />

      {showEmptyState ? (
        /* Empty State View */
        <main className="flex-1 overflow-y-auto p-8 relative flex items-center justify-center">
          <div className="max-w-[480px] text-center space-y-6 animate-fade-in select-none">
            <div className="relative w-full aspect-video rounded-2xl overflow-hidden bg-slate-100/50 border border-slate-200/40 p-4 mb-4 shadow-sm flex items-center justify-center">
              <img
                className="object-contain max-h-[160px] drop-shadow-md"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDpLk3wMbo8I1RJiKJid_Kqpi3LcRr5I1xJRDOSDqWVXPFWHKKr2GK7gAdHF6huFgauEgOJcM-cZCsE2L6E6YRwceHGnWaiSWx7r3i0N_x1FXPGt-5Fsi6rzp5bfEPp5a1FDK6PA2JuLLFY2H2DzCgosxnp1hAZmAE7OZazvz0uBL9CfSj8d3I3dju-yPL0G3VsboPiIfG3otu3aUzOq0ftqaGo4xiOvzawO4DEoHj7C9Ao404qyTBtPA"
                alt="Empty state illustration"
              />
            </div>
            <h1 className="text-xl font-bold text-slate-800 font-sans tracking-tight">Ready to start flowing?</h1>
            <p className="text-xs text-slate-500 leading-relaxed max-w-sm mx-auto font-sans">
              Your workspace is looking a bit quiet. Create your first automated conversation flow to start engaging with
              your users across WhatsApp, Web, and more.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <Button
                onClick={() => setShowEmptyState(false)}
                className="w-full sm:w-auto bg-primary text-on-primary px-5 py-2.5 rounded-xl font-bold hover:opacity-90 active:scale-95 transition-all shadow-md shadow-primary/10 flex items-center gap-2 cursor-pointer text-xs"
              >
                <Plus className="w-4 h-4" />
                Create your first flow
              </Button>
              <Button
                variant="outline"
                className="w-full sm:w-auto border border-slate-200 hover:bg-slate-50 px-5 py-2.5 rounded-xl font-bold cursor-pointer text-slate-700 text-xs"
              >
                <BookOpen className="w-4 h-4" />
                Browse templates
              </Button>
            </div>
            <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">
              Need help?{" "}
              <a className="text-primary hover:underline" href="#">
                Check out our 2-minute guide.
              </a>
            </p>
          </div>
        </main>
      ) : (
        /* Real Dashboard View */
        <main className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50/50">
          
          {/* Dashboard Header Title Row */}
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-4 mb-2 select-none">
            <div>
              <h2 className="text-xl font-extrabold text-slate-800 tracking-tight leading-none">Dashboard Overview</h2>
              <p className="text-slate-400 text-xs mt-1.5 font-semibold">Welcome back, Alex. Here is what&apos;s happening with your bots today.</p>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-1.5 bg-white border border-slate-200/60 px-3.5 h-8.5 rounded-xl text-slate-700 font-bold text-xs hover:bg-slate-50 cursor-pointer shadow-sm"
              >
                <Plus className="w-3.5 h-3.5 text-slate-500" />
                Create New Flow
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowEmptyState(true)}
                className="flex items-center gap-1.5 bg-white border border-slate-200/60 px-3.5 h-8.5 rounded-xl text-slate-700 font-bold text-xs hover:bg-slate-50 cursor-pointer shadow-sm"
              >
                <EyeOff className="w-3.5 h-3.5 text-slate-500" />
                Simulate Empty State
              </Button>
            </div>
          </div>

          {/* Metric Cards Bento Row */}
          <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 select-none">
            {/* Card 1 */}
            <div className="bg-white p-5.5 rounded-2xl border border-slate-200/50 hover:shadow-lg hover:shadow-slate-100/50 transition-all duration-300">
              <div className="flex justify-between items-start mb-4">
                <div className="p-2.5 bg-primary/10 rounded-xl border border-primary/20 text-primary">
                  <MessageSquare className="w-4 h-4 text-primary" />
                </div>
                <Badge className="bg-emerald-50 text-emerald-600 border border-emerald-100 text-[10px] font-bold py-0.5 px-2 flex items-center gap-0.5 rounded-lg">
                  <TrendingUp className="w-3 h-3" /> 12.5%
                </Badge>
              </div>
              <p className="text-slate-400 text-[10px] uppercase tracking-widest font-extrabold">Active Conversations</p>
              <h3 className="text-2xl font-extrabold text-slate-800 mt-1.5 tracking-tight">1,284</h3>
            </div>
            {/* Card 2 */}
            <div className="bg-white p-5.5 rounded-2xl border border-slate-200/50 hover:shadow-lg hover:shadow-slate-100/50 transition-all duration-300">
              <div className="flex justify-between items-start mb-4">
                <div className="p-2.5 bg-indigo-50 rounded-xl border border-indigo-100 text-indigo-600">
                  <Send className="w-4 h-4" />
                </div>
                <Badge className="bg-emerald-50 text-emerald-600 border border-emerald-100 text-[10px] font-bold py-0.5 px-2 flex items-center gap-0.5 rounded-lg">
                  <TrendingUp className="w-3 h-3" /> 8.2%
                </Badge>
              </div>
              <p className="text-slate-400 text-[10px] uppercase tracking-widest font-extrabold">Messages Today</p>
              <h3 className="text-2xl font-extrabold text-slate-800 mt-1.5 tracking-tight">42,903</h3>
            </div>
            {/* Card 3 */}
            <div className="bg-white p-5.5 rounded-2xl border border-slate-200/50 hover:shadow-lg hover:shadow-slate-100/50 transition-all duration-300">
              <div className="flex justify-between items-start mb-4">
                <div className="p-2.5 bg-violet-50 rounded-xl border border-violet-100 text-violet-600">
                  <Users className="w-4 h-4" />
                </div>
                <Badge className="bg-rose-50 text-rose-600 border border-rose-100 text-[10px] font-bold py-0.5 px-2 flex items-center gap-0.5 rounded-lg">
                  <TrendingDown className="w-3 h-3" /> 2.1%
                </Badge>
              </div>
              <p className="text-slate-400 text-[10px] uppercase tracking-widest font-extrabold">Contacts Captured</p>
              <h3 className="text-2xl font-extrabold text-slate-800 mt-1.5 tracking-tight">312</h3>
            </div>
            {/* Card 4 */}
            <div className="bg-white p-5.5 rounded-2xl border border-slate-200/50 hover:shadow-lg hover:shadow-slate-100/50 transition-all duration-300">
              <div className="flex justify-between items-start mb-4">
                <div className="p-2.5 bg-amber-50 rounded-xl border border-amber-100 text-amber-700">
                  <Clock className="w-4 h-4" />
                </div>
                <Badge className="bg-emerald-50 text-emerald-600 border border-emerald-100 text-[10px] font-bold py-0.5 px-2 flex items-center gap-0.5 rounded-lg">
                  <TrendingUp className="w-3 h-3" /> 18%
                </Badge>
              </div>
              <p className="text-slate-400 text-[10px] uppercase tracking-widest font-extrabold">Avg. Response Time</p>
              <h3 className="text-2xl font-extrabold text-slate-800 mt-1.5 tracking-tight">1.4s</h3>
            </div>
          </section>

          {/* Line Chart Section */}
          <section className="bg-white p-6 rounded-2xl border border-slate-200/50 relative overflow-hidden select-none">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-sm font-bold text-slate-800">Conversation Volume (Last 7 Days)</h3>
              <div className="flex gap-4">
                <div className="flex items-center gap-1.5 text-[11px] text-slate-400 font-semibold">
                  <span className="w-2.5 h-2.5 rounded-full bg-primary inline-block"></span>
                  Total Chats
                </div>
                <div className="flex items-center gap-1.5 text-[11px] text-slate-400 font-semibold">
                  <span className="w-2.5 h-2.5 rounded-full bg-slate-200 inline-block"></span>
                  Last Week
                </div>
              </div>
            </div>
            
            {/* Chart Visualization */}
            <div className="h-60 w-full relative flex items-end justify-between px-4 pt-4">
              <div className="absolute inset-0 flex flex-col justify-between py-4 pointer-events-none">
                <div className="w-full h-[1px] bg-slate-100"></div>
                <div className="w-full h-[1px] bg-slate-100"></div>
                <div className="w-full h-[1px] bg-slate-100"></div>
                <div className="w-full h-[1px] bg-slate-100"></div>
                <div className="w-full h-[1px] bg-slate-100"></div>
              </div>
              <svg className="absolute inset-0 w-full h-full px-4" preserveAspectRatio="none" viewBox="0 0 1200 256">
                <defs>
                  <linearGradient id="chartGradient" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor="#4F46E5" stopOpacity="0.12"></stop>
                    <stop offset="100%" stopColor="#4F46E5" stopOpacity="0"></stop>
                  </linearGradient>
                </defs>
                <path
                  className="opacity-30"
                  d="M 0 256 L 0 180 Q 150 120 300 200 T 600 80 T 900 150 T 1200 40 L 1200 256 Z"
                  fill="url(#chartGradient)"
                ></path>
                <path d="M 0 180 Q 150 120 300 200 T 600 80 T 900 150 T 1200 40" fill="none" stroke="#4F46E5" strokeWidth="2.5"></path>
              </svg>
              <div className="flex justify-between w-full text-[10px] text-slate-400 px-4 -mb-6 font-bold uppercase tracking-wider">
                <span>Mon</span>
                <span>Tue</span>
                <span>Wed</span>
                <span>Thu</span>
                <span>Fri</span>
                <span>Sat</span>
                <span>Sun</span>
              </div>
            </div>
          </section>


          {/* Two-Column Section */}
          <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Recent Conversations */}
            <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200/50 overflow-hidden flex flex-col">
              <div className="p-5 border-b border-slate-100 flex justify-between items-center select-none">
                <h3 className="text-sm font-bold text-slate-800">Recent Conversations</h3>
                <Button variant="link" className="text-primary text-xs font-bold hover:underline p-0 cursor-pointer h-auto">
                  View All
                </Button>
              </div>
              <div className="divide-y divide-slate-100 flex-1">
                {/* List Item 1 */}
                <div className="p-4.5 flex items-center gap-4 hover:bg-slate-50/40 transition-colors cursor-pointer group">
                  <div className="relative shrink-0 select-none">
                    <img
                      className="w-10 h-10 rounded-full border border-slate-100 object-cover"
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuDW9rmrlU5RyYKu1EPuByeHjGmt05K5BCTrxYRpIpzgmi-B7p7276g07-OD1uw62GbvTrmIBbmxteASp4BIhn67v6bHn-1gaIqFnlNeANVvcllewIlPlOHh0Vnr4NGlua9PqRgaSRy1jyS_LjVhtD0BiRbtIwZ4o7i3hAVc-2gIDw_7-9_21kXOquYDxwfo270c9z5ekT8lcKXVpKhb32x3dpNcj5DVv5KSV7wOR_g6ryhx_PPVdWmUFA"
                      alt="Sarah Jenkins Avatar"
                    />
                    <div className="absolute -bottom-0.5 -right-0.5 w-4.5 h-4.5 bg-white rounded-full flex items-center justify-center border border-slate-100 shadow-sm text-blue-500">
                      <MessageSquare className="w-2.5 h-2.5" />
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start mb-0.5 select-none">
                      <h4 className="font-bold text-slate-800 truncate text-xs">Sarah Jenkins</h4>
                      <span className="text-[9px] text-slate-400 font-semibold">2m ago</span>
                    </div>
                    <p className="text-xs text-slate-500 truncate font-medium">&quot;I need help with my billing subscription...&quot;</p>
                  </div>
                  <div className="hidden sm:flex items-center gap-2.5 opacity-0 group-hover:opacity-100 transition-opacity select-none">
                    <Badge variant="secondary" className="bg-primary/5 text-primary text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-tight h-auto">
                      Support
                    </Badge>
                    <ChevronRight className="w-4 h-4 text-slate-400" />
                  </div>
                </div>

                {/* List Item 2 */}
                <div className="p-4.5 flex items-center gap-4 hover:bg-slate-50/40 transition-colors cursor-pointer group">
                  <div className="relative shrink-0 select-none">
                    <img
                      className="w-10 h-10 rounded-full border border-slate-100 object-cover"
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuAIHcY0q3EP8y1gt86j95R9hClIqgNoHGWLz6FyVeMSJ-lLq6yEw41E0fh6BtLcl1vTyNbRJ5ngeyJM2Izo2XmLiWQcXUNLg9V7huizOGVyrAgyFoekKG3ZCrRKK2SwLwbfqGjZkJuudlzWfElk93wy0BX6HJyuMf6LyS8TgrCwBY8n9fjtAlfmIqp-LGbc6OlIQo6KH2-RVH5KFySwRpfrQgrx7KGV1xTJ2MJmpm8PdqbRci52jYx0Og"
                      alt="Michael Chen Avatar"
                    />
                    <div className="absolute -bottom-0.5 -right-0.5 w-4.5 h-4.5 bg-white rounded-full flex items-center justify-center border border-slate-100 shadow-sm text-amber-500">
                      <Flame className="w-2.5 h-2.5" />
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start mb-0.5 select-none">
                      <h4 className="font-bold text-slate-800 truncate text-xs">Marcus Chen</h4>
                      <span className="text-[9px] text-slate-400 font-semibold">15m ago</span>
                    </div>
                    <p className="text-xs text-slate-500 truncate font-medium">&quot;The last order was fantastic, thank you!&quot;</p>
                  </div>
                  <div className="hidden sm:flex items-center gap-2.5 opacity-0 group-hover:opacity-100 transition-opacity select-none">
                    <Badge variant="secondary" className="bg-amber-50 text-amber-600 text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-tight h-auto">
                      Sales
                    </Badge>
                    <ChevronRight className="w-4 h-4 text-slate-400" />
                  </div>
                </div>

                {/* List Item 3 */}
                <div className="p-4.5 flex items-center gap-4 hover:bg-slate-50/40 transition-colors cursor-pointer group">
                  <div className="relative shrink-0 select-none">
                    <img
                      className="w-10 h-10 rounded-full border border-slate-100 object-cover"
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuDvNJ5Kf4mVUmglt3H4bAnC8afSFir_ASFAB8s1HtCM5H7-Jyn3iw7GyA6WBSoJ44SsHz42XXp0rQEfl8G7y6AuPN8Un__kb7VY7w2Bk0-DuhBsQpO-EY13iG8QducR0LedHPq-4DF_b5_LnvO25FhhA2x6LIsqHeOGaoE-98Lg7kEEMf2PSN47CVw5VOIvx_6zpl2-szFhGTYRP1mQHhrS6tzAXsvvKQHjAjoonhXOqOYv7c6_xM4ZrA"
                      alt="Elena Rodriguez Avatar"
                    />
                    <div className="absolute -bottom-0.5 -right-0.5 w-4.5 h-4.5 bg-white rounded-full flex items-center justify-center border border-slate-100 shadow-sm text-indigo-500">
                      <Mail className="w-2.5 h-2.5" />
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start mb-0.5 select-none">
                      <h4 className="font-bold text-slate-800 truncate text-xs">Elena Rodriguez</h4>
                      <span className="text-[9px] text-slate-400 font-semibold">1h ago</span>
                    </div>
                    <p className="text-xs text-slate-500 truncate font-medium">&quot;Waiting for documentation on API v2...&quot;</p>
                  </div>
                  <div className="hidden sm:flex items-center gap-2.5 opacity-0 group-hover:opacity-100 transition-opacity select-none">
                    <Badge variant="secondary" className="bg-slate-100 text-slate-600 text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-tight h-auto">
                      Developer
                    </Badge>
                    <ChevronRight className="w-4 h-4 text-slate-400" />
                  </div>
                </div>
              </div>
            </div>

            {/* Bot Performance Panel */}
            <div className="bg-white rounded-2xl border border-slate-200/50 p-6 flex flex-col h-full select-none">
              <h3 className="text-sm font-bold text-slate-800 mb-6">Bot Performance</h3>
              <div className="space-y-6 flex-grow flex flex-col justify-between">
                
                {/* Completion Rate Gauge */}
                <div className="flex flex-col items-center">
                  <div className="relative w-32 h-32 flex items-center justify-center">
                    <svg className="w-full h-full transform -rotate-90">
                      <circle
                        className="text-slate-100"
                        cx="64"
                        cy="64"
                        fill="transparent"
                        r="56"
                        stroke="currentColor"
                        strokeWidth="7"
                      ></circle>
                      <circle
                        className="text-primary transition-all duration-1000"
                        cx="64"
                        cy="64"
                        fill="transparent"
                        r="56"
                        stroke="currentColor"
                        strokeDasharray="351.8"
                        strokeDashoffset="35.18"
                        strokeLinecap="round"
                        strokeWidth="7"
                      ></circle>
                    </svg>
                    <div className="absolute text-center">
                      <span className="text-2xl font-extrabold text-slate-800 tracking-tight">90%</span>
                      <p className="text-[9px] text-slate-400 font-extrabold uppercase mt-0.5">Success</p>
                    </div>
                  </div>
                  <p className="text-xs font-bold text-slate-500 mt-4">Flow Completion Rate</p>
                </div>

                {/* Stats List Progress Bars */}
                <div className="space-y-4 pt-4">
                  <div>
                    <div className="flex justify-between items-center mb-1.5 font-bold text-xs">
                      <div className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-rose-500 inline-block"></span>
                        <span className="text-slate-500">Drop-off Rate</span>
                      </div>
                      <span className="text-slate-700">4.2%</span>
                    </div>
                    <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-rose-500 h-full rounded-full" style={{ width: "4.2%" }}></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-1.5 font-bold text-xs">
                      <div className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-amber-400 inline-block"></span>
                        <span className="text-slate-500">CSAT Score</span>
                      </div>
                      <span className="text-slate-700">4.8 / 5</span>
                    </div>
                    <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-amber-400 h-full rounded-full" style={{ width: "96%" }}></div>
                    </div>
                  </div>
                </div>
              </div>

              <Button
                variant="outline"
                className="w-full mt-6 py-2 bg-slate-50 hover:bg-slate-100 border border-slate-200/60 rounded-xl text-[11px] font-bold text-primary cursor-pointer h-9 shadow-sm"
              >
                View Detailed Report
              </Button>
            </div>
          </section>
        </main>
      )}
    </div>
  );
}
