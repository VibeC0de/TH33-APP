"use client";

import React from 'react';
import { Play, Pause, Loader2, AlertCircle } from 'lucide-react';
import { useTTS } from './TTSProvider';
import Link from 'next/link';

export function AudioStatus() {
  const { 
    isApiKeySet, 
    isGenerating, 
    isPlaying, 
    audioUrl,
    error 
  } = useTTS();

  if (isGenerating) {
    return (
      <div className="fixed bottom-20 left-1/2 -translate-x-1/2 bg-background border border-border rounded-full px-4 py-2 flex items-center gap-2 shadow-md z-50">
        <Loader2 className="w-4 h-4 text-primary animate-spin" />
        <span className="text-sm">Generating audio...</span>
      </div>
    );
  }

  if (isPlaying) {
    return (
      <div className="fixed bottom-20 left-1/2 -translate-x-1/2 bg-background border border-border rounded-full px-4 py-2 flex items-center gap-2 shadow-md z-50">
        <div className="flex space-x-1">
          <div className="w-1 h-6 bg-primary rounded-full animate-[soundwave_0.5s_ease-in-out_infinite_alternate]"></div>
          <div className="w-1 h-6 bg-primary rounded-full animate-[soundwave_0.5s_ease-in-out_0.1s_infinite_alternate]"></div>
          <div className="w-1 h-6 bg-primary rounded-full animate-[soundwave_0.5s_ease-in-out_0.2s_infinite_alternate]"></div>
          <div className="w-1 h-6 bg-primary rounded-full animate-[soundwave_0.5s_ease-in-out_0.3s_infinite_alternate]"></div>
        </div>
        <span className="text-sm">Playing audio...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="fixed bottom-20 left-1/2 -translate-x-1/2 bg-red-50 dark:bg-red-900/30 border border-red-300 dark:border-red-800 text-red-700 dark:text-red-300 rounded-full px-4 py-2 flex items-center gap-2 shadow-md z-50">
        <AlertCircle className="w-4 h-4" />
        <span className="text-sm">{error}</span>
      </div>
    );
  }

  if (!isApiKeySet && !error && !audioUrl) {
    return (
      <div className="fixed bottom-20 left-1/2 -translate-x-1/2 bg-amber-50 dark:bg-amber-900/30 border border-amber-300 dark:border-amber-800 text-amber-700 dark:text-amber-300 rounded-full px-4 py-2 flex items-center gap-2 shadow-md z-50">
        <AlertCircle className="w-4 h-4" />
        <span className="text-sm">
          API key required. <Link href="/settings" className="underline">Add your OpenAI key</Link>
        </span>
      </div>
    );
  }

  return null;
} 