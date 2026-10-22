'use client';
import React from "react";
import VoicePlayButton from "@/app/components/card/voice-play-btn"
import { useRef, useState } from "react";

import {useHoverPopupTrigger} from '@/app/components/hover_card/useHoverPopupTrigger';
import { useUserData } from "@/hooks/useUserData";


type Card = {
    uid: string,
    hskLevel: string,
    tabInOrder: number,
    word: string,
    pinyin: string,
    translation: string,
    voice_file: string,
};



function PopupContent({
        item,
        currentTabId,
        moveCard
    }: {
        item: Card;
        currentTabId: number;
        moveCard: (uid: string, tabId: number, hskLevel: string) => void;
    }): React.JSX.Element {
    //}
//)
    // {
        return (
                <div
                    key={item.uid + "cardPopup"}
                    className={[
                        "gCard",
                        "gCardPopup",
                    ]
                        .filter(Boolean)
                        .join(" ")}
                >

                    <div className="
                            gCardMoveButtonContainer
                            // group-hover:block
                            "
                    >
                        <button
                            
                            onClick={() => moveCard(item.uid, currentTabId + 1, item.hskLevel)}
                            className="gCardMoveButton">
                        </button>

                    </div>

                    <div className="gCardVoicePlayContainer
                    ">
                        <VoicePlayButton
                            className="gCardVoicePlayButton"
                            item_pinyin={item.pinyin} item_file={item.voice_file}
                        />

                    </div>



                    <div className="gCardChineseWordContainerPopup">
                        <p className=
                        
                        {[
                        "gCardChineseWordCaption",
                        "gCardChineseWordCaptionPopup",
                        "font-chinese",
                        
                    ]
                        .filter(Boolean)
                        .join(" ")}
                        >{item.word}</p>
                    </div>


                    <div


                        className="gCardTranslationContainer"
                    >
                        <p className="gCardTranslationCaption"
                        >{item.translation}</p>
                    </div>


                </div>

    );
}

    function ListItemHanziMode({
        item,
        currentTabId,
        moveCard
    }: {
        item: Card;
        currentTabId: number;
        moveCard: (uid: string, tabId: number, hskLevel: string) => void;
    }): React.JSX.Element {
    // }
    // ) 
    // {
  const { ref, isActive, handlers } = useHoverPopupTrigger<HTMLLIElement>(
    item.uid,
    <PopupContent item={item} 
                    currentTabId={currentTabId}
                    moveCard={moveCard}
                     />
  );

  return (
     <li
        key={item.uid + "cardHanziMode"}
        ref={ref}
        {...handlers}
        className="gCard gCardHanziMode"
                
                style={{
                    
                     cursor: 'default',
                    listStyle: 'none',
                }}
        >   

        <div className="gCardChineseWordContainer">
                <p className=
                {[
                "gCardChineseWordCaption",
                "font-chinese",                
            ]
                .filter(Boolean)
                .join(" ")}
                >{item.word}</p>
                                {/* // >{item.word.length}</p> */}
        </div>
    </li>
  );
}

    function ListItemExploreMode({
        item,
        currentTabId,
        moveCard
    }: {
        item: Card;
        currentTabId: number;
        moveCard: (uid: string, tabId: number, hskLevel: string) => void;
    }): React.JSX.Element {
    // }
    // ) 
    // {
  const { ref, isActive, handlers } = useHoverPopupTrigger<HTMLLIElement>(
    item.uid,
    <PopupContent item={item} 
                    currentTabId={currentTabId}
                    moveCard={moveCard}
                     />
  );

  return (
                <div
                    key={item.uid + "cardExploreMode"}
                    className={[
                        "gCard",
                        "gCardExploreMode",
                    ]
                        .filter(Boolean)
                        .join(" ")}
                >

                    <div className="
                            gCardMoveButtonContainerExplore
                            // group-hover:block
                            "
                    >
                        <button
                            
                            onClick={() => moveCard(item.uid, currentTabId + 1, item.hskLevel)}
                            className="gCardMoveButtonExplore">
                        </button>

                    </div>

                    <div className="gCardVoicePlayContainerExplore
                    ">
                        <VoicePlayButton
                            className="gCardVoicePlayButtonExplore"
                            item_pinyin={item.pinyin} item_file={item.voice_file}
                        />

                    </div>



                    <div className="gCardChineseWordContainerExplore">
                        <p className=
                        
                        {[
                        "gCardChineseWordCaptionExplore",
                        "font-chinese",
                        
                    ]
                        .filter(Boolean)
                        .join(" ")}
                        >{item.word}</p>
                    </div>


                    <div


                        className="gCardTranslationContainerExplore"
                    >
                        <p className="gCardTranslationCaptionExplore"
                        >{item.translation}</p>
                    </div>


                </div>

    );
}


function Card({ item, 
                moveCard,
                currentTabId,

                }: {
                item: Card;
                moveCard: (uid: string, tabId: number, hskLevel: string) => void;
                currentTabId: number;
                }): React.JSX.Element {

    const cardRef = useRef(null);
    const { userDexie } = useUserData();
    // console.log('item', item);
    return (
        <>
        {userDexie?.mode === "hanzi" &&             
            <ListItemHanziMode 
                item={item}
                moveCard={moveCard} 
                currentTabId={currentTabId}
                />}

        {userDexie?.mode === "explore" &&             
            <ListItemExploreMode 
                item={item}
                moveCard={moveCard} 
                currentTabId={currentTabId}
                />}



        
        </>

    )
}

export default React.memo(Card);