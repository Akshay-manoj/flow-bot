"use client";

import { useState } from "react";
import Header from "../../components/Header";
import {
  Blocks,
  Globe,
  Terminal,
  ArrowRight,
  ExternalLink
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface Integration {
  id: string;
  name: string;
  logo: string;
  category: "CRM" | "Payments" | "Calendar" | "E-commerce" | "Automation";
  connected: boolean;
  description: string;
  bgColor: string;
  borderColor: string;
}

export default function IntegrationsPage() {
  const [filter, setFilter] = useState<string>("All");
  const [integrations, setIntegrations] = useState<Integration[]>([
    {
      id: "sheets",
      name: "Google Sheets",
      logo: "https://lh3.googleusercontent.com/aida-public/AB6AXuALmL29OHG_CMc3PmGnKK1purBJyluiL-LEsA3z7riC7A_ev6ukDVOBNIKQEy_ZsMnVK2Gs_VKqlqJtTzAafkTy8wwkgekIB-pUsWVH-MTMHNASac0_W_kqDJH-RjdgNXEIhxphy6KTx8a6zFUHpGxMFCVsqtVI1PMheIQoOjjw-iFd_4H6HDkN4TuKPUkc0wETyGO7NN41GcQHdiaVGqKnOheElscCBkhRG2cA1yGeQJbE7GJkjQ-ZDw",
      category: "Automation",
      connected: true,
      description: "Sync chat data and user responses directly into spreadsheet rows for easy analysis.",
      bgColor: "bg-green-50",
      borderColor: "border-green-100",
    },
    {
      id: "calendar",
      name: "Google Calendar",
      logo: "https://lh3.googleusercontent.com/aida-public/AB6AXuDbUPJkGP143znYIlKPfcGmOcmk3abmifG03rSk6yzLqEzj8d_32NeW61yWbI_C61c-3VTIju7zC2DSQ9MyxI4HI_eJUk7m_f5WxDX3vcvRI6CKXLSdGOlLROIxSfAW-p1IqeB1WZgfrxZ-gRwqiao_qpEVzjUYlaeUGe3lY5uBSi6u9TGM8AswWSZ43t_VxEFUw3tPYKfWuaiwiO7xvFmlXPaVVklztD5qsYNFnaUm79NJddC-xpuqmA",
      category: "Calendar",
      connected: false,
      description: "Allow bots to book meetings, check availability, and manage appointments automatically.",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-100",
    },
    {
      id: "shopify",
      name: "Shopify",
      logo: "https://lh3.googleusercontent.com/aida-public/AB6AXuCXodYxtdE3WHGxtQnYj6mgLMDFpKeHSdhKV3N9WiP7mTWdoL7OymVNe1Qv7yU6REQQGSJbJy3k5C099h66GUtjH-Hg7m69Gs66VLOiFbFHP6a6RVFSmMwvVqIs94W_CJ-XxcalUoUrbMaFcTAld3jLSPeo04TnC5PNFiyy45fFUTlCBjaCoB7q9UC09w9UHIjCWlk5d02GyfT_3NQL3qPTGX4x48FRCoMzTZ1-P_PmgKrNHGdlGq9qxw",
      category: "E-commerce",
      connected: false,
      description: "Retrieve order status, manage inventory inquiries, and drive sales through chat.",
      bgColor: "bg-[#95BF47]/10",
      borderColor: "border-[#95BF47]/20",
    },
    {
      id: "stripe",
      name: "Stripe",
      logo: "https://lh3.googleusercontent.com/aida-public/AB6AXuDoMhJZsgAocOm47Joz0gDaBCdcmT6qdHX-ho3HwcKgfvCysqwQU_bFwiGLGRCmxFPwZA_6LBpC8v8BQgDC-YKoQR-AvdaVPCxDWHt9fBRtBgKBtBWqNzQuZVABs7B06Xz3_TBzEZiLIvKR-6BOIX355cemicyKhRURTfJTMHVTkaUxdI8dQRuuoOXVMzCDYSSTqQGNYAFW6a4H9A37IkPICsn7xqdzJI2IGXwo-c18UR9sB2mIj5UxQQ",
      category: "Payments",
      connected: true,
      description: "Process payments, manage subscriptions, and send invoices during bot interactions.",
      bgColor: "bg-[#635BFF]/10",
      borderColor: "border-[#635BFF]/20",
    },
    {
      id: "zoho",
      name: "Zoho CRM",
      logo: "https://lh3.googleusercontent.com/aida-public/AB6AXuBfSwGf_vKJRksjkozrcJs1kjdKsFNJdPMjmBsJlP1RfEV863npTceKH8Y83_uwh1fX0T3tKM-bgn6ZR7X_CxttAeX_mdqfmI1udBOHvBNXViM0qBnLBjeh6bHNTKkIdIiNbH9FQrITPLp4uxjZCr6GwLT3czPP9tm2jla54-6EJIQcc8AgK3Qe9OOZM7gOWpRkfv6Jm4asJaCAFfzhOpbVcDLpj8D_1MuUPihE2sjKTd5QkdSABEPQJg",
      category: "CRM",
      connected: false,
      description: "Lead capture and data synchronization between chat flows and your sales pipeline.",
      bgColor: "bg-red-50",
      borderColor: "border-red-100",
    },
    {
      id: "hubspot",
      name: "HubSpot",
      logo: "https://lh3.googleusercontent.com/aida-public/AB6AXuBhr9m-hnw0pGIbuQh3aZvxY2EIxjFDPdkfjmArwDUtvgAEdVZtI3fCoWElCGDH5AyhX3NPHey6AzyVesWSfOC_4KcpQ2DdnY3B_Ly1CCV-WqRojTTnnHTUMUoNgw1VNJC3nxwcawSg03bpTEQ_MDxgr4-ekpLcqhxIO-ZkMok-wYOhzc0rtzkPyL_OuM-4TLq0cNaT_JfoTAV8Q5foA6iQ5igfXp5ejdYQKszf-WahliAOtRTZLYs2lA",
      category: "CRM",
      connected: false,
      description: "Create tickets, update contacts, and trigger marketing workflows through conversations.",
      bgColor: "bg-[#FF7A59]/10",
      borderColor: "border-[#FF7A59]/20",
    },
    {
      id: "zapier",
      name: "Zapier",
      logo: "https://lh3.googleusercontent.com/aida-public/AB6AXuA6D1dFiAC1DQu8d3JdrZIj8wr3vkelEVDNPyEh-wxVwt8BLSMEWILVMKxbam0NVMAIic39Q59z6WLpVbJ6npmprlMmpZkex6sNX_e3DTe2x3E8_p_VkjbcxfJt6XgfpfpFaPMUG8_BAbPPMm0RvtD31uXymt-yOEAtagoVgSumyzeDKx5494Ypt6bZLEa_gTnWH9sQXu_IxujvMU0tABV0N5_g2Q7wEHE84W7XfY_Jhvrdmm_MslzXEQ",
      category: "Automation",
      connected: false,
      description: "Connect FlowBot to 5,000+ apps to create complex cross-platform automations.",
      bgColor: "bg-[#FF4F00]/10",
      borderColor: "border-[#FF4F00]/20",
    },
    {
      id: "slack",
      name: "Slack",
      logo: "https://lh3.googleusercontent.com/aida-public/AB6AXuDLAI4tiPPPAb1AlGQSgFrKgFTg5d5gcxEAX0kISo8jcN4ytSKsK_IL0zQg35IkT4Z4iAIfvzbfPfbnEqkYNcelsJ-pZWaZ3El9cTHGu-3axnweiRtkbsc7VyuRfBW2frVDT9_Negxe4z0YjVAJ4YBsfl_lw_GuWA_xoxdauix_-Am9F8hOcOorvRlNU9ek4ml8I8ipyK41rH5jtWs1HTEuqpfu0Q68QXuxtQAetEIMrLVgh3u48aD2aw",
      category: "Automation",
      connected: false,
      description: "Get real-time notifications and hand off bot conversations to human agents in Slack.",
      bgColor: "bg-white",
      borderColor: "border-slate-200/50",
    },
  ]);

  const toggleConnection = (id: string) => {
    setIntegrations(
      integrations.map((item) => {
        if (item.id === id) {
          const state = !item.connected;
          if (state) {
            alert(`Connecting to ${item.name}...`);
          } else {
            alert(`Disconnected from ${item.name}`);
          }
          return { ...item, connected: state };
        }
        return item;
      })
    );
  };

  const filteredIntegrations = integrations.filter((item) => {
    if (filter === "All") return true;
    return item.category === filter;
  });

  return (
    <div className="lg:ml-[260px] flex-grow flex flex-col min-h-screen bg-slate-50/50">
      <Header title="Integrations Marketplace" />


      {/* Marketplace Canvas */}
      <main className="flex-grow p-6 max-w-[1100px] mx-auto w-full space-y-6">
        
        {/* Header Section */}
        <section className="select-none">
          <h2 className="text-xl font-extrabold text-slate-800 tracking-tight">Integrations Marketplace</h2>
          <p className="text-xs text-slate-400 font-semibold mt-1.5">
            Connect your favorite tools to automate workflows and sync customer data in real time.
          </p>
        </section>

        {/* Filters */}
        <section className="flex flex-wrap items-center gap-1.5 select-none">
          {["All", "CRM", "Payments", "Calendar", "E-commerce", "Automation"].map((cat) => {
            const isCurrent = filter === cat;
            return (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`px-4.5 py-1.5 rounded-full text-[10px] font-extrabold tracking-wider transition-all cursor-pointer uppercase ${
                  isCurrent
                    ? "bg-slate-900 text-white"
                    : "bg-white border border-slate-200 hover:bg-slate-50 text-slate-500 hover:text-slate-800"
                }`}
              >
                {cat}
              </button>
            );
          })}
        </section>

        {/* Integration Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredIntegrations.map((item) => (
            <div
              key={item.id}
              className={`bg-white border border-slate-200/50 rounded-2xl p-5 flex flex-col transition-all duration-300 hover:shadow-lg hover:shadow-slate-100/50 hover:border-primary/50`}
            >
              <div className="flex justify-between items-start mb-4">
                <div className={`w-11 h-11 rounded-xl ${item.bgColor} border border-slate-150 flex items-center justify-center shrink-0 shadow-sm p-1.5`}>
                  <img className="w-full h-full object-contain" src={item.logo} alt={item.name} />
                </div>
                {item.connected && (
                  <Badge className="bg-emerald-50 text-emerald-600 border border-emerald-100 text-[10px] font-bold py-0.5 px-2 rounded-full h-auto flex items-center gap-1 select-none">
                    <span className="w-1.5 h-1.5 bg-emerald-600 rounded-full inline-block animate-pulse" />
                    Connected
                  </Badge>
                )}
              </div>
              <h3 className="font-bold text-xs text-slate-800 mb-1">{item.name}</h3>
              <p className="text-xs text-slate-500 flex-grow mb-6 leading-relaxed font-medium">
                {item.description}
              </p>
              <div className="flex items-center justify-between mt-auto select-none">
                {item.connected ? (
                  <>
                    <Button
                      variant="link"
                      onClick={() => alert(`Configuring ${item.name} variables...`)}
                      className="text-primary font-bold text-xs hover:underline p-0 cursor-pointer h-auto"
                    >
                      Manage
                    </Button>
                    <Button
                      onClick={() => toggleConnection(item.id)}
                      variant="outline"
                      className="h-8 rounded-xl px-3 text-xs font-bold border border-slate-200 text-slate-650 hover:bg-slate-50 cursor-pointer shadow-none"
                    >
                      Disconnect
                    </Button>
                  </>
                ) : (
                  <>
                    <span className="text-[9px] text-slate-400 font-extrabold uppercase tracking-wider">{item.category}</span>
                    <Button
                      onClick={() => toggleConnection(item.id)}
                      className="bg-primary text-on-primary px-4 py-1.5 rounded-xl text-xs font-bold hover:opacity-90 shadow-md shadow-primary/10 transition-all cursor-pointer h-8"
                    >
                      Connect
                    </Button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Promotion / CTA Section (Bento Style) */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 select-none">
          <div className="md:col-span-2 relative overflow-hidden bg-primary rounded-2xl p-8 text-on-primary shadow-lg shadow-primary/10 border border-primary/20 flex flex-col justify-between min-h-[160px]">
            <div className="relative z-10 space-y-3.5">
              <h3 className="text-lg font-bold">Request a Custom Integration</h3>
              <p className="text-xs text-white/90 max-w-md leading-relaxed font-medium">
                Don&apos;t see the tool you use? Our engineering team can build custom API bridges for your enterprise needs.
              </p>
              <Button className="bg-white text-primary px-5 py-2.5 rounded-xl text-xs font-bold hover:bg-slate-50 transition-all cursor-pointer shadow-sm">
                Talk to Sales
              </Button>
            </div>
            <div className="absolute right-0 bottom-0 w-48 h-48 opacity-10 pointer-events-none translate-x-8 translate-y-8">
              <Blocks className="w-full h-full text-white" />
            </div>
          </div>
          
          <div className="bg-white border border-slate-200/50 rounded-2xl p-6.5 flex flex-col justify-center text-center items-center">
            <div className="w-10 h-10 rounded-full bg-primary/10 text-primary border border-primary/15 flex items-center justify-center mb-4">
              <Terminal className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-xs text-slate-800 mb-1">Developer API</h3>
            <p className="text-xs text-slate-500 mb-5 leading-relaxed font-medium">
              Build your own integrations using our robust API and Webhooks.
            </p>
            <a className="text-primary text-xs hover:underline font-bold flex items-center gap-1" href="#">
              Read API Docs <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </section>
      </main>

      {/* Footer Info */}
      <footer className="p-6 mt-auto flex flex-col sm:flex-row justify-between items-center bg-white border-t border-slate-100 text-[10px] text-slate-400 font-bold uppercase tracking-wider select-none gap-4 shrink-0">
        <p>© 2026 FlowBot Systems Inc. All rights reserved.</p>
        <div className="flex gap-6">
          <a className="hover:text-primary transition-colors" href="#">
            Documentation
          </a>
          <a className="hover:text-primary transition-colors" href="#">
            Terms of Service
          </a>
          <a className="hover:text-primary transition-colors" href="#">
            Privacy Policy
          </a>
        </div>
      </footer>
    </div>
  );
}
