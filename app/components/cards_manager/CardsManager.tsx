'use client';

// import { useRouter } from 'next/navigation';



import LoadingAnimation from "@/app/components/loading_animation/LoadingAnimation";
import Sidebar from "@/app/components/sidebar/Sidebar";
import Card from "@/app/components/card/Card";

import { HoverPopup } from "@/app/components/hover_card/HoverPopup";

import { useUserData } from "@/hooks/useUserData";
import { useAllTabs } from "@/hooks/useAllTabs";


import { useState, 
            useRef, 
            useCallback, 
            useEffect } from "react";

type Card = {
    uid: string,
    hskLevel: string,
    tabInOrder: number,
    word: string,
    pinyin: string,
    translation: string,
    voice_file: string,
};

type CurrentTab = {
    hskLevel: string,
    inOrder: number,
    cards: Card[],
};

type AllTabs = {
    hskLevel: string,
    inOrder: number,
    cards: Card[],
}[];


import { useLayout  as useLayoutUntyped  } from "@/app/context/LayoutContext";
interface LayoutReturnType {
    oldHskLevel: string;
    setOldHskLevel: (value: string) => void;
    sidebarOpen: boolean;
    setSidebarOpen: (value: boolean) => void;
    contentOffsetLeft: number;
    isLoading: boolean;
    setIsLoading: (value: boolean) => void;
    activeTabId: number;
    setActiveTabId: (value: number) => void;
    currentTab: CurrentTab; 
    setCurrentTab: (value: CurrentTab) => void;
    allTabsHook: AllTabs;
    // setAllTabsHook: (value: AllTabs) => void;
    sidebarWidth: number;
    viewportWidth: number;
    viewportHeight: number;
}
const useLayout = useLayoutUntyped as () => LayoutReturnType;



function setTheme(theme:string) {
    document.documentElement.setAttribute(
        "data-theme",
        theme
    );
}


// ─── Вспомогательный компонент: пустой список ────────────────────────────────

function EmptyState() {
    return (
        <div className="flex flex-col items-center justify-center py-20 text-slate-400 select-none">
            <svg className="w-10 h-10 mb-3 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            <p className="text-[15px] font-medium text-slate-500">Список пуст</p>
            <p className="text-[13px] mt-1">Перенесите карточки из других вкладок</p>
        </div>
    );
}            



