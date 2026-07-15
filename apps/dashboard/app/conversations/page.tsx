"use client";

import { useState, useEffect, useRef } from "react";
import Header from "../../components/Header";
import {
  Search,
  Bot,
  User,
  Phone,
  Mail,
  MoreHorizontal,
  Globe,
  Activity,
  CreditCard,
  Send,
  Smile,
  Paperclip,
  Shield,
  MapPin,
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
import { fetchWithAuth } from "@/lib/api";

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
  const [selectedContactId, setSelectedContactId] = useState<string | null>(null);
  const [inputText, setInputText] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [mobileView, setMobileView] = useState<"list" | "chat" | "info">("list");
  
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Poll contacts & messages list every 3.5s for real-time dashboard updates
  useEffect(() => {
    const loadContacts = async () => {
      try {
        const res = await fetchWithAuth("/contacts");
        if (!res.ok) throw new Error("Failed to load");
        const list = await res.json();

        const mapped: Contact[] = list.map((item: any) => {
          // Parse variables
          const vars = typeof item.variables === "string" ? JSON.parse(item.variables) : (item.variables || {});
          
          // Map database message schema to state schema
          const msgHistory: Message[] = (item.messages || []).map((m: any) => ({
            sender: m.sender === "visitor" ? "user" : m.sender,
            text: m.text,
            time: new Date(m.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          }));

          const hasMessages = msgHistory.length > 0;
          const lastMsg = hasMessages ? msgHistory[msgHistory.length - 1].text : "No messages yet";
          const lastTime = hasMessages ? msgHistory[msgHistory.length - 1].time : "Just now";

          // Determine status based on botActive state
          const botActive = item.botActive ?? true;
          const status = botActive ? "Bot Active" : "Needs Human";

          return {
            id: item.id,
            name: vars.name || `Visitor (${item.externalId.slice(0, 8)})`,
            avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${item.externalId}`,
            channel: item.channel,
            lastMessage: lastMsg,
            time: lastTime,
            status: status,
            unreadCount: 0,
            email: vars.email || "Not provided",
            phone: vars.phone || "Not provided",
            company: vars.company || "Not provided",
            role: vars.role || "Visitor",
            location: vars.location || "Unknown Location",
            tags: item.tags || [],
            variables: vars,
            activity: [
              { text: "Started widget conversation", time: new Date(item.createdAt).toLocaleDateString(), type: "history" }
            ],
            messages: msgHistory,
            botActive,
          };
        });

        setContacts(mapped);

        // Select first contact on first load if none selected
        if (mapped.length > 0 && !selectedContactId) {
          setSelectedContactId(mapped[0].id);
        }
      } catch (err) {
        console.error("Fetch contacts error:", err);
      } finally {
        setLoading(false);
      }
    };

    loadContacts();
    timerRef.current = setInterval(loadContacts, 3500);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [selectedContactId]);

  const selectedContact = contacts.find((c) => c.id === selectedContactId) || contacts[0];

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !selectedContact) return;

    const messageText = inputText.trim();
    setInputText("");

    // Optimistically update UI message history
    const timeString = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    const localMsg: Message = { sender: "agent", text: messageText, time: timeString };

    setContacts((prev) =>
      prev.map((c) => {
        if (c.id === selectedContact.id) {
          return {
            ...c,
            lastMessage: messageText,
            time: "Just now",
            messages: [...c.messages, localMsg],
          };
        }
        return c;
      })
    );

    try {
      // Send to backend via REST API (this logs message + forwards to visitor connection)
      await fetchWithAuth(`/contacts/${selectedContact.id}/messages`, {
        method: "POST",
        body: JSON.stringify({
          text: messageText,
          sender: "agent",
        }),
      });
    } catch (err) {
      console.error("Failed to send message to backend:", err);
    }
  };

  const toggleBotTakeover = async (checked: boolean) => {
    if (!selectedContact) return;

    const nextActive = !checked;
    const takeoverMessage: Message = nextActive
      ? { sender: "system", text: "Bot resumed management", time: "" }
      : { sender: "system", text: "You took over the conversation", time: "" };

    // Update UI state optimistically
    setContacts((prev) =>
      prev.map((c) => {
        if (c.id === selectedContact.id) {
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

    try {
      // Send takeover state update to backend
      await fetchWithAuth(`/contacts/${selectedContact.id}/takeover`, {
        method: "POST",
        body: JSON.stringify({
          botActive: nextActive,
        }),
      });
    } catch (err) {
      console.error("Failed to update bot takeover state:", err);
    }
  };

  const addTag = () => {
    const nextTag = prompt("Add a tag for this contact:");
    if (!nextTag || !selectedContact) return;
    
    // Optimistic UI update
    setContacts((prev) =>
      prev.map((c) => {
        if (c.id === selectedContact.id) {
          return { ...c, tags: [...c.tags, nextTag] };
        }
        return c;
      })
    );

    // Call backend API to save tags
    fetchWithAuth(`/contacts/${selectedContact.id}/tags`, {
      method: "POST",
      body: JSON.stringify({ tag: nextTag }),
    }).catch((err) => console.error("Tag update failed:", err));
  };

  const filteredContacts = contacts.filter((c) => {
    const matchesSearch = c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          c.lastMessage.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filter === "All" || c.status === filter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="flex-grow flex flex-col h-screen overflow-hidden bg-slate-50/30">
      <Header title="Live Chat Inbox" />

      {loading && contacts.length === 0 ? (
        <div className="flex-1 flex items-center justify-center font-bold text-slate-400 text-xs select-none">
          Loading inbox conversations…
        </div>
      ) : (
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
                const isSelected = selectedContact?.id === contact.id;
                return (
                  <div
                    key={contact.id}
                    onClick={() => {
                      setSelectedContactId(contact.id);
                      setMobileView("chat");
                    }}
                    className={`p-4 cursor-pointer transition-all duration-200 border-l-4 relative group flex gap-3.5 ${
                      isSelected
                        ? "bg-primary/[0.03] border-l-primary"
                        : "hover:bg-slate-55/50 border-l-transparent"
                    }`}
                  >
                    <div className="relative shrink-0 select-none">
                      <img className="w-11 h-11 rounded-full object-cover border border-slate-100 shadow-sm" src={contact.avatar} alt={contact.name} />
                      <div
                        className={cn(
                          "absolute -bottom-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center border-2 border-white shadow-sm text-white text-[9px] font-bold",
                          contact.channel === "whatsapp" ? "bg-emerald-500" : contact.channel === "telegram" ? "bg-sky-500" : "bg-primary"
                        )}
                      >
                        {contact.channel === "whatsapp" ? "W" : contact.channel === "telegram" ? "T" : "C"}
                      </div>
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start mb-0.5">
                        <h3 className="font-bold text-xs text-slate-800 truncate">{contact.name}</h3>
                        <span className="text-[9px] text-slate-400 font-semibold">{contact.time}</span>
                      </div>
                      <p className="text-xs truncate text-slate-400 font-medium">{contact.lastMessage}</p>
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
          {selectedContact ? (
            <div
              className={cn(
                "flex-grow flex flex-col bg-white relative overflow-hidden lg:flex",
                mobileView === "chat" ? "flex" : "hidden"
              )}
            >
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
                              ? "bg-violet-50 text-violet-955 border border-violet-100 rounded-2xl rounded-tl-none"
                              : "bg-white border border-slate-200/50 text-slate-800 rounded-2xl rounded-tl-none"
                          }`}
                        >
                          <p>{msg.text}</p>
                        </div>
                        {msg.time && (
                          <span className={cn("text-[9px] text-slate-400 font-semibold mt-0.5 select-none", isUser ? "text-right mr-1.5" : "ml-1.5")}>
                            {msg.time}
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Form Input Message Area */}
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
                      <Button type="button" variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg cursor-pointer">
                        <Paperclip className="w-4 h-4" />
                      </Button>
                      <Button type="button" variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-slate-650 hover:bg-slate-100 rounded-lg cursor-pointer">
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
          ) : (
            <div className="flex-grow flex items-center justify-center font-bold text-slate-400 text-xs select-none bg-slate-50/10">
              Select a conversation to reply
            </div>
          )}

          {/* Column 3: Contact Profile Panel */}
          {selectedContact && (
            <div
              className={cn(
                "w-full lg:w-[300px] border-l border-slate-100 bg-white flex flex-col overflow-y-auto shrink-0 select-text divide-y divide-slate-100 scrollbar-thin lg:flex",
                mobileView === "info" ? "flex" : "hidden"
              )}
            >
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

              <div className="p-6 flex flex-col items-center text-center select-none">
                <div className="relative mb-3.5">
                  <img className="w-18 h-18 rounded-full object-cover border-4 border-slate-100 shadow-md" src={selectedContact.avatar} alt={selectedContact.name} />
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

              <div className="p-6 space-y-6 divide-y divide-slate-100/50">
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
                      <span className="text-slate-400 font-medium">Location</span>
                      <span className="text-slate-700 flex items-center gap-0.5">
                        <MapPin className="w-3 h-3 text-slate-400" />
                        {selectedContact.location}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="pt-5 space-y-3.5">
                  <div className="flex justify-between items-center select-none">
                    <h4 className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest">Tags</h4>
                    <button onClick={addTag} className="text-primary hover:underline text-[9px] font-extrabold">
                      + Add
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {selectedContact.tags.map((tag, i) => (
                      <Badge key={i} variant="secondary" className="px-2.5 py-0.5 rounded-full text-[9px] font-bold select-none uppercase tracking-tight h-auto">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="pt-5 space-y-3.5">
                  <h4 className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest select-none">
                    Variables
                  </h4>
                  <div className="bg-slate-50 rounded-xl border border-slate-200/30 overflow-hidden font-medium">
                    {Object.entries(selectedContact.variables).map(([key, val], i) => (
                      <div key={key} className={`flex p-3 text-xs justify-between gap-3 ${i < Object.keys(selectedContact.variables).length - 1 ? "border-b border-slate-200/30" : ""}`}>
                        <span className="text-slate-400">{key}</span>
                        <span className="font-mono text-slate-700 truncate select-all">{String(val)}</span>
                      </div>
                    ))}
                  </div>
                </div>

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
          )}
        </section>
      )}
    </div>
  );
}
