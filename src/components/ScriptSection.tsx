"use client";

import React, { useState } from 'react';
import { SectionHeader } from './SectionHeader';
import { Textarea } from '@/components/ui/textarea';
import { Mic, Loader2 } from 'lucide-react';
import { useTTS } from './TTSProvider';
import { getApiKey } from '@/lib/openai-api';

export function ScriptSection() {
  const [scriptText, setScriptText] = useState(`What's up, sports fans?! Welcome to The Final Whistle! I'm your host, and today, we're breaking down last night's epic overtime thriller!

The crowd was electric, the players fired up, and the Artica Aces pulled off a comeback for the ages! We'll dive into the key plays and standout moments, and what this means for the rest of the season.

This one's packed with heart-pounding action, so grab your snacks, and let's get into it!`);

  const { 
    isApiKeySet, 
    isGenerating, 
    isPlaying, 
    isRecording,
    generateTTS, 
    startSpeechRecognition,
    playAudio, 
    pauseAudio,
    error
  } = useTTS();

  // Function to handle speech-to-text using OpenAI's API
  const handleSpeechToText = async () => {
    // Check API key directly
    const apiKey = getApiKey();
    if (!apiKey) {
      alert("API key not set. Please add your OpenAI API key in the settings.");
      return;
    }

    if (isRecording) {
      return; // Already recording
    }

    try {
      const result = await startSpeechRecognition();
      
      if (result.success && result.text) {
        // Append the transcribed text to the current text
        setScriptText(prev => {
          return prev ? `${prev}\n\n${result.text}` : result.text || '';
        });
      } else if (result.error) {
        alert(`Error: ${result.error}`);
      }
    } catch (err) {
      console.error("Speech recognition error:", err);
      alert("Failed to recognize speech. Check console for details.");
    }
  };

  const handleGenerateAudio = async () => {
    // Get the selected voice and vibe from sibling components
    // For now, we'll use hardcoded values for the demo
    const voiceText = document.querySelector('[data-selected="true"] span')?.textContent || 'coral';
    // OpenAI requires lowercase voice names
    const voice = voiceText.trim().toLowerCase();
    
    // Get the vibe instructions from the textarea in VibeSection
    const vibeTextarea = document.getElementById('input') as HTMLTextAreaElement;
    const instructions = vibeTextarea?.value || "";
    
    await generateTTS({
      voice,
      input: scriptText,
      instructions,
    });
  };

  return (
    <div className="flex flex-1 flex-col shrink-0 mb-10">
      <SectionHeader title="Script" />
      <div className="flex flex-1 flex-col pt-3 rounded-md">
        <div className="relative flex flex-col h-full w-full">
          <Textarea
            id="prompt"
            className="w-full h-full min-h-[220px] resize-none outline-none focus:outline-none bg-[#f7f7f7] dark:bg-[#1e1e1e] p-4 rounded-lg shadow-textarea text-[16px] md:text-[14px] pb-10"
            value={scriptText}
            onChange={(e) => setScriptText(e.target.value)}
            rows={8}
          />
          <div className="absolute right-4 bottom-4 flex items-center gap-2">
            <button
              className={`${isRecording ? 'bg-primary/20 opacity-100' : 'opacity-70'} hover:opacity-100 transition-all focus:outline-none focus:ring-2 focus:ring-primary rounded-full p-1 disabled:cursor-not-allowed`}
              onClick={handleSpeechToText}
              disabled={isRecording}
              aria-label={isRecording ? "Recording in progress" : "Use speech to text"}
            >
              {isRecording ? (
                <Loader2 className="w-5 h-5 text-primary animate-spin" />
              ) : (
                <Mic className="w-5 h-5 text-primary" />
              )}
            </button>
            <span className="text-xs opacity-30 select-none">{scriptText.length}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
