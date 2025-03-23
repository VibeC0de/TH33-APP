import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import { TTSProvider } from "@/components/TTSProvider";
import { AudioStatus } from "@/components/AudioStatus";

export const metadata: Metadata = {
  title: "TH33APP",
  description: "Powered by azlabs.ai - The leading platform for AI technology solutions and innovation.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased min-h-screen flex flex-col" suppressHydrationWarning>
        <ThemeProvider>
          <TTSProvider>
            <div className="flex flex-col gap-x-3 min-h-screen px-5 pt-6 pb-32 md:pb-24">
              {children}
              <AudioStatus />
            </div>
          </TTSProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
