"use client";

import { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { SectionHeader } from "@/components/SectionHeader";
import { testOpenAIApiKey, setApiKey, getApiKey } from "@/lib/openai-api";

export default function SettingsPage() {
  const [apiKey, setApiKeyState] = useState("");
  const [testStatus, setTestStatus] = useState<null | "success" | "error">(null);
  const [isLoading, setIsLoading] = useState(false);
  const [testMessage, setTestMessage] = useState("");

  // Load API key from localStorage on initial render
  useEffect(() => {
    const savedApiKey = getApiKey();
    if (savedApiKey) {
      setApiKeyState(savedApiKey);
    }
  }, []);

  // Save API key to localStorage
  const saveApiKey = () => {
    setApiKey(apiKey);
    setTestStatus("success");
    setTestMessage("API key saved successfully!");
    
    // Clear message after 3 seconds
    setTimeout(() => {
      setTestMessage("");
    }, 3000);
  };

  // Test API key by making a request to OpenAI API
  const testApiKey = async () => {
    if (!apiKey) {
      setTestStatus("error");
      setTestMessage("Please enter an API key");
      return;
    }

    setIsLoading(true);
    setTestStatus(null);
    
    try {
      const result = await testOpenAIApiKey(apiKey);
      
      if (result) {
        setTestStatus("success");
        setTestMessage("API key is valid!");
      } else {
        setTestStatus("error");
        setTestMessage("Invalid API key. Please check and try again.");
      }
    } catch (error) {
      setTestStatus("error");
      setTestMessage(`Network error: ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Header />
      <main className="flex-1 flex flex-col gap-x-3 w-full max-w-[var(--page-max-width)] mx-auto">
        <div className="mb-8">
          <SectionHeader title="Settings" />
          
          <div className="p-4 bg-card rounded-lg mt-4">
            <div className="mb-6">
              <h2 className="text-xl font-medium mb-2">OpenAI API Key</h2>
              <p className="text-muted-foreground mb-4">
                An OpenAI API key is required to use the text-to-speech features in this application.
                You can get your API key from the{" "}
                <a 
                  href="https://platform.openai.com/api-keys" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  OpenAI API keys page
                </a>.
              </p>
              
              <div className="mb-4">
                <label htmlFor="api-key" className="block mb-2 text-sm font-medium">
                  API Key
                </label>
                <input
                  id="api-key"
                  type="password"
                  className="w-full p-2 border border-input rounded-md bg-background"
                  value={apiKey}
                  onChange={(e) => setApiKeyState(e.target.value)}
                  placeholder="sk-..."
                />
              </div>
              
              <div className="flex gap-3">
                <Button onClick={saveApiKey}>
                  Save Key
                </Button>
                <Button 
                  onClick={testApiKey} 
                  disabled={isLoading}
                  variant="outline"
                >
                  {isLoading ? "Testing..." : "Test Key"}
                </Button>
              </div>
              
              {testMessage && (
                <div 
                  className={`mt-4 p-3 rounded ${
                    testStatus === "success" 
                      ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300" 
                      : testStatus === "error" 
                      ? "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300" 
                      : "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300"
                  }`}
                >
                  {testMessage}
                </div>
              )}
            </div>

            <div className="border-t border-border pt-4">
              <h3 className="text-lg font-medium mb-2">Usage Information</h3>
              <p className="text-muted-foreground mb-2">
                Your API key is stored locally in your browser and is never sent to our servers.
                It is used only to make direct requests to OpenAI's API for text-to-speech conversions.
              </p>
              <p className="text-muted-foreground">
                Using the OpenAI API incurs costs based on your usage. Please review the{" "}
                <a 
                  href="https://openai.com/pricing" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  OpenAI pricing page
                </a>{" "}
                for current rates.
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
} 