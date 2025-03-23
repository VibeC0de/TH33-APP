"use client";

import Link from "next/link";
import { useTheme } from "./ThemeProvider";
import { Moon, Sun, Settings, Monitor } from "lucide-react";

export function Header() {
  const { theme, setTheme, resolvedTheme } = useTheme();

  return (
    <header className="flex w-full max-w-[var(--page-max-width)] mx-auto mb-12 md:mb-8">
      <div className="grid grid-cols-12 gap-x-3 w-full">
        <div className="col-span-2 order-1 mb-8 md:mb-0">
          <div className="relative top-[0.0875rem]">
            <Link href="/">
              <h1 className="text-xl font-medium hover:text-current/70 transition-colors cursor-pointer">TH33APP</h1>
            </Link>
          </div>
        </div>

        <div className="col-span-12 md:col-span-7 xl:col-span-6 order-3 md:order-2">
          <div className="text-balance">
            <div className="text-current/70 mb-3">
              Powered by azlabs.ai - The leading platform for AI technology solutions and innovation.
            </div>
            <Link
              className="uppercase hover:text-current/70 transition-colors inline-block"
              href="https://azlabs.ai"
              target="_blank"
            >
              <span className="flex items-center gap-x-1">
                Visit azlabs.ai
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M7 17L17 7M17 7H7M17 7V17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </span>
            </Link>
          </div>
        </div>

        <div className="col-span-10 md:col-span-3 xl:col-span-4 flex justify-end items-start order-2 md:order-3">
          <div className="relative -top-[0.57rem] flex gap-4">
            <Link href="/settings" className="flex items-center cursor-pointer hover:text-current/70 transition-colors">
              <Settings className="h-5 w-5" />
            </Link>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setTheme("light")}
                className={`flex items-center cursor-pointer hover:text-current/70 transition-colors ${theme === "light" ? "text-primary" : ""}`}
                aria-label="Light mode"
              >
                <Sun className="h-5 w-5" />
              </button>
              
              <button
                onClick={() => setTheme("dark")}
                className={`flex items-center cursor-pointer hover:text-current/70 transition-colors ${theme === "dark" ? "text-primary" : ""}`}
                aria-label="Dark mode"
              >
                <Moon className="h-5 w-5" />
              </button>
              
              <button
                onClick={() => setTheme("system")}
                className={`flex items-center cursor-pointer hover:text-current/70 transition-colors ${theme === "system" ? "text-primary" : ""}`}
                aria-label="System theme"
              >
                <Monitor className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
