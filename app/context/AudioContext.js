"use client";

// const URL_AUDIOS_HOSTING = 'https://voices-def.infinityfreeapp.com/voices/';

import { createContext, useContext, useRef } from "react";

const AudioContext = createContext(null);

export function AudioProvider({ children }) {
  const audioRefs = useRef({});

  const play = (src) => {
    src = "voices/"+src

    // src = URL_AUDIOS_HOSTING + src

    if (!audioRefs.current[src]) {
      audioRefs.current[src] = new Audio(src);
    }

    audioRefs.current[src].currentTime = 0;
    // audioRefs.current[src].play();
        audioRefs.current[src].play().catch(console.error);
        // console.log("AUDIO URL:", src);

  };

  return (
    <AudioContext.Provider value={{ play }}>
      {children}
    </AudioContext.Provider>
  );
}

export function useAudio() {
  return useContext(AudioContext);
}
