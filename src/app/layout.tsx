import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "JS Debug Playground — Execute, Visualize & Debug JavaScript",
  description:
    "A professional developer tool to execute, visualize DOM changes, track event flows, detect bugs, and debug AI-generated JavaScript code in real-time.",
  keywords: [
    "JavaScript debugger",
    "DOM visualizer",
    "event flow tracker",
    "code playground",
    "AI code analysis",
    "developer tool",
  ],
  authors: [{ name: "JS Debug Playground" }],
  openGraph: {
    title: "JS Debug Playground",
    description:
      "Execute, visualize & debug JavaScript code with real-time DOM tracking and AI-powered analysis.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} dark antialiased`}
    >
      <body className="min-h-screen flex flex-col bg-background font-sans">
        {children}
        <Toaster
          position="bottom-right"
          toastOptions={{
            className: "text-xs",
            duration: 3000,
          }}
          richColors
          closeButton
        />
      </body>
    </html>
  );
}
