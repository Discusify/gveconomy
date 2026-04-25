import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/ui/app-sidebar";
import { AuthProvider } from "@/clientContext/AuthContext";
import { getServerSession } from "@/lib/supabase/serverClient";
import React from "react";
import supabase from "@/lib/supabase/server";
import { SessionProfile } from "@/lib/exportableTypes";
import { Toaster } from "@/components/ui/sonner";

const inter = Inter({subsets:['latin'],variable:'--font-sans'});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Golden Vitality Bank",
  description: "Golden Vitality Bank",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getServerSession()
 
  let profile: SessionProfile | null = null
  if (session) {
    const { data, error } = await supabase
      .from("profiles")
      .select("username, displayname, avatar_url")
      .eq("id", session.user.id)
      .single<SessionProfile>();
      if (error) {
        console.error(error)
      }
    profile = data;
  }
  return (
    <html
      lang="en"
      className={cn("h-full", "antialiased", geistSans.variable, geistMono.variable, "font-sans", inter.variable) + " dark"}
    >
      <body className="min-h-full flex flex-col dark">
        <AuthProvider initialSession={session} initialProfile={profile}>
          <TooltipProvider>
            <SidebarProvider>
              <AppSidebar />
              <main className="w-full">
                {children}
                <Toaster />
              </main>
            </SidebarProvider>
          </TooltipProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
