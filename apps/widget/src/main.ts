// Import the Tailwind CSS compiled stylesheet as an inline string
import styles from "./styles.css?inline";
import { io, Socket } from "socket.io-client";

// ─── Config ──────────────────────────────────────────────────────────────────
interface WidgetConfig {
  token?: string;          // orgApiToken — read from data-token attribute
  color?: string;
  position?: "right" | "left";
  welcomeMessage?: string;
  botName?: string;
  apiUrl?: string;         // NestJS API base URL (e.g. https://flowbot-api.onrender.com)
}

// ─── Visitor ID ──────────────────────────────────────────────────────────────
function getOrCreateVisitorId(): string {
  const key = "flowbot_visitor_id";
  let id = localStorage.getItem(key);
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem(key, id);
  }
  return id;
}

// ─── Widget Class ─────────────────────────────────────────────────────────────
class FlowBotWidget {
  private config: WidgetConfig = {
    token: "",
    color: "#3525cd",
    position: "right",
    welcomeMessage: "Hello! I'm your assistant from FlowBot. How can I help you streamline your workflows today?",
    botName: "FlowBot",
    apiUrl: "",
  };

  private container: HTMLDivElement | null = null;
  private chatWindow: HTMLDivElement | null = null;
  private launcher: HTMLDivElement | null = null;
  private greeting: HTMLDivElement | null = null;
  private messagesContainer: HTMLDivElement | null = null;

  private isOpen = false;
  private socket: Socket | null = null;
  private visitorId: string = getOrCreateVisitorId();
  private connected = false;

  constructor() {
    this.readConfig();
    this.injectStyles();
    this.initDOM();
    this.connectSocket();
  }

  // ─── Config ────────────────────────────────────────────────────────────────
  private readConfig() {
    if ((window as any).FlowBotWidgetConfig) {
      this.config = { ...this.config, ...(window as any).FlowBotWidgetConfig };
    }

    const scripts = document.getElementsByTagName("script");
    for (let i = 0; i < scripts.length; i++) {
      const script = scripts[i];
      if (script.src.includes("widget.js") || script.getAttribute("data-flowbot-widget") !== null) {
        const token = script.getAttribute("data-token") || "";
        const color = script.getAttribute("data-color") || "";
        const position = script.getAttribute("data-position") as "right" | "left" || "";
        const welcome = script.getAttribute("data-welcome-message") || "";
        const botName = script.getAttribute("data-bot-name") || "";
        const apiUrl = script.getAttribute("data-api-url") || "";

        if (token) this.config.token = token;
        if (color) this.config.color = color;
        if (position) this.config.position = position;
        if (welcome) this.config.welcomeMessage = welcome;
        if (botName) this.config.botName = botName;
        if (apiUrl) this.config.apiUrl = apiUrl;
        break;
      }
    }

    // Fallback: resolve API URL from VITE env var baked at build time
    if (!this.config.apiUrl) {
      this.config.apiUrl = (import.meta as any).env?.VITE_API_URL || "http://localhost:3000";
    }
  }

  // ─── Socket.io ─────────────────────────────────────────────────────────────
  private connectSocket() {
    if (!this.config.token || !this.config.apiUrl) {
      // No token configured — stay in demo/simulation mode
      return;
    }

    this.socket = io(`${this.config.apiUrl}/widget`, {
      query: {
        orgApiToken: this.config.token,
        visitorId: this.visitorId,
      },
      transports: ["websocket", "polling"],
      reconnectionAttempts: 5,
      reconnectionDelay: 2000,
    });

    this.socket.on("connect", () => {
      this.connected = true;
      console.debug("[FlowBot] Socket connected:", this.socket!.id);
    });

    this.socket.on("disconnect", () => {
      this.connected = false;
      console.debug("[FlowBot] Socket disconnected");
    });

    // Bot sends messages one at a time via this event
    this.socket.on("bot_message", (data: { text: string }) => {
      this.removeTypingIndicator();
      this.addMessage(data.text, "bot");
    });

    // Flow is complete
    this.socket.on("flow_complete", (data: { message: string }) => {
      this.removeTypingIndicator();
      this.addMessage(data.message, "bot");
    });

    this.socket.on("error", (data: { message: string }) => {
      this.removeTypingIndicator();
      this.addMessage("⚠️ " + (data.message || "Something went wrong."), "bot");
    });
  }

