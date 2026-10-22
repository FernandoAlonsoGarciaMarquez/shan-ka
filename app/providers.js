"use client";

import { AudioProvider } from "@/app/context/AudioContext";
import { LayoutProvider } from "@/app/context/LayoutContext";
import { SyncProvider } from "@/app/context/SyncJsonsDexieContext";

export default function Providers({ children }) {
    return(
        
           
                <AudioProvider>
                   
                     <LayoutProvider>
                             <SyncProvider>
                        {children}
                            </SyncProvider>
                        </LayoutProvider>
                </AudioProvider>
            

    ); 

}