export default function CardsManager() {



    const { userDexie } = useUserData();

    const { allTabsHook,
                        } = useLayout();

    const { 
        updateCardTabInOrderDexie,
                        } = useAllTabs();

    const {
                sidebarOpen,
                setSidebarOpen,
                viewportWidth,
                viewportHeight,

            } = useLayout();


    // -- Experimenting with "ContentOffset Value"
    const {
                contentOffsetLeft,
            } = useLayout();

    const {
                isLoading, 
                setIsLoading,
            } = useLayout();


    const {
                activeTabId, 
                setActiveTabId
            } = useLayout();


    const { currentTab, setCurrentTab } = useLayout();


    const [openMoveCardId, setOpenMoveCardId] = useState(null);

    // const [ uebanstvo, setUebanstvo ] = useState(0);

    // костылиииииииииииии -----------------------------------------------------------------------
const getMargin = (itemId:number) => {
    const x = (itemId * 17 + 3) % 5;
    const y = (itemId * 31 + 7) % 5;

    const marginsX = [
        "px-3",
        "px-7",
        "px-4",
        "px-8",
        "px-6",
        // "py-18",
        // "py-26",
        // "py-9",
        // "py-30",
        // "py-5",
    ];

    const marginsY = [
        "py-18",
        "py-16",
        "py-9",
        "py-7",
        "py-5",
    ];

    return {
        mx: marginsX[x],
        my: marginsY[y],
    };
};
    // костылиииииииииииии -----------------------------------------------------------------------




    // ── Переключить вкладку ────────────────────────────────────────────────────
    const switchTab = useCallback((id:number) => {
        // function getFkngTab(allTabsHook, newTabId) {
        //     return allTabsHook.find((t) => t.inOrder === newTabId); 

        // };

        async function ssetTabs(newTabId:number) {
            if (allTabsHook && (allTabsHook.length > 0)) {  
                // getFkngTab(allTabsHook, newTabId)
                // .then(( fuckingTab ) => {
                //     setOpenMoveCardId(null)
                //     setActiveTabId(newTabId);
                //     if (fuckingTab !== undefined) setCurrentTab(fuckingTab);


                // });
                // const fuckingTab = allTabsHook.find((t) => t.inOrder === newTabId);            
                
                // .then(( fuckingTab) => {
                //     if (fuckingTab !== undefined) setCurrentTab(fuckingTab, newTabId);

                // })
                // .then(() => {
                    setOpenMoveCardId(null)
                    setActiveTabId(newTabId);
                // });
                
                const fuckingTab = allTabsHook.find((t) => t.inOrder === newTabId);
                if (fuckingTab !== undefined) setCurrentTab(fuckingTab);

            };
                
        };

        setIsLoading(true);

        ssetTabs(id);
    }, [
        allTabsHook,
        setActiveTabId,
        setCurrentTab,
        setIsLoading

        ]);

    const moveCard = useCallback((cardUid: string, 
                                toTabInOrder: number,
                                hskLevel: string
                            ) => {
        // console.log("moveCard");

        let isLastTab = false;
        if (toTabInOrder > allTabsHook.length) {
            isLastTab = true;
            // console.log("ffff it's the last tab wey");
        }

        updateCardTabInOrderDexie(cardUid, 
                                    toTabInOrder, 
                                    isLastTab, 
                                    hskLevel
                                )
        .then(() => {
            setOpenMoveCardId(null);
        })
     
    setOpenMoveCardId(null);
    }, [
        allTabsHook,
        updateCardTabInOrderDexie
    ]);



    useEffect(() => {
        if (userDexie) setTheme(userDexie.theme);

        async function ssetCurrentTab() {
            const fuckingTab = allTabsHook.find((t) => t.inOrder === activeTabId);
            if (fuckingTab !== undefined) setCurrentTab(fuckingTab);
        }

            if (allTabsHook && (allTabsHook.length > 0)) ssetCurrentTab();

            if (userDexie && (allTabsHook && isLoading)) {
                if (allTabsHook.length > 0) {
                        // setTheme(userDexie.theme);
                        setIsLoading(false);
                        
                };
            };
        
    }, [isLoading, 
        setIsLoading,
        allTabsHook,
        userDexie,
        setCurrentTab,
        currentTab,
        activeTabId,
        viewportWidth,
        contentOffsetLeft,

    ])




    return(
        <>
        <div 

        style={{
            // height: viewportHeight,
            // width: 200,

        }}

        
        className="gCardsManager">
            {/* ----------  Sidebar ---------------------------------------------------------*/}
            <button
                    key={"menuBtn"}
                    onClick={() => setSidebarOpen(!sidebarOpen)}
                    className="
                    gMenuButton
                    z-50
                    "
                    >
            </button>
            <Sidebar className="gSidebar" />

             {/* ── Navbar ────────────────────────────────────────────────────────── */}    
            <div className="gNavbarPanel"
                    style={{
                            left: contentOffsetLeft,
                            // left: sidebarWidth
                    }}>                
                <ul className="gNavbarUl">
                    {allTabsHook?.map((tab) => {
                        // console.log("allTabsHook ",allTabsHook);
                        const isActive = tab.inOrder === activeTabId;
                        if (tab.cards?.length > 0) {
                                return (
                                            <li 
                                            key={tab.inOrder + "_navLink"}
                                            >                       
                                                <button
                                                    // key={tab.inOrder + "_navBtn"}
                                                    onClick={() => switchTab(tab.inOrder)}
                                                    className={`gNavbarButton
                                                                    ${isActive
                                                                    ? "gNavbarButtonActive"
                                                                    : "gNavbarButtonInactive"}`}>
                                                </button>
                                            </li>

                                        )

                        }

                    })}
                </ul>
                    
            </div>

            {/* ── Контент ───────────────────────────────────────────────────────── */}
            {isLoading ? (
                            <div className="m-30">
                                    <LoadingAnimation />
                            </div>
                    ) : (
            <div >
                {currentTab?.cards?.length === 0 ? (
                        <EmptyState />
                    ) : (
                        <div 
                            style={{
                                left: contentOffsetLeft,
                                // right: 0,
                                // width: contentWidth,
                                

                            }}


                            className={
                                    userDexie?.mode === "hanzi"
                                        ? "gCardsGridHanziMode"
                                        : userDexie?.mode === "explore"
                                            ? "gCardsGridExploreMode"
                                            : ""
                                }
                                >

                            
                                {currentTab?.cards?.map((card) => {
                                    const margin = getMargin(Number(card.uid));


            // className={`${margin.mx} ${margin.my}`}
                                    
                                    return ( <div 
                                        
                                        
                                                className={
                                                    
                                                    userDexie?.mode === "hanzi"
                                                    ? [
                                                        "col-span-1",
                                                        card.word.length >= 2 && "min-[260px]:col-span-2",
                                                        card.word.length >= 3 && "min-[380px]:col-span-3",
                                                        card.word.length >= 4 && "min-[500px]:col-span-4",

                                                    ].filter(Boolean).join(" ")
                                                    : 
                                                    userDexie?.mode === "explore"
                                                        ? [
                                                            "col-span-1",
                                                            // card.word.length >= 3 && "min-[380px]:col-span-1",
                                                            card.word.length >= 5 && "min-[500px]:col-span-2",
                                                            margin.mx,
                                                            margin.my,
                                                        ].filter(Boolean).join(" ")
                                                    : [ "col-span-1", 
                                                        
                                                    ] .filter(Boolean).join(" ")

                                                    
                                                    
                                                    }

                                    
                                    key={card.uid + "cardOr"}>
                                     <HoverPopup openDelayMs={3200} closeDelayMs={300}
                                         
                                     >

                                    <Card
                                    item={card} 
                                    moveCard={moveCard}
                                    currentTabId={currentTab.inOrder}
                                    />

                                    </HoverPopup >
                                    </div>

                                    )
                                

                                            
                                        
                                    
                                })}
                        </div>
                 )}
                    
            </div>)}
        
        </div>
        </>
    )
}