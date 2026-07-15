"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  GitFork,
  ChevronDown,
  Check,
  ArrowRight,
  Chrome,
  MessageSquare,
  MessageCircle,
  Send,
  UserSearch,
  ShoppingCart,
  Calendar,
  Building,
  UserCheck,
  PlusCircle,
  AlertTriangle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "https://flow-bot-d075.onrender.com";

// Default template node definitions to seed on complete
const TEMPLATES: Record<string, { name: string; definition: any }> = {
  leadgen: {
    name: "LeadGenBot",
    definition: {
      startNode: "n1",
      nodes: {
        n1: { type: "message", text: "Hi! Welcome to FlowBot. What is your name? 👋", next: "n2" },
        n2: { type: "question", saveTo: "name", next: "n3" },
        n3: { type: "message", text: "Nice to meet you, {{name}}! What is your email?", next: "n4" },
        n4: { type: "question", saveTo: "email", validation: "email", next: "n5" },
        n5: { type: "message", text: "Thanks {{name}}, we will be in touch at {{email}}! Have a great day.", next: null }
      }
    }
  },
  ecommerce: {
    name: "EcommerceBot",
    definition: {
      startNode: "n1",
      nodes: {
        n1: { type: "message", text: "Welcome! Are you looking for product recommendations? (Yes/No)", next: "n2" },
        n2: { type: "question", saveTo: "interest", next: "n3" },
        n3: { type: "message", text: "Great! Let us know your email to send the recommendation code.", next: "n4" },
        n4: { type: "question", saveTo: "email", validation: "email", next: "n5" },
        n5: { type: "message", text: "All set. Check your inbox for product details!", next: null }
      }
    }
  },
  appointment: {
    name: "AppointmentBot",
    definition: {
      startNode: "n1",
      nodes: {
        n1: { type: "message", text: "Hello! What date would you like to schedule your clinic visit? (e.g. Monday)", next: "n2" },
        n2: { type: "question", saveTo: "appointmentDate", next: "n3" },
        n3: { type: "message", text: "Please enter your email to confirm the booking.", next: "n4" },
        n4: { type: "question", saveTo: "email", validation: "email", next: "n5" },
        n5: { type: "message", text: "Appointment scheduled! We sent a confirmation to {{email}}.", next: null }
      }
    }
  },
  gov: {
    name: "SmartGovBot",
    definition: {
      startNode: "n1",
      nodes: {
        n1: { type: "message", text: "Welcome to Citizen Services. Please state your inquiry.", next: "n2" },
        n2: { type: "question", saveTo: "inquiry", next: "n3" },
        n3: { type: "message", text: "Thank you. Please enter your email so we can file ticket reference.", next: "n4" },
        n4: { type: "question", saveTo: "email", validation: "email", next: "n5" },
        n5: { type: "message", text: "Your ticket has been logged. An official will reply to {{email}}.", next: null }
      }
    }
  },
  desk: {
    name: "VirtualDeskBot",
    definition: {
      startNode: "n1",
      nodes: {
        n1: { type: "message", text: "Hi, Tier-1 support desk here. What error code are you seeing?", next: "n2" },
        n2: { type: "question", saveTo: "errorCode", next: "n3" },
        n3: { type: "message", text: "Got it. Enter your email for helpdesk notifications.", next: "n4" },
        n4: { type: "question", saveTo: "email", validation: "email", next: "n5" },
        n5: { type: "message", text: "Our engineering team has been notified. Troubleshooting steps sent to {{email}}.", next: null }
      }
    }
  },
  scratch: {
    name: "Blank Canvas Bot",
    definition: {
      startNode: "n1",
      nodes: {
        n1: { type: "message", text: "Hello! This is a blank starting bot.", next: null }
      }
    }
  }
};

