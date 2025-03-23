"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { getApiKey, generateSpeech, transcribeSpeech, API_KEY_STORAGE_KEY } from "@/lib/openai-api";

// Define the context type
type TTSContextType = {
  isApiKeySet: boolean;
  isGenerating: boolean;
  audioUrl: string | null;
  isPlaying: boolean;
  isRecording: boolean;
  generateTTS: (params: {
    voice: string;
    input: string;
    instructions: string;
  }) => Promise<{ success: boolean; error?: string }>;
  startSpeechRecognition: () => Promise<{ success: boolean; text?: string; error?: string }>;
  playAudio: () => void;
  pauseAudio: () => void;
  stopAudio: () => void;
  error: string | null;
  setError: (error: string | null) => void;
};

// Create the context with a default value
const TTSContext = createContext<TTSContextType | undefined>(undefined);

// Hook for using the context
export function useTTS() {
  const context = useContext(TTSContext);
  if (context === undefined) {
    throw new Error("useTTS must be used within a TTSProvider");
  }
  return context;
}

// Provider component
export function TTSProvider({ children }: { children: ReactNode }) {
  const [isApiKeySet, setIsApiKeySet] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [audioElement, setAudioElement] = useState<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const [audioChunks, setAudioChunks] = useState<Blob[]>([]);

  // Function to check if API key is set
  const checkApiKey = () => {
    const apiKey = getApiKey();
    setIsApiKeySet(!!apiKey);
    console.log('API key check:', !!apiKey);
    return !!apiKey;
  };

  // Check API key on mount and when localStorage changes
  useEffect(() => {
    // Initial check
    checkApiKey();

    // Setup listener for storage changes (if user updates key in another tab)
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === API_KEY_STORAGE_KEY) {
        checkApiKey();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    
    // Check API key when window gets focus (coming back from settings)
    const handleWindowFocus = () => {
      checkApiKey();
    };
    
    window.addEventListener('focus', handleWindowFocus);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('focus', handleWindowFocus);
    };
  }, []);

  // Initialize audio element
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const audio = new Audio();
      setAudioElement(audio);

      // Add event listeners
      audio.addEventListener('play', () => setIsPlaying(true));
      audio.addEventListener('pause', () => setIsPlaying(false));
      audio.addEventListener('ended', () => setIsPlaying(false));

      return () => {
        audio.pause();
        audio.removeEventListener('play', () => setIsPlaying(true));
        audio.removeEventListener('pause', () => setIsPlaying(false));
        audio.removeEventListener('ended', () => setIsPlaying(false));
      };
    }
  }, []);

  // Update audio source when URL changes
  useEffect(() => {
    if (audioElement && audioUrl) {
      audioElement.src = audioUrl;
      audioElement.load();
    }
  }, [audioUrl, audioElement]);

  // Generate speech using the OpenAI API
  const generateTTS = async ({ voice, input, instructions }: { 
    voice: string; 
    input: string; 
    instructions: string;
  }) => {
    // Double check the API key directly
    if (!checkApiKey()) {
      setError("API key not set. Please add your OpenAI API key in the settings.");
      return { success: false, error: "API key not set" };
    }

    if (!input || input.trim() === '') {
      setError("Please enter some text in the script section");
      return { success: false, error: "No input text provided" };
    }

    setIsGenerating(true);
    setError(null);

    try {
      console.log('Requesting TTS with voice:', voice);
      
      const result = await generateSpeech({
        voice,
        input,
        instructions,
      });

      if (result.success && result.data?.audioUrl) {
        setAudioUrl(result.data.audioUrl);
        return { success: true };
      } else {
        const errorMessage = result.error || "Failed to generate speech";
        console.error('TTS error:', errorMessage);
        setError(errorMessage);
        return { success: false, error: errorMessage };
      }
    } catch (err) {
      console.error('TTS generation error:', err);
      const errorMessage = err instanceof Error ? err.message : "An unknown error occurred";
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsGenerating(false);
    }
  };

  // Speech-to-text recording and transcription
  const startSpeechRecognition = async (): Promise<{ success: boolean; text?: string; error?: string }> => {
    if (!isApiKeySet) {
      setError("API key not set. Please add your OpenAI API key in the settings.");
      return { success: false, error: "API key not set" };
    }

    if (!navigator.mediaDevices) {
      setError("Media devices not supported in this browser");
      return { success: false, error: "Media devices not supported" };
    }

    try {
      setIsRecording(true);
      setError(null);
      setAudioChunks([]);

      // Request microphone access
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      // Create a new media recorder
      const recorder = new MediaRecorder(stream);
      setMediaRecorder(recorder);
      
      // Create a promise that will resolve with the final transcription
      const transcriptionPromise = new Promise<{ success: boolean; text?: string; error?: string }>((resolve) => {
        const chunks: Blob[] = [];
        
        // Collect audio chunks
        recorder.ondataavailable = (e) => {
          if (e.data.size > 0) {
            chunks.push(e.data);
          }
        };
        
        // When recording stops, transcribe the audio
        recorder.onstop = async () => {
          try {
            // Combine all chunks into a single blob
            const audioBlob = new Blob(chunks, { type: 'audio/webm' });
            
            // Send to OpenAI for transcription
            const result = await transcribeSpeech(audioBlob);
            
            // Clean up the stream tracks
            stream.getTracks().forEach(track => track.stop());
            
            setIsRecording(false);
            
            if (result.success) {
              resolve({ success: true, text: result.text });
            } else {
              setError(result.error || "Failed to transcribe audio");
              resolve({ success: false, error: result.error });
            }
          } catch (error) {
            setIsRecording(false);
            const errorMessage = error instanceof Error ? error.message : "Unknown error";
            setError(`Error transcribing: ${errorMessage}`);
            resolve({ success: false, error: errorMessage });
          }
        };
        
        // Start recording
        recorder.start();
        
        // Record for 10 seconds max
        setTimeout(() => {
          if (recorder.state === "recording") {
            recorder.stop();
          }
        }, 10000);
      });
      
      // Add a stop button functionality
      const stopRecording = () => {
        if (recorder && recorder.state === "recording") {
          recorder.stop();
        }
      };
      
      // Stop after 3 seconds for testing (you can adjust or remove this)
      setTimeout(stopRecording, 5000);
      
      return await transcriptionPromise;
      
    } catch (err) {
      setIsRecording(false);
      const errorMessage = err instanceof Error ? err.message : "An unknown error occurred";
      setError(`Microphone error: ${errorMessage}`);
      return { success: false, error: errorMessage };
    }
  };

  // Audio control functions
  const playAudio = () => {
    if (audioElement && audioUrl) {
      audioElement.play().catch(err => {
        console.error("Error playing audio:", err);
        setError("Failed to play audio");
      });
    }
  };

  const pauseAudio = () => {
    if (audioElement) {
      audioElement.pause();
    }
  };

  const stopAudio = () => {
    if (audioElement) {
      audioElement.pause();
      audioElement.currentTime = 0;
    }
  };

  const value: TTSContextType = {
    isApiKeySet,
    isGenerating,
    isRecording,
    audioUrl,
    isPlaying,
    generateTTS,
    startSpeechRecognition,
    playAudio,
    pauseAudio,
    stopAudio,
    error,
    setError,
  };

  return <TTSContext.Provider value={value}>{children}</TTSContext.Provider>;
} 