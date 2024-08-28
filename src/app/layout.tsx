import { TRPCReactProvider } from "@/trpc/react";
import type { Metadata } from "next";
import { Toaster } from "sonner";

import { Inter as FontSans } from "next/font/google";

import { TooltipProvider } from "@/components/ui/tooltip";
import TailwindIndicator from "@/frontend/components/common/TailwindIndicator";
import Navbar from "@/frontend/components/layout/Navbar";
import ActiveModals from "@/frontend/components/modals/ActiveModals";
import { APP_NAME } from "@/frontend/config";
import { JotaiProvider } from "@/frontend/lib/jotai-provider";
import ThemeProvider from "@/frontend/lib/theme-provider";
import { cn } from "@/frontend/lib/utils";
import "./globals.css";

export const metadata: Metadata = {
  title: APP_NAME,
  description: "",
};

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});

export default ({ children }: { children: React.ReactNode }) => {
  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          fontSans.variable
        )}
      >
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <TRPCReactProvider>
            <JotaiProvider>
              <TooltipProvider>
                <Navbar>{children}</Navbar>
                <ActiveModals />
              </TooltipProvider>
            </JotaiProvider>
          </TRPCReactProvider>
        </ThemeProvider>
        <TailwindIndicator />

        <div className="absolute bottom-0 right-0">
          <Toaster richColors position="bottom-left" />
        </div>
      </body>
    </html>
  );
};