export default function LoginPage() {
  const router = useRouter();
  const [view, setView] = useState<"login" | "signup" | "onboarding">("login");
  const [onboardingStep, setOnboardingStep] = useState(1);
  const [selectedChannel, setSelectedChannel] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Input states
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [companyName, setCompanyName] = useState("");

  // Onboarding Step 1 details
  const [businessName, setBusinessName] = useState("");
  const [industry, setIndustry] = useState("SaaS & Technology");
  const [websiteUrl, setWebsiteUrl] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Invalid credentials");

      // Save token & org ID
      localStorage.setItem("flowbot_token", data.access_token);
      localStorage.setItem("flowbot_org_id", data.organizationId);

      // Direct to dashboard (since account is already set up)
      router.push("/dashboard");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch(`${API_BASE}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ organizationName: companyName, email, password }),
      });

      const data = await res.json();
      if (!res.ok || data.error) throw new Error(data.message || "Registration failed");

      // Save token & org ID
      localStorage.setItem("flowbot_token", data.access_token);
      localStorage.setItem("flowbot_org_id", data.organizationId);
      
      // Default step 1 business name to company name
      setBusinessName(companyName);

      // Direct to onboarding wizard
      setView("onboarding");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const finishOnboarding = async () => {
    setLoading(true);
    setError("");

    const token = localStorage.getItem("flowbot_token");
    if (!token) {
      setError("Session expired. Please log in again.");
      setView("login");
      setLoading(false);
      return;
    }

    try {
      const template = TEMPLATES[selectedTemplate];
      if (!template) throw new Error("Please select a template");

      // Create flow in DB
      const res = await fetch(`${API_BASE}/flows`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: template.name,
          definition: template.definition,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to create flow");

      // Publish the newly created flow
      const publishRes = await fetch(`${API_BASE}/flows/${data.id}/publish`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!publishRes.ok) throw new Error("Failed to publish starter flow");

      // Save onboarding metrics locally if needed
      localStorage.setItem("flowbot_industry", industry);
      localStorage.setItem("flowbot_website", websiteUrl);
      localStorage.setItem("flowbot_channel", selectedChannel);

      router.push("/dashboard");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="gradient-mesh min-h-screen flex items-center justify-center p-6 bg-slate-50/50">
      <style jsx global>{`
        .gradient-mesh {
          background-color: #FAF9F6;
          background-image: radial-gradient(at 0% 0%, hsla(243, 75%, 59%, 0.05) 0, transparent 50%), 
                            radial-gradient(at 50% 0%, hsla(243, 75%, 59%, 0.03) 0, transparent 50%),
                            radial-gradient(at 100% 0%, hsla(243, 75%, 59%, 0.05) 0, transparent 50%);
        }
      `}</style>

      {/* Error Toast / Banner */}
      {error && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[100] max-w-[400px] w-[90vw] bg-red-50 border border-red-200 rounded-xl p-4 shadow-lg flex items-start gap-3 animate-fade-in">
          <AlertTriangle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
          <div className="flex-grow min-w-0">
            <h4 className="text-xs font-bold text-red-800">Error</h4>
            <p className="text-xs text-red-700 mt-1 font-medium leading-relaxed">{error}</p>
          </div>
          <button className="text-red-500 hover:text-red-700 text-xs font-bold shrink-0" onClick={() => setError("")}>
            Dismiss
          </button>
        </div>
      )}

      {view === "login" && (
        <div className="bg-white border border-slate-200/50 w-full max-w-[420px] rounded-2xl shadow-xl shadow-slate-100/40 p-8 relative overflow-hidden" id="login-card">
          <div className="flex justify-center mb-8 select-none">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center border border-primary/20 text-primary">
                <GitFork className="w-5 h-5 text-primary rotate-90" />
              </div>
              <span className="text-xl font-extrabold text-slate-800 tracking-tight leading-none">FlowBot</span>
            </div>
          </div>

          <div className="space-y-4">
            <h1 className="text-sm font-extrabold text-slate-700 text-center font-sans uppercase tracking-widest select-none font-semibold">Welcome back</h1>
                      <Button variant="outline" className="w-full flex items-center justify-center gap-2 bg-white border border-slate-200 py-5 rounded-xl hover:bg-slate-55 transition-colors cursor-pointer shadow-none">
              <img
                alt="Google Logo"
                className="w-4 h-4 shrink-0 object-contain"
                src="https://www.vectorlogo.zone/logos/google/google-icon.svg"
              />
              <span className="text-xs font-bold text-slate-700">Continue with Google</span>
            </Button>
            
            <div className="relative flex items-center py-2 select-none">
              <div className="flex-grow border-t border-slate-150"></div>
              <span className="flex-shrink mx-4 text-slate-400 text-[10px] font-extrabold uppercase tracking-wider">or</span>
              <div className="flex-grow border-t border-slate-150"></div>
            </div>
            
            <form className="space-y-4 font-semibold" onSubmit={handleLogin}>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 block">Email address</label>
                <Input
                  className="w-full bg-slate-50 border border-slate-200/50 rounded-xl px-4 py-2 text-xs focus-visible:bg-white transition-all h-10 font-medium"
                  placeholder="name@company.com"
                  required
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="space-y-1.5">
                <div className="flex justify-between">
                  <label className="text-xs font-bold text-slate-700 block">Password</label>
                  <a className="text-xs font-bold text-primary hover:underline" href="#">
                    Forgot?
                  </a>
                </div>
                <Input
                  className="w-full bg-slate-50 border border-slate-200/50 rounded-xl px-4 py-2 text-xs focus-visible:bg-white transition-all h-10 font-medium"
                  placeholder="••••••••"
                  required
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <Button
                className="w-full bg-primary hover:opacity-90 text-on-primary py-5 rounded-xl font-bold transition-all cursor-pointer shadow-md shadow-primary/10 text-xs"
                type="submit"
                disabled={loading}
              >
                {loading ? "Signing in..." : "Sign in"}
              </Button>
            </form>
            <p className="text-center text-xs text-slate-400 mt-6 select-none font-semibold">
              Don&apos;t have an account?{" "}
              <button className="text-primary font-bold hover:underline cursor-pointer" onClick={() => setView("signup")}>
                Sign up
              </button>
            </p>
          </div>
        </div>
      )}

      {view === "signup" && (
        <div className="bg-white border border-slate-200/50 w-full max-w-[420px] rounded-2xl shadow-xl shadow-slate-100/40 p-8 relative overflow-hidden" id="signup-card">
          <div className="flex justify-center mb-8 select-none">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center border border-primary/20 text-primary">
                <GitFork className="w-5 h-5 text-primary rotate-90" />
              </div>
              <span className="text-xl font-extrabold text-slate-800 tracking-tight leading-none">FlowBot</span>
            </div>
          </div>

          <div className="space-y-4">
            <h1 className="text-sm font-extrabold text-slate-700 text-center font-sans uppercase tracking-widest select-none font-semibold">Create your account</h1>
            
            <Button variant="outline" className="w-full flex items-center justify-center gap-2 bg-white border border-slate-200 py-5 rounded-xl hover:bg-slate-55 transition-colors cursor-pointer shadow-none">
              <img
                alt="Google Logo"
                className="w-4 h-4 shrink-0 object-contain"
                src="https://www.vectorlogo.zone/logos/google/google-icon.svg"
              />
              <span className="text-xs font-bold text-slate-700">Sign up with Google</span>
            </Button>
            
            <div className="relative flex items-center py-2 select-none">
              <div className="flex-grow border-t border-slate-150"></div>
              <span className="flex-shrink mx-4 text-slate-400 text-[10px] font-extrabold uppercase tracking-wider">or</span>
              <div className="flex-grow border-t border-slate-150"></div>
            </div>
            
            <form className="space-y-4 font-semibold" onSubmit={handleSignUp}>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 block">Company Name</label>
                <Input
                  className="w-full bg-slate-50 border border-slate-200/50 rounded-xl px-4 py-2 text-xs focus-visible:bg-white transition-all h-10 font-medium"
                  placeholder="Acme Inc."
                  required
                  type="text"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 block">Email address</label>
                <Input
                  className="w-full bg-slate-50 border border-slate-200/50 rounded-xl px-4 py-2 text-xs focus-visible:bg-white transition-all h-10 font-medium"
                  placeholder="name@company.com"
                  required
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 block">Password</label>
                <Input
                  className="w-full bg-slate-50 border border-slate-200/50 rounded-xl px-4 py-2 text-xs focus-visible:bg-white transition-all h-10 font-medium"
                  placeholder="••••••••"
                  required
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <Button
                className="w-full bg-primary hover:opacity-90 text-on-primary py-5 rounded-xl font-bold transition-all cursor-pointer shadow-md shadow-primary/10 text-xs"
                type="submit"
                disabled={loading}
              >
                {loading ? "Creating Account..." : "Create Account"}
              </Button>
            </form>
            <p className="text-center text-xs text-slate-400 mt-6 select-none font-semibold">
              Already have an account?{" "}
              <button className="text-primary font-bold hover:underline cursor-pointer" onClick={() => setView("login")}>
                Sign in
              </button>
            </p>
          </div>
        </div>
      )}

      {view === "onboarding" && (
        <div className="w-full max-w-[800px] flex flex-col items-center">
          {/* Progress Stepper */}
          <div className="w-full max-w-[600px] mt-8 px-6 mb-8 select-none">
            <div className="flex items-center justify-between relative">
              <div className="absolute top-1/2 left-0 right-0 h-[2px] bg-slate-200 -z-10 -translate-y-1/2"></div>
              
              {/* Step 1 Indicator */}
              <div className="flex flex-col items-center gap-2 bg-slate-50/50 px-3">
                <div
                  className={`w-9 h-9 rounded-full flex items-center justify-center font-bold ring-4 ring-slate-50 transition-all text-xs ${
                    onboardingStep >= 1 ? "bg-primary text-on-primary shadow-md shadow-primary/10" : "bg-slate-200 text-slate-400"
                  }`}
                >
                  {onboardingStep > 1 ? <Check className="w-4 h-4" /> : 1}
                </div>
                <span className="text-[10px] font-extrabold text-slate-550 uppercase tracking-wider">Business</span>
              </div>
              
              {/* Step 2 Indicator */}
              <div className="flex flex-col items-center gap-2 bg-slate-50/50 px-3">
                <div
                  className={`w-9 h-9 rounded-full flex items-center justify-center font-bold ring-4 ring-slate-50 transition-all text-xs ${
                    onboardingStep >= 2 ? "bg-primary text-on-primary shadow-md shadow-primary/10" : "bg-slate-200 text-slate-400"
                  }`}
                >
                  {onboardingStep > 2 ? <Check className="w-4 h-4" /> : 2}
                </div>
                <span className={`text-[10px] uppercase tracking-wider ${onboardingStep >= 2 ? "font-extrabold text-slate-550" : "font-semibold text-slate-400"}`}>
                  Channels
                </span>
              </div>
              
              {/* Step 3 Indicator */}
              <div className="flex flex-col items-center gap-2 bg-slate-50/50 px-3">
                <div
                  className={`w-9 h-9 rounded-full flex items-center justify-center font-bold ring-4 ring-slate-50 transition-all text-xs ${
                    onboardingStep >= 3 ? "bg-primary text-on-primary shadow-md shadow-primary/10" : "bg-slate-200 text-slate-400"
                  }`}
                >
                  3
                </div>
                <span className={`text-[10px] uppercase tracking-wider ${onboardingStep >= 3 ? "font-extrabold text-slate-550" : "font-semibold text-slate-400"}`}>
                  Templates
                </span>
              </div>
            </div>
          </div>

          {/* Onboarding Step 1 */}
          {onboardingStep === 1 && (
            <div className="w-full max-w-[500px] px-6">
              <div className="bg-white border border-slate-200/50 rounded-2xl p-8 shadow-xl shadow-slate-100/40 space-y-6">
                <div className="text-center select-none">
                  <h2 className="text-lg font-extrabold text-slate-800 uppercase tracking-wider">What&apos;s your business?</h2>
                  <p className="text-xs text-slate-400 font-semibold mt-2">Help us tailor FlowBot to your specific needs.</p>
                </div>
                <form className="space-y-4 font-semibold" onSubmit={(e) => { e.preventDefault(); setOnboardingStep(2); }}>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 block">Business Name</label>
                    <Input
                      className="w-full bg-slate-50 border border-slate-200/50 rounded-xl px-4 py-2 text-xs focus-visible:bg-white h-10 font-medium"
                      placeholder="Acme Corp"
                      required
                      type="text"
                      value={businessName}
                      onChange={(e) => setBusinessName(e.target.value)}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 block">Industry</label>
                    <div className="relative">
                      <select
                        className="w-full bg-slate-50 border border-slate-200/50 rounded-xl px-4 py-2 text-xs focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary cursor-pointer font-bold text-slate-700 h-10 appearance-none"
                        value={industry}
                        onChange={(e) => setIndustry(e.target.value)}
                      >
                        <option>SaaS & Technology</option>
                        <option>Ecommerce & Retail</option>
                        <option>Real Estate</option>
                        <option>Healthcare</option>
                        <option>Government & Public Service</option>
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 w-4 h-4" />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 block">Website URL</label>
                    <Input
                      className="w-full bg-slate-50 border border-slate-200/50 rounded-xl px-4 py-2 text-xs focus-visible:bg-white h-10 font-medium"
                      placeholder="https://example.com"
                      type="url"
                      value={websiteUrl}
                      onChange={(e) => setWebsiteUrl(e.target.value)}
                    />
                  </div>
                  <Button
                    className="w-full bg-primary hover:opacity-90 text-on-primary py-5 rounded-xl font-bold transition-all cursor-pointer shadow-md shadow-primary/10 flex items-center justify-center gap-1.5 text-xs select-none mt-2"
                    type="submit"
                  >
                    Next Step
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </form>
              </div>
            </div>
          )}

          {/* Onboarding Step 2 */}
          {onboardingStep === 2 && (
            <div className="w-full max-w-[680px] px-6 animate-fade-in">
              <div className="bg-white border border-slate-200/50 rounded-2xl p-8 shadow-xl shadow-slate-100/40 space-y-6">
                <div className="text-center select-none">
                  <h2 className="text-lg font-extrabold text-slate-800 uppercase tracking-wider">Choose your first channel</h2>
                  <p className="text-xs text-slate-400 font-semibold mt-2">Where will your FlowBot interact with customers?</p>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* WhatsApp */}
                  <div
                    className={`border p-4 rounded-2xl cursor-pointer hover:bg-slate-50/50 transition-all flex items-center gap-4 group ${
                      selectedChannel === "whatsapp" ? "border-primary bg-primary/[0.02] shadow-sm" : "border-slate-200/60"
                    }`}
                    onClick={() => setSelectedChannel("whatsapp")}
                  >
                    <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-[#25D366] shrink-0 shadow-sm">
                      <MessageSquare className="w-5 h-5 text-emerald-600" />
                    </div>
                    <div>
                      <p className="font-bold text-xs text-slate-800">WhatsApp</p>
                      <p className="text-[10px] text-slate-400 font-semibold mt-0.5">Direct messaging API</p>
                    </div>
                    <div className={`ml-auto shrink-0 select-none ${selectedChannel === "whatsapp" ? "opacity-100" : "opacity-0"}`}>
                      <Check className="w-4.5 h-4.5 text-primary" />
                    </div>
                  </div>

                  {/* Website Widget */}
                  <div
                    className={`border p-4 rounded-2xl cursor-pointer hover:bg-slate-50/50 transition-all flex items-center gap-4 group ${
                      selectedChannel === "widget" ? "border-primary bg-primary/[0.02] shadow-sm" : "border-slate-200/60"
                    }`}
                    onClick={() => setSelectedChannel("widget")}
                  >
                    <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shrink-0 shadow-sm">
                      <Chrome className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-bold text-xs text-slate-800">Website Widget</p>
                      <p className="text-[10px] text-slate-400 font-semibold mt-0.5">Embedded on your site</p>
                    </div>
                    <div className={`ml-auto shrink-0 select-none ${selectedChannel === "widget" ? "opacity-100" : "opacity-0"}`}>
                      <Check className="w-4.5 h-4.5 text-primary" />
                    </div>
                  </div>

                  {/* Messenger */}
                  <div
                    className={`border p-4 rounded-2xl cursor-pointer hover:bg-slate-50/50 transition-all flex items-center gap-4 group ${
                      selectedChannel === "messenger" ? "border-primary bg-primary/[0.02] shadow-sm" : "border-slate-200/60"
                    }`}
                    onClick={() => setSelectedChannel("messenger")}
                  >
                    <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-[#0084FF] shrink-0 shadow-sm">
                      <MessageCircle className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-bold text-xs text-slate-800">Messenger</p>
                      <p className="text-[10px] text-slate-400 font-semibold mt-0.5">Facebook Business</p>
                    </div>
                    <div className={`ml-auto shrink-0 select-none ${selectedChannel === "messenger" ? "opacity-100" : "opacity-0"}`}>
                      <Check className="w-4.5 h-4.5 text-primary" />
                    </div>
                  </div>

                  {/* Telegram */}
                  <div
                    className={`border p-4 rounded-2xl cursor-pointer hover:bg-slate-50/50 transition-all flex items-center gap-4 group ${
                      selectedChannel === "telegram" ? "border-primary bg-primary/[0.02] shadow-sm" : "border-slate-200/60"
                    }`}
                    onClick={() => setSelectedChannel("telegram")}
                  >
                    <div className="w-10 h-10 rounded-xl bg-sky-50 border border-sky-100 flex items-center justify-center text-[#229ED9] shrink-0 shadow-sm">
                      <Send className="w-5 h-5 text-sky-600" />
                    </div>
                    <div>
                      <p className="font-bold text-xs text-slate-800">Telegram</p>
                      <p className="text-[10px] text-slate-400 font-semibold mt-0.5">Public bot API</p>
                    </div>
                    <div className={`ml-auto shrink-0 select-none ${selectedChannel === "telegram" ? "opacity-100" : "opacity-0"}`}>
                      <Check className="w-4.5 h-4.5 text-primary" />
                    </div>
                  </div>
                </div>

                <div className="flex gap-4 pt-4 select-none">
                  <Button
                    variant="outline"
                    className="flex-1 border border-slate-200 hover:bg-slate-50 py-5 rounded-xl font-bold cursor-pointer h-9 shadow-none text-slate-700 text-xs"
                    onClick={() => setOnboardingStep(1)}
                  >
                    Back
                  </Button>
                  <Button
                    className="flex-1 bg-primary text-on-primary py-5 rounded-xl font-bold hover:opacity-90 active:scale-[0.98] transition-all cursor-pointer h-9 shadow-md shadow-primary/10 text-xs"
                    onClick={() => setOnboardingStep(3)}
                    disabled={!selectedChannel}
                  >
                    Continue
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Onboarding Step 3 */}
          {onboardingStep === 3 && (
            <div className="w-full max-w-[840px] px-6 animate-fade-in">
              <div className="bg-white border border-slate-200/50 rounded-2xl p-8 shadow-xl shadow-slate-100/40 space-y-6">
                <div className="text-center select-none">
                  <h2 className="text-lg font-extrabold text-slate-800 uppercase tracking-wider">Pick a starting template</h2>
                  <p className="text-xs text-slate-400 font-semibold mt-2">Templates help you go live in minutes, not hours.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {/* Template Card: LeadGenBot */}
                  <div
                    className={`flex flex-col border rounded-2xl overflow-hidden hover:shadow-lg transition-all cursor-pointer bg-slate-50/50 group ${
                      selectedTemplate === "leadgen" ? "border-primary bg-primary/[0.02] shadow-sm" : "border-slate-200/60"
                    }`}
                    onClick={() => setSelectedTemplate("leadgen")}
                  >
                    <div className="h-28 bg-primary/[0.03] flex items-center justify-center relative select-none">
                      <UserSearch className="text-primary w-10 h-10" />
                    </div>
                    <div className="p-4 bg-white border-t border-slate-100 flex-grow">
                      <h4 className="font-bold text-xs text-slate-800">LeadGenBot</h4>
                      <p className="text-[10px] text-slate-400 mt-1 font-semibold leading-relaxed">Qualify leads and book meetings automatically.</p>
                    </div>
                  </div>

                  {/* Template Card: EcommerceBot */}
                  <div
                    className={`flex flex-col border rounded-2xl overflow-hidden hover:shadow-lg transition-all cursor-pointer bg-slate-50/50 group ${
                      selectedTemplate === "ecommerce" ? "border-primary bg-primary/[0.02] shadow-sm" : "border-slate-200/60"
                    }`}
                    onClick={() => setSelectedTemplate("ecommerce")}
                  >
                    <div className="h-28 bg-amber-500/[0.03] flex items-center justify-center relative select-none">
                      <ShoppingCart className="text-amber-500 w-10 h-10" />
                    </div>
                    <div className="p-4 bg-white border-t border-slate-100 flex-grow">
                      <h4 className="font-bold text-xs text-slate-800">EcommerceBot</h4>
                      <p className="text-[10px] text-slate-400 mt-1 font-semibold leading-relaxed">Product recommendations and order tracking.</p>
                    </div>
                  </div>

                  {/* Template Card: AppointmentBot */}
                  <div
                    className={`flex flex-col border rounded-2xl overflow-hidden hover:shadow-lg transition-all cursor-pointer bg-slate-50/50 group ${
                      selectedTemplate === "appointment" ? "border-primary bg-primary/[0.02] shadow-sm" : "border-slate-200/60"
                    }`}
                    onClick={() => setSelectedTemplate("appointment")}
                  >
                    <div className="h-28 bg-emerald-500/[0.03] flex items-center justify-center relative select-none">
                      <Calendar className="text-emerald-555 w-10 h-10" />
                    </div>
                    <div className="p-4 bg-white border-t border-slate-100 flex-grow">
                      <h4 className="font-bold text-xs text-slate-800">AppointmentBot</h4>
                      <p className="text-[10px] text-slate-400 mt-1 font-semibold leading-relaxed">Schedule visits for your office or clinic.</p>
                    </div>
                  </div>

                  {/* Template Card: SmartGovBot */}
                  <div
                    className={`flex flex-col border rounded-2xl overflow-hidden hover:shadow-lg transition-all cursor-pointer bg-slate-50/50 group ${
                      selectedTemplate === "gov" ? "border-primary bg-primary/[0.02] shadow-sm" : "border-slate-200/60"
                    }`}
                    onClick={() => setSelectedTemplate("gov")}
                  >
                    <div className="h-28 bg-blue-500/[0.03] flex items-center justify-center relative select-none">
                      <Building className="text-blue-600 w-10 h-10" />
                    </div>
                    <div className="p-4 bg-white border-t border-slate-100 flex-grow">
                      <h4 className="font-bold text-xs text-slate-800">SmartGovBot</h4>
                      <p className="text-[10px] text-slate-400 mt-1 font-semibold leading-relaxed">Citizen service and official form collection.</p>
                    </div>
                  </div>

                  {/* Template Card: VirtualDeskBot */}
                  <div
                    className={`flex flex-col border rounded-2xl overflow-hidden hover:shadow-lg transition-all cursor-pointer bg-slate-50/50 group ${
                      selectedTemplate === "desk" ? "border-primary bg-primary/[0.02] shadow-sm" : "border-slate-200/60"
                    }`}
                    onClick={() => setSelectedTemplate("desk")}
                  >
                    <div className="h-28 bg-rose-500/[0.03] flex items-center justify-center relative select-none">
                      <UserCheck className="text-rose-600 w-10 h-10" />
                    </div>
                    <div className="p-4 bg-white border-t border-slate-100 flex-grow">
                      <h4 className="font-bold text-xs text-slate-800">VirtualDeskBot</h4>
                      <p className="text-[10px] text-slate-400 mt-1 font-semibold leading-relaxed">Automated Tier-1 support and FAQ resolver.</p>
                    </div>
                  </div>

                  {/* Blank Template */}
                  <div
                    className={`flex flex-col border border-dashed rounded-2xl overflow-hidden hover:bg-slate-50/50 transition-all cursor-pointer group ${
                      selectedTemplate === "scratch" ? "border-primary bg-primary/[0.02] shadow-sm" : "border-slate-200"
                    }`}
                    onClick={() => setSelectedTemplate("scratch")}
                  >
                    <div className="h-full flex flex-col items-center justify-center p-4 text-center select-none min-h-[148px]">
                      <PlusCircle className="text-slate-400 w-9 h-9 group-hover:text-primary transition-colors" />
                      <h4 className="font-bold text-xs text-slate-800 mt-2">Start from scratch</h4>
                      <p className="text-[10px] text-slate-400 mt-1 font-semibold leading-relaxed">A blank canvas for custom logic.</p>
                    </div>
                  </div>
                </div>

                <div className="flex gap-4 pt-4 select-none animate-fade-in">
                  <Button
                    variant="outline"
                    className="flex-1 border border-slate-200 hover:bg-slate-50 py-5 rounded-xl font-bold cursor-pointer h-9 shadow-none text-slate-700 text-xs"
                    onClick={() => setOnboardingStep(2)}
                  >
                    Back
                  </Button>
                  <Button
                    className="flex-1 bg-primary text-on-primary py-5 rounded-xl font-bold hover:opacity-90 active:scale-[0.98] transition-all cursor-pointer h-9 shadow-md shadow-primary/10 text-xs"
                    onClick={finishOnboarding}
                    disabled={!selectedTemplate || loading}
                  >
                    {loading ? "Seeding templates..." : "Complete Setup"}
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
