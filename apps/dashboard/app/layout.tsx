import type { Metadata } from "next";
import "./globals.css";
import Sidebar from "../components/Sidebar";
import { Geist } from "next/font/google";
import { cn } from "@/lib/utils";
import { SidebarProvider } from "@/lib/sidebar-context";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

export const metadata: Metadata = {
  title: "FlowBot Dashboard",
  description: "Manage your chat widget and conversational flows",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={cn("light", "font-sans", geist.variable)} suppressHydrationWarning>
      <head>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
        />
      </head>
      <body className="bg-background text-on-background antialiased">
        <SidebarProvider>
          <div className="flex min-h-screen">
            <Sidebar />
            <main className="flex-1 min-h-screen flex flex-col">
              {children}
            </main>
          </div>
        </SidebarProvider>
      </body>
    </html>
  );
}

