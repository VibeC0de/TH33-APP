"use client";

import React, { useState, useRef } from 'react';
import { SectionHeader } from './SectionHeader';
import { Textarea } from '@/components/ui/textarea';

type VibeButtonProps = {
  name: string;
  isSelected?: boolean;
  onClick?: () => void;
};

function VibeButton({ name, isSelected = false, onClick }: VibeButtonProps) {
  return (
    <div
      className="Button_Button__u2RFO aspect-4/3 sm:aspect-2/1 lg:aspect-2.5/1 min-h-[60px] max-h-[100px] flex-col items-start justify-between relative"
      data-color="default"
      data-block=""
      data-selected={isSelected ? "true" : undefined}
      role="button"
      tabIndex={0}
      onClick={onClick}
    >
      <span className="break-words pr-1">{name}</span>
      <div className="absolute left-[0.93rem] bottom-[0.93rem]">
        <span className="Button_LED__yt_Oj" data-on={isSelected ? "true" : undefined}></span>
      </div>
      {isSelected && (
        <div className="absolute inset-0 rounded-md border border-orange-500 pointer-events-none" aria-hidden="true"></div>
      )}
    </div>
  );
}

type RandomButtonProps = {
  onClick: () => void;
};

function RandomButton({ onClick }: RandomButtonProps) {
  return (
    <div
      className="Button_Button__u2RFO aspect-4/3 sm:aspect-2/1 lg:aspect-2.5/1 min-h-[60px] max-h-[100px] flex items-center justify-center"
      data-color="neutral"
      data-block=""
      role="button"
      tabIndex={0}
      aria-label="Generate new list of vibes"
      onClick={onClick}
    >
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M8 3L4 7L8 11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M16 3L20 7L16 11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M4 7H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    </div>
  );
}

// Define vibe types
type VibePresetKey = 'Sports Coach' | 'Calm' | 'Santa' | 'Noir Detective' | 'Dramatic';

// Define vibe presets with instructions
const vibePresets: Record<VibePresetKey, string> = {
  'Sports Coach': `Voice Affect: Energetic and animated; dynamic with variations in pitch and tone.

Tone: Excited and enthusiastic, conveying an upbeat and thrilling atmosphere.

Pacing: Rapid delivery when describing the game or the key moments (e.g., "an overtime thriller," "pull off an unbelievable win") to convey the intensity and build excitement.

Slightly slower during dramatic pauses to let key points sink in.

Emotion: Intensely focused, and excited. Giving off positive energy.

Personality: Relatable and engaging.

Pauses: Short, purposeful pauses after key moments in the game.`,

  'Calm': `Voice Affect: Gentle, smooth, and even; minimal pitch variation.

Tone: Soothing and tranquil, with a softness that eases tension.

Pacing: Slow and deliberate, allowing each word to be fully articulated.

Emotion: Peaceful and reassuring, completely free from urgency or anxiety.

Personality: Comforting and stabilizing, like a steady presence.

Pauses: Unhurried pauses between sentences, creating a rhythm that encourages the listener to breathe and relax.`,

  'Santa': `Voice Affect: Warm, jolly and resonant with a deep richness.

Tone: Cheerful and friendly with an underlying warmth that conveys kindness.

Pacing: Unhurried and comfortable, with a slightly slower cadence that feels welcoming.

Emotion: Joyful and good-natured, exuding happiness and generosity.

Personality: Inherently kind and paternal, with an infectious heartiness.

Pauses: Occasional chuckles or "ho ho ho" laughs between sentences.

Pronunciation: Emphasis on certain words with an almost musical quality, particularly when expressing delight or excitement.`,

  'Noir Detective': `Voice Affect: Low, hushed, and suspenseful; convey tension and intrigue.

Tone: Deeply serious and mysterious, maintaining an undercurrent of unease throughout.

Pacing: Slow, deliberate, pausing slightly after suspenseful moments to heighten drama.

Emotion: Restrained yet intense—voice should subtly tremble or tighten at key suspenseful points.

Emphasis: Highlight sensory descriptions to amplify atmosphere.

Pronunciation: Slightly elongated vowels and softened consonants for an eerie, haunting effect.

Pauses: Insert meaningful pauses after phrases to enhance suspense dramatically.`,

  'Dramatic': `Voice Affect: Intense with significant dynamic range; powerful and commanding.

Tone: Deeply emotional and passionate with clear conviction in every word.

Pacing: Varied for effect - slow and deliberate for important revelations, quickening for building tension.

Emotion: Bold and unrestrained, allowing full expression of strong emotions.

Personality: Theatrical and expressive, with a flair for the dramatic.

Pauses: Strategic dramatic pauses before key revelations or powerful statements.

Pronunciation: Crisp articulation with emphasis on emotional words; occasionally lingering on syllables for dramatic effect.`
};

export function VibeSection() {
  const [selectedVibe, setSelectedVibe] = useState<VibePresetKey>('Sports Coach');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const vibes = Object.keys(vibePresets) as VibePresetKey[];

  const handleVibeSelection = (vibe: VibePresetKey) => {
    setSelectedVibe(vibe);
    if (textareaRef.current) {
      textareaRef.current.value = vibePresets[vibe];
    }
  };

  const selectRandomVibe = () => {
    const randomIndex = Math.floor(Math.random() * vibes.length);
    const randomVibe = vibes[randomIndex];
    handleVibeSelection(randomVibe);
  };

  return (
    <div className="flex flex-1 flex-col shrink-0 mb-10">
      <SectionHeader title="Vibe" />
      <div className="flex flex-1 flex-col pt-3 rounded-md">
        <div className="flex flex-col gap-3">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {vibes.map((vibe) => (
              <VibeButton
                key={vibe}
                name={vibe}
                isSelected={selectedVibe === vibe}
                onClick={() => handleVibeSelection(vibe)}
              />
            ))}
            <RandomButton onClick={selectRandomVibe} />
          </div>

          <Textarea
            id="input"
            ref={textareaRef}
            className="w-full resize-none outline-none focus:outline-none bg-[#f7f7f7] dark:bg-[#1e1e1e] p-4 rounded-lg shadow-textarea text-[16px] md:text-[14px]"
            defaultValue={vibePresets[selectedVibe]}
            rows={8}
          />
        </div>
      </div>
    </div>
  );
}