  // ─── Styles ────────────────────────────────────────────────────────────────
  private injectStyles() {
    const styleEl = document.createElement("style");
    styleEl.id = "flowbot-widget-styles";
    styleEl.textContent = styles;
    document.head.appendChild(styleEl);
  }

  // ─── DOM ───────────────────────────────────────────────────────────────────
  private initDOM() {
    this.container = document.createElement("div");
    this.container.id = "flowbot-widget-root";
    const posClass = this.config.position === "left" ? "left-6" : "right-6";
    this.container.className = `fixed bottom-6 ${posClass} z-[99999] font-sans flex flex-col items-end gap-3`;
    document.body.appendChild(this.container);

    this.createGreetingDOM();
    this.createLauncherDOM();
    this.createChatWindowDOM();
    this.attachListeners();
  }

  private createGreetingDOM() {
    this.greeting = document.createElement("div");
    this.greeting.className = "bg-white border border-outline-variant p-4 rounded-xl rounded-br-none shadow-lg max-w-[260px] flex items-center gap-3 relative animate-bounce-subtle select-none cursor-pointer";
    this.greeting.style.animation = "floating 3s ease-in-out infinite";

    if (!document.getElementById("flowbot-floating-keyframes")) {
      const kf = document.createElement("style");
      kf.id = "flowbot-floating-keyframes";
      kf.textContent = `
        @keyframes floating {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-8px); }
          100% { transform: translateY(0px); }
        }
      `;
      document.head.appendChild(kf);
    }

    this.greeting.innerHTML = `
      <div class="w-10 h-10 rounded-full overflow-hidden shrink-0 border border-outline-variant/50">
        <img class="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBDBri2ywEO0OVJtQNOOCaBEy7jHYj4CVO4h5x0g4-ZteW7Vhkxpk_6AI2XtA7Bu9p4FUTNpcCIXyMBiHIcV9gqM2wTvcbGVqwpBKEZcE3U6iavpIHeMCcybfFN_NLZLk46UFisTAjWo0pBmHq-WkYbNOhNxecjjS3MlCv2vFlKlePULnkBWCe-SpIrZf10RXyKG-TjkX8wBA9tCNR_FMKheENnS4cMt45XUJ4rOHuj52kUzbcOngDIIw" alt="Bot Avatar" />
      </div>
      <div>
        <p class="font-bold text-xs leading-tight text-on-surface">Hi! I'm ${this.config.botName}. 👋</p>
        <p class="text-[11px] text-on-surface-variant mt-0.5">How can I help you today?</p>
      </div>
      <!-- Triangle Tail -->
      <div class="absolute -bottom-2 right-4 w-4 h-4 bg-white border-r border-b border-outline-variant rotate-45 transform translate-y-[-5px]"></div>
    `;
    this.container!.appendChild(this.greeting);
  }

  private createLauncherDOM() {
    this.launcher = document.createElement("div");
    this.launcher.className = "w-14 h-14 rounded-full flex items-center justify-center shadow-xl cursor-pointer hover:scale-105 active:scale-95 transition-transform duration-200 text-white select-none relative";
    this.launcher.style.backgroundColor = this.config.color!;

    this.launcher.innerHTML = `
      <span class="material-symbols-outlined text-[28px] flowbot-icon-chat" style="font-variation-settings: 'FILL' 1;">chat</span>
      <span class="material-symbols-outlined text-[28px] flowbot-icon-close hidden">close</span>
      <!-- Notification badge -->
      <div class="absolute -top-1 -right-1 w-5 h-5 bg-red-600 rounded-full border-2 border-white flex items-center justify-center text-[10px] font-bold">1</div>
    `;
    this.container!.appendChild(this.launcher);
  }

