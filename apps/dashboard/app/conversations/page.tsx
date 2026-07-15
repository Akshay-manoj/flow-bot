"use client";

import { useState } from "react";
import Header from "../../components/Header";
import {
  Search,
  MessageSquare,
  Bot,
  User,
  Plus,
  Phone,
  Mail,
  MoreHorizontal,
  Globe,
  PlusCircle,
  Activity,
  CreditCard,
  Send,
  Smile,
  Paperclip,
  Shield,
  ShieldAlert,
  MapPin,
  Calendar,
  ArrowLeft,
  Info
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";


interface Message {
  sender: "bot" | "user" | "agent" | "system";
  text: string;
  time: string;
}

interface Contact {
  id: string;
  name: string;
  avatar: string;
  channel: "whatsapp" | "website" | "telegram";
  lastMessage: string;
  time: string;
  status: "Needs Human" | "Bot Active" | "Resolved";
  unreadCount: number;
  email: string;
  phone: string;
  company: string;
  role: string;
  location: string;
  tags: string[];
  variables: Record<string, string>;
  activity: { text: string; time: string; type: "history" | "payment" | "resolved" }[];
  messages: Message[];
  botActive: boolean;
}

export default function ConversationsPage() {
  const [filter, setFilter] = useState<"All" | "Bot Active" | "Needs Human" | "Resolved">("All");
  const [selectedContactId, setSelectedContactId] = useState("elena");
  const [inputText, setInputText] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const [mobileView, setMobileView] = useState<"list" | "chat" | "info">("list");

  const [contacts, setContacts] = useState<Contact[]>([
    {
      id: "elena",
      name: "Elena Rodriguez",
      avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuAz67vwZR-jFxw4ZQF4ycWSKdmfHc9EjA3xlgN_z3ZiE5GGnk1XhKPSpqXJg2B-lfdyLxwQxuCnUhWkxk7GEEDfZRie0DNu_EyLhXP1NKX6klFDO8t8dOG62H5ytEIapnT6XWNFSziNc5pgR4LpkNnrI5pPTvDc3YSN5_ruJmdlkEC3kV3K3ZcD7Rfbb1aF4tBS0Rtw_FNnk6UIa4k6OaP-e5xBV-mRTSQJtHvLCPjoJYJxDGv5hqd7vA",
      channel: "whatsapp",
      lastMessage: "I'm having trouble with the pricing tier integration...",
      time: "12:45 PM",
      status: "Needs Human",
      unreadCount: 3,
      email: "elena@innoscale.io",
      phone: "+34 612 990 011",
      company: "InnoScale",
      role: "Product Designer",
      location: "Barcelona, ES",
      tags: ["High Value", "Enterprise Lead", "Billing Issue"],
      variables: {
        Email: "elena@innoscale.io",
        Phone: "+34 612 990 011",
        Tier: "Pro (Trial)",
        Project: "Q4 Expansion",
      },
      activity: [
        { text: "Viewed Pricing Table", time: "Oct 12, 12:15 PM", type: "history" },
        { text: "Payment attempt Failed", time: "Oct 12, 12:40 PM", type: "payment" },
      ],
      messages: [
        { sender: "system", text: "Flow started: Pricing Inquiries", time: "" },
        { sender: "bot", text: "Hello Elena! I'm the FlowBot assistant. How can I help you today?", time: "12:30 PM" },
        {
          sender: "user",
          text: "Hi! I'm trying to upgrade to the Enterprise tier but the 'Confirm' button is greyed out after I enter my billing details.",
          time: "12:31 PM",
        },
        {
          sender: "bot",
          text: "I see. Let me check your account status. It appears there might be a validation error with the VAT number provided. Would you like me to connect you with a billing specialist?",
          time: "12:31 PM",
        },
        {
          sender: "user",
          text: "Yes please. I've tried three different cards and none of them work. This is urgent as my trial ends today.",
          time: "12:44 PM",
        },
      ],
      botActive: false,
    },
    {
      id: "marcus",
      name: "Marcus Chen",
      avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuD1fJmj1piCN5ChBOWgT_Y79ypuloxt-v0KXcCAehRSZM3TwH8W5Le3Lg4UjdR7NZly4-99B9pSREvKdV5ABvUVVqajC7ZCOOHmsGmdxakQSTEIexTPdV35Jr1edGhBxcxgR-sZvYiahf7NjBjIM_mhD2h9yQe_ESXNC4YgPXQAoCtdV0xUMEGonHzLb3GGUuGT4nIiM8-KQ-AcQ0csnMOeux60kev2qVyCDpit-sGtormlvLBU4k4tLA",
      channel: "telegram",
      lastMessage: "The bot is currently handling this request...",
      time: "11:20 AM",
      status: "Bot Active",
      unreadCount: 0,
      email: "marcus@founderflow.co",
      phone: "+1 (555) 345-6789",
      company: "FounderFlow",
      role: "Startup Founder",
      location: "San Francisco, US",
      tags: ["Seed Stage", "Telegram User"],
      variables: {
        Email: "marcus@founderflow.co",
        Source: "Product Hunt",
      },
      activity: [
        { text: "Triggered Telegram Bot", time: "Oct 12, 11:15 AM", type: "history" },
      ],
      messages: [
        { sender: "system", text: "Flow started: Lead Qualification", time: "" },
        { sender: "bot", text: "Welcome! Tell me about your startup.", time: "11:18 AM" },
        { sender: "user", text: "We are building an AI-powered SaaS for sales teams.", time: "11:19 AM" },
        { sender: "bot", text: "Awesome! What's your current stage?", time: "11:20 AM" },
      ],
      botActive: true,
    },
    {
      id: "sarah",
      name: "Sarah Jenkins",
      avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuAxLdJO8fmtTTlJtSYdo9hPJAd7afh7CDcvl6xy_fjBYA8urUpiMASCQ74vsJdTiIPehVTV1qkTJP-JjzIa8GsdRARwxYMCtHhS3BlZxNS4J8CYUl1NX2pDtJzKU41TOuMginUbzrQLDaPI7IQvOkC8UNmtunl028ph8I0m8O4WkaB2TOlVDUNkWPwNlcqK4MRxTSup3SgTODhmOdHMsW7vKfz_pFxX9op3nAgfrD9xXksEhia8AOUrRg",
      channel: "website",
      lastMessage: "Thanks for the quick response, that resolved it.",
      time: "Yesterday",
      status: "Resolved",
      unreadCount: 0,
      email: "s.jenkins@globex.org",
      phone: "+44 20 7946 0958",
      company: "Globex Corp",
      role: "Senior Developer",
      location: "London, UK",
      tags: ["Developer", "API User"],
      variables: {
        Email: "s.jenkins@globex.org",
        Version: "v2.0",
      },
      activity: [
        { text: "Resolved Conversation", time: "Oct 11, 4:30 PM", type: "resolved" },
      ],
      messages: [
        { sender: "bot", text: "Hello Sarah! How can I help you?", time: "Oct 11, 4:10 PM" },
        { sender: "user", text: "Is the API key expired? I get 401 errors.", time: "Oct 11, 4:12 PM" },
        { sender: "bot", text: "It looks like your key was rotated. I will generate a new one.", time: "Oct 11, 4:20 PM" },
        { sender: "user", text: "Thanks for the quick response, that resolved it.", time: "Oct 11, 4:30 PM" },
      ],
      botActive: false,
    },
  ]);

  const selectedContact = contacts.find((c) => c.id === selectedContactId) || contacts[0];

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const timeString = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    const newMessage: Message = { sender: "agent", text: inputText, time: timeString };

    setContacts((prev) =>
      prev.map((c) => {
        if (c.id === selectedContact.id) {
          return {
            ...c,
            lastMessage: inputText,
            time: "Just now",
            unreadCount: 0,
            messages: [...c.messages, newMessage],
          };
        }
        return c;
      })
    );
    setInputText("");
  };

  const toggleBotTakeover = (checked: boolean) => {
    setContacts((prev) =>
      prev.map((c) => {
        if (c.id === selectedContact.id) {
          const nextActive = !checked;
          const takeoverMessage: Message = nextActive
            ? { sender: "system", text: "Bot resumed management", time: "" }
            : { sender: "system", text: "You took over the conversation", time: "" };

          return {
            ...c,
            botActive: nextActive,
            status: nextActive ? "Bot Active" : "Needs Human",
            messages: [...c.messages, takeoverMessage],
          };
        }
        return c;
      })
    );
  };

  const addTag = () => {
    const nextTag = prompt("Add a tag for this contact:");
    if (!nextTag) return;
    setContacts((prev) =>
      prev.map((c) => {
        if (c.id === selectedContact.id) {
          return { ...c, tags: [...c.tags, nextTag] };
        }
        return c;
      })
    );
  };

  const filteredContacts = contacts.filter((c) => {
    const matchesSearch = c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          c.lastMessage.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filter === "All" || c.status === filter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="lg:ml-[260px] flex-grow flex flex-col h-screen overflow-hidden bg-slate-50/30">
      <Header title="Live Chat Inbox" />

      {/* Inbox Layout Grid */}
      <section className="flex-1 flex overflow-hidden">
        
        {/* Column 1: Conversations List Panel */}
        <div
          className={cn(
            "w-full lg:w-[350px] flex flex-col border-r border-slate-100 bg-white shrink-0 lg:flex",
            mobileView === "list" ? "flex" : "hidden"
          )}
        >
          {/* Header Search & Filters with Shadcn Tabs */}
          <div className="p-4 space-y-4 shrink-0">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-3.5 h-3.5" />
              <Input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search conversations..."
                className="w-full bg-slate-50 border border-slate-200/50 rounded-xl pl-9 pr-4 focus-visible:bg-white text-xs h-9 transition-all duration-200"
              />
            </div>
            
            {/* Shadcn Tabs List Filter */}
            <Tabs value={filter} onValueChange={(val) => setFilter(val as any)} className="w-full">
              <TabsList className="grid grid-cols-4 bg-slate-100/80 p-[3px] rounded-xl w-full h-9">
                <TabsTrigger value="All" className="text-[10px] font-bold py-1.5 cursor-pointer">All</TabsTrigger>
                <TabsTrigger value="Bot Active" className="text-[10px] font-bold py-1.5 cursor-pointer">Active</TabsTrigger>
                <TabsTrigger value="Needs Human" className="text-[10px] font-bold py-1.5 cursor-pointer">Inbox</TabsTrigger>
                <TabsTrigger value="Resolved" className="text-[10px] font-bold py-1.5 cursor-pointer">Done</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          {/* List items */}
          <div className="flex-1 overflow-y-auto divide-y divide-slate-50">
            {filteredContacts.map((contact) => {
              const isSelected = selectedContact.id === contact.id;
              return (
                <div
                  key={contact.id}
                  onClick={() => {
                    setSelectedContactId(contact.id);
                    setMobileView("chat");
                    setContacts((prev) =>
                      prev.map((c) => (c.id === contact.id ? { ...c, unreadCount: 0 } : c))
                    );
                  }}
                  className={`p-4 cursor-pointer transition-all duration-200 border-l-4 relative group flex gap-3.5 ${
                    isSelected
                      ? "bg-primary/[0.03] border-l-primary"
                      : "hover:bg-slate-50/50 border-l-transparent"
                  }`}
                >
                  <div className="relative shrink-0 select-none">
                    <img className="w-11 h-11 rounded-full object-cover border border-slate-100 shadow-sm" src={contact.avatar} alt={contact.name} />
                    <div
                      className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center border-2 border-white shadow-sm text-white ${
                        contact.channel === "whatsapp"
                          ? "bg-[#25D366]"
                          : contact.channel === "telegram"
                          ? "bg-[#229ED9]"
                          : "bg-primary"
                      }`}
                    >
                      <span className="text-[10px] font-bold">
                        {contact.channel === "whatsapp" ? "W" : contact.channel === "telegram" ? "T" : "C"}
                      </span>
                    </div>
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start mb-0.5">
                      <h3 className="font-bold text-xs text-slate-800 truncate">{contact.name}</h3>
                      <span className="text-[9px] text-slate-400 font-semibold">{contact.time}</span>
                    </div>
                    <p
                      className={`text-xs truncate ${
                        contact.unreadCount > 0 ? "text-slate-900 font-bold" : "text-slate-400 font-medium"
                      }`}
                    >
                      {contact.lastMessage}
                    </p>
                    <div className="flex items-center justify-between mt-2.5">
                      <Badge
                        variant="outline"
                        className={`text-[9px] font-extrabold px-2 py-0.5 rounded-full tracking-wider select-none h-auto border ${
                          contact.status === "Needs Human"
                            ? "bg-rose-50 text-rose-600 border-rose-100"
                            : contact.status === "Bot Active"
                            ? "bg-violet-50 text-violet-600 border-violet-100"
                            : "bg-emerald-50 text-emerald-600 border-emerald-100"
                        }`}
                      >
                        {contact.status}
                      </Badge>
                      {contact.unreadCount > 0 && (
                        <div className="bg-primary text-on-primary text-[9px] font-bold w-4.5 h-4.5 rounded-full flex items-center justify-center shadow-md shadow-primary/10 select-none animate-pulse">
                          {contact.unreadCount}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
            {filteredContacts.length === 0 && (
              <div className="p-8 text-center text-xs text-slate-400 font-semibold select-none">
                No conversations match the filters.
              </div>
            )}
          </div>
        </div>

        {/* Column 2: Active Chat Room Thread */}
        <div
          className={cn(
            "flex-grow flex flex-col bg-white relative overflow-hidden lg:flex",
            mobileView === "chat" ? "flex" : "hidden"
          )}
        >
          {/* Active Chat Header */}
          <div className="h-16 px-6 border-b border-slate-100 flex items-center justify-between bg-white/95 backdrop-blur-md sticky top-0 z-10 select-none">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden h-8 w-8 text-slate-500 hover:text-slate-800 rounded-lg cursor-pointer shrink-0"
                onClick={() => setMobileView("list")}
              >
                <ArrowLeft className="w-4 h-4" />
              </Button>
              <span
                className={`w-2.5 h-2.5 rounded-full inline-block ${
                  selectedContact.status === "Needs Human"
                    ? "bg-rose-500 animate-pulse"
                    : selectedContact.status === "Bot Active"
                    ? "bg-violet-500"
                    : "bg-emerald-500"
                }`}
              />
              <span className="font-bold text-sm text-slate-800">{selectedContact.name}</span>
            </div>
            
            {/* Takeover Control Toggle Switch / Mobile info button */}
            <div className="flex items-center gap-2.5 sm:gap-4 select-none">
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden h-8 w-8 text-slate-500 hover:text-slate-800 rounded-lg cursor-pointer shrink-0"
                onClick={() => setMobileView("info")}
              >
                <Info className="w-4 h-4" />
              </Button>
              <div className="flex items-center gap-2.5">
                <Switch
                  checked={!selectedContact.botActive}
                  onCheckedChange={toggleBotTakeover}
                  id="bot-takeover"
                  className="cursor-pointer"
                />
                <label htmlFor="bot-takeover" className="hidden sm:inline-block text-[10px] font-extrabold text-primary uppercase tracking-wider cursor-pointer">
                  Take Over
                </label>
              </div>
            </div>
          </div>

          {/* Messages List Area */}
          <div className="flex-grow overflow-y-auto p-6 space-y-6 bg-slate-50/30">
            {selectedContact.messages.map((msg, index) => {
              if (msg.sender === "system") {
                return (
                  <div key={index} className="flex justify-center select-none animate-fade-in">
                    <span className="px-3 py-1 bg-slate-100 rounded-full text-[10px] font-bold text-slate-500 uppercase tracking-wide border border-slate-200/40">
                      {msg.text}
                    </span>
                  </div>
                );
              }

              const isAgent = msg.sender === "agent";
              const isUser = msg.sender === "user";
              const isBot = msg.sender === "bot";

              return (
                <div
                  key={index}
                  className={`flex gap-3 max-w-[85%] sm:max-w-[80%] items-start animate-fade-in ${
                    isUser ? "self-end flex-row-reverse" : "self-start"
                  }`}
                >
                  {isBot && (
                    <div className="w-7 h-7 rounded-full bg-violet-100 border border-violet-200/50 flex items-center justify-center shrink-0 shadow-sm select-none">
                      <Bot className="w-4 h-4 text-violet-600" />
                    </div>
                  )}
                  {isAgent && (
                    <div className="w-7 h-7 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0 shadow-sm select-none">
                      <User className="w-4 h-4 text-primary" />
                    </div>
                  )}
                  
                  <div className="flex flex-col gap-1">
                    <div
                      className={`p-3.5 shadow-sm text-xs font-medium leading-relaxed ${
                        isUser
                          ? "bg-primary text-white rounded-2xl rounded-tr-none shadow-md shadow-primary/5"
                          : isAgent
                          ? "bg-violet-50 text-violet-950 border border-violet-100 rounded-2xl rounded-tl-none"
                          : "bg-white border border-slate-200/50 text-slate-800 rounded-2xl rounded-tl-none"
                      }`}
                    >
                      <p>{msg.text}</p>
                    </div>
                    {msg.time && (
                      <span
                        className={`text-[9px] text-slate-400 font-semibold mt-0.5 select-none ${
                          isUser ? "text-right mr-1.5" : "ml-1.5"
                        }`}
                      >
                        {msg.time}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Form Input Message Area using Shadcn Textarea */}
          <div className="p-4 border-t border-slate-100 bg-white shrink-0">
            <form
              onSubmit={handleSendMessage}
              className="bg-slate-50 border border-slate-200/60 rounded-2xl p-2 flex flex-col gap-2 focus-within:bg-white focus-within:ring-4 focus-within:ring-primary/5 focus-within:border-primary transition-all duration-200"
            >
              <Textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                disabled={selectedContact.botActive}
                className="w-full bg-transparent border-none text-xs p-2.5 resize-none disabled:opacity-50 outline-none text-slate-800 placeholder:text-slate-400 focus-visible:ring-0 focus-visible:border-none min-h-[60px]"
                placeholder={
                  selectedContact.botActive
                    ? "Activate 'Take Over' above to reply..."
                    : `Type a message to ${selectedContact.name.split(" ")[0]}...`
                }
                rows={2}
              />
              <div className="flex items-center justify-between border-t border-slate-200/30 pt-2 px-1 select-none">
                <div className="flex items-center gap-0.5">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-slate-400 hover:text-slate-650 hover:bg-slate-100 rounded-lg cursor-pointer"
                  >
                    <Paperclip className="w-4 h-4" />
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-slate-400 hover:text-slate-650 hover:bg-slate-100 rounded-lg cursor-pointer"
                  >
                    <Smile className="w-4 h-4" />
                  </Button>
                </div>
                <Button
                  type="submit"
                  disabled={selectedContact.botActive || !inputText.trim()}
                  className="bg-primary text-on-primary px-5 py-2 rounded-xl text-xs font-bold shadow-md shadow-primary/10 hover:opacity-95 transition-all active:scale-95 flex items-center gap-1.5 cursor-pointer disabled:opacity-50 h-8"
                >
                  <span>Send</span>
                  <Send className="w-3.5 h-3.5" />
                </Button>
              </div>
            </form>
          </div>
        </div>

        {/* Column 3: Contact Profile Panel */}
        <div
          className={cn(
            "w-full lg:w-[300px] border-l border-slate-100 bg-white flex flex-col overflow-y-auto shrink-0 select-text divide-y divide-slate-100 scrollbar-thin lg:flex",
            mobileView === "info" ? "flex" : "hidden"
          )}
        >
          {/* Mobile Profile Header Navigation Row */}
          <div className="p-4 border-b border-slate-100 flex items-center justify-between lg:hidden bg-slate-50/50 select-none">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-slate-500 hover:text-slate-800 rounded-lg cursor-pointer shrink-0"
              onClick={() => setMobileView("chat")}
            >
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <span className="font-extrabold text-[10px] text-slate-500 uppercase tracking-widest">Contact Details</span>
            <div className="w-8 h-8" />
          </div>

          {/* Profile Header Hero */}
          <div className="p-6 flex flex-col items-center text-center select-none">
            <div className="relative mb-3.5">
              <img
                className="w-18 h-18 rounded-full object-cover border-4 border-slate-100 shadow-md"
                src={selectedContact.avatar}
                alt={selectedContact.name}
              />
              <span className="absolute bottom-0.5 right-0.5 w-5 h-5 bg-green-500 rounded-full border-4 border-white shadow-sm" />
            </div>
            <h2 className="text-sm font-bold text-slate-800 leading-tight">{selectedContact.name}</h2>
            <p className="text-[11px] text-slate-400 mt-1 font-semibold">
              {selectedContact.role} @ {selectedContact.company}
            </p>
            <div className="flex gap-2 mt-4 select-none">
              <Button variant="outline" size="icon" className="h-9 w-9 rounded-full border border-slate-200 text-slate-400 hover:text-primary hover:border-primary cursor-pointer transition-all duration-200">
                <Phone className="w-3.5 h-3.5" />
              </Button>
              <Button variant="outline" size="icon" className="h-9 w-9 rounded-full border border-slate-200 text-slate-400 hover:text-primary hover:border-primary cursor-pointer transition-all duration-200">
                <Mail className="w-3.5 h-3.5" />
              </Button>
              <Button variant="outline" size="icon" className="h-9 w-9 rounded-full border border-slate-200 text-slate-400 hover:text-primary hover:border-primary cursor-pointer transition-all duration-200">
                <MoreHorizontal className="w-3.5 h-3.5" />
              </Button>
            </div>
          </div>

          {/* Details sections */}
          <div className="p-6 space-y-6 divide-y divide-slate-100/50">
            {/* Info Grid */}
            <div className="space-y-3.5">
              <h4 className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest select-none">
                Conversation Info
              </h4>
              <div className="space-y-2.5 text-xs font-semibold">
                <div className="flex justify-between items-center">
                  <span className="text-slate-400 font-medium">Channel</span>
                  <span className="flex items-center gap-1 text-[#25D366]">
                    <Globe className="w-3.5 h-3.5" />
                    {selectedContact.channel.toUpperCase()}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400 font-medium">Last Active</span>
                  <span className="text-slate-700">2 mins ago</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400 font-medium">Location</span>
                  <span className="text-slate-700 flex items-center gap-0.5">
                    <MapPin className="w-3 h-3 text-slate-400" />
                    {selectedContact.location}
                  </span>
                </div>
              </div>
            </div>

            {/* Tags section */}
            <div className="pt-5 space-y-3.5">
              <div className="flex justify-between items-center select-none">
                <h4 className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest">Tags</h4>
                <button onClick={addTag} className="text-primary hover:underline text-[9px] font-extrabold">
                  + Add
                </button>
              </div>
              <div className="flex flex-wrap gap-1">
                {selectedContact.tags.map((tag, i) => (
                  <Badge
                    key={i}
                    variant="secondary"
                    className="px-2.5 py-0.5 rounded-full text-[9px] font-bold select-none uppercase tracking-tight h-auto"
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Variables section */}
            <div className="pt-5 space-y-3.5">
              <h4 className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest select-none">
                Variables
              </h4>
              <div className="bg-slate-50 rounded-xl border border-slate-200/30 overflow-hidden font-medium">
                {Object.entries(selectedContact.variables).map(([key, val], i) => (
                  <div
                    key={key}
                    className={`flex p-3 text-xs justify-between gap-3 ${
                      i < Object.keys(selectedContact.variables).length - 1 ? "border-b border-slate-200/30" : ""
                    }`}
                  >
                    <span className="text-slate-400">{key}</span>
                    <span className="font-mono text-slate-700 truncate select-all">{val}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Activity History timeline */}
            <div className="pt-5 space-y-3.5">
              <h4 className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest select-none">
                Recent Activity
              </h4>
              <div className="space-y-4 pl-1">
                {selectedContact.activity.map((act, i) => (
                  <div key={i} className="flex gap-3 items-start relative">
                    <div className="w-7 h-7 rounded-full bg-slate-50 border border-slate-200/50 flex items-center justify-center shrink-0 text-slate-400 shadow-sm">
                      {act.type === "payment" ? (
                        <CreditCard className="w-3.5 h-3.5 text-rose-500" />
                      ) : act.type === "resolved" ? (
                        <Shield className="w-3.5 h-3.5 text-emerald-500" />
                      ) : (
                        <Activity className="w-3.5 h-3.5 text-primary" />
                      )}
                    </div>
                    <div>
                      <p className="text-xs text-slate-700 font-bold">{act.text}</p>
                      <p className="text-[10px] text-slate-400 mt-0.5">{act.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

