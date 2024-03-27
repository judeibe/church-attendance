import { cn } from "@/lib/utils";
import { ThemeProvider } from "@/components/theme-provider";

import "@/styles/globals.css";

import type { Metadata } from "next";
import { Inter as FontSans } from "next/font/google";

const fontSans = FontSans({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: "Church Attendance Tracker",
  description: "Track church attendance with ease",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          fontSans.variable,
        )}
      >
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
