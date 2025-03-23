"use client";

import React, { useState } from 'react';
import { SectionHeader } from './SectionHeader';

type VoiceButtonProps = {
  name: string;
  isSelected?: boolean;
  hasAdditionalIcon?: boolean;
  onClick?: () => void;
};

function VoiceButton({ name, isSelected = false, hasAdditionalIcon = false, onClick }: VoiceButtonProps) {
  return (
    <div
      className="Button_Button__u2RFO aspect-4/3 sm:aspect-2/1 lg:aspect-2.5/1 xl:aspect-square min-h-[60px] max-h-[100px] flex-col items-start justify-between relative"
      data-color="default"
      data-block=""
      data-selected={isSelected ? "true" : undefined}
      role="button"
      tabIndex={0}
      onClick={onClick}
    >
      <span>{name}</span>
      <div className="absolute left-[0.93rem] bottom-[0.93rem]">
        <span className="Button_LED__yt_Oj" data-on={isSelected ? "true" : undefined}></span>
      </div>
      {hasAdditionalIcon && (
        <div className="absolute right-[13px] bottom-[10.5px]">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M8 3L4 7L8 11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M16 3L20 7L16 11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      )}
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
      className="Button_Button__u2RFO aspect-4/3 sm:aspect-2/1 lg:aspect-2.5/1 xl:aspect-square max-h-[100px] flex items-center justify-center"
      data-color="neutral"
      data-block=""
      role="button"
      tabIndex={0}
      aria-label="Select random voice"
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

export function VoiceSection() {
  const [selectedVoice, setSelectedVoice] = useState('Coral');

  // Updated to match OpenAI's valid TTS voices
  // Valid voices: 'nova', 'shimmer', 'echo', 'onyx', 'fable', 'alloy', 'ash', 'sage', 'coral'
  const voices = [
    { name: 'Alloy', hasIcon: false },
    { name: 'Ash', hasIcon: true },
    { name: 'Coral', hasIcon: true },
    { name: 'Echo', hasIcon: false },
    { name: 'Fable', hasIcon: false },
    { name: 'Nova', hasIcon: false },
    { name: 'Onyx', hasIcon: false },
    { name: 'Sage', hasIcon: true },
    { name: 'Shimmer', hasIcon: false },
  ];

  const selectRandomVoice = () => {
    const randomIndex = Math.floor(Math.random() * voices.length);
    setSelectedVoice(voices[randomIndex].name);
  };

  return (
    <div className="flex flex-1 flex-col shrink-0 mb-10">
      <SectionHeader title="Voice" />
      <div className="flex flex-1 flex-col pt-3 rounded-md">
        <div className="grid grid-cols-12 gap-3">
          {voices.map((voice) => (
            <div className="col-span-4 sm:col-span-3 md:col-span-2 xl:col-span-1 relative" key={voice.name}>
              <VoiceButton
                name={voice.name}
                isSelected={selectedVoice === voice.name}
                hasAdditionalIcon={voice.hasIcon}
                onClick={() => setSelectedVoice(voice.name)}
              />
            </div>
          ))}
          <div className="col-span-4 sm:col-span-3 md:col-span-2 xl:col-span-1">
            <RandomButton onClick={selectRandomVoice} />
          </div>
        </div>
      </div>
    </div>
  );
}
