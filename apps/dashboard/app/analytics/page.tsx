"use client";

import { useState, useEffect } from "react";
import Header from "../../components/Header";
import {
  LineChart,
  Calendar,
  Download,
  ChevronDown,
  Info,
  Activity,
  Clock,
  Sparkles,
  Award
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface MetricData {
  funnel: { started: number; engaged: number; completed: number };
  csat: { score: number; positivePercent: number; responsesCount: string };
  latency: number[];
  dropoff: { nodeName: string; percent: number }[];
  distribution: { name: string; percent: number; colorClass: string; offset: number }[];
}

export default function AnalyticsPage() {
  const [selectedFlow, setSelectedFlow] = useState("Customer Support Onboarding");
  const [animate, setAnimate] = useState(false);

  // Trigger animations on load or flow change
  useEffect(() => {
    setAnimate(false);
    const timer = setTimeout(() => setAnimate(true), 150);
    return () => clearTimeout(timer);
  }, [selectedFlow]);

  // Mock data mapping for different flows
  const flowMetrics: Record<string, MetricData> = {
    "Customer Support Onboarding": {
      funnel: { started: 12482, engaged: 8924, completed: 5102 },
      csat: { score: 4.8, positivePercent: 92, responsesCount: "1.2k" },
      latency: [80, 75, 85, 60, 65, 40, 45, 30, 35, 50, 45, 55, 40, 30, 25, 35, 20, 25, 15, 20, 10],
      dropoff: [
        { nodeName: "Greeting & Intent", percent: 12 },
        { nodeName: "Data Privacy Consent", percent: 34 },
        { nodeName: "Email Capture", percent: 21 },
        { nodeName: "Issue Categorization", percent: 8 },
        { nodeName: "Solution Suggestion", percent: 28 },
      ],
      distribution: [
        { name: "WhatsApp", percent: 45, colorClass: "bg-primary", offset: 0 },
        { name: "Web Messenger", percent: 30, colorClass: "bg-secondary", offset: 153 },
        { name: "Telegram", percent: 15, colorClass: "bg-outline-variant", offset: 255 },
        { name: "Messenger", percent: 10, colorClass: "bg-surface-dim", offset: 306 },
      ],
    },
    "Lead Gen - Q3 Campaign": {
      funnel: { started: 8430, engaged: 5200, completed: 3950 },
      csat: { score: 4.6, positivePercent: 88, responsesCount: "820" },
      latency: [90, 85, 75, 70, 60, 50, 55, 40, 45, 35, 40, 45, 30, 25, 30, 20, 25, 15, 10, 12, 8],
      dropoff: [
        { nodeName: "Welcome Message", percent: 8 },
        { nodeName: "Capture Name", percent: 15 },
        { nodeName: "Capture Email", percent: 28 },
        { nodeName: "Company Size Select", percent: 42 },
        { nodeName: "Book Meeting Demo", percent: 18 },
      ],
      distribution: [
        { name: "Web Messenger", percent: 65, colorClass: "bg-secondary", offset: 0 },
        { name: "WhatsApp", percent: 20, colorClass: "bg-primary", offset: 220 },
        { name: "Telegram", percent: 10, colorClass: "bg-outline-variant", offset: 288 },
        { name: "Messenger", percent: 5, colorClass: "bg-surface-dim", offset: 322 },
      ],
    },
    "Product Feedback Loop": {
      funnel: { started: 4502, engaged: 4100, completed: 3820 },
      csat: { score: 4.9, positivePercent: 97, responsesCount: "2.4k" },
      latency: [40, 45, 35, 30, 25, 20, 25, 18, 15, 22, 18, 20, 15, 12, 10, 15, 8, 10, 5, 8, 4],
      dropoff: [
        { nodeName: "Welcome Prompter", percent: 3 },
        { nodeName: "Rating 1-5 Selection", percent: 5 },
        { nodeName: "Review Comment Textarea", percent: 65 },
        { nodeName: "Follow-up Consent Check", percent: 12 },
        { nodeName: "Thank You Note", percent: 2 },
      ],
      distribution: [
        { name: "WhatsApp", percent: 50, colorClass: "bg-primary", offset: 0 },
        { name: "Web Widget", percent: 40, colorClass: "bg-secondary", offset: 170 },
        { name: "Telegram", percent: 8, colorClass: "bg-outline-variant", offset: 306 },
        { name: "Messenger", percent: 2, colorClass: "bg-surface-dim", offset: 333 },
      ],
    },
  };

  const currentData = flowMetrics[selectedFlow] || flowMetrics["Customer Support Onboarding"];

  return (
    <div className="flex-grow flex flex-col min-h-screen bg-slate-50/50">
      <Header title="Analytics Overview" />

      {/* Analytics Canvas */}
      <div className="p-6 max-w-[1200px] mx-auto w-full space-y-6">
        
        {/* Filters Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-4 select-none">
          <div>
            <h2 className="text-xl font-extrabold text-slate-800 tracking-tight">Analytics Overview</h2>
            <p className="text-xs text-slate-400 mt-1 font-semibold">Real-time performance metrics for your conversational flows.</p>
          </div>
          
          <div className="flex flex-wrap items-end gap-3">

            <div className="flex flex-col gap-1.5 font-semibold">
              <label className="text-[9px] text-slate-400 font-extrabold uppercase tracking-widest">Selected Flow</label>
              <div className="relative">
                <select
                  value={selectedFlow}
                  onChange={(e) => setSelectedFlow(e.target.value)}
                  className="appearance-none bg-white border border-slate-200/60 rounded-xl px-4 py-2 pr-10 text-xs font-bold text-slate-700 focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary cursor-pointer h-9.5"
                >
                  <option>Customer Support Onboarding</option>
                  <option>Lead Gen - Q3 Campaign</option>
                  <option>Product Feedback Loop</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 w-3.5 h-3.5" />
              </div>
            </div>

            <div className="flex flex-col gap-1.5 font-semibold">
              <label className="text-[9px] text-slate-400 font-extrabold uppercase tracking-widest">Date Range</label>
              <Button
                variant="outline"
                className="flex items-center gap-2 bg-white border border-slate-200/60 rounded-xl px-4 h-9.5 text-xs font-bold text-slate-700 hover:bg-slate-50 cursor-pointer shadow-none"
              >
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                <span>Last 30 Days</span>
                <ChevronDown className="w-3 h-3 text-slate-400 ml-1" />
              </Button>
            </div>

            <Button
              variant="outline"
              size="icon"
              onClick={() => alert("Downloading PDF/CSV reports...")}
              className="bg-white border border-slate-200/60 h-9.5 w-9.5 rounded-xl hover:bg-slate-50 mt-auto cursor-pointer shadow-none shrink-0"
            >
              <Download className="w-4 h-4 text-slate-400" />
            </Button>
          </div>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-12 gap-6 select-none">
          
          {/* Main Funnel Chart (7 cols) */}
          <div className="col-span-12 lg:col-span-7 bg-white border border-slate-200/50 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h3 className="text-sm font-bold text-slate-800">Conversation Funnel</h3>
                <p className="text-xs text-slate-400 font-semibold mt-0.5">Conversion journey from start to completion</p>
              </div>
              <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:bg-slate-50 rounded-lg cursor-pointer">
                <Info className="w-4.5 h-4.5" />
              </Button>
            </div>

            <div className="space-y-6 flex-grow flex flex-col justify-around py-2">
              {/* Started */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-bold text-slate-500">
                  <span>Started</span>
                  <span className="text-slate-800 font-extrabold">
                    {currentData.funnel.started.toLocaleString()}{" "}
                    <span className="text-[10px] font-bold text-slate-400 ml-2 uppercase tracking-wide">100%</span>
                  </span>
                </div>
                <div className="h-10 bg-slate-100 rounded-xl overflow-hidden relative">
                  <div
                    className="absolute inset-y-0 left-0 bg-primary opacity-80 rounded-r-xl transition-all duration-700 ease-out"
                    style={{ width: animate ? "100%" : "0%" }}
                  />
                </div>
              </div>

              {/* Engaged */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-bold text-slate-500">
                  <span>Engaged (3+ steps)</span>
                  <span className="text-slate-800 font-extrabold">
                    {currentData.funnel.engaged.toLocaleString()}{" "}
                    <span className="text-[10px] font-bold text-slate-400 ml-2 uppercase tracking-wide">
                      {((currentData.funnel.engaged / currentData.funnel.started) * 100).toFixed(1)}%
                    </span>
                  </span>
                </div>
                <div className="h-10 bg-slate-100 rounded-xl overflow-hidden relative">
                  <div
                    className="absolute inset-y-0 left-0 bg-primary opacity-60 rounded-r-xl transition-all duration-700 ease-out"
                    style={{
                      width: animate
                        ? `${(currentData.funnel.engaged / currentData.funnel.started) * 100}%`
                        : "0%",
                    }}
                  />
                </div>
              </div>

              {/* Completed */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-bold text-slate-500">
                  <span>Completed</span>
                  <span className="text-slate-800 font-extrabold">
                    {currentData.funnel.completed.toLocaleString()}{" "}
                    <span className="text-[10px] font-bold text-slate-400 ml-2 uppercase tracking-wide">
                      {((currentData.funnel.completed / currentData.funnel.started) * 100).toFixed(1)}%
                    </span>
                  </span>
                </div>
                <div className="h-10 bg-slate-100 rounded-xl overflow-hidden relative">
                  <div
                    className="absolute inset-y-0 left-0 bg-primary opacity-40 rounded-r-xl transition-all duration-700 ease-out"
                    style={{
                      width: animate
                        ? `${(currentData.funnel.completed / currentData.funnel.started) * 100}%`
                        : "0%",
                    }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* CSAT Score Gauge (5 cols) */}
          <div className="col-span-12 lg:col-span-5 bg-white border border-slate-200/50 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
            <h3 className="text-sm font-bold text-slate-800 mb-2">CSAT Rating Score</h3>
            
            <div className="flex-grow flex flex-col items-center justify-center py-4">
              <div className="relative w-40 h-40">
                {/* SVG Gauge */}
                <svg className="w-full h-full transform -rotate-90">
                  <circle
                    className="text-slate-100"
                    cx="80"
                    cy="80"
                    fill="transparent"
                    r="66"
                    stroke="currentColor"
                    strokeWidth="8"
                  />
                  <circle
                    className="text-primary transition-all duration-1000 ease-out"
                    cx="80"
                    cy="80"
                    fill="transparent"
                    r="66"
                    stroke="currentColor"
                    strokeDasharray="414.69"
                    strokeDashoffset={animate ? 414.69 * (1 - currentData.csat.score / 5) : 414.69}
                    strokeLinecap="round"
                    strokeWidth="8"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center rotate-90">
                  <span className="text-4xl font-extrabold text-primary leading-none tracking-tight">{currentData.csat.score}</span>
                  <span className="text-[8px] text-slate-400 uppercase font-extrabold tracking-widest mt-1">Out of 5.0</span>
                </div>
              </div>

              <div className="mt-6 flex gap-10 text-center font-bold">
                <div>
                  <p className="text-base text-slate-800 font-extrabold flex items-center gap-1"><Award className="w-4 h-4 text-emerald-500" /> {currentData.csat.positivePercent}%</p>
                  <p className="text-[9px] text-slate-400 uppercase tracking-wider font-extrabold mt-0.5">Positive</p>
                </div>
                <div className="w-[1px] bg-slate-100" />
                <div>
                  <p className="text-base text-slate-800 font-extrabold">{currentData.csat.responsesCount}</p>
                  <p className="text-[9px] text-slate-400 uppercase tracking-wider font-extrabold mt-0.5">Reviews</p>
                </div>
              </div>
            </div>
          </div>

          {/* Response Time Trend (12 cols) */}
          <div className="col-span-12 bg-white border border-slate-200/50 rounded-2xl p-6 shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="text-sm font-bold text-slate-800">Response Latency Trend</h3>
                <p className="text-xs text-slate-400 font-semibold mt-0.5">Average bot response latency over the last 30 days</p>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-slate-400 font-bold select-none">
                <span className="inline-block w-2.5 h-2.5 bg-primary rounded-full" />
                <span>Avg Latency (ms)</span>
              </div>
            </div>

            <div className="h-64 w-full relative pt-4">
              {/* Simulated Chart Grid */}
              <div className="absolute inset-0 border-b border-l border-slate-150 flex flex-col justify-between text-[9px] text-slate-400 pb-6 font-extrabold uppercase">
                <span>400ms</span>
                <span>300ms</span>
                <span>200ms</span>
                <span>100ms</span>
                <span>0ms</span>
              </div>
              
              {/* SVG Path for Latency Line Chart */}
              <svg className="absolute inset-0 w-full h-full pb-6 pl-2" preserveAspectRatio="none" viewBox="0 0 1000 100">
                <path
                  className="text-primary opacity-85 transition-all duration-1000 ease-in-out"
                  d={
                    animate
                      ? `M0,${100 - currentData.latency[0]} ${currentData.latency
                          .map((val, idx) => `L${(idx / (currentData.latency.length - 1)) * 1000},${100 - val}`)
                          .join(" ")}`
                      : `M0,100 L1000,100`
                  }
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                />
                <path
                  className="text-primary opacity-10 transition-all duration-1000 ease-in-out"
                  d={
                    animate
                      ? `M0,${100 - currentData.latency[0]} ${currentData.latency
                          .map((val, idx) => `L${(idx / (currentData.latency.length - 1)) * 1000},${100 - val}`)
                          .join(" ")} L1000,100 L0,100 Z`
                      : "M0,100 L1000,100 L1000,100 L0,100 Z"
                  }
                  fill="currentColor"
                />
              </svg>

              <div className="absolute bottom-0 inset-x-0 flex justify-between px-2 text-[9px] text-slate-400 pt-2 font-bold select-none">
                <span>1 Oct</span>
                <span>7 Oct</span>
                <span>14 Oct</span>
                <span>21 Oct</span>
                <span>28 Oct</span>
              </div>
            </div>
          </div>

          {/* Drop-off by Flow Node (8 cols) */}
          <div className="col-span-12 lg:col-span-8 bg-white border border-slate-200/50 rounded-2xl p-6 shadow-sm">
            <h3 className="text-sm font-bold text-slate-800 mb-6">Drop-off by Flow Node</h3>
            <div className="space-y-4">
              {currentData.dropoff.map((node, i) => (
                <div key={i} className="flex items-center gap-4">
                  <div className="w-40 shrink-0 text-xs font-bold text-slate-600 truncate">{node.nodeName}</div>
                  <div className="flex-grow h-8 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-rose-500/35 rounded-r-full transition-all duration-1000 ease-out"
                      style={{ width: animate ? `${node.percent}%` : "0%" }}
                    />
                  </div>
                  <div className="w-12 text-right text-xs font-bold text-slate-850">{node.percent}%</div>
                </div>
              ))}
            </div>
          </div>

          {/* Channel Distribution (4 cols) */}
          <div className="col-span-12 lg:col-span-4 bg-white border border-slate-200/50 rounded-2xl p-6 shadow-sm">
            <h3 className="text-sm font-bold text-slate-800 mb-6">Channel Distribution</h3>
            <div className="flex flex-col items-center">
              <div className="relative w-36 h-36 mb-6">
                {/* SVG Donut */}
                <svg className="w-full h-full transform -rotate-90">
                  {currentData.distribution.map((dist, idx) => (
                    <circle
                      key={idx}
                      cx="72"
                      cy="72"
                      fill="transparent"
                      r="54"
                      className={
                        dist.name === "WhatsApp"
                          ? "text-primary"
                          : dist.name === "Web Messenger" || dist.name === "Web Widget"
                          ? "text-indigo-500"
                          : dist.name === "Telegram"
                          ? "text-violet-300"
                          : "text-slate-200"
                      }
                      stroke="currentColor"
                      strokeDasharray="339.29"
                      strokeDashoffset={animate ? 339.29 * (1 - dist.percent / 100) : 339.29}
                      strokeWidth="16"
                      style={{
                        transformOrigin: "center",
                        transform: `rotate(${dist.offset * 1.05}deg)`,
                      }}
                    />
                  ))}
                </svg>
              </div>
              <div className="w-full space-y-1.5 font-semibold">
                {currentData.distribution.map((dist, idx) => (
                  <div key={idx} className="flex justify-between items-center px-3.5 py-2 bg-slate-50 border border-slate-100 rounded-xl text-xs">
                    <div className="flex items-center gap-2 select-none">
                      <span
                        className={`w-2 h-2 rounded-full inline-block ${
                          dist.name === "WhatsApp"
                            ? "bg-primary"
                            : dist.name === "Web Messenger" || dist.name === "Web Widget"
                            ? "bg-indigo-500"
                            : dist.name === "Telegram"
                            ? "bg-violet-300"
                            : "bg-slate-200"
                        }`}
                      />
                      <span className="text-slate-500">{dist.name}</span>
                    </div>
                    <span className="font-extrabold text-slate-700">{dist.percent}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
