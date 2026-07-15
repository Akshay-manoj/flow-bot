"use client";

import { useState } from "react";
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
  Instagram,
  Bot,
  User,
  PlusCircle,
  Edit3,
  Globe,
  Tag
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";

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
  const [selectedContactId, setSelectedContactId] = useState("sj");
  const [selectedChannel, setSelectedChannel] = useState("All Channels");
  const [selectedTag, setSelectedTag] = useState("Filter by Tags");
  const [searchQuery, setSearchQuery] = useState("");

  const [contacts, setContacts] = useState<Contact[]>([
    {
      id: "sj",
      name: "Sarah Jenkins",
      initials: "SJ",
      leadId: "#44921",
      channel: "whatsapp",
      tags: ["VIP", "Lead"],
      lastActive: "2 mins ago",
      email: "sarah.j@enterprise.com",
      phone: "+1 (555) 123-4567",
      company: "Enterprise Solutions",
      role: "Product Director",
      sourceFlow: "Onboarding v2",
      avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuBnSU6A-v7PMGAtnsoVvnyDEc-j36-fwe7TbHJUZeNGhZov1KH8FySmgLV-lPdpMdLzQBhTvEhCGXhCBz7mL81X79XRqks2ECS_oH3x3sHh4ybo8quyWmsxRQ9bTq-COeOxPRqgKKbmINcQ5I3MibBFvx31xyvjwmaunh4iMNvH2qyBFt7ra7gqfS9lg19xk3B02n0GJ0ikWLD48RwCeAxRdquvi3H8lY9ICaxzV_2kPVTphuRwAhg8lA",
      timeline: [
        { sender: "bot", flowName: "Onboarding Flow", text: "Welcome to the portal! Would you like to schedule a demo?", time: "10:42 AM" },
        { sender: "user", text: "Yes, please. Looking for Friday afternoon slots.", time: "10:43 AM" },
        { sender: "bot", flowName: "Booking Agent", text: "Sent 3 meeting options via Calendly link.", time: "10:43 AM" },
      ],
    },
    {
      id: "mr",
      name: "Marcus Rivera",
      initials: "MR",
      leadId: "#44919",
      channel: "messenger",
      tags: ["Support"],
      lastActive: "1 hour ago",
      email: "m.rivera@gmail.com",
      phone: "+1 (555) 987-6543",
      company: "Rivera Digital",
      role: "Marketing Manager",
      sourceFlow: "Refund Request",
      timeline: [
        { sender: "user", text: "Hello, I wanted to ask about your refund policy.", time: "09:12 AM" },
        { sender: "bot", flowName: "FAQ Flow", text: "We offer full refunds within 14 days of purchase. Would you like to start a refund ticket?", time: "09:13 AM" },
      ],
    },
    {
      id: "el",
      name: "Elena Lowery",
      initials: "EL",
      leadId: "#44908",
      channel: "instagram",
      tags: ["Qualified"],
      lastActive: "Yesterday",
      email: "elena@creative.studio",
      phone: "+44 20 7946 0958",
      company: "Creative Studio",
      role: "Lead Photographer",
      sourceFlow: "Pricing Inquiry",
      timeline: [
        { sender: "bot", flowName: "Pricing Flow", text: "Hi Elena, our packages start from $49/mo. Would you like to check out the details?", time: "Yesterday" },
        { sender: "user", text: "Sure, send me the enterprise tier brochure.", time: "Yesterday" },
      ],
    },
  ]);

  const selectedContact = contacts.find((c) => c.id === selectedContactId) || contacts[0];

  const handleRowClick = (id: string) => {
    setSelectedContactId(id);
    setIsDrawerOpen(true);
  };

  const addTag = () => {
    const newTag = prompt("Enter a new tag:");
    if (!newTag) return;
    setContacts((prev) =>
      prev.map((c) => {
        if (c.id === selectedContact.id) {
          return { ...c, tags: [...c.tags, newTag] };
        }
        return c;
      })
    );
  };

  const removeTag = (tagToRemove: string) => {
    setContacts((prev) =>
      prev.map((c) => {
        if (c.id === selectedContact.id) {
          return { ...c, tags: c.tags.filter((t) => t !== tagToRemove) };
        }
        return c;
      })
    );
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
    <div className="lg:ml-[260px] flex-grow flex flex-col min-h-screen relative overflow-hidden bg-slate-50/50">
      <Header title="Contacts CRM" />

      {/* Content Canvas */}
      <div className="p-6 flex-1 overflow-x-hidden">
        
        {/* Filter Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6 bg-white p-4 rounded-2xl border border-slate-200/50 shadow-sm select-none">
          <div className="flex flex-wrap items-center gap-2">
            {/* Search Input inline */}
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

            {/* Channel Filter */}
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

            {/* Tag Filter */}
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

            {/* Date Picker */}
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
                    <input className="rounded border-slate-300 text-primary focus:ring-primary/20" type="checkbox" />
                  </th>
                  <th className="px-4 py-3.5 text-[9px] font-extrabold text-slate-400 uppercase tracking-wider">Name</th>
                  <th className="px-4 py-3.5 text-[9px] font-extrabold text-slate-400 uppercase tracking-wider">Channel</th>
                  <th className="px-4 py-3.5 text-[9px] font-extrabold text-slate-400 uppercase tracking-wider">Tags</th>
                  <th className="px-4 py-3.5 text-[9px] font-extrabold text-slate-400 uppercase tracking-wider">Last Active</th>
                  <th className="px-4 py-3.5 text-[9px] font-extrabold text-slate-400 uppercase tracking-wider">Contact Info</th>
                  <th className="px-4 py-3.5 text-[9px] font-extrabold text-slate-400 uppercase tracking-wider">Source Flow</th>
                  <th className="px-6 py-3.5 w-24"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {filteredContacts.map((contact) => (
                  <tr
                    key={contact.id}
                    onClick={() => handleRowClick(contact.id)}
                    className="hover:bg-slate-50/20 transition-colors cursor-pointer group"
                  >
                    <td className="px-6 py-4.5 text-center" onClick={(e) => e.stopPropagation()}>
                      <input className="rounded border-slate-300 text-primary focus:ring-primary/20" type="checkbox" />
                    </td>
                    <td className="px-4 py-4.5">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-extrabold border border-primary/15 text-xs">
                          {contact.initials}
                        </div>
                        <div>
                          <div className="text-xs font-bold text-slate-800">{contact.name}</div>
                          <div className="text-[10px] text-slate-400 font-semibold mt-0.5">Lead ID: {contact.leadId}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4.5 select-none">
                      <span
                        className={`inline-flex items-center justify-center w-7 h-7 rounded-lg text-white font-bold text-xs ${
                          contact.channel === "whatsapp"
                            ? "bg-[#25D366]"
                            : contact.channel === "messenger"
                            ? "bg-[#0084FF]"
                            : contact.channel === "instagram"
                            ? "bg-pink-500"
                            : "bg-primary"
                        }`}
                        title={contact.channel}
                      >
                        {contact.channel === "whatsapp" ? "W" : contact.channel === "messenger" ? "M" : contact.channel === "instagram" ? "I" : "WS"}
                      </span>
                    </td>
                    <td className="px-4 py-4.5 select-none">
                      <div className="flex gap-1 flex-wrap">
                        {contact.tags.map((tag, i) => (
                          <Badge
                            key={i}
                            variant="secondary"
                            className="bg-primary/5 text-primary-fixed-dim px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-tight h-auto"
                          >
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </td>
                    <td className="px-4 py-4.5 text-xs text-slate-500">{contact.lastActive}</td>
                    <td className="px-4 py-4.5">
                      <div className="text-xs text-slate-800 font-bold">{contact.email}</div>
                      <div className="text-[10px] text-slate-400 font-semibold mt-0.5">{contact.phone}</div>
                    </td>
                    <td className="px-4 py-4.5 select-none">
                      <Badge variant="outline" className="bg-slate-50 text-slate-600 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider h-auto border-slate-200/50">
                        {contact.sourceFlow}
                      </Badge>
                    </td>
                    <td className="px-6 py-4.5 text-right select-none">
                      <Button size="sm" className="opacity-0 group-hover:opacity-100 bg-primary hover:opacity-90 text-on-primary px-4 py-1.5 rounded-xl text-xs font-bold shadow-sm transition-all h-8 cursor-pointer">
                        View
                      </Button>
                    </td>
                  </tr>
                ))}
                {filteredContacts.length === 0 && (
                  <tr>
                    <td colSpan={8} className="p-8 text-center text-xs text-slate-400 font-semibold">
                      No contacts found matching the filters.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between px-6 py-4.5 bg-white border-t border-slate-100 select-none">
            <div className="text-xs text-slate-400 font-bold">
              Showing 1-{filteredContacts.length} of {filteredContacts.length} contacts
            </div>
            <div className="flex items-center gap-1.5">
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8 rounded-xl border border-slate-200 text-slate-400 hover:bg-slate-50 disabled:opacity-35 cursor-pointer"
                disabled
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </Button>
              <Button size="sm" className="h-8 px-3.5 bg-primary text-on-primary rounded-xl text-xs font-bold cursor-pointer">
                1
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8 rounded-xl border border-slate-200 text-slate-400 hover:bg-slate-50 disabled:opacity-35 cursor-pointer"
                disabled
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side Drawer Panel */}
      {isDrawerOpen && (
        <>
          <div
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40"
            onClick={() => setIsDrawerOpen(false)}
          />
          <div className="fixed inset-y-0 right-0 w-full sm:w-[460px] bg-white shadow-2xl border-l border-slate-100 z-50 flex flex-col animate-slide-in">

            {/* Header */}
            <div className="p-4.5 border-b border-slate-100 flex items-center justify-between select-none">
              <h3 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider">Contact Profile</h3>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-slate-400 hover:text-slate-600 rounded-lg cursor-pointer"
                onClick={() => setIsDrawerOpen(false)}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* Profile Hero */}
              <div className="flex flex-col items-center text-center">
                <div className="w-20 h-20 rounded-full overflow-hidden border-4 border-slate-100 shadow-md mb-3.5 select-none">
                  <img className="w-full h-full object-cover" src={selectedContact.avatar || "https://lh3.googleusercontent.com/aida-public/AB6AXuBnSU6A-v7PMGAtnsoVvnyDEc-j36-fwe7TbHJUZeNGhZov1KH8FySmgLV-lPdpMdLzQBhTvEhCGXhCBz7mL81X79XRqks2ECS_oH3x3sHh4ybo8quyWmsxRQ9bTq-COeOxPRqgKKbmINcQ5I3MibBFvx31xyvjwmaunh4iMNvH2qyBFt7ra7gqfS9lg19xk3B02n0GJ0ikWLD48RwCeAxRdquvi3H8lY9ICaxzV_2kPVTphuRwAhg8lA"} alt={selectedContact.name} />
                </div>
                <h4 className="text-sm font-extrabold text-slate-800 leading-tight">{selectedContact.name}</h4>
                <div className="flex items-center gap-1 mt-1 select-none">
                  <CheckCircle className="w-3.5 h-3.5 text-primary" />
                  <span className="text-slate-400 text-[10px] font-bold uppercase tracking-wider">Lead ID: {selectedContact.leadId}</span>
                </div>
              </div>

              {/* Tag Editor */}
              <div className="space-y-2">
                <div className="flex items-center justify-between select-none">
                  <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest">Tags</span>
                  <button onClick={addTag} className="text-primary text-[9px] font-extrabold hover:underline">
                    + Add Tag
                  </button>
                </div>
                <div className="flex flex-wrap gap-1.5 select-none">
                  {selectedContact.tags.map((tag) => (
                    <Badge
                      key={tag}
                      variant="secondary"
                      className="flex items-center gap-1 bg-primary/10 text-primary-fixed-dim px-2.5 py-0.5 rounded-full text-[9px] font-extrabold uppercase tracking-tight h-auto"
                    >
                      {tag}
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-3.5 w-3.5 rounded-full p-0 text-primary-fixed-dim hover:text-primary cursor-pointer hover:bg-transparent"
                        onClick={() => removeTag(tag)}
                      >
                        <X className="w-2.5 h-2.5" />
                      </Button>
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Fields Grid */}
              <div className="space-y-3">
                <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest block select-none">
                  Captured CRM Fields
                </span>
                <div className="grid grid-cols-2 gap-3 font-semibold">
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                    <div className="text-slate-400 text-[9px] font-extrabold uppercase tracking-wider mb-1 flex items-center gap-1"><Mail className="w-3 h-3 text-slate-400" /> Email</div>
                    <div className="text-xs text-slate-700 truncate select-all">{selectedContact.email}</div>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                    <div className="text-slate-400 text-[9px] font-extrabold uppercase tracking-wider mb-1 flex items-center gap-1"><Phone className="w-3 h-3 text-slate-400" /> Phone</div>
                    <div className="text-xs text-slate-700 select-all">{selectedContact.phone}</div>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                    <div className="text-slate-400 text-[9px] font-extrabold uppercase tracking-wider mb-1 flex items-center gap-1"><Building2 className="w-3 h-3 text-slate-400" /> Company</div>
                    <div className="text-xs text-slate-700 truncate">{selectedContact.company}</div>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                    <div className="text-slate-400 text-[9px] font-extrabold uppercase tracking-wider mb-1 flex items-center gap-1"><Edit3 className="w-3 h-3 text-slate-400" /> Job Title</div>
                    <div className="text-xs text-slate-700 truncate">{selectedContact.role}</div>
                  </div>
                </div>
              </div>

              {/* Timeline */}
              <div>
                <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest block mb-4 select-none">
                  Conversation History
                </span>
                <div className="space-y-6 border-l-2 border-slate-150 ml-2 pl-4.5 relative">
                  {selectedContact.timeline.map((item, i) => (
                    <div key={i} className="relative animate-fade-in">
                      <div
                        className={`absolute -left-[24.5px] top-1.5 w-3 h-3 rounded-full ring-4 ring-white ${
                          item.sender === "bot" ? "bg-primary" : "bg-slate-400"
                        }`}
                      />
                      <div className="flex justify-between items-start mb-1 select-none font-semibold">
                        <span className={`text-[10px] uppercase tracking-wider flex items-center gap-1 ${item.sender === "bot" ? "text-primary" : "text-slate-500"}`}>
                          {item.sender === "bot" ? <Bot className="w-3.5 h-3.5" /> : <User className="w-3.5 h-3.5" />}
                          {item.sender === "bot" ? `Bot: ${item.flowName}` : "Contact"}
                        </span>
                        <span className="text-[9px] text-slate-400">{item.time}</span>
                      </div>
                      <div className="bg-slate-50 border border-slate-200/40 p-3 rounded-2xl text-xs font-medium text-slate-700 leading-relaxed shadow-sm">
                        {item.text}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Footer Actions */}
            <div className="p-4 border-t border-slate-100 bg-white grid grid-cols-2 gap-3 select-none">
              <Button variant="outline" className="py-2.5 rounded-xl font-bold text-xs hover:bg-slate-50 transition-all cursor-pointer h-9 text-slate-700">
                Edit Profile
              </Button>
              <Button
                onClick={() => setIsDrawerOpen(false)}
                className="bg-primary text-on-primary py-2.5 rounded-xl font-bold text-xs shadow-md shadow-primary/10 hover:opacity-95 transition-all cursor-pointer h-9"
              >
                Send Message
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