  private createChatWindowDOM() {
    this.chatWindow = document.createElement("div");
    this.chatWindow.className = "w-[380px] h-[550px] bg-white rounded-2xl shadow-2xl flex flex-col border border-outline-variant overflow-hidden hidden transition-all duration-300 transform scale-95 translate-y-4 opacity-0";

    this.chatWindow.innerHTML = `
      <!-- Header -->
      <header class="px-6 py-4 flex items-center justify-between text-white shrink-0" style="background-color: ${this.config.color};">
        <div class="flex items-center gap-3">
          <div class="relative">
            <div class="w-10 h-10 rounded-full border-2 border-white/20 overflow-hidden bg-white/10 flex items-center justify-center text-white font-bold">
              <img class="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDvG28_STrxl_7wtCRF8OHmpOpMtMDi4L7KtronlEQfje8ThR44uh7u8kyg-TnRWnO9HAPhXIj0mcsMLAy7vMt9ei2j04eTYiGPOaC4-sWNJlQT6CZnH_FU5fuilesvHxtLncF28xor3aXKe1Ben47PMWBq534NRcqDz61yzK-3F__lWhiIhR7RWQQJcUJcKisa2A2pnff6zZINHrbYMxduA5OnMfq67KN4m1EOeCJTmnP-fG9xLG8w7g" alt="Avatar" />
            </div>
            <div class="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 rounded-full" style="border-color: ${this.config.color};"></div>
          </div>
          <div>
            <h3 class="font-bold text-sm leading-none">${this.config.botName}</h3>
            <p class="text-[10px] opacity-80 mt-1" id="flowbot-status-text">Connecting…</p>
          </div>
        </div>
        <div class="flex gap-2">
          <button class="p-1 hover:bg-white/10 rounded transition-colors flowbot-btn-minimize">
            <span class="material-symbols-outlined text-sm">minimize</span>
          </button>
          <button class="p-1 hover:bg-white/10 rounded transition-colors flowbot-btn-close">
            <span class="material-symbols-outlined text-sm">close</span>
          </button>
        </div>
      </header>

      <!-- Message History area -->
      <div class="flex-grow overflow-y-auto p-6 flex flex-col gap-4 bg-surface-container-low/40 flowbot-messages-area scroll-smooth">
      </div>

      <!-- Input container -->
      <div class="p-4 border-t border-outline-variant bg-white shrink-0">
        <div class="flex items-center gap-2 bg-surface-container-low rounded-lg px-3 py-2 border border-outline-variant focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/10 transition-all">
          <input class="bg-transparent border-none text-xs text-on-surface w-full p-0 focus:ring-0 outline-none placeholder:text-outline/70 flowbot-input-field" placeholder="Type a message..." type="text" />
          <button class="text-primary hover:scale-110 transition-transform flowbot-btn-send">
            <span class="material-symbols-outlined text-[20px]" style="color: ${this.config.color}; font-variation-settings: 'FILL' 1;">send</span>
          </button>
        </div>
        <div class="flex justify-center items-center gap-1 mt-2 select-none">
          <span class="text-[9px] text-outline font-semibold">Powered by</span>
          <span class="font-bold text-[9px] text-primary tracking-tight">FlowBot</span>
        </div>
      </div>
    `;

    this.container!.insertBefore(this.chatWindow, this.launcher);
    this.messagesContainer = this.chatWindow.querySelector(".flowbot-messages-area");
    this.injectAnimationStyles();
    this.watchConnectionStatus();
  }

  private injectAnimationStyles() {
    if (document.getElementById("flowbot-bounce-animations")) return;
    const kf = document.createElement("style");
    kf.id = "flowbot-bounce-animations";
    kf.textContent = `
      .animate-bounce {
        animation: bounce-dots 1s infinite alternate;
      }
      @keyframes bounce-dots {
        from { transform: translateY(0); opacity: 0.4; }
        to { transform: translateY(-4px); opacity: 1; }
      }
      .animate-fade-in {
        animation: fadeIn 0.25s ease-out forwards;
      }
      @keyframes fadeIn {
        from { opacity: 0; transform: translateY(3px); }
        to { opacity: 1; transform: translateY(0); }
      }
    `;
    document.head.appendChild(kf);
  }

