"use client";

import { useState } from "react";
import Header from "../../components/Header";
import {
  Sliders,
  Users,
  CreditCard,
  Key,
  Webhook,
  Plus,
  Trash2,
  Download,
  Check,
  X,
  Info,
  Construction,
  PlusCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface Member {
  name: string;
  role: "Owner" | "Admin" | "Member" | "Viewer";
  email: string;
  joined: string;
  avatar: string;
}

interface Invoice {
  date: string;
  amount: string;
  status: "Paid" | "Failed";
}

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<"general" | "team" | "billing" | "api" | "webhooks">("billing");
  
  const [members, setMembers] = useState<Member[]>([
    {
      name: "Sarah Chen",
      role: "Owner",
      email: "sarah@flowbot.ai",
      joined: "Aug 2023",
      avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuD0KoAt0cHQCKtKGbB6Tg9TMabennfEJ_hXPA1xKffTmqZJFG5_TlOmInXOkNRjGJNSbuuA_u0kAPqpfAS1GiXeK4xWE-bs7MvIeNmANGcbUAw-eOlBJfxnidRgwML2Wt60vqBbjUGeKPIr2AncKbOzUGT-f1h0LKjQ2cf_wkSsE3k9O46XubMIyiky6FbUj7nxBxLRx78rWSKBiUzojXbdUv1Nuf9N37krRGDnTOcZ5640E-WHJAGuAg",
    },
    {
      name: "Marcus Miller",
      role: "Member",
      email: "marcus@flowbot.ai",
      joined: "Sep 2023",
      avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuDVldqii8hAUytfwk6vxBHaAWbSVD2SIutWsZHfqquhXxQaFvcCW_RAgZWop4zjXvqWspm0SRYj7_C9uvYMFlSL-QLG67HhrYr2tBsNEi5vbzfUvXmkAncWQtjZa8GasGuaNzRBKz64zGnrKZxrESX2y67NXCcmVJAJ_Ro6j2GdOqGOx9LnpAaYuYpnNY-BviX_7UeDngp_PMcpheZI5X7-ESpAfS1kaaYT4tJQeXfZjRZzIbQwFeUjFg",
    },
    {
      name: "Elena Rodriguez",
      role: "Viewer",
      email: "elena@flowbot.ai",
      joined: "Oct 2023",
      avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuBOkQvc4ks7EI_P0-1IWfHGaGccP-iQeZc5rssYICvAMlqyw2MiKfHx5fYc_9rI54g1P0E0Oay18EpR5gccbpCP_PsfSkmu_cc0IGCb2aRghAiBncXZekK96--ac10g0_QgzazjpIplAk8eJ3X9RVtXg_P-6O3iNOenNwrvvtVCfyGJRC7ua-iD2JJFuK63SbiCaeafUyGqR6KHS94JJqEyrd1PLowyrfz2qcuNDIJ4Ud8gb4gXb3cCrQ",
    },
  ]);

  const invoices: Invoice[] = [
    { date: "Sep 24, 2023", amount: "$49.00", status: "Paid" },
    { date: "Aug 24, 2023", amount: "$49.00", status: "Paid" },
  ];

  const handleRoleChange = (email: string, nextRole: Member["role"]) => {
    setMembers(members.map((m) => (m.email === email ? { ...m, role: nextRole } : m)));
    alert(`Changed role of ${email} to ${nextRole}`);
  };

  const handleDeleteMember = (email: string) => {
    if (confirm(`Are you sure you want to remove ${email}?`)) {
      setMembers(members.filter((m) => m.email !== email));
    }
  };

  const getBreadcrumbTitle = () => {
    if (activeTab === "billing") return "Billing & Plan";
    if (activeTab === "team") return "Team Members";
    if (activeTab === "general") return "General Settings";
    if (activeTab === "api") return "API Keys";
    return "Webhooks";
  };

  return (
    <div className="flex-grow flex flex-col min-h-screen bg-slate-50/50">
      
      {/* Top App Bar */}
      <header className="h-16 flex justify-between items-center px-6 sticky top-0 bg-white border-b border-slate-100 z-40 shrink-0 select-none">
        <div className="flex items-center gap-2 text-xs font-semibold">
          <span className="text-slate-400">Settings</span>
          <span className="text-slate-300">/</span>
          <span className="text-slate-800 font-bold">{getBreadcrumbTitle()}</span>
        </div>
      </header>

      <div className="flex flex-col md:flex-row flex-1">
        
        {/* Settings Sub-Navigation */}
        <aside className="w-full md:w-64 border-b md:border-b-0 md:border-r border-slate-100 bg-white p-6 select-none shrink-0">
          <nav className="space-y-1.5">
            {[
              { id: "general", name: "General Settings", icon: Sliders },
              { id: "team", name: "Team Members", icon: Users },
              { id: "billing", name: "Billing & Plan", icon: CreditCard },
              { id: "api", name: "API Keys", icon: Key },
              { id: "webhooks", name: "Webhooks Integrations", icon: Webhook },
            ].map((tab) => {
              const isActive = activeTab === tab.id;
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-left transition-all cursor-pointer ${
                    isActive
                      ? "bg-slate-50 border border-slate-100 text-slate-800 font-bold shadow-none"
                      : "text-slate-500 hover:text-slate-800 hover:bg-slate-50/40 font-semibold"
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? "text-primary" : "text-slate-400"}`} />
                  <span className="text-xs">{tab.name}</span>
                </button>
              );
            })}
          </nav>
        </aside>

        {/* Settings Content Container */}
        <div className="flex-1 p-8">
          <div className="max-w-[760px] mx-auto space-y-8">
            
            {/* Billing & Plan View */}
            {activeTab === "billing" && (
              <div className="space-y-6">
                <div className="flex justify-between items-end select-none">
                  <div>
                    <h2 className="text-xl font-extrabold text-slate-800 tracking-tight">Billing &amp; Plan</h2>
                    <p className="text-xs text-slate-400 font-semibold mt-1.5">Manage your subscription, usage limits, and invoices.</p>
                  </div>
                  <Button className="h-8.5 rounded-xl font-bold text-xs bg-primary hover:opacity-90 text-on-primary px-4.5 cursor-pointer shadow-md shadow-primary/10">
                    Upgrade Plan
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Current Plan Card */}
                  <div className="col-span-2 bg-white rounded-2xl border border-slate-200/50 p-6 shadow-sm flex flex-col justify-between">
                    <div className="flex justify-between items-start mb-6">
                      <div>
                        <Badge className="bg-primary/10 text-primary border border-primary/20 text-[9px] font-extrabold rounded-full mb-2 h-auto">
                          Current Plan
                        </Badge>
                        <h3 className="font-bold text-sm text-slate-800">Growth Tier</h3>
                        <p className="text-3xl font-extrabold text-primary mt-2">
                          $49<span className="text-xs font-bold text-slate-400">/mo</span>
                        </p>
                      </div>
                      <div className="text-right select-none font-semibold">
                        <p className="text-[10px] text-slate-400 uppercase tracking-wider font-extrabold">Next billing date</p>
                        <p className="text-xs text-slate-800 font-bold mt-1">Oct 24, 2023</p>
                      </div>
                    </div>
                    <div className="space-y-3 pt-2">
                      <div className="flex justify-between items-center text-xs font-bold text-slate-600">
                        <span>Conversation Usage</span>
                        <span className="text-slate-400">3,200 / 5,000 used</span>
                      </div>
                      <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full bg-primary rounded-full w-[64%]" />
                      </div>
                      <p className="text-[9px] text-slate-400 font-semibold italic">Resets in 12 days. Automated top-ups are disabled.</p>
                    </div>
                  </div>

                  {/* Payment Method Card */}
                  <div className="bg-white rounded-2xl border border-slate-200/50 p-6 shadow-sm flex flex-col justify-between">
                    <h3 className="font-bold text-xs text-slate-800 select-none">Payment Method</h3>
                    <div className="flex-grow flex flex-col justify-center py-4 select-text">
                      <div className="flex items-center gap-3 p-3 border border-slate-200/50 rounded-xl bg-slate-50/50 font-bold">
                        <div className="w-10 h-7 bg-slate-900 rounded-lg flex items-center justify-center text-white font-extrabold text-[9px] italic select-none">
                          VISA
                        </div>
                        <div>
                          <p className="text-xs text-slate-800">•••• 4242</p>
                          <p className="text-[9px] text-slate-400 font-semibold mt-0.5">Exp: 12/25</p>
                        </div>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      onClick={() => alert("Redirecting to payment details...")}
                      className="w-full h-8.5 rounded-xl border border-slate-200 text-slate-700 text-xs font-bold hover:bg-slate-50 cursor-pointer shadow-none select-none"
                    >
                      Edit Details
                    </Button>
                  </div>
                </div>

                {/* Plan Comparison Table */}
                <div className="bg-white rounded-2xl border border-slate-200/50 overflow-hidden shadow-sm">
                  <div className="p-5 border-b border-slate-100 select-none">
                    <h3 className="font-bold text-xs text-slate-800">Compare Tier Benefits</h3>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left">
                      <thead>
                        <tr className="bg-slate-50/50 text-[9px] font-extrabold text-slate-400 uppercase tracking-widest">
                          <th className="px-6 py-3.5">Feature</th>
                          <th className="px-6 py-3.5">Starter</th>
                          <th className="px-6 py-3.5 text-primary">Growth</th>
                          <th className="px-6 py-3.5">Scale</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 text-xs text-slate-500 font-semibold">
                        <tr>
                          <td className="px-6 py-3 font-bold text-slate-800">Chats /mo</td>
                          <td className="px-6 py-3">1,000</td>
                          <td className="px-6 py-3 font-bold text-primary">5,000</td>
                          <td className="px-6 py-3">Unlimited</td>
                        </tr>
                        <tr>
                          <td className="px-6 py-3 font-bold text-slate-800">Active Bots</td>
                          <td className="px-6 py-3">2</td>
                          <td className="px-6 py-3 font-bold text-primary">10</td>
                          <td className="px-6 py-3">Unlimited</td>
                        </tr>
                        <tr>
                          <td className="px-6 py-3 font-bold text-slate-800">Remove Branding</td>
                          <td className="px-6 py-3 text-rose-500">
                            <X className="w-4.5 h-4.5" />
                          </td>
                          <td className="px-6 py-3 text-primary">
                            <Check className="w-4.5 h-4.5" />
                          </td>
                          <td className="px-6 py-3 text-primary">
                            <Check className="w-4.5 h-4.5" />
                          </td>
                        </tr>
                        <tr>
                          <td className="px-6 py-3 font-bold text-slate-800">API Webhooks</td>
                          <td className="px-6 py-3 text-rose-500">
                            <X className="w-4.5 h-4.5" />
                          </td>
                          <td className="px-6 py-3 text-primary">
                            <Check className="w-4.5 h-4.5" />
                          </td>
                          <td className="px-6 py-3 text-primary">
                            <Check className="w-4.5 h-4.5" />
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Past Invoices */}
                <div className="bg-white rounded-2xl border border-slate-200/50 overflow-hidden shadow-sm">
                  <div className="p-5 border-b border-slate-100 flex justify-between items-center select-none">
                    <h3 className="font-bold text-xs text-slate-800">Invoices History</h3>
                    <Button variant="link" className="text-primary text-xs font-bold hover:underline p-0 h-auto cursor-pointer">
                      Download All
                    </Button>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left">
                      <thead>
                        <tr className="bg-slate-50/50 text-[9px] font-extrabold text-slate-400 uppercase tracking-widest">
                          <th className="px-6 py-3.5">Date</th>
                          <th className="px-6 py-3.5">Amount</th>
                          <th className="px-6 py-3.5">Status</th>
                          <th className="px-6 py-3.5 text-right"></th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 text-xs text-slate-500 font-semibold">
                        {invoices.map((inv, idx) => (
                          <tr key={idx} className="hover:bg-slate-50/20 transition-colors">
                            <td className="px-6 py-3.5 font-bold text-slate-800">{inv.date}</td>
                            <td className="px-6 py-3.5">{inv.amount}</td>
                            <td className="px-6 py-3.5 select-none">
                              <Badge className="bg-emerald-50 text-emerald-600 border border-emerald-100 text-[10px] font-bold py-0.5 px-2 rounded-full h-auto">
                                {inv.status}
                              </Badge>
                            </td>
                            <td className="px-6 py-3.5 text-right select-none">
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-7 w-7 text-slate-400 hover:text-slate-800 rounded-lg cursor-pointer"
                              >
                                <Download className="w-4 h-4" />
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* Team Members View */}
            {activeTab === "team" && (
              <div className="space-y-6">
                <div className="flex justify-between items-end select-none">
                  <div>
                    <h2 className="text-xl font-extrabold text-slate-800 tracking-tight">Team Members</h2>
                    <p className="text-xs text-slate-400 font-semibold mt-1.5">Manage roles and permissions for your team workspace.</p>
                  </div>
                  <Button
                    onClick={() => {
                      const email = prompt("Enter email of the team member to invite:");
                      if (email) {
                        alert(`Invited ${email} to join FlowBot workspace.`);
                      }
                    }}
                    className="h-8.5 bg-primary text-on-primary text-xs font-bold rounded-xl px-4.5 hover:opacity-90 transition-all flex items-center gap-1.5 cursor-pointer shadow-md shadow-primary/10"
                  >
                    <PlusCircle className="w-4 h-4" />
                    Invite Member
                  </Button>
                </div>

                <div className="bg-white rounded-2xl border border-slate-200/50 overflow-hidden shadow-sm">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="bg-slate-50/50 text-[9px] font-extrabold text-slate-400 uppercase tracking-widest">
                        <th className="px-6 py-3.5">Member</th>
                        <th className="px-6 py-3.5">Email</th>
                        <th className="px-6 py-3.5">Role</th>
                        <th className="px-6 py-3.5 text-right"></th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-xs text-slate-500 font-semibold">
                      {members.map((member) => (
                        <tr key={member.email} className="hover:bg-slate-50/20 transition-colors">
                          <td className="px-6 py-3.5">
                            <div className="flex items-center gap-3">
                              <img className="w-9 h-9 rounded-full object-cover border border-slate-100 shadow-sm" src={member.avatar} alt={member.name} />
                              <div>
                                <p className="font-bold text-slate-800 text-xs">{member.name}</p>
                                <p className="text-[9px] text-slate-400 font-semibold mt-0.5">Joined {member.joined}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-3.5 font-mono text-[11px]">{member.email}</td>
                          <td className="px-6 py-3.5">
                            {member.role === "Owner" ? (
                              <span className="text-primary font-bold font-sans">Owner</span>
                            ) : (
                              <select
                                value={member.role}
                                onChange={(e) => handleRoleChange(member.email, e.target.value as any)}
                                className="bg-transparent border-none focus:ring-0 text-xs font-bold cursor-pointer text-primary p-0 outline-none"
                              >
                                <option>Admin</option>
                                <option>Member</option>
                                <option>Viewer</option>
                              </select>
                            )}
                          </td>
                          <td className="px-6 py-3.5 text-right select-none">
                            {member.role !== "Owner" && (
                              <Button
                                onClick={() => handleDeleteMember(member.email)}
                                variant="ghost"
                                size="icon"
                                className="h-7 w-7 text-slate-400 hover:text-rose-500 rounded-lg hover:bg-rose-50 cursor-pointer"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="p-4 bg-primary/5 rounded-2xl border border-primary/10 flex items-start gap-3 select-none">
                  <Info className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs font-bold text-primary">Plan Seat Limit Warning</p>
                    <p className="text-xs text-slate-500 mt-0.5 font-semibold leading-relaxed">
                      You have used 3 out of 5 seats available on your current plan.{" "}
                      <a className="text-primary hover:underline font-bold" href="#">
                        Upgrade to Scale
                      </a>{" "}
                      for unlimited workspace team seats.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Placeholder under construction general, api, webhooks */}
            {(activeTab === "general" || activeTab === "api" || activeTab === "webhooks") && (
              <div className="py-20 flex flex-col items-center justify-center text-center opacity-40 select-none">
                <Construction className="w-12 h-12 text-slate-400 mb-4" />
                <h2 className="text-sm font-bold text-slate-850 uppercase tracking-wider">Section under construction</h2>
                <p className="text-xs text-slate-450 mt-1 font-semibold">
                  We&apos;re fine-tuning this part of the settings. Check back shortly!
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
