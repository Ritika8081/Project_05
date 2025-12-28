import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ErrorBoundary from "@/components/ErrorBoundary";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Emotional Mirror - Understand Yourself",
  description:
    "A gentle web app to help you recognize emotional patterns in relationships",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased overflow-hidden bg-gradient-to-br from-slate-50 via-orange-50 to-rose-50`}
      >
        <ErrorBoundary>
          <div className="flex flex-col h-screen w-screen overflow-hidden">
            {children}
          </div>
        </ErrorBoundary>
      </body>
    </html>
  );
}