  /** Poll socket connection and update the status line in the header */
  private watchConnectionStatus() {
    const statusEl = this.chatWindow?.querySelector("#flowbot-status-text");
    if (!statusEl) return;

    const update = () => {
      if (!this.socket) {
        statusEl.textContent = "Demo mode • AI Assistant";
      } else if (this.connected) {
        statusEl.textContent = "Online • AI Assistant";
      } else {
        statusEl.textContent = "Connecting…";
      }
    };

    if (this.socket) {
      this.socket.on("connect", update);
      this.socket.on("disconnect", update);
    }
    update();
  }

  // ─── Listeners ─────────────────────────────────────────────────────────────
  private attachListeners() {
    this.launcher!.addEventListener("click", () => this.toggleChat());
    this.greeting!.addEventListener("click", () => this.toggleChat());

    this.chatWindow!.querySelector(".flowbot-btn-minimize")!.addEventListener("click", (e) => {
      e.stopPropagation();
      this.closeChat();
    });
    this.chatWindow!.querySelector(".flowbot-btn-close")!.addEventListener("click", (e) => {
      e.stopPropagation();
      this.closeChat();
    });

    const inputField = this.chatWindow!.querySelector(".flowbot-input-field") as HTMLInputElement;
    inputField.addEventListener("keypress", (e) => {
      if (e.key === "Enter") this.handleUserSend();
    });

    this.chatWindow!.querySelector(".flowbot-btn-send")!.addEventListener("click", () => {
      this.handleUserSend();
    });
  }

  private toggleChat() {
    if (this.isOpen) {
      this.closeChat();
    } else {
      this.openChat();
    }
  }

  private openChat() {
    this.isOpen = true;
    this.greeting!.classList.add("hidden");

    const badge = this.launcher!.querySelector(".absolute");
    if (badge) badge.remove();

    this.launcher!.querySelector(".flowbot-icon-chat")!.classList.add("hidden");
    this.launcher!.querySelector(".flowbot-icon-close")!.classList.remove("hidden");

    this.chatWindow!.classList.remove("hidden");
    this.chatWindow!.getBoundingClientRect();
    this.chatWindow!.classList.remove("scale-95", "translate-y-4", "opacity-0");
    this.chatWindow!.classList.add("scale-100", "translate-y-0", "opacity-100");

    setTimeout(() => {
      const input = this.chatWindow!.querySelector(".flowbot-input-field") as HTMLInputElement;
      input?.focus();
    }, 150);
  }

  private closeChat() {
    this.isOpen = false;
    this.launcher!.querySelector(".flowbot-icon-chat")!.classList.remove("hidden");
    this.launcher!.querySelector(".flowbot-icon-close")!.classList.add("hidden");

    this.chatWindow!.classList.remove("scale-100", "translate-y-0", "opacity-100");
    this.chatWindow!.classList.add("scale-95", "translate-y-4", "opacity-0");
    setTimeout(() => {
      if (!this.isOpen) {
        this.chatWindow!.classList.add("hidden");
      }
    }, 300);
  }

  // ─── Messaging ─────────────────────────────────────────────────────────────
  private handleUserSend() {
    const inputField = this.chatWindow!.querySelector(".flowbot-input-field") as HTMLInputElement;
    const text = inputField.value.trim();
    if (!text) return;

    inputField.value = "";
    this.addMessage(text, "user");

    if (this.socket && this.connected) {
      // Real mode — send to NestJS WebSocket gateway
      this.showTypingIndicator();
      this.socket.emit("message", { text });
    } else {
      // Demo/fallback mode — simulate a response locally
      this.simulateBotReply(text);
    }
  }

