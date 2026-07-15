"use client";

import { useState } from "react";
import Header from "../../components/Header";
import {
  Chrome,
  MessageCircle,
  Send,
  Smartphone,
  MessageSquare,
  Plus,
  X,
  Settings,
  UploadCloud,
  Copy,
  Bot
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";


interface Channel {
  id: string;
  name: string;
  icon: any;
  bgColor: string;
  textColor: string;
  connected: boolean;
  description: string;
  actionText: string;
  fullWidth?: boolean;
}

export default function ChannelsPage() {
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [brandColor, setBrandColor] = useState("#4F46E5");
  const [welcomeText, setWelcomeText] = useState(
    "Hi! I'm FlowBot. How can I help you automate your business today? 👋"
  );
  const [position, setPosition] = useState<"right" | "left">("right");

  const [channels, setChannels] = useState<Channel[]>([
    {
      id: "website",
      name: "Website Widget",
      icon: Chrome,
      bgColor: "bg-primary/10",
      textColor: "text-primary border-primary/20",
      connected: true,
      description:
        "Engage visitors directly on your site with a sleek, customizable chat interface. Perfect for lead generation and support.",
      actionText: "Configure",
      fullWidth: true,
    },
    {
      id: "whatsapp",
      name: "WhatsApp Business",
      icon: MessageSquare,
      bgColor: "bg-emerald-50",
      textColor: "text-emerald-600 border-emerald-100",
      connected: true,
      description: "Direct communication on the world's most popular messaging app via Official API.",
      actionText: "Configure",
    },
    {
      id: "messenger",
      name: "Messenger",
      icon: MessageCircle,
      bgColor: "bg-blue-50",
      textColor: "text-blue-600 border-blue-100",
      connected: false,
      description: "Automate responses for your Facebook Page visitors and convert social traffic.",
      actionText: "Connect",
    },
    {
      id: "telegram",
      name: "Telegram",
      icon: Send,
      bgColor: "bg-sky-50",
      textColor: "text-sky-600 border-sky-100",
      connected: true,
      description: "Deploy powerful bots for Telegram groups or private chats with ease.",
      actionText: "Configure",
    },
    {
      id: "sms",
      name: "SMS (Twilio)",
      icon: Smartphone,
      bgColor: "bg-amber-50",
      textColor: "text-amber-600 border-amber-100",
      connected: false,
      description: "Reach customers globally with high-delivery SMS automation for alerts and sales.",
      actionText: "Connect",
    },
  ]);

  const handleCopyCode = () => {
    const orgId = localStorage.getItem("flowbot_org_id") || "demo-token-123";
    const code = `<script src="https://cdn.flowbot.ai/widget.js" data-token="${orgId}" data-color="${brandColor}"></script>`;
    navigator.clipboard.writeText(code);
    alert("Embed code copied to clipboard!");
  };

  const handleSave = () => {
    alert("Changes saved successfully!");
    setIsPanelOpen(false);
  };

  return (
    <div className="flex-grow flex flex-col min-h-screen relative overflow-hidden bg-slate-50/50">
      <Header title="Messaging Channels" />

      {/* Main Content Canvas */}
      <main className="flex-grow p-6">
        <div className="max-w-[1100px] mx-auto space-y-6">
          {/* Page Header */}
          <div className="select-none">
            <h2 className="text-xl font-extrabold text-slate-800 tracking-tight">Messaging Channels</h2>
            <p className="text-xs text-slate-400 mt-1.5 font-semibold">
              Connect FlowBot to your customers&apos; favorite platforms to automate conversations.
            </p>
          </div>

          {/* Channels Grid (Bento Style) */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {channels.map((channel) => {
              const Icon = channel.icon;
              if (channel.fullWidth) {
                return (
                  <div
                    key={channel.id}
                    className="col-span-1 md:col-span-2 lg:col-span-3 bg-white border border-slate-200/50 rounded-2xl p-6 flex flex-col md:flex-row gap-6 hover:shadow-lg hover:shadow-slate-100/50 transition-all duration-300 group"
                  >
                    <div className={`w-16 h-16 ${channel.bgColor} rounded-2xl border ${channel.textColor} flex items-center justify-center shrink-0 shadow-sm`}>
                      <Icon className="w-8 h-8" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1.5 select-none">
                        <h3 className="font-bold text-sm text-slate-800">{channel.name}</h3>
                        <Badge className="bg-emerald-50 text-emerald-600 border border-emerald-100 text-[10px] font-bold py-0.5 px-2 flex items-center gap-1 rounded-full h-auto">
                          <span className="w-1.5 h-1.5 bg-emerald-600 rounded-full inline-block" /> Connected
                        </Badge>
                      </div>
                      <p className="text-xs text-slate-500 mb-6 font-medium leading-relaxed max-w-2xl">{channel.description}</p>
                      <div className="flex items-center gap-4 select-none">
                        <Button
                          onClick={() => setIsPanelOpen(true)}
                          className="bg-primary text-on-primary px-4 py-2 rounded-xl text-xs font-bold hover:opacity-90 transition-all flex items-center gap-1.5 cursor-pointer shadow-md shadow-primary/10 h-8"
                        >
                          <Settings className="w-3.5 h-3.5" /> Configure
                        </Button>
                        <Button variant="link" className="text-primary text-xs font-bold hover:underline p-0 h-auto cursor-pointer">
                          View Analytics
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              }

              return (
                <div
                  key={channel.id}
                  className="bg-white border border-slate-200/50 rounded-2xl p-6 hover:shadow-lg hover:shadow-slate-100/50 transition-all duration-300 flex flex-col h-full"
                >
                  <div className="flex items-center justify-between mb-4.5 select-none">
                    <div className={`w-11 h-11 ${channel.bgColor} border ${channel.textColor} rounded-xl flex items-center justify-center shrink-0 shadow-sm`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <Badge
                      variant="outline"
                      className={`px-2.5 py-0.5 text-[9px] font-bold rounded-full select-none h-auto ${
                        channel.connected ? "bg-emerald-50 text-emerald-600 border-emerald-100" : "bg-slate-100 text-slate-500 border-slate-200/40"
                      }`}
                    >
                      {channel.connected ? "Connected" : "Disconnected"}
                    </Badge>
                  </div>
                  <h3 className="font-bold text-xs text-slate-800 mb-1.5">{channel.name}</h3>
                  <p className="text-xs text-slate-500 leading-relaxed font-medium flex-grow mb-6">{channel.description}</p>
                  <Button
                    onClick={() => {
                      if (channel.id === "whatsapp" || channel.id === "telegram") {
                        alert(`Opening ${channel.name} configuration...`);
                      } else {
                        setChannels(
                          channels.map((c) => (c.id === channel.id ? { ...c, connected: true, actionText: "Configure" } : c))
                        );
                      }
                    }}
                    variant={channel.connected ? "outline" : "default"}
                    className={`w-full py-2 rounded-xl text-xs font-bold transition-all h-9 cursor-pointer ${
                      channel.connected
                        ? "border border-slate-200 hover:bg-slate-50 text-slate-700 shadow-none"
                        : "bg-primary text-on-primary hover:opacity-90 shadow-md shadow-primary/10"
                    }`}
                  >
                    {channel.actionText}
                  </Button>
                </div>
              );
            })}

            {/* Custom Integration Card */}
            <div className="bg-white border-2 border-dashed border-slate-200 rounded-2xl p-6 flex flex-col items-center justify-center text-center hover:border-primary/50 transition-all duration-200 cursor-pointer group select-none">
              <div className="w-10 h-10 rounded-full bg-slate-50 border border-slate-250/20 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform text-slate-400 group-hover:text-primary">
                <Plus className="w-5 h-5" />
              </div>
              <p className="font-bold text-xs text-slate-850">Add Custom Channel</p>
              <p className="text-[9px] text-slate-400 mt-1 font-semibold uppercase tracking-wider">Webhooks / API</p>
            </div>
          </div>
        </div>
      </main>

      {/* Sliding Customizer Panel */}
      {isPanelOpen && (
        <>
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 animate-fade-in" onClick={() => setIsPanelOpen(false)} />
          <div className="fixed inset-y-0 right-0 w-full max-w-2xl bg-white shadow-2xl z-50 flex flex-col animate-slide-in">
            {/* Panel Header */}
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-white select-none">
              <div>
                <h3 className="text-sm font-extrabold text-slate-800 leading-tight uppercase tracking-wider">Website Widget Customizer</h3>
                <p className="text-[11px] text-slate-400 mt-1 font-semibold">Customize your chatbot appearance and greetings</p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-slate-400 hover:text-slate-650 rounded-lg cursor-pointer"
                onClick={() => setIsPanelOpen(false)}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>

            {/* Panel Content (Split View) */}
            <div className="flex-grow overflow-y-auto flex flex-col md:flex-row">
              {/* Left Column: Settings Customization inputs */}
              <div className="w-full md:w-1/2 p-6 border-b md:border-b-0 md:border-r border-slate-100 space-y-6">
                <div>
                  <h4 className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest mb-4 select-none">Appearance Settings</h4>
                  <div className="space-y-4">
                    {/* Brand Color */}
                    <div className="space-y-1.5 font-semibold">
                      <label className="block text-xs font-bold text-slate-700">Brand Color</label>
                      <div className="flex items-center gap-2">
                        <div
                          className="w-8 h-8 rounded-lg border border-slate-200/50 shadow-sm shrink-0"
                          style={{ backgroundColor: brandColor }}
                        />
                        <Input
                          className="flex-1 px-3 py-1.5 border border-slate-200/50 rounded-xl font-mono text-xs focus-visible:bg-white h-9"
                          type="text"
                          value={brandColor}
                          onChange={(e) => setBrandColor(e.target.value)}
                        />
                      </div>
                    </div>

                    {/* Logo Mock Upload */}
                    <div className="space-y-1.5 font-semibold">
                      <label className="block text-xs font-bold text-slate-700">Widget Logo</label>
                      <div className="border-2 border-dashed border-slate-200 hover:border-primary/40 rounded-xl p-4 text-center hover:bg-slate-50/50 cursor-pointer transition-colors select-none">
                        <UploadCloud className="w-5 h-5 text-slate-400 mx-auto mb-1.5" />
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Upload Brand Image</p>
                      </div>
                    </div>

                    {/* Position Toggle */}
                    <div className="space-y-1.5 font-semibold">
                      <label className="block text-xs font-bold text-slate-700">Launcher Position</label>
                      <div className="flex bg-slate-100 p-1 rounded-xl select-none">
                        <button
                          onClick={() => setPosition("right")}
                          className={`flex-1 py-1.5 text-[10px] font-bold rounded-lg transition-all cursor-pointer ${
                            position === "right" ? "bg-white shadow-sm text-slate-800" : "text-slate-500 hover:text-slate-800"
                          }`}
                        >
                          Bottom Right
                        </button>
                        <button
                          onClick={() => setPosition("left")}
                          className={`flex-1 py-1.5 text-[10px] font-bold rounded-lg transition-all cursor-pointer ${
                            position === "left" ? "bg-white shadow-sm text-slate-800" : "text-slate-500 hover:text-slate-800"
                          }`}
                        >
                          Bottom Left
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Greeting text configuration */}
                <div className="space-y-2 font-semibold">
                  <h4 className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest select-none">Welcome Message</h4>
                  <Textarea
                    value={welcomeText}
                    onChange={(e) => setWelcomeText(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200/50 rounded-xl text-xs min-h-[90px] resize-none focus-visible:bg-white transition-all font-medium leading-relaxed"
                    placeholder="Hi there! How can we help you today?"
                  />
                </div>

                {/* Installation copy script snippet */}
                <div className="space-y-2 font-semibold select-none">
                  <h4 className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest">Installation</h4>
                  <Button
                    onClick={handleCopyCode}
                    className="w-full bg-slate-900 text-white py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 hover:opacity-95 transition-opacity cursor-pointer h-10 shadow-md"
                  >
                    <Copy className="w-3.5 h-3.5" /> Copy Embed Code
                  </Button>
                </div>
              </div>

              {/* Right Column: Live Mock Preview */}
              <div className="w-full md:w-1/2 bg-slate-50/50 p-6 flex flex-col select-none">
                <h4 className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest mb-3">Live Preview</h4>
                {/* Mock Browser Wrapper */}
                <div className="flex-grow bg-white rounded-2xl border border-slate-200/50 shadow-lg flex flex-col overflow-hidden relative min-h-[300px]">
                  <div className="h-8 bg-slate-50 border-b border-slate-100 flex items-center px-4 gap-1.5">
                    <div className="flex gap-1">
                      <div className="w-1.5 h-1.5 rounded-full bg-rose-500/50" />
                      <div className="w-1.5 h-1.5 rounded-full bg-amber-400/50" />
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-500/50" />
                    </div>
                    <div className="h-4.5 w-36 bg-slate-100 rounded px-2 text-[8px] text-slate-400 flex items-center font-bold">
                      yourwebsite.com
                    </div>
                  </div>
                  <div className="flex-grow relative p-4 overflow-hidden bg-slate-50/20">
                    <div className="w-full h-8 bg-slate-100/60 rounded-lg mb-2" />
                    <div className="w-3/4 h-16 bg-slate-100/60 rounded-lg mb-2" />
                    <div className="w-full h-20 bg-slate-100/60 rounded-lg" />

                    {/* Interactive widget mock */}
                    <div
                      className={`absolute bottom-4 flex flex-col items-end gap-3 transition-all ${
                        position === "right" ? "right-4" : "left-4"
                      }`}
                    >
                      {/* Mock Popover Bubble */}
                      <div className="w-52 bg-white rounded-2xl shadow-xl border border-slate-200/40 overflow-hidden">
                        <div className="p-3 flex items-center gap-2 text-white" style={{ backgroundColor: brandColor }}>
                          <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center shrink-0">
                            <Bot className="w-3.5 h-3.5 text-white" />
                          </div>
                          <div>
                            <p className="text-[9px] font-bold leading-none">FlowBot</p>
                            <p className="text-[8px] opacity-80 mt-0.5 font-semibold">Online</p>
                          </div>
                        </div>
                        <div className="p-3 h-24 bg-slate-50/25 overflow-y-auto">
                          <div className="flex gap-1.5 items-start">
                            <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5 text-primary">
                              <Bot className="w-3 h-3" />
                            </div>
                            <div className="bg-white border border-slate-200/50 p-2.5 rounded-tr-xl rounded-br-xl rounded-bl-xl text-[9px] leading-relaxed text-slate-700 font-medium">
                              {welcomeText}
                            </div>
                          </div>
                        </div>
                        <div className="p-2 border-t border-slate-100 flex items-center gap-1 bg-white">
                          <input
                            disabled
                            className="flex-grow bg-transparent border-none text-[9px] p-0 focus:ring-0 outline-none text-slate-700"
                            placeholder="Type a message..."
                            type="text"
                          />
                          <Send className="w-3 h-3" style={{ color: brandColor }} />
                        </div>
                      </div>
                      {/* Launcher Bubble */}
                      <div
                        className="w-10 h-10 rounded-full shadow-md flex items-center justify-center text-white cursor-pointer hover:scale-[1.03] transition-transform"
                        style={{ backgroundColor: brandColor }}
                      >
                        <MessageSquare className="w-4 h-4" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Panel Footer */}
            <div className="p-5 border-t border-slate-100 flex justify-end gap-3 shrink-0 bg-white select-none">
              <Button
                variant="outline"
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-500 border-slate-200 hover:bg-slate-50 cursor-pointer h-9 shadow-none"
                onClick={() => setIsPanelOpen(false)}
              >
                Cancel
              </Button>
              <Button
                onClick={handleSave}
                className="px-5 py-2 rounded-xl text-xs font-bold bg-primary text-on-primary shadow-md shadow-primary/10 hover:opacity-90 transition-opacity cursor-pointer h-9"
              >
                Save Changes
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
