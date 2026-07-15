"use client";

import { useState, useEffect } from "react";
import Header from "../../components/Header";
import {
  Search,
  ChevronDown,
  Calendar,
  Download,
  ChevronLeft,
  ChevronRight,
  X,
  MessageCircle,
  Mail,
  Phone,
  Building2,
  CheckCircle,
  Bot,
  User,
  PlusCircle,
  Edit3,
  Globe,
  Tag,
  MoreHorizontal
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { fetchWithAuth } from "@/lib/api";
import { cn } from "@/lib/utils";

interface TimelineItem {
  sender: "bot" | "user";
  flowName?: string;
  text: string;
  time: string;
}

interface Contact {
  id: string;
  name: string;
  initials: string;
  leadId: string;
  channel: "whatsapp" | "messenger" | "instagram" | "website";
  tags: string[];
  lastActive: string;
  email: string;
  phone: string;
  company: string;
  role: string;
  sourceFlow: string;
  avatar?: string;
  timeline: TimelineItem[];
}

export default function ContactsPage() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedContactId, setSelectedContactId] = useState<string | null>(null);
  const [selectedChannel, setSelectedChannel] = useState("All Channels");
  const [selectedTag, setSelectedTag] = useState("Filter by Tags");
  const [searchQuery, setSearchQuery] = useState("");
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadContacts = async () => {
      try {
        const res = await fetchWithAuth("/contacts");
        if (!res.ok) throw new Error("Failed to load");
        const list = await res.json();

        const mapped: Contact[] = list.map((item: any) => {
          const vars = typeof item.variables === "string" ? JSON.parse(item.variables) : (item.variables || {});
          
          const timeline: TimelineItem[] = (item.messages || []).map((m: any) => ({
            sender: m.sender === "visitor" ? "user" : m.sender,
            text: m.text,
            time: new Date(m.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          }));

          const name = vars.name || `Visitor (${item.externalId.slice(0, 8)})`;
          const initials = name
            .split(" ")
            .map((n: string) => n[0])
            .join("")
            .slice(0, 2)
            .toUpperCase();

          return {
            id: item.id,
            name,
            initials,
            leadId: `#${item.id.slice(0, 5).toUpperCase()}`,
            channel: item.channel,
            tags: item.tags || [],
            lastActive: new Date(item.createdAt).toLocaleDateString(),
            email: vars.email || "Not provided",
            phone: vars.phone || "Not provided",
            company: vars.company || "Not provided",
            role: vars.role || "Visitor",
            sourceFlow: "Active Flow",
            avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${item.externalId}`,
            timeline,
          };
        });

        setContacts(mapped);
        if (mapped.length > 0 && !selectedContactId) {
          setSelectedContactId(mapped[0].id);
        }
      } catch (err) {
        console.error("Failed to load contacts CRM:", err);
      } finally {
        setLoading(false);
      }
    };

    loadContacts();
  }, [selectedContactId]);

  const selectedContact = contacts.find((c) => c.id === selectedContactId) || contacts[0];

  const handleRowClick = (id: string) => {
    setSelectedContactId(id);
    setIsDrawerOpen(true);
  };

  const addTag = () => {
    const newTag = prompt("Enter a new tag:");
    if (!newTag || !selectedContact) return;

    setContacts((prev) =>
      prev.map((c) => {
        if (c.id === selectedContact.id) {
          return { ...c, tags: [...c.tags, newTag] };
        }
        return c;
      })
    );

    fetchWithAuth(`/contacts/${selectedContact.id}/tags`, {
      method: "POST",
      body: JSON.stringify({ tag: newTag }),
    }).catch((err) => console.error("Tag update failed:", err));
  };

  const removeTag = (tagToRemove: string) => {
    if (!selectedContact) return;

    setContacts((prev) =>
      prev.map((c) => {
        if (c.id === selectedContact.id) {
          return { ...c, tags: c.tags.filter((t) => t !== tagToRemove) };
        }
        return c;
      })
    );

    // Call backend to delete if needed
  };

  const handleExportCSV = () => {
    alert("Exporting contacts as CSV...");
  };

  const filteredContacts = contacts.filter((c) => {
    const matchesSearch = c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          c.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          c.leadId.includes(searchQuery);

    const matchesChannel = selectedChannel === "All Channels" ||
                           c.channel === selectedChannel.toLowerCase().replace(" chat", "").replace("widget", "website");

    const matchesTag = selectedTag === "Filter by Tags" || c.tags.includes(selectedTag);

    return matchesSearch && matchesChannel && matchesTag;
  });

  return (
    <div className="flex-grow flex flex-col min-h-screen relative overflow-hidden bg-slate-50/50">
      <Header title="Contacts CRM" />

      {loading && contacts.length === 0 ? (
        <div className="flex-1 flex items-center justify-center font-bold text-slate-400 text-xs select-none">
          Loading CRM contacts…
        </div>
      ) : (
        <div className="p-6 flex-1 overflow-x-hidden">
          {/* Filter Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6 bg-white p-4 rounded-2xl border border-slate-200/50 shadow-sm select-none">
            <div className="flex flex-wrap items-center gap-2">
              <div className="relative w-full max-w-xs md:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-3.5 h-3.5" />
                <Input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search CRM..."
                  className="w-full bg-slate-50 border border-slate-200/50 rounded-xl pl-9 pr-4 text-xs h-9 focus-visible:bg-white transition-all"
                />
              </div>

              <div className="relative">
                <select
                  value={selectedChannel}
                  onChange={(e) => setSelectedChannel(e.target.value)}
                  className="appearance-none bg-slate-50 border border-slate-200/50 rounded-xl pl-4 pr-10 py-1.5 text-xs focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary cursor-pointer font-bold text-slate-700 h-9"
                >
                  <option>All Channels</option>
                  <option>WhatsApp</option>
                  <option>Messenger</option>
                  <option>Instagram</option>
                  <option>Website</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 w-3.5 h-3.5" />
              </div>

              <div className="relative">
                <select
                  value={selectedTag}
                  onChange={(e) => setSelectedTag(e.target.value)}
                  className="appearance-none bg-slate-50 border border-slate-200/50 rounded-xl pl-4 pr-10 py-1.5 text-xs focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary cursor-pointer font-bold text-slate-700 h-9"
                >
                  <option>Filter by Tags</option>
                  <option>VIP</option>
                  <option>Lead</option>
                  <option>Support</option>
                  <option>Qualified</option>
                </select>
                <Tag className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 w-3.5 h-3.5" />
              </div>

              <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200/50 rounded-xl px-4 py-2 text-xs font-bold text-slate-700 h-9 cursor-pointer shadow-none"
              >
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                Last 30 Days
              </Button>
            </div>

            <Button
              onClick={handleExportCSV}
              variant="outline"
              size="sm"
              className="flex items-center gap-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200/50 rounded-xl px-4 py-2 text-xs font-bold text-slate-700 h-9 cursor-pointer shadow-none"
            >
              <Download className="w-3.5 h-3.5 text-slate-400" />
              Export CSV
            </Button>
          </div>

          {/* Data Table Card */}
          <div className="bg-white border border-slate-200/50 rounded-2xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/55 border-b border-slate-100 select-none">
                    <th className="px-6 py-3.5 w-12 text-center">
                      <input type="checkbox" className="rounded text-primary focus:ring-primary/25 cursor-pointer" />
                    </th>
                    <th className="px-6 py-3.5 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Lead Info</th>
                    <th className="px-6 py-3.5 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Channel</th>
                    <th className="px-6 py-3.5 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Tags</th>
                    <th className="px-6 py-3.5 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Company</th>
                    <th className="px-6 py-3.5 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Last Sync</th>
                    <th className="px-6 py-3.5 text-[10px] font-bold text-slate-500 uppercase tracking-wider text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs font-medium text-slate-700">
                  {filteredContacts.map((contact) => (
                    <tr
                      key={contact.id}
                      onClick={() => handleRowClick(contact.id)}
                      className="hover:bg-slate-50/40 cursor-pointer transition-colors duration-150"
                    >
                      <td className="px-6 py-4 text-center" onClick={(e) => e.stopPropagation()}>
                        <input type="checkbox" className="rounded text-primary focus:ring-primary/25 cursor-pointer" />
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="relative shrink-0">
                            {contact.avatar ? (
                              <img className="w-9 h-9 rounded-full object-cover border border-slate-100 shadow-sm" src={contact.avatar} alt="" />
                            ) : (
                              <div className="w-9 h-9 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-bold text-xs select-none">
                                {contact.initials}
                              </div>
                            )}
                          </div>
                          <div>
                            <p className="font-bold text-slate-800 text-xs">{contact.name}</p>
                            <p className="text-[10px] text-slate-400 font-semibold mt-0.5">{contact.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <Badge
                          variant="outline"
                          className={cn(
                            "text-[9px] font-extrabold px-2 py-0.5 rounded-full select-none capitalize tracking-wide h-auto border",
                            contact.channel === "whatsapp" ? "bg-emerald-50 text-emerald-600 border-emerald-100" :
                            contact.channel === "messenger" ? "bg-blue-50 text-blue-600 border-blue-100" :
                            "bg-primary/5 text-primary border-primary/10"
                          )}
                        >
                          {contact.channel}
                        </Badge>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-wrap gap-1">
                          {contact.tags.map((tag, idx) => (
                            <Badge
                              key={idx}
                              variant="secondary"
                              className="px-2 py-0.5 rounded-md text-[9px] font-bold select-none uppercase tracking-tight h-auto"
                            >
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-slate-850">{contact.company}</p>
                        <p className="text-[10px] text-slate-400 font-semibold mt-0.5">{contact.role}</p>
                      </td>
                      <td className="px-6 py-4 text-slate-450">{contact.lastActive}</td>
                      <td className="px-6 py-4 text-right" onClick={(e) => e.stopPropagation()}>
                        <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg text-slate-400 hover:text-slate-700 cursor-pointer">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                  {filteredContacts.length === 0 && (
                    <tr>
                      <td colSpan={7} className="px-6 py-10 text-center text-xs text-slate-400 font-semibold select-none">
                        No contacts found in CRM index.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Side Slide-out Drawer Panel */}
      {selectedContact && isDrawerOpen && (
        <>
          <div className="fixed inset-0 bg-slate-900/20 backdrop-blur-xs z-40 transition-opacity cursor-pointer select-none" onClick={() => setIsDrawerOpen(false)} />
          <div className="fixed right-0 top-0 bottom-0 w-full sm:w-[480px] bg-white border-l border-slate-200/50 shadow-2xl z-50 flex flex-col overflow-hidden animate-slide-in select-text">
            {/* Drawer Header */}
            <div className="p-6 border-b border-slate-100 flex items-center justify-between shrink-0 bg-slate-50/50 select-none">
              <div>
                <p className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest">Lead details</p>
                <h3 className="font-bold text-sm text-slate-800 mt-1">{selectedContact.name}</h3>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-slate-400 hover:text-slate-700 rounded-lg cursor-pointer shrink-0"
                onClick={() => setIsDrawerOpen(false)}
              >
                <X className="w-4.5 h-4.5" />
              </Button>
            </div>

            {/* Drawer Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 divide-y divide-slate-100/50">
              {/* Bio Grid Card */}
              <div className="space-y-4 font-semibold">
                <h4 className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest select-none">General Info</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex items-center gap-2.5 text-xs">
                    <Building2 className="w-4 h-4 text-slate-400 shrink-0" />
                    <div>
                      <p className="text-[10px] text-slate-400 font-semibold leading-none mb-0.5">Company</p>
                      <p className="text-slate-700">{selectedContact.company}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2.5 text-xs">
                    <CheckCircle className="w-4 h-4 text-slate-400 shrink-0" />
                    <div>
                      <p className="text-[10px] text-slate-400 font-semibold leading-none mb-0.5">Job Title</p>
                      <p className="text-slate-700">{selectedContact.role}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2.5 text-xs">
                    <Mail className="w-4 h-4 text-slate-400 shrink-0" />
                    <div>
                      <p className="text-[10px] text-slate-400 font-semibold leading-none mb-0.5">Email address</p>
                      <p className="text-slate-700 select-all">{selectedContact.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2.5 text-xs">
                    <Phone className="w-4 h-4 text-slate-400 shrink-0" />
                    <div>
                      <p className="text-[10px] text-slate-400 font-semibold leading-none mb-0.5">Phone Number</p>
                      <p className="text-slate-700 select-all">{selectedContact.phone}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2.5 text-xs">
                    <Globe className="w-4 h-4 text-slate-400 shrink-0" />
                    <div>
                      <p className="text-[10px] text-slate-400 font-semibold leading-none mb-0.5">Acquisition Channel</p>
                      <p className="text-slate-700 flex items-center gap-1 capitalize">
                        {selectedContact.channel}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2.5 text-xs">
                    <Tag className="w-4 h-4 text-slate-400 shrink-0" />
                    <div>
                      <p className="text-[10px] text-slate-400 font-semibold leading-none mb-0.5">Source Campaign</p>
                      <p className="text-slate-700">{selectedContact.sourceFlow}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Tags section drawer */}
              <div className="pt-5 space-y-3.5">
                <div className="flex justify-between items-center select-none">
                  <h4 className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest">Metadata Tags</h4>
                  <button onClick={addTag} className="text-primary hover:underline text-[9px] font-extrabold flex items-center gap-0.5">
                    <PlusCircle className="w-3 h-3" />
                    Add Tag
                  </button>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {selectedContact.tags.map((tag, idx) => (
                    <Badge
                      key={idx}
                      variant="secondary"
                      className="px-2.5 py-0.5 rounded-full text-[9px] font-extrabold select-none uppercase tracking-tight h-auto group flex items-center gap-1"
                    >
                      <span>{tag}</span>
                      <X className="w-2.5 h-2.5 opacity-60 group-hover:opacity-100 cursor-pointer" onClick={() => removeTag(tag)} />
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Activity Timeline drawer */}
              <div className="pt-5 space-y-4">
                <h4 className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest select-none">Session Logs</h4>
                <div className="relative border-l border-slate-100 pl-4 space-y-6">
                  {selectedContact.timeline.map((item, idx) => {
                    const isBot = item.sender === "bot";
                    return (
                      <div key={idx} className="relative animate-fade-in">
                        <div
                          className={cn(
                            "absolute -left-[23px] top-0 w-3 h-3 rounded-full border-2 border-white shadow-sm",
                            isBot ? "bg-violet-500" : "bg-primary"
                          )}
                        />
                        <div className="flex items-center gap-1.5 mb-1 select-none">
                          <span className="text-[10px] font-extrabold text-slate-800 uppercase tracking-wider flex items-center gap-1">
                            {isBot ? <Bot className="w-3 h-3 text-violet-650" /> : <User className="w-3 h-3 text-primary" />}
                            {isBot ? (item.flowName || "Bot Assistant") : "Lead Client"}
                          </span>
                          <span className="text-[9px] text-slate-400 font-semibold">• {item.time}</span>
                        </div>
                        <div className="bg-slate-50 border border-slate-200/30 p-3 rounded-xl max-w-sm">
                          <p className="text-xs text-slate-650 font-semibold leading-relaxed">{item.text}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Footer action drawer */}
            <div className="p-4 border-t border-slate-100 shrink-0 select-none bg-slate-50/50">
              <Button
                onClick={() => {
                  setIsDrawerOpen(false);
                  window.location.href = "/conversations";
                }}
                className="w-full bg-primary hover:opacity-95 text-on-primary py-5 rounded-xl font-bold flex items-center justify-center gap-2 text-xs shadow-md shadow-primary/10 cursor-pointer h-9"
              >
                <MessageCircle className="w-4 h-4" />
                Open Conversation in Inbox
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
