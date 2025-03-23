"use client";

import React, { useEffect } from 'react';
import { Play, Pause, Loader2, Download, Share } from 'lucide-react';
import { useTTS } from './TTSProvider';
import Link from 'next/link';
import { getApiKey } from '@/lib/openai-api';

type ActionButtonProps = {
  label: string;
  color: 'primary' | 'secondary' | 'tertiary';
  icon: React.ReactNode;
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
};

function ActionButton({ label, color, icon, onClick, className = "", disabled = false }: ActionButtonProps) {
  return (
    <div
      className={`Button_Button__u2RFO flex gap-2 items-center justify-center font-medium ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'} ${className}`}
      data-color={color}
      role="button"
      tabIndex={disabled ? -1 : 0}
      onClick={disabled ? undefined : onClick}
    >
      {icon}
      <span className="uppercase hidden md:inline">{label}</span>
    </div>
  );
}

export function Footer() {
  const { 
    isApiKeySet, 
    isGenerating, 
    isPlaying, 
    audioUrl,
    generateTTS, 
    playAudio, 
    pauseAudio, 
    error,
    setError
  } = useTTS();

  // Clear errors when audio playback status changes
  useEffect(() => {
    if (isPlaying && error) {
      setError(null);
    }
  }, [isPlaying, error, setError]);

  const handlePlayPause = async () => {
    if (isPlaying) {
      pauseAudio();
      return;
    }

    if (audioUrl) {
      // If we already have audio generated, just play it
      playAudio();
      return;
    }

    // Otherwise, generate new audio
    await handleGenerateAudio();
  };

  const handleGenerateAudio = async () => {
    // Double check API key directly from localStorage to be sure
    const apiKey = getApiKey();
    if (!apiKey) {
      alert("API key is required. Please add your OpenAI API key in the settings.");
      return;
    }

    // Clear any previous errors
    setError(null);

    // Get the selected voice from VoiceSection
    const voiceElement = document.querySelector('[data-selected="true"] span');
    const voiceText = voiceElement?.textContent || 'Coral';
    // OpenAI requires lowercase voice names
    const voice = voiceText.trim().toLowerCase();
    
    // Get the script text from ScriptSection
    const scriptElement = document.getElementById('prompt') as HTMLTextAreaElement;
    const input = scriptElement?.value || '';
    
    // Validate input
    if (!input || input.trim() === '') {
      setError("Please enter some text in the script section");
      return;
    }
    
    // Get the vibe instructions from VibeSection
    const vibeElement = document.getElementById('input') as HTMLTextAreaElement;
    const instructions = vibeElement?.value || '';
    
    // Generate and play the audio
    console.log(`Generating audio with voice: ${voice}, input length: ${input.length} chars`);
    
    try {
      const result = await generateTTS({
        voice,
        input,
        instructions,
      });
      
      if (result.success) {
        playAudio();
      } else if (result.error) {
        setError(result.error);
        console.error('Audio generation failed:', result.error);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Unknown error";
      setError(`Error generating speech: ${errorMessage}`);
      console.error('Error generating audio:', err);
    }
  };

  const handleDownload = () => {
    if (!audioUrl) {
      alert("Generate audio first before downloading");
      return;
    }
    
    // Create an anchor element and trigger download
    const a = document.createElement('a');
    a.href = audioUrl;
    a.download = `tts-${new Date().getTime()}.mp3`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <footer className="py-3 fixed bottom-0 left-0 right-0 px-6 bg-background">
      <div className="relative w-full max-w-[var(--page-max-width)] m-auto">
        {error && (
          <div className="text-red-500 text-sm mb-2 bg-red-50 p-2 rounded">
            {error}
          </div>
        )}
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
          <ActionButton
            label="Download"
            color="tertiary"
            disabled={!audioUrl}
            onClick={handleDownload}
            icon={<Download className="w-5 h-5" />}
          />

          {!isApiKeySet ? (
            <Link href="/settings" className="col-span-1">
              <ActionButton
                label="Add API Key"
                color="secondary"
                icon={<Share className="w-5 h-5" />}
              />
            </Link>
          ) : (
            <ActionButton
              label="Share"
              color="secondary"
              disabled={!audioUrl}
              icon={<Share className="w-5 h-5" />}
            />
          )}

          <div className="flex col-span-1 sm:col-span-2">
            <ActionButton
              label={isPlaying ? "Pause" : "Play"}
              color="primary"
              className="w-full text-lg flex-row-reverse"
              disabled={isGenerating && !audioUrl}
              onClick={handlePlayPause}
              icon={
                isGenerating ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : isPlaying ? (
                  <Pause className="w-5 h-5" />
                ) : (
                  <Play className="w-5 h-5" />
                )
              }
            />
          </div>
        </div>
      </div>
    </footer>
  );
}
