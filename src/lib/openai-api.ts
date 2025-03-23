/**
 * Utility functions for interacting with the OpenAI API
 */

// Ensure we're using the same key throughout the application
export const API_KEY_STORAGE_KEY = 'openai-api-key';

// Get the OpenAI API key from localStorage
export function getApiKey(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(API_KEY_STORAGE_KEY);
}

// Set the OpenAI API key in localStorage
export function setApiKey(apiKey: string): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(API_KEY_STORAGE_KEY, apiKey);
}

// Test if the OpenAI API key is valid
export async function testOpenAIApiKey(apiKey: string): Promise<boolean> {
  try {
    const response = await fetch('https://api.openai.com/v1/models', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${apiKey}`
      }
    });
    
    const errorData = await response.json().catch(() => null);
    if (!response.ok) {
      console.error('API key test failed:', errorData);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error testing API key:', error);
    return false;
  }
}

// Generate text-to-speech audio
export async function generateSpeech({ 
  voice, 
  input,
  instructions = '',
  model = 'tts-1'
}: {
  voice: string;
  input: string;
  instructions?: string;
  model?: string;
}): Promise<{ success: boolean; data?: { audioUrl: string }; error?: string }> {
  const apiKey = getApiKey();
  if (!apiKey) {
    return { success: false, error: 'API key not set' };
  }

  // Validate input
  if (!input || input.trim() === '') {
    return { success: false, error: 'Input text is required' };
  }

  // OpenAI has a limit of 4096 characters for TTS
  if (input.length > 4096) {
    return { 
      success: false, 
      error: `Input text is too long (${input.length} characters). Maximum is 4096 characters.` 
    };
  }

  // Normalize voice to lowercase - OpenAI's API requires lowercase voice names
  const normalizedVoice = voice.toLowerCase();
  
  // Validate voice parameter against allowed values
  // Source: https://platform.openai.com/docs/api-reference/audio/createSpeech
  const allowedVoices = ['nova', 'shimmer', 'echo', 'onyx', 'fable', 'alloy', 'ash', 'sage', 'coral'];
  if (!allowedVoices.includes(normalizedVoice)) {
    console.error(`Invalid voice "${normalizedVoice}" requested. Using "alloy" instead.`);
    return {
      success: false,
      error: `Invalid voice: "${voice}". Must be one of: ${allowedVoices.join(', ')}`
    };
  }

  // Build API request payload
  console.log(`Using model: ${model}, voice: ${normalizedVoice}`);
  
  try {
    const payload = {
      model,
      input,
      voice: normalizedVoice,
      response_format: 'mp3'
    };

    // Add optional parameters if provided
    if (instructions && instructions.trim() !== '') {
      // Don't add voice_settings to the payload as it might not be supported by the API
      console.log('Using instructions:', instructions);
    }

    console.log('Sending TTS request with payload:', {
      ...payload,
      input: `${input.substring(0, 20)}...` // Log just the start of the input for brevity
    });

    const response = await fetch('https://api.openai.com/v1/audio/speech', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify(payload)
    });

    console.log('TTS API response status:', response.status);
    
    if (!response.ok) {
      let errorMessage = `API error: ${response.status} ${response.statusText}`;
      
      try {
        const errorData = await response.json();
        if (errorData.error) {
          errorMessage = `Error: ${errorData.error.message || errorData.error}`;
        }
      } catch (err) {
        // If we can't parse JSON, use default error message
        console.error('Failed to parse error response:', err);
      }
      
      console.error('TTS API error:', errorMessage);
      return { success: false, error: errorMessage };
    }

    const audioBlob = await response.blob();
    const audioUrl = URL.createObjectURL(audioBlob);
    return { success: true, data: { audioUrl } };
  } catch (error) {
    console.error('TTS API fetch error:', error);
    const errorMessage = error instanceof Error 
      ? `Failed to fetch: ${error.message}` 
      : 'An unknown error occurred';
    return { success: false, error: errorMessage };
  }
}

// Transcribe speech to text
export async function transcribeSpeech(audioBlob: Blob): Promise<{ success: boolean; text?: string; error?: string }> {
  const apiKey = getApiKey();
  
  if (!apiKey) {
    return { success: false, error: 'API key not set' };
  }

  try {
    const formData = new FormData();
    formData.append('file', audioBlob, 'recording.webm');
    formData.append('model', 'whisper-1');
    formData.append('language', 'en');

    const response = await fetch('https://api.openai.com/v1/audio/transcriptions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`
      },
      body: formData
    });

    if (!response.ok) {
      console.error('Transcription API error:', response.status, response.statusText);
      try {
        const errorData = await response.json();
        return { success: false, error: errorData.error?.message || 'Transcription failed' };
      } catch (e) {
        return { success: false, error: `Transcription failed: ${response.status} ${response.statusText}` };
      }
    }

    const data = await response.json();
    return { success: true, text: data.text };
  } catch (error) {
    console.error('Transcription error:', error);
    const errorMessage = error instanceof Error 
      ? `Failed to transcribe: ${error.message}` 
      : 'An unknown error occurred';
    return { success: false, error: errorMessage };
  }
} 