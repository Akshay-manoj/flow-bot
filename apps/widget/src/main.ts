// Import the Tailwind CSS compiled stylesheet as an inline string
import styles from "./styles.css?inline";

interface WidgetConfig {
  token?: string;
  color?: string;
  position?: "right" | "left";
  welcomeMessage?: string;
  botName?: string;
}

class FlowBotWidget {
  private config: WidgetConfig = {
    token: "",
    color: "#3525cd",
    position: "right",
    welcomeMessage: "Hello! I'm your assistant from FlowBot. How can I help you streamline your workflows today?",
    botName: "FlowBot",
  };

  private container: HTMLDivElement | null = null;
  private chatWindow: HTMLDivElement | null = null;
  private launcher: HTMLDivElement | null = null;
  private greeting: HTMLDivElement | null = null;
  private messagesContainer: HTMLDivElement | null = null;

  private isOpen = false;

  constructor() {
    this.readConfig();
    this.injectStyles();
    this.initDOM();
  }

  private readConfig() {
    // Read from window global config if exists
    if ((window as any).FlowBotWidgetConfig) {
      this.config = { ...this.config, ...(window as any).FlowBotWidgetConfig };
    }

    // Also try to read from the current script tag
    const scripts = document.getElementsByTagName("script");
    for (let i = 0; i < scripts.length; i++) {
      const script = scripts[i];
      if (script.src.includes("widget.js") || script.getAttribute("data-flowbot-widget") !== null) {
        const token = script.getAttribute("data-token") || "";
        const color = script.getAttribute("data-color") || "";
        const position = script.getAttribute("data-position") as "right" | "left" || "";
        const welcome = script.getAttribute("data-welcome-message") || "";
        const botName = script.getAttribute("data-bot-name") || "";

        if (token) this.config.token = token;
        if (color) this.config.color = color;
        if (position) this.config.position = position;
        if (welcome) this.config.welcomeMessage = welcome;
        if (botName) this.config.botName = botName;
        break;
      }
    }
  }

  private injectStyles() {
    const styleEl = document.createElement("style");
    styleEl.id = "flowbot-widget-styles";
    styleEl.textContent = styles;
    document.head.appendChild(styleEl);
  }

  private initDOM() {
    // Create the container element
    this.container = document.createElement("div");
    this.container.id = "flowbot-widget-root";
    // Set position class
    const posClass = this.config.position === "left" ? "left-6" : "right-6";
    this.container.className = `fixed bottom-6 ${posClass} z-[99999] font-sans flex flex-col items-end gap-3`;
    document.body.appendChild(this.container);

    // 1. Create Greeting Bubble
    this.createGreetingDOM();

    // 2. Create Launcher
    this.createLauncherDOM();

    // 3. Create Chat Window
    this.createChatWindowDOM();

    // Attach interaction listeners
    this.attachListeners();
  }

  private createGreetingDOM() {
    this.greeting = document.createElement("div");
    this.greeting.className = "bg-white border border-outline-variant p-4 rounded-xl rounded-br-none shadow-lg max-w-[260px] flex items-center gap-3 relative animate-bounce-subtle select-none cursor-pointer";
    this.greeting.style.animation = "floating 3s ease-in-out infinite";
    
    // Add floating keyframes dynamically
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
      <!-- Optional notification badge -->
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
            <p class="text-[10px] opacity-80 mt-1">Online • AI Assistant</p>
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
        <!-- Initial Bot Message -->
        <div class="flex gap-2.5 max-w-[85%]">
          <div class="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center shrink-0 border border-outline-variant/30">
            <span class="material-symbols-outlined text-base text-primary">robot_2</span>
          </div>
          <div class="bg-white border border-outline-variant p-3 rounded-xl rounded-tl-none shadow-sm">
            <p class="text-xs text-on-surface font-medium leading-relaxed">${this.config.welcomeMessage}</p>
            <span class="text-[9px] text-outline mt-1 block">Just now</span>
          </div>
        </div>
      </div>

      <!-- Quick Replies -->
      <div class="px-6 pb-3 flex gap-2 overflow-x-auto select-none shrink-0 scrollbar-none py-1">
        <button class="shrink-0 px-4 py-1.5 bg-white border border-primary text-primary hover:bg-primary/5 rounded-full text-[10px] font-bold transition-all flowbot-quick-reply">
          Pricing Plans
        </button>
        <button class="shrink-0 px-4 py-1.5 bg-white border border-primary text-primary hover:bg-primary/5 rounded-full text-[10px] font-bold transition-all flowbot-quick-reply">
          Integrations
        </button>
        <button class="shrink-0 px-4 py-1.5 bg-white border border-primary text-primary hover:bg-primary/5 rounded-full text-[10px] font-bold transition-all flowbot-quick-reply">
          Live Chat
        </button>
      </div>

      {/* Input container */}
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

    // Insert as first child of container (so it stacks above launcher)
    this.container!.insertBefore(this.chatWindow, this.launcher);
    this.messagesContainer = this.chatWindow.querySelector(".flowbot-messages-area");
  }

