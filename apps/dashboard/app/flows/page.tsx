"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Undo2 as Undo,
  Redo2 as Redo,
  Minus,
  Plus,
  Play,
  MessageSquare,
  HelpCircle,
  GitFork,
  Cpu,
  Clock,
  UserCheck,
  ChevronRight,
  ChevronLeft,
  ChevronUp,
  ChevronDown,
  Save,
  Bot,
  Sparkles,
  Settings2,
  Trash2,
  X,
  Send,
  Smile,
  Paperclip
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

interface Node {
  id: string;
  type: "start" | "message" | "question" | "condition" | "api" | "delay" | "handoff";
  title: string;
  description: string;
  details?: string;
  left: number;
  top: number;
  colorClass: string;
}

interface Connection {
  from: string;
  to: string;
}

export default function FlowsPage() {
  const [leftPanelOpen, setLeftPanelOpen] = useState(false); // closed by default on mobile
  const [bottomTrayOpen, setBottomTrayOpen] = useState(true); // repurposed as right properties sidebar open/close
  const [testPreviewOpen, setTestPreviewOpen] = useState(false);
  const [selectedNodeId, setSelectedNodeId] = useState<string>("n3");
  const [isPublished, setIsPublished] = useState(true);
  const [zoom, setZoom] = useState(85);
  const [flowTitle, setFlowTitle] = useState("Lead Gen - Q4 Campaign");

  // Panning & dragging states
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState({ x: 0, y: 0 });
  
  const [draggingNodeId, setDraggingNodeId] = useState<string | null>(null);
  const [dragStartOffset, setDragStartOffset] = useState({ x: 0, y: 0 });

  const [activeDragLink, setActiveDragLink] = useState<{
    fromNodeId: string;
    startX: number;
    startY: number;
    currentX: number;
    currentY: number;
  } | null>(null);

  // Canvas container reference
  const canvasContainerRef = useRef<HTMLDivElement>(null);
  const hasDraggedRef = useRef(false);

  // Initial nodes with coordinates as numbers
  const [nodes, setNodes] = useState<Node[]>([
    {
      id: "n_start",
      type: "start",
      title: "START",
      description: "",
      left: 40,
      top: 10,
      colorClass: "bg-primary",
    },
    {
      id: "n1",
      type: "message",
      title: "Welcome Message",
      description: '"Hi there! I\'m FlowBot. How can I assist you today?"',
      left: 240,
      top: 160,
      colorClass: "bg-primary",
    },
    {
      id: "n2",
      type: "question",
      title: "Ask Name",
      description: "Input: Full Name",
      details: "Waiting for response...",
      left: 440,
      top: 270,
      colorClass: "bg-secondary",
    },
    {
      id: "n3",
      type: "question",
      title: "Ask Email",
      description: "Input: Email Address",
      details: "Validation: Email",
      left: 640,
      top: 380,
      colorClass: "bg-primary",
    },
    {
      id: "n4",
      type: "delay",
      title: "Delay",
      description: "Wait time: 5 seconds",
      details: "Pausing flow...",
      left: 840,
      top: 380,
      colorClass: "bg-gray-500",
    },
    {
      id: "n5",
      type: "condition",
      title: "Has Email?",
      description: "If/Else checks",
      left: 840,
      top: 220,
      colorClass: "bg-amber-500",
    },
    {
      id: "n6",
      type: "api",
      title: "Sync to Salesforce",
      description: "POST /leads/sync",
      details: '{ "email": "{var_email}" }',
      left: 1040,
      top: 80,
      colorClass: "bg-blue-500",
    },
    {
      id: "n7",
      type: "message",
      title: "Success Msg",
      description: '"Thanks {var_name}! We\'ll be in touch."',
      left: 1240,
      top: 220,
      colorClass: "bg-primary",
    },
  ]);

  const [links, setLinks] = useState<Connection[]>([
    { from: "n_start", to: "n1" },
    { from: "n1", to: "n2" },
    { from: "n2", to: "n3" },
    { from: "n3", to: "n4" },
    { from: "n4", to: "n7" },
    { from: "n3", to: "n5" },
    { from: "n5", to: "n6" },
  ]);

  const selectedNode = nodes.find((n) => n.id === selectedNodeId);

  // Simulator State
  const [chatMessages, setChatMessages] = useState<Array<{ sender: "bot" | "user"; text: string }>>([
    { sender: "bot", text: "Hi there! I'm FlowBot. How can I assist you today?" },
    { sender: "user", text: "I'd like to see the Q4 marketing deck." },
    { sender: "bot", text: "Great! Please provide your work email so we can send the deck." },
  ]);
  const [inputText, setInputText] = useState("");
  const [simNodeId, setSimNodeId] = useState<string | null>(null);
  const [simVariables, setSimVariables] = useState<Record<string, string>>({});
  const [isSimulating, setIsSimulating] = useState(false);

  // Template variables helper
  const replaceVariables = (text: string, vars: Record<string, string>) => {
    let result = text;
    // Replace standard placeholders
    result = result.replace(/{var_name}/g, vars["name"] || vars["var_name"] || "there");
    result = result.replace(/{var_email}/g, vars["email"] || vars["var_email"] || "email");
    Object.entries(vars).forEach(([key, val]) => {
      result = result.replace(new RegExp(`{${key}}`, "g"), val);
    });
    return result;
  };

  // Start workflow execution simulation
  const startWorkflow = () => {
    setTestPreviewOpen(true);
    setChatMessages([]);
    setSimVariables({});
    
    // Find node connected directly to the start trigger
    const startLink = links.find(l => l.from === "n_start");
    if (startLink) {
      setIsSimulating(true);
      executeNode(startLink.to, [], {});
    } else {
      setChatMessages([{ sender: "bot", text: "⚠️ No connections found from START trigger. Please drag a connector from start trigger to a message or question node." }]);
    }
  };

  // Execute workflow node step-by-step
  const executeNode = (nodeId: string, currentMsgs: typeof chatMessages, currentVars: Record<string, string>) => {
    const node = nodes.find(n => n.id === nodeId);
    if (!node) {
      setIsSimulating(false);
      return;
    }

    setSimNodeId(nodeId);
    const botText = replaceVariables(node.description || node.title, currentVars);

    if (node.type === "message") {
      setTimeout(() => {
        const nextMsgs = [...currentMsgs, { sender: "bot" as const, text: botText }];
        setChatMessages(nextMsgs);
        
        const nextLink = links.find(l => l.from === nodeId);
        if (nextLink) {
          executeNode(nextLink.to, nextMsgs, currentVars);
        } else {
          setIsSimulating(false);
        }
      }, 1000);
    } else if (node.type === "question") {
      setTimeout(() => {
        const nextMsgs = [...currentMsgs, { sender: "bot" as const, text: botText }];
        setChatMessages(nextMsgs);
        setIsSimulating(false);
      }, 1000);
    } else if (node.type === "delay") {
      const nextMsgs = [...currentMsgs, { sender: "bot" as const, text: `⏳ Delay: Waiting for 3 seconds...` }];
      setChatMessages(nextMsgs);
      setTimeout(() => {
        const nextLink = links.find(l => l.from === nodeId);
        if (nextLink) {
          executeNode(nextLink.to, nextMsgs, currentVars);
        } else {
          setIsSimulating(false);
        }
      }, 3000);
    } else if (node.type === "api") {
      const payload = replaceVariables(node.details || "{}", currentVars);
      const nextMsgs = [...currentMsgs, { sender: "bot" as const, text: `⚙️ API Hook: POST ${node.description || "endpoint"} with variables payload: ${payload}` }];
      setChatMessages(nextMsgs);
      setTimeout(() => {
        const nextLink = links.find(l => l.from === nodeId);
        if (nextLink) {
          executeNode(nextLink.to, nextMsgs, currentVars);
        } else {
          setIsSimulating(false);
        }
      }, 1500);
    } else if (node.type === "condition") {
      const nextLink = links.find(l => l.from === nodeId);
      if (nextLink) {
        executeNode(nextLink.to, currentMsgs, currentVars);
      } else {
        setIsSimulating(false);
      }
    } else if (node.type === "handoff") {
      setTimeout(() => {
        const nextMsgs = [...currentMsgs, { sender: "bot" as const, text: `👋 Handoff: Connecting to a live customer success agent...` }];
        setChatMessages(nextMsgs);
        setIsSimulating(false);
      }, 1000);
    } else {
      setIsSimulating(false);
    }
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const userText = inputText.trim();
    const newUserMsg = { sender: "user" as const, text: userText };
    const nextMsgs = [...chatMessages, newUserMsg];
    setChatMessages(nextMsgs);
    setInputText("");

    // If we are currently paused at a question node:
    if (simNodeId) {
      const node = nodes.find(n => n.id === simNodeId);
      if (node && node.type === "question") {
        // Save the input to variables
        let varName = "var_name";
        if (node.id === "n2") varName = "var_name";
        else if (node.id === "n3") varName = "var_email";
        else if (node.details && !node.details.includes("Validation:")) {
          varName = node.details;
        }
        
        const nextVars = { ...simVariables, [varName]: userText, name: node.id === "n2" ? userText : simVariables.name || "" };
        setSimVariables(nextVars);

        // Find next connected node
        const nextLink = links.find(l => l.from === simNodeId);
        if (nextLink) {
          setIsSimulating(true);
          setTimeout(() => {
            executeNode(nextLink.to, nextMsgs, nextVars);
          }, 800);
        }
      }
    }
  };

  // Node operations
  const deleteLink = (from: string, to: string) => {
    setLinks((prev) => prev.filter((l) => !(l.from === from && l.to === to)));
  };

  const deleteNode = (nodeId: string) => {
    if (nodeId === "n_start") return;
    setNodes((prev) => prev.filter((n) => n.id !== nodeId));
    setLinks((prev) => prev.filter((l) => l.from !== nodeId && l.to !== nodeId));
    setSelectedNodeId("n_start");
  };

  const addNode = (type: Node["type"], x?: number, y?: number) => {
    const newId = `n_${Date.now()}`;
    const defaultTitles: Record<Node["type"], string> = {
      start: "Start Trigger",
      message: "New Message",
      question: "New Question",
      condition: "Branch Check",
      api: "Webhook API",
      delay: "Delay Timer",
      handoff: "Live Agent Handoff"
    };
    const defaultDescriptions: Record<Node["type"], string> = {
      start: "Trigger definition",
      message: '"Enter message text..."',
      question: "Input: Text / Option",
      condition: "If / Else evaluation",
      api: "Call external webhook",
      delay: "Pause for 5 seconds",
      handoff: "Transfer to live support team"
    };
    const colorClasses: Record<Node["type"], string> = {
      start: "bg-primary",
      message: "bg-primary",
      question: "bg-indigo-500",
      condition: "bg-amber-500",
      api: "bg-blue-500",
      delay: "bg-slate-400",
      handoff: "bg-rose-500"
    };

    const newNode: Node = {
      id: newId,
      type,
      title: defaultTitles[type] || "New Node",
      description: defaultDescriptions[type] || "",
      left: x !== undefined ? Math.round(x) : 300,
      top: y !== undefined ? Math.round(y) : 200,
      colorClass: colorClasses[type] || "bg-slate-400"
    };

    setNodes((prev) => [...prev, newNode]);
    setSelectedNodeId(newId);
  };

  // Mouse drag event handlers
  const handleNodeMouseDown = (e: React.MouseEvent, nodeId: string) => {
    if ((e.target as HTMLElement).closest('button, input, select, textarea, .node-port')) return;
    e.stopPropagation();
    e.preventDefault();
    
    setSelectedNodeId(nodeId);
    hasDraggedRef.current = false;
    
    const node = nodes.find((n) => n.id === nodeId);
    if (!node) return;
    
    const scale = zoom / 100;
    const container = canvasContainerRef.current;
    if (!container) return;
    const rect = container.getBoundingClientRect();
    
    const mouseX = (e.clientX - rect.left - panOffset.x) / scale;
    const mouseY = (e.clientY - rect.top - panOffset.y) / scale;
    
    setDraggingNodeId(nodeId);
    setDragStartOffset({
      x: mouseX - node.left,
      y: mouseY - node.top
    });
  };

  const handlePortMouseDown = (e: React.MouseEvent, fromNodeId: string) => {
    e.stopPropagation();
    e.preventDefault();
    const fromNode = nodes.find((n) => n.id === fromNodeId);
    if (!fromNode) return;
    
    const startX = fromNode.left + 208;
    const startY = fromNode.top + (fromNode.type === "start" ? 40 : 55);
    
    setActiveDragLink({
      fromNodeId,
      startX,
      startY,
      currentX: startX,
      currentY: startY
    });
  };

  const handlePortMouseUp = (e: React.MouseEvent, toNodeId: string) => {
    if (activeDragLink) {
      e.stopPropagation();
      const fromNodeId = activeDragLink.fromNodeId;
      if (fromNodeId !== toNodeId) {
        const exists = links.some((l) => l.from === fromNodeId && l.to === toNodeId);
        if (!exists) {
          setLinks((prev) => [...prev, { from: fromNodeId, to: toNodeId }]);
        }
      }
      setActiveDragLink(null);
    }
  };

  const handleCanvasMouseDown = (e: React.MouseEvent) => {
    if (window.innerWidth < 768 && leftPanelOpen) {
      setLeftPanelOpen(false);
      return;
    }
    const target = e.target as HTMLElement;
    if (target.classList.contains('canvas-grid') || target.tagName === 'svg' || target.closest('.canvas-container')) {
      setIsPanning(true);
      setPanStart({
        x: e.clientX - panOffset.x,
        y: e.clientY - panOffset.y
      });
    }
  };

  const handleCanvasMouseMove = (e: React.MouseEvent) => {
    if (isPanning) {
      setPanOffset({
        x: e.clientX - panStart.x,
        y: e.clientY - panStart.y
      });
    } else if (draggingNodeId) {
      hasDraggedRef.current = true;
      const scale = zoom / 100;
      const container = canvasContainerRef.current;
      if (!container) return;
      const rect = container.getBoundingClientRect();
      
      const mouseX = (e.clientX - rect.left - panOffset.x) / scale;
      const mouseY = (e.clientY - rect.top - panOffset.y) / scale;
      
      setNodes((prev) =>
        prev.map((node) => {
          if (node.id === draggingNodeId) {
            return {
              ...node,
              left: Math.max(0, Math.round(mouseX - dragStartOffset.x)),
              top: Math.max(0, Math.round(mouseY - dragStartOffset.y))
            };
          }
          return node;
        })
      );
    } else if (activeDragLink) {
      const scale = zoom / 100;
      const container = canvasContainerRef.current;
      if (!container) return;
      const rect = container.getBoundingClientRect();
      
      const mouseX = (e.clientX - rect.left - panOffset.x) / scale;
      const mouseY = (e.clientY - rect.top - panOffset.y) / scale;
      
      setActiveDragLink((prev) =>
        prev
          ? {
              ...prev,
              currentX: mouseX,
              currentY: mouseY
            }
          : null
      );
    }
  };

  const handleCanvasMouseUp = () => {
    setIsPanning(false);
    setDraggingNodeId(null);
    setActiveDragLink(null);
  };

  // Touch event handlers for mobile
  const handleNodeTouchStart = (e: React.TouchEvent, nodeId: string) => {
    if ((e.target as HTMLElement).closest('button, input, select, textarea, .node-port')) return;
    e.stopPropagation();
    
    setSelectedNodeId(nodeId);
    hasDraggedRef.current = false;
    
    const node = nodes.find((n) => n.id === nodeId);
    if (!node) return;
    
    const scale = zoom / 100;
    const container = canvasContainerRef.current;
    if (!container) return;
    const rect = container.getBoundingClientRect();
    
    const touch = e.touches[0];
    const mouseX = (touch.clientX - rect.left - panOffset.x) / scale;
    const mouseY = (touch.clientY - rect.top - panOffset.y) / scale;
    
    setDraggingNodeId(nodeId);
    setDragStartOffset({
      x: mouseX - node.left,
      y: mouseY - node.top
    });
  };

  const handlePortTouchStart = (e: React.TouchEvent, fromNodeId: string) => {
    e.stopPropagation();
    const fromNode = nodes.find((n) => n.id === fromNodeId);
    if (!fromNode) return;
    
    const startX = fromNode.left + 208;
    const startY = fromNode.top + (fromNode.type === "start" ? 40 : 55);
    
    const touch = e.touches[0];
    const container = canvasContainerRef.current;
    if (!container) return;
    const rect = container.getBoundingClientRect();
    const scale = zoom / 100;
    
    const currentX = (touch.clientX - rect.left - panOffset.x) / scale;
    const currentY = (touch.clientY - rect.top - panOffset.y) / scale;

    setActiveDragLink({
      fromNodeId,
      startX,
      startY,
      currentX,
      currentY
    });
  };

  const handleCanvasTouchStart = (e: React.TouchEvent) => {
    if (window.innerWidth < 768 && leftPanelOpen) {
      setLeftPanelOpen(false);
      return;
    }
    const target = e.target as HTMLElement;
    if (target.classList.contains('canvas-grid') || target.tagName === 'svg' || target.closest('.canvas-container')) {
      const touch = e.touches[0];
      setIsPanning(true);
      setPanStart({
        x: touch.clientX - panOffset.x,
        y: touch.clientY - panOffset.y
      });
    }
  };

  const handleCanvasTouchMove = (e: React.TouchEvent) => {
    if (draggingNodeId || activeDragLink || isPanning) {
      if (e.cancelable) {
        e.preventDefault();
      }
    }

    const touch = e.touches[0];

    if (isPanning) {
      setPanOffset({
        x: touch.clientX - panStart.x,
        y: touch.clientY - panStart.y
      });
    } else if (draggingNodeId) {
      hasDraggedRef.current = true;
      const scale = zoom / 100;
      const container = canvasContainerRef.current;
      if (!container) return;
      const rect = container.getBoundingClientRect();
      
      const mouseX = (touch.clientX - rect.left - panOffset.x) / scale;
      const mouseY = (touch.clientY - rect.top - panOffset.y) / scale;
      
      setNodes((prev) =>
        prev.map((node) => {
          if (node.id === draggingNodeId) {
            return {
              ...node,
              left: Math.max(0, Math.round(mouseX - dragStartOffset.x)),
              top: Math.max(0, Math.round(mouseY - dragStartOffset.y))
            };
          }
          return node;
        })
      );
    } else if (activeDragLink) {
      const scale = zoom / 100;
      const container = canvasContainerRef.current;
      if (!container) return;
      const rect = container.getBoundingClientRect();
      
      const mouseX = (touch.clientX - rect.left - panOffset.x) / scale;
      const mouseY = (touch.clientY - rect.top - panOffset.y) / scale;
      
      setActiveDragLink((prev) =>
        prev
          ? {
              ...prev,
              currentX: mouseX,
              currentY: mouseY
            }
          : null
      );
    }
  };

  const handleCanvasTouchEnd = (e: React.TouchEvent) => {
    if (activeDragLink) {
      const touch = e.changedTouches[0];
      const element = document.elementFromPoint(touch.clientX, touch.clientY);
      const nodePortEl = element?.closest('.node-port');
      
      if (nodePortEl) {
        const toNodeId = nodePortEl.getAttribute('data-node-id');
        const fromNodeId = activeDragLink.fromNodeId;
        if (toNodeId && fromNodeId !== toNodeId) {
          const exists = links.some((l) => l.from === fromNodeId && l.to === toNodeId);
          if (!exists) {
            setLinks((prev) => [...prev, { from: fromNodeId, to: toNodeId }]);
          }
        }
      }
    }

    setIsPanning(false);
    setDraggingNodeId(null);
    setActiveDragLink(null);
  };

  const getBezierPath = (startX: number, startY: number, endX: number, endY: number) => {
    const controlOffset = Math.abs(endX - startX) / 2;
    return `M ${startX},${startY} C ${startX + controlOffset},${startY} ${endX - controlOffset},${endY} ${endX},${endY}`;
  };

  return (
    <div className="flex-grow flex flex-col h-screen overflow-hidden select-none bg-slate-50/30 relative">
      <style jsx global>{`
        .canvas-grid {
          background-size: 20px 20px;
          background-image: radial-gradient(circle, rgba(148, 163, 184, 0.1) 1px, transparent 1px);
        }
        .node-connector {
          stroke: #cbd5e1;
          stroke-width: 2;
          fill: none;
          stroke-dasharray: 4;
          animation: dash 35s linear infinite;
        }
        @keyframes dash {
          to {
            stroke-dashoffset: -1000;
          }
        }
        .node-port:hover {
          background-color: var(--color-primary-fixed-dim);
          border-color: var(--color-primary);
        }
      `}</style>

      {/* Top Toolbar */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center h-auto md:h-16 p-4 md:px-6 gap-4 bg-white border-b border-slate-100 shrink-0 z-30 select-none">
        <div className="flex items-center gap-4 flex-wrap">
          <Link href="/dashboard" className="flex items-center justify-center w-8 h-8 rounded-xl border border-slate-200 text-slate-400 hover:text-slate-700 hover:bg-slate-50 transition-colors">
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div className="flex items-center gap-2">
            <GitFork className="w-5 h-5 text-primary rotate-90" />
            <input
              type="text"
              value={flowTitle}
              onChange={(e) => setFlowTitle(e.target.value)}
              className="bg-transparent border-none focus:ring-0 text-sm font-extrabold p-0 w-64 text-slate-800 outline-none"
            />
          </div>
          <div className="h-5 w-px bg-slate-200 mx-1.5"></div>
          <div className="flex items-center gap-1.5">
            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg text-slate-400 hover:bg-slate-50 cursor-pointer">
              <Undo className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg text-slate-400 hover:bg-slate-50 cursor-pointer opacity-40">
              <Redo className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center bg-slate-50 border border-slate-200/50 rounded-xl p-1 mr-1">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setZoom(Math.max(50, zoom - 10))}
              className="h-6 w-6 rounded-lg text-slate-400 hover:bg-white cursor-pointer"
            >
              <Minus className="w-3.5 h-3.5" />
            </Button>
            <span className="px-2 text-[10px] font-extrabold text-slate-550 w-10 text-center">{zoom}%</span>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setZoom(Math.min(150, zoom + 10))}
              className="h-6 w-6 rounded-lg text-slate-400 hover:bg-white cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
            </Button>
            <div className="flex items-center gap-2 px-1">
              <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">Publish</span>
              <Switch checked={isPublished} onCheckedChange={setIsPublished} className="cursor-pointer" />
            </div>
            <Button
              onClick={startWorkflow}
              className="h-8 bg-primary text-on-primary text-xs font-bold rounded-xl px-4 hover:opacity-90 transition-all flex items-center gap-1.5 cursor-pointer shadow-md shadow-primary/10"
            >
              <Play className="w-3.5 h-3.5" />
              Test Bot
            </Button>
          </div>
        </div>
      </header>

      {/* Main Builder Canvas Area */}
      <div className="flex flex-1 overflow-hidden relative">
        {/* Left Drawer Panel - slides in on mobile overlay, inline on desktop */}
        <aside
          className={cn(
            "bg-white border-r border-slate-100 flex flex-col z-35 transition-all duration-300 shadow-sm shrink-0 absolute md:relative h-full top-0 bottom-0 left-0",
            leftPanelOpen 
              ? "w-64 translate-x-0" 
              : "w-64 -translate-x-full md:translate-x-0 md:w-12"
          )}
        >
          <div className="p-4 border-b border-slate-100 flex justify-between items-center select-none">
            {leftPanelOpen && <span className="text-xs font-extrabold text-slate-800 uppercase tracking-wider">Nodes Palette</span>}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setLeftPanelOpen(!leftPanelOpen)}
              className={cn("h-7 w-7 rounded-lg text-slate-400 hover:bg-slate-50 cursor-pointer", !leftPanelOpen && "mx-auto")}
            >
              {leftPanelOpen ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
            </Button>
          </div>

          {leftPanelOpen && (
            <div className="p-4 space-y-4 flex-1 overflow-y-auto">
              <p className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest mb-1 select-none">Interactions</p>
              
              <div
                draggable
                onDragStart={(e) => e.dataTransfer.setData("text/plain", "message")}
                onClick={() => addNode("message")}
                className="group flex items-center gap-3.5 p-3.5 bg-slate-50 border border-slate-200/50 rounded-xl cursor-grab hover:bg-white hover:border-primary hover:shadow-md transition-all duration-200"
              >
                <div className="w-9 h-9 rounded-lg bg-primary/10 text-primary border border-primary/20 flex items-center justify-center shrink-0">
                  <MessageSquare className="w-4.5 h-4.5" />
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-slate-800">Message</span>
                  <span className="text-[9px] text-slate-400 font-semibold mt-0.5">Bot sends bubbles</span>
                </div>
              </div>

              <div
                draggable
                onDragStart={(e) => e.dataTransfer.setData("text/plain", "question")}
                onClick={() => addNode("question")}
                className="group flex items-center gap-3.5 p-3.5 bg-slate-50 border border-slate-200/50 rounded-xl cursor-grab hover:bg-white hover:border-primary hover:shadow-md transition-all duration-200"
              >
                <div className="w-9 h-9 rounded-lg bg-indigo-50 text-indigo-650 border border-indigo-100 flex items-center justify-center shrink-0">
                  <HelpCircle className="w-4.5 h-4.5" />
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-slate-800">Question</span>
                  <span className="text-[9px] text-slate-400 font-semibold mt-0.5">Capture user input</span>
                </div>
              </div>

              <p className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest mt-4 mb-1 select-none">Routing & Logic</p>
              
              <div
                draggable
                onDragStart={(e) => e.dataTransfer.setData("text/plain", "condition")}
                onClick={() => addNode("condition")}
                className="group flex items-center gap-3.5 p-3.5 bg-slate-50 border border-slate-200/50 rounded-xl cursor-grab hover:bg-white hover:border-primary hover:shadow-md transition-all duration-200"
              >
                <div className="w-9 h-9 rounded-lg bg-amber-50 text-amber-650 border border-amber-100 flex items-center justify-center shrink-0">
                  <GitFork className="w-4.5 h-4.5" />
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-slate-800">Branch</span>
                  <span className="text-[9px] text-slate-400 font-semibold mt-0.5">Conditional splits</span>
                </div>
              </div>

              <div
                draggable
                onDragStart={(e) => e.dataTransfer.setData("text/plain", "api")}
                onClick={() => addNode("api")}
                className="group flex items-center gap-3.5 p-3.5 bg-slate-50 border border-slate-200/50 rounded-xl cursor-grab hover:bg-white hover:border-primary hover:shadow-md transition-all duration-200"
              >
                <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-600 border border-blue-100 flex items-center justify-center shrink-0">
                  <Cpu className="w-4.5 h-4.5" />
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-slate-800">API Webhook</span>
                  <span className="text-[9px] text-slate-400 font-semibold mt-0.5">Send/Fetch database</span>
                </div>
              </div>

              <div
                draggable
                onDragStart={(e) => e.dataTransfer.setData("text/plain", "delay")}
                onClick={() => addNode("delay")}
                className="group flex items-center gap-3.5 p-3.5 bg-slate-50 border border-slate-200/50 rounded-xl cursor-grab hover:bg-white hover:border-primary hover:shadow-md transition-all duration-200"
              >
                <div className="w-9 h-9 rounded-lg bg-slate-200/50 text-slate-655 border border-slate-300/40 flex items-center justify-center shrink-0">
                  <Clock className="w-4.5 h-4.5" />
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-slate-800">Delay</span>
                  <span className="text-[9px] text-slate-400 font-semibold mt-0.5">Pause execution</span>
                </div>
              </div>

              <p className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest mt-4 mb-1 select-none">Support Handoff</p>
              
              <div
                draggable
                onDragStart={(e) => e.dataTransfer.setData("text/plain", "handoff")}
                onClick={() => addNode("handoff")}
                className="group flex items-center gap-3.5 p-3.5 bg-slate-50 border border-slate-200/50 rounded-xl cursor-grab hover:bg-white hover:border-primary hover:shadow-md transition-all duration-200"
              >
                <div className="w-9 h-9 rounded-lg bg-rose-50 text-rose-650 border border-rose-100 flex items-center justify-center shrink-0">
                  <UserCheck className="w-4.5 h-4.5" />
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-slate-800">Live Agent</span>
                  <span className="text-[9px] text-slate-400 font-semibold mt-0.5">Handoff to team</span>
                </div>
              </div>
            </div>
          )}
        </aside>

        {/* Center Canvas container wrapper for Drag/Drop, Panning and mouse movements */}
        <div
          ref={canvasContainerRef}
          onMouseDown={handleCanvasMouseDown}
          onMouseMove={handleCanvasMouseMove}
          onMouseUp={handleCanvasMouseUp}
          onMouseLeave={handleCanvasMouseUp}
          onTouchStart={handleCanvasTouchStart}
          onTouchMove={handleCanvasTouchMove}
          onTouchEnd={handleCanvasTouchEnd}
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();
            const type = e.dataTransfer.getData("text/plain") as any;
            const container = canvasContainerRef.current;
            if (!container) return;
            const rect = container.getBoundingClientRect();
            const scale = zoom / 100;
            const x = (e.clientX - rect.left - panOffset.x) / scale - 104; // center node horizontally (208/2 = 104)
            const y = (e.clientY - rect.top - panOffset.y) / scale - 55; // center node vertically (110/2 = 55)
            addNode(type, x, y);
          }}
          className="flex-grow overflow-hidden relative bg-slate-50/50 canvas-container"
        >
          {/* Zoom/Pan scaled container */}
          <div
            className="absolute inset-0 canvas-grid"
            style={{
              transform: `translate(${panOffset.x}px, ${panOffset.y}px) scale(${zoom / 100})`,
              transformOrigin: "0 0",
              width: "5000px",
              height: "5000px"
            }}
          >
            {/* Connector SVGs */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none z-10">
              <defs>
                <marker id="arrowhead" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
                  <polygon points="0 0, 8 3, 0 6" fill="#cbd5e1" />
                </marker>
              </defs>

              {/* Connections lines */}
              {links.map((link, index) => {
                const fromNode = nodes.find((n) => n.id === link.from);
                const toNode = nodes.find((n) => n.id === link.to);
                if (!fromNode || !toNode) return null;

                const startX = fromNode.left + 208;
                const startY = fromNode.top + (fromNode.type === "start" ? 40 : 55);
                const endX = toNode.left;
                const endY = toNode.top + 55;

                return (
                  <g key={index} className="group pointer-events-auto">
                    <path
                      className="node-connector group-hover:stroke-rose-400 transition-colors cursor-pointer"
                      d={getBezierPath(startX, startY, endX, endY)}
                    />
                    <g
                      className="cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteLink(link.from, link.to);
                      }}
                    >
                      <circle
                        cx={(startX + endX) / 2}
                        cy={(startY + endY) / 2}
                        r="9"
                        className="fill-white stroke-slate-200 hover:stroke-rose-500 hover:fill-rose-50 shadow-sm"
                      />
                      <path
                        d={`M ${(startX + endX) / 2 - 3.5} ${(startY + endY) / 2 - 3.5} L ${(startX + endX) / 2 + 3.5} ${(startY + endY) / 2 + 3.5} M ${(startX + endX) / 2 + 3.5} ${(startY + endY) / 2 - 3.5} L ${(startX + endX) / 2 - 3.5} ${(startY + endY) / 2 + 3.5}`}
                        stroke="#f43f5e"
                        strokeWidth="1.5"
                      />
                    </g>
                  </g>
                );
              })}

              {/* Active Connection Line drag indicator */}
              {activeDragLink && (
                <path
                  className="stroke-primary stroke-2 fill-none"
                  style={{ strokeDasharray: "4 4" }}
                  d={getBezierPath(
                    activeDragLink.startX,
                    activeDragLink.startY,
                    activeDragLink.currentX,
                    activeDragLink.currentY
                  )}
                />
              )}
            </svg>

            {/* Render Flow Nodes */}
            {nodes.map((node) => {
              const isSelected = selectedNodeId === node.id;
              return (
                <div
                  key={node.id}
                  onMouseDown={(e) => handleNodeMouseDown(e, node.id)}
                  onTouchStart={(e) => handleNodeTouchStart(e, node.id)}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedNodeId(node.id);
                    if (!hasDraggedRef.current) {
                      setBottomTrayOpen(true);
                    }
                  }}
                  className={`absolute w-52 bg-white border rounded-2xl hover:border-primary/50 hover:shadow-lg transition-shadow cursor-grab active:cursor-grabbing z-25 ${
                    isSelected ? "border-primary ring-4 ring-primary/5" : "border-slate-200/50 shadow-sm"
                  }`}
                  style={{ left: `${node.left}px`, top: `${node.top}px` }}
                >
                  {node.type === "start" ? (
                    <div className="p-4.5 flex flex-col items-center justify-center select-none relative">
                      <div
                        onClick={(e) => {
                          e.stopPropagation();
                          startWorkflow();
                        }}
                        className="w-12 h-12 rounded-full bg-primary text-on-primary flex items-center justify-center shadow-md shadow-primary/10 border-4 border-white hover:scale-110 active:scale-95 transition-all cursor-pointer z-30"
                        title="Click to start workflow simulation"
                      >
                        <Play className="w-5 h-5 fill-white ml-0.5" />
                      </div>
                      <span className="mt-2 text-[10px] font-extrabold text-primary uppercase tracking-widest">START TRIGGER</span>
                      
                      {/* Connection output port on start node */}
                      <div
                        onMouseDown={(e) => handlePortMouseDown(e, node.id)}
                        onTouchStart={(e) => handlePortTouchStart(e, node.id)}
                        data-node-id={node.id}
                        data-port-type="output"
                        className="node-port absolute -right-1.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 rounded-full bg-white border-2 border-slate-300 hover:border-primary hover:scale-120 transition-all z-30 cursor-crosshair"
                        title="Drag connection"
                      />
                    </div>
                  ) : (
                    <>
                      <div className={`h-1.5 rounded-t-2xl ${
                        node.type === "message"
                          ? "bg-primary"
                          : node.type === "question"
                          ? "bg-indigo-500"
                          : node.type === "condition"
                          ? "bg-amber-500"
                          : node.type === "api"
                          ? "bg-blue-500"
                          : "bg-slate-400"
                      }`} />
                      <div className="p-3.5 flex items-center gap-2.5 border-b border-slate-100 select-none">
                        <div
                          className={`w-7.5 h-7.5 rounded-lg flex items-center justify-center shrink-0 border ${
                            node.type === "message"
                              ? "bg-primary/10 text-primary border-primary/15"
                              : node.type === "question"
                              ? "bg-indigo-50 text-indigo-650 border-indigo-100"
                              : node.type === "condition"
                              ? "bg-amber-50 text-amber-655 border-amber-100"
                              : node.type === "api"
                              ? "bg-blue-50 text-blue-600 border-blue-100"
                              : "bg-slate-100 text-slate-600 border-slate-200/50"
                          }`}
                        >
                          {node.type === "message" ? (
                            <MessageSquare className="w-4 h-4" />
                          ) : node.type === "question" ? (
                            <HelpCircle className="w-4 h-4" />
                          ) : node.type === "condition" ? (
                            <GitFork className="w-4 h-4" />
                          ) : node.type === "api" ? (
                            <Cpu className="w-4 h-4" />
                          ) : (
                            <Clock className="w-4 h-4" />
                          )}
                        </div>
                        <span className="text-xs font-bold text-slate-800 truncate">{node.title}</span>
                        {isSelected && <span className="ml-auto w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />}
                      </div>
                      
                      <div className="p-3.5 space-y-2 select-none">
                        <p className="text-[11px] text-slate-505 leading-relaxed font-semibold font-sans line-clamp-2">{node.description}</p>
                        {node.details && (
                          <div className="bg-slate-50 border border-slate-200/30 rounded-lg p-1.5 text-[9px] text-slate-600 font-mono font-medium truncate">
                            {node.details}
                          </div>
                        )}
                      </div>
                      
                      {/* Handles ports */}
                      <div
                        onMouseUp={(e) => handlePortMouseUp(e, node.id)}
                        data-node-id={node.id}
                        data-port-type="input"
                        className="node-port absolute -left-1.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 rounded-full bg-white border-2 border-slate-300 hover:border-primary hover:scale-120 transition-all z-30 cursor-crosshair"
                        title="Connect here"
                      />
                      <div
                        onMouseDown={(e) => handlePortMouseDown(e, node.id)}
                        onTouchStart={(e) => handlePortTouchStart(e, node.id)}
                        data-node-id={node.id}
                        data-port-type="output"
                        className="node-port absolute -right-1.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 rounded-full bg-white border-2 border-slate-300 hover:border-primary hover:scale-120 transition-all z-30 cursor-crosshair"
                        title="Drag connection"
                      />
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Floating mobile Nodes Palette toggle button */}
        <div className="md:hidden fixed bottom-6 left-6 z-30 select-none">
          <button
            onClick={() => setLeftPanelOpen(!leftPanelOpen)}
            className="flex items-center gap-2 bg-white border border-slate-200/50 shadow-xl rounded-full px-5 h-14 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer text-slate-800 font-bold"
          >
            <Plus className="w-5 h-5 text-primary" />
            <span>Add Node</span>
          </button>
        </div>

        {/* Floating Test Bot Launcher Widget */}
        <div className="fixed bottom-6 right-6 z-30 select-none">
          <button
            onClick={startWorkflow}
            className="group flex items-center gap-3 bg-white border border-slate-200/50 shadow-xl rounded-full p-1 pl-4 pr-4 h-14 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
          >
            <div className="w-10 h-10 rounded-full bg-primary text-on-primary flex items-center justify-center shadow-md shadow-primary/10 group-hover:rotate-12 transition-transform">
              <Bot className="w-5 h-5" />
            </div>
            <div className="flex flex-col text-left">
              <span className="text-xs font-bold text-slate-800">Test Preview</span>
              <span className="text-[9px] text-green-500 flex items-center gap-1 font-extrabold uppercase tracking-wider">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                Active
              </span>
            </div>
          </button>
        </div>

        {/* Chat Preview Panel popup */}
        {testPreviewOpen && (
          <div className="fixed bottom-0 right-0 sm:right-10 w-full sm:w-96 h-[500px] bg-white shadow-2xl rounded-t-2xl border-x border-t border-slate-200/60 z-40 transition-all duration-300 flex flex-col">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-900 text-white rounded-t-2xl select-none">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-primary-fixed">
                  <Bot className="w-4.5 h-4.5" />
                </div>
                <div>
                  <p className="text-xs font-bold leading-none">FlowBot Preview</p>
                  <p className="text-[9px] text-slate-550 font-semibold mt-1">v2.4.0 • Active Session</p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="text-slate-400 hover:text-white hover:bg-slate-800 h-7 w-7 rounded-lg cursor-pointer"
                onClick={() => setTestPreviewOpen(false)}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
            <div className="flex-grow p-4 space-y-4 overflow-y-auto bg-slate-50/50 flex flex-col">
              {chatMessages.map((msg, i) => (
                <div key={i} className={`flex gap-2 max-w-[85%] items-start animate-fade-in ${msg.sender === "user" ? "self-end flex-row-reverse" : "self-start"}`}>
                  {msg.sender === "bot" && (
                    <div className="w-7 h-7 rounded-full bg-violet-100 border border-violet-200/50 flex items-center justify-center shrink-0 mt-0.5 text-violet-650 select-none shadow-sm">
                      <Bot className="w-4 h-4" />
                    </div>
                  )}
                  <div
                    className={`p-3 rounded-2xl text-xs font-medium leading-relaxed ${
                      msg.sender === "user"
                        ? "bg-primary text-white rounded-tr-none shadow-sm"
                        : "bg-white text-slate-850 border border-slate-200/40 rounded-tl-none shadow-sm"
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
              {isSimulating && (
                <div className="flex gap-2 max-w-[85%] items-start animate-fade-in self-start">
                  <div className="w-7 h-7 rounded-full bg-violet-100 border border-violet-200/50 flex items-center justify-center shrink-0 mt-0.5 text-violet-655 select-none shadow-sm">
                    <Bot className="w-4 h-4" />
                  </div>
                  <div className="p-3 bg-white text-slate-550 border border-slate-200/40 rounded-2xl rounded-tl-none shadow-sm flex gap-1 items-center select-none">
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: "0ms" }} />
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: "150ms" }} />
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: "300ms" }} />
                  </div>
                </div>
              )}
              {!isSimulating && !simNodeId && (
                <div className="flex flex-col items-center py-2 opacity-40 select-none">
                  <div className="h-px w-full bg-slate-200"></div>
                  <span className="bg-slate-50 px-2 -mt-2 text-[9px] text-slate-500 uppercase font-bold tracking-widest">
                    Execution Paused
                  </span>
                </div>
              )}
            </div>
            <form onSubmit={handleSendMessage} className="p-4 bg-white border-t border-slate-100 select-none">
              <div className="relative">
                <Input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="Type a message..."
                  className="w-full bg-slate-50 border border-slate-200/60 rounded-full py-2.5 pl-4 pr-12 text-xs focus-visible:bg-white focus-visible:border-primary focus-visible:ring-0 outline-none h-10 transition-all placeholder:text-slate-400"
                />
                <Button
                  type="submit"
                  size="icon"
                  className="absolute right-1 top-1 w-8 h-8 bg-primary hover:opacity-90 text-on-primary rounded-full flex items-center justify-center cursor-pointer shadow-md shadow-primary/10"
                >
                  <Send className="w-3.5 h-3.5" />
                </Button>
              </div>
              <p className="text-center text-[9px] text-slate-400 mt-2.5 font-semibold">Test Mode • Dynamic Simulator Active</p>
            </form>
          </div>
        )}

        {/* Right properties sidebar Custom Panel drawer */}
        <aside
          className={cn(
            "fixed top-16 right-0 bottom-0 w-full sm:w-[360px] bg-white border-l border-slate-100 z-35 transition-transform duration-300 ease-in-out flex flex-col shadow-xl",
            selectedNode && bottomTrayOpen ? "translate-x-0" : "translate-x-full"
          )}
        >
          {/* Header custom actions */}
          <div className="p-4 border-b border-slate-100 flex items-center justify-between select-none">
            <div className="flex items-center gap-2">
              <Settings2 className="w-4 h-4 text-slate-400" />
              <span className="text-xs font-extrabold text-slate-800 uppercase tracking-wider">Node Properties</span>
            </div>
            <div className="flex items-center gap-1.5 ml-auto">
              {selectedNode && selectedNode.id !== "n_start" && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => deleteNode(selectedNode.id)}
                  className="h-8 w-8 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg cursor-pointer"
                  title="Delete Node"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              )}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setBottomTrayOpen(false)}
                className="h-8 w-8 text-slate-400 hover:text-slate-655 rounded-lg cursor-pointer"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Form parameters */}
          {selectedNode && (
            <div className="flex-grow overflow-y-auto p-5 space-y-5 font-semibold">
              <div className="space-y-1.5">
                <label className="text-[9.5px] font-extrabold text-slate-400 block uppercase tracking-widest select-none">
                  Node Title
                </label>
                <Input
                  type="text"
                  value={selectedNode.title}
                  onChange={(e) => {
                    const updatedNodes = nodes.map((n) => (n.id === selectedNode.id ? { ...n, title: e.target.value } : n));
                    setNodes(updatedNodes);
                  }}
                  className="w-full bg-slate-50 border border-slate-200/50 rounded-xl px-3 py-2 text-xs focus-visible:bg-white transition-all h-9"
                />
              </div>

              {selectedNode.id !== "n_start" && (
                <div className="space-y-1.5">
                  <label className="text-[9.5px] font-extrabold text-slate-400 block uppercase tracking-widest select-none">
                    Description / Content
                  </label>
                  <Textarea
                    value={selectedNode.description}
                    onChange={(e) => {
                      const updatedNodes = nodes.map((n) =>
                        n.id === selectedNode.id ? { ...n, description: e.target.value } : n
                      );
                      setNodes(updatedNodes);
                    }}
                    className="w-full bg-slate-50 border border-slate-200/50 rounded-xl px-3 py-2 text-xs h-24 resize-none focus-visible:bg-white transition-all min-h-16"
                  />
                </div>
              )}

              {selectedNode.type === "question" && (
                <div className="space-y-5">
                  <div className="space-y-1.5">
                    <label className="text-[9.5px] font-extrabold text-slate-400 block uppercase tracking-widest select-none">
                      Variable to Save Response
                    </label>
                    <Input
                      type="text"
                      placeholder="e.g. user_email"
                      value={selectedNode.details || ""}
                      onChange={(e) => {
                        const updatedNodes = nodes.map((n) =>
                          n.id === selectedNode.id ? { ...n, details: e.target.value } : n
                        );
                        setNodes(updatedNodes);
                      }}
                      className="w-full bg-slate-50 border border-slate-200/50 rounded-xl px-3 py-2 text-xs font-mono h-9 focus-visible:bg-white"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[9.5px] font-extrabold text-slate-400 block uppercase tracking-widest select-none">
                      Input Type Validation
                    </label>
                    <select className="w-full bg-slate-50 border border-slate-200/50 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary cursor-pointer font-bold text-slate-700 h-9">
                      <option>Email</option>
                      <option>Phone Number</option>
                      <option>Number</option>
                      <option>Plain Text</option>
                    </select>
                  </div>
                </div>
              )}

              {selectedNode.type === "delay" && (
                <div className="space-y-1.5">
                  <label className="text-[9.5px] font-extrabold text-slate-400 block uppercase tracking-widest select-none">
                    Wait Duration
                  </label>
                  <div className="flex gap-2">
                    <Input
                      type="number"
                      defaultValue={5}
                      className="w-24 bg-slate-50 border border-slate-200/50 rounded-xl px-3 py-2 text-xs h-9 focus-visible:bg-white"
                    />
                    <select className="flex-1 bg-slate-50 border border-slate-200/50 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary cursor-pointer font-bold text-slate-700 h-9">
                      <option>Seconds</option>
                      <option>Minutes</option>
                      <option>Hours</option>
                    </select>
                  </div>
                </div>
              )}

              {selectedNode.type === "api" && (
                <div className="space-y-1.5">
                  <label className="text-[9.5px] font-extrabold text-slate-400 block uppercase tracking-widest select-none">
                    HTTP Request Body (JSON)
                  </label>
                  <Textarea
                    value={selectedNode.details}
                    onChange={(e) => {
                      const updatedNodes = nodes.map((n) =>
                        n.id === selectedNode.id ? { ...n, details: e.target.value } : n
                      );
                      setNodes(updatedNodes);
                    }}
                    className="w-full bg-slate-50 border border-slate-200/50 rounded-xl px-3 py-2 text-xs font-mono h-32 resize-none focus-visible:bg-white min-h-16"
                  />
                </div>
              )}
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}
