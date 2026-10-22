'use-client';

import { useAudio } from "@/app/context/AudioContext";

export default function VoicePlayButton({ item_pinyin, item_file, className }) {
  const { play } = useAudio();

  return (
    <button 

    className={className}

    onClick={() => 
    {
    // alert(item_file);
    play(item_file);
    }
    }
    
    >
      {item_pinyin}
    </button>
  );
}