  private addMessage(text: string, sender: "user" | "bot") {
    const timeString = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    const msgEl = document.createElement("div");

    if (sender === "user") {
      msgEl.className = "flex gap-2 max-w-[85%] self-end flex-row-reverse animate-fade-in";
      msgEl.innerHTML = `
        <div class="p-3 rounded-xl rounded-tr-none shadow-sm text-white text-xs font-semibold leading-relaxed" style="background-color: ${this.config.color};">
          <p>${text}</p>
          <span class="text-[9px] opacity-75 mt-1 block text-right">${timeString}</span>
        </div>
      `;
    } else {
      msgEl.className = "flex gap-2.5 max-w-[85%] animate-fade-in";
      msgEl.innerHTML = `
        <div class="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center shrink-0 border border-outline-variant/30">
          <span class="material-symbols-outlined text-base text-primary">robot_2</span>
        </div>
        <div class="bg-white border border-outline-variant p-3 rounded-xl rounded-tl-none shadow-sm">
          <p class="text-xs text-on-surface font-medium leading-relaxed">${text}</p>
          <span class="text-[9px] text-outline mt-1 block">${timeString}</span>
        </div>
      `;
    }

    this.messagesContainer!.appendChild(msgEl);
    this.scrollToBottom();
  }

  private showTypingIndicator() {
    if (this.chatWindow!.querySelector(".flowbot-typing-indicator")) return;
    const typingIndicator = document.createElement("div");
    typingIndicator.className = "flex gap-2.5 max-w-[85%] flowbot-typing-indicator animate-fade-in";
    typingIndicator.innerHTML = `
      <div class="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center shrink-0 border border-outline-variant/30">
        <span class="material-symbols-outlined text-base text-primary">robot_2</span>
      </div>
      <div class="bg-white border border-outline-variant px-4 py-3 rounded-xl rounded-tl-none shadow-sm flex gap-1 items-center h-10 shrink-0">
        <div class="w-1.5 h-1.5 bg-outline rounded-full animate-bounce"></div>
        <div class="w-1.5 h-1.5 bg-outline rounded-full animate-bounce" style="animation-delay: 0.15s"></div>
        <div class="w-1.5 h-1.5 bg-outline rounded-full animate-bounce" style="animation-delay: 0.3s"></div>
      </div>
    `;
    this.messagesContainer!.appendChild(typingIndicator);
    this.scrollToBottom();
  }

  private removeTypingIndicator() {
    this.chatWindow!.querySelector(".flowbot-typing-indicator")?.remove();
  }

  /** Fallback used in demo mode (no API token / no connection) */
  private simulateBotReply(userMessage: string) {
    this.showTypingIndicator();
    setTimeout(() => {
      this.removeTypingIndicator();
      const cleanMsg = userMessage.toLowerCase().trim();
      let botResponse = "Thank you for reaching out! One of our agents will contact you shortly.";
      if (cleanMsg.includes("price") || cleanMsg.includes("pricing") || cleanMsg.includes("plan")) {
        botResponse = "Our pricing starts at $15/mo for Starter and $49/mo for Growth. Check Settings › Billing for details!";
      } else if (cleanMsg.includes("integration") || cleanMsg.includes("connect")) {
        botResponse = "FlowBot connects with Google Sheets, Shopify, Stripe, Slack, HubSpot, and Zapier out-of-the-box.";
      } else if (cleanMsg.includes("live chat") || cleanMsg.includes("agent")) {
        botResponse = "Toggle 'Bot Takeover' in your Live Chat Inbox to chat with users directly in real time!";
      }
      this.addMessage(botResponse, "bot");
    }, 1200);
  }

  private scrollToBottom() {
    this.messagesContainer!.scrollTop = this.messagesContainer!.scrollHeight;
  }
}

// ─── Boot ────────────────────────────────────────────────────────────────────
if (typeof window !== "undefined") {
  window.addEventListener("DOMContentLoaded", () => {
    (window as any).flowbotWidget = new FlowBotWidget();
  });
}