  private attachListeners() {
    // 1. Toggle panel from launcher bubble
    this.launcher!.addEventListener("click", () => this.toggleChat());

    // 2. Hide greeting on click
    this.greeting!.addEventListener("click", () => {
      this.toggleChat();
    });

    // 3. Minimize / Close inside header
    this.chatWindow!.querySelector(".flowbot-btn-minimize")!.addEventListener("click", (e) => {
      e.stopPropagation();
      this.closeChat();
    });
    this.chatWindow!.querySelector(".flowbot-btn-close")!.addEventListener("click", (e) => {
      e.stopPropagation();
      this.closeChat();
    });

    // 4. Send Message keypress
    const inputField = this.chatWindow!.querySelector(".flowbot-input-field") as HTMLInputElement;
    inputField.addEventListener("keypress", (e) => {
      if (e.key === "Enter") {
        this.handleUserSend();
      }
    });

    // 5. Send Message click icon button
    this.chatWindow!.querySelector(".flowbot-btn-send")!.addEventListener("click", () => {
      this.handleUserSend();
    });

    // 6. Quick Replies triggers
    const quickReplies = this.chatWindow!.querySelectorAll(".flowbot-quick-reply");
    quickReplies.forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const text = (e.target as HTMLButtonElement).innerText;
        this.addMessage(text, "user");
        this.simulateBotReply(text);
      });
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

    // Remove notification badge
    const badge = this.launcher!.querySelector(".absolute");
    if (badge) badge.remove();

    // Show close, hide chat icon
    this.launcher!.querySelector(".flowbot-icon-chat")!.classList.add("hidden");
    this.launcher!.querySelector(".flowbot-icon-close")!.classList.remove("hidden");

    // Open animations
    this.chatWindow!.classList.remove("hidden");
    // Force DOM repaint
    this.chatWindow!.getBoundingClientRect();
    this.chatWindow!.classList.remove("scale-95", "translate-y-4", "opacity-0");
    this.chatWindow!.classList.add("scale-100", "translate-y-0", "opacity-100");

    // Focus input field
    setTimeout(() => {
      const input = this.chatWindow!.querySelector(".flowbot-input-field") as HTMLInputElement;
      input?.focus();
    }, 150);
  }

  private closeChat() {
    this.isOpen = false;
    this.launcher!.querySelector(".flowbot-icon-chat")!.classList.remove("hidden");
    this.launcher!.querySelector(".flowbot-icon-close")!.classList.add("hidden");

    // Close animations
    this.chatWindow!.classList.remove("scale-100", "translate-y-0", "opacity-100");
    this.chatWindow!.classList.add("scale-95", "translate-y-4", "opacity-0");
    setTimeout(() => {
      if (!this.isOpen) {
        this.chatWindow!.classList.add("hidden");
      }
    }, 300);
  }

  private handleUserSend() {
    const inputField = this.chatWindow!.querySelector(".flowbot-input-field") as HTMLInputElement;
    const text = inputField.value.trim();
    if (!text) return;

    inputField.value = "";
    this.addMessage(text, "user");
    this.simulateBotReply(text);
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

  private simulateBotReply(userMessage: string) {
    // 1. Add Typing indicator
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

    // Dynamic style sheet for animations
    if (!document.getElementById("flowbot-bounce-animations")) {
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

    this.messagesContainer!.appendChild(typingIndicator);
    this.scrollToBottom();

    // 2. Timeout and reply
    setTimeout(() => {
      // Remove typing indicator
      typingIndicator.remove();

      // Bot responses logic
      let botResponse = "Thank you for reaching out! One of our agents will contact you shortly. Feel free to explore our product categories below.";
      const cleanMsg = userMessage.toLowerCase().trim();

      if (cleanMsg.includes("price") || cleanMsg.includes("pricing") || cleanMsg.includes("plan")) {
        botResponse = `Our pricing starts at $15/mo for the Starter plan and $49/mo for the Growth plan. You can view all our premium features in the Settings > Billing tab of your dashboard!`;
      } else if (cleanMsg.includes("integration") || cleanMsg.includes("connect")) {
        botResponse = `FlowBot connects seamlessly with Google Sheets, Shopify, Stripe, Slack, HubSpot, and Zapier out-of-the-box. Go to your Integrations tab to view the setup guides.`;
      } else if (cleanMsg.includes("live chat") || cleanMsg.includes("agent") || cleanMsg.includes("chat")) {
        botResponse = `Our Live Chat Inbox simulates bot hand-offs instantly. Toggling 'Bot Takeover' lets you converse directly with your users in real time. Try it out!`;
      }

      this.addMessage(botResponse, "bot");
    }, 1200);
  }

  private scrollToBottom() {
    this.messagesContainer!.scrollTop = this.messagesContainer!.scrollHeight;
  }
}

// Automatically boot up the widget on load
if (typeof window !== "undefined") {
  window.addEventListener("DOMContentLoaded", () => {
    (window as any).flowbotWidget = new FlowBotWidget();
  });
}
