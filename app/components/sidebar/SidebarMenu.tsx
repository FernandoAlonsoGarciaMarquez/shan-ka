'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';

import { useUserData } from "@/hooks/useUserData";


import { useLayout as useLayoutUntyped} from "@/app/context/LayoutContext";

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


interface LayoutReturnType {
  activeTabId: number;
  setActiveTabId: (value: number) => void;
  setIsLoading: (value: boolean) => void;
  setCurrentTab: (value: CurrentTab) => void;
  setAllTabsHook: (value: AllTabs) => void;
}
const useLayout = useLayoutUntyped as () => LayoutReturnType;



function setTheme(theme:string) {
    document.documentElement.setAttribute(
        "data-theme",
        theme
    );
}



const SidebarMenu: React.FC = () => {



    const { activeTabId, setActiveTabId, setIsLoading, setCurrentTab, setAllTabsHook } = useLayout();

    const { userDexie, updateUserDexie } = useUserData();
    const [navData, setnavData] = useState(
                                                [
                                                                                                    {
                                                    label: 'mode: ',
                                                    labelCurrent: "",
                                                    onClick: "modeBtn",
                                                    subItems: [
                                                        'explore',
                                                        'hanzi',
                                                        ],
                                                },
                                                {
                                                    label: 'hsk_level: ',
                                                    labelCurrent: "",
                                                    onClick: "hskLevelBtn",
                                                    subItems: [
                                                        '1',
                                                        '2',
                                                        '3',
                                                        '4',
                                                        '5',
                                                        '6',
                                                        '7',
                                                        ],
                                                },
                                                {
                                                    label: 'colors: ',
                                                    labelCurrent: "",
                                                    onClick: "themeBtn",
                                                    subItems: [
                                                        'default',
                                                        "citrus",
                                                        'original',
                                                        'lilac',
                                                        ],
                                                },
                                            ]
                                            );

    const [ isInitializedSideMenu, setInitializedSideMenu ] = useState(false);



    // найти где контактирует эта функция и описать её здесь
    const updateNavData = useCallback(( name: string, hskLevel: string, theme: string, mode: string ) => {

        if (mode === "") { mode = "explore"; };

        if (theme === "") {
            theme = "default";
        }

        for (let index1 = 0; index1 <=2; index1++) {
        let newValue = '';
        if (index1 === 1) {
            newValue = hskLevel.toString();
        } else if (index1 === 2) {
            newValue = theme;
        } else if (index1 === 0) {
            newValue = mode;
        }
            setnavData(prevData => 
                    prevData.map((item, index) => 
                        index === index1 
                        ? { ...item, labelCurrent: newValue }
                        : item
                    )
                    );
                }
    }, []);


    const fetchAndUpdateUserData = useCallback(() => {
        if (userDexie) {
                    updateNavData(userDexie.name, userDexie.hskLevel, userDexie.theme, userDexie.mode);
                }
    }, [userDexie, updateNavData]);


    const updateHskOnclick = useCallback((hskLevel:string) => {
        
        // setCurrentTab(undefined);
        if (userDexie?.hskLevel !== hskLevel) {
            setIsLoading(true);
            setAllTabsHook([]);
            setActiveTabId(1);
            updateUserDexie("hskLevel", hskLevel);
            
        }
        

    }, [
        setActiveTabId,
        updateUserDexie,
        setIsLoading,
        setAllTabsHook,
        userDexie,
        // setCurrentTab
        ]);


    const updateThemeOnclick = useCallback((theme:string) => {
        updateUserDexie("theme", theme);
        setTheme(theme === "default" ? "" : theme);
        if (theme === "default") {theme = "";};

    }, [
        updateUserDexie,

    ]);

    const updateModeOnclick = useCallback((mode:string) => {
        
        // setCurrentTab(undefined);
        if (userDexie?.mode !== mode) {
            // setIsLoading(true);
            // setAllTabsHook([]);
            // setActiveTabId(1);
            updateUserDexie("mode", mode);
            
        }
        

    }, [
        // setActiveTabId,
        updateUserDexie,
        // setIsLoading,
        // setAllTabsHook,
        userDexie,
        // setCurrentTab
        ]);


    function onClickMenuButton(item: string, data: string) {
    if (item === "userBtn") {
        console.log("User button clicked");
    } else if (item === "hskLevelBtn") {
        updateHskOnclick(data);
        
        //НАХУЯЯЯЯ?!?!?!?!?!?!?!!!!!!!!!!!!!!!!!!!?!?!?!?!??!?!?!? !?!??!?!?!?!?!?!
        // setInitializedSideMenu(false);

    } else if (item === "themeBtn") {
        updateThemeOnclick(data);
        
    } else if (item === "modeBtn") {
        updateModeOnclick(data);
    }
    fetchAndUpdateUserData();
    }


    // Состояние для активного верхнего пункта (индекс)
    const [activeIndex, setActiveIndex] = useState<number>(0);


    // Получаем подпункты для активного верхнего пункта
    const activeSubItems = navData[activeIndex]?.subItems || [];

    useEffect(() => {
        

        async function fkingUpdateMenu() {
            fetchAndUpdateUserData();
            // console.log("SidebarMenu.fkingUpdateMenu");
            // updateNavData(name, hskLevel, theme);
            // setInitializedSideMenu(true);
        }

        fkingUpdateMenu();

        // if (!isInitializedSideMenu && userDexie) {
        //     fkingUpdateMenu(userDexie.name, userDexie.hskLevel, userDexie.theme);
        // }
    }, [
        // isInitializedSideMenu, 
        // setInitializedSideMenu,
        // userDexie,
        // updateNavData,
        fetchAndUpdateUserData,
    ]);

    return (
        <div className="gSidebarMenu">
            {/* Верхние пункты навигации */}
            <nav 
            // className="space-y-1"
            >
                {navData.map((item, index) => (
                    <button
                        key={index}
                        onClick={() => setActiveIndex(index)}
                        className={`gSidebarMenuButton
                                ${activeIndex === index
                                                    ? 'gSidebarMenuButtonActive'
                                                    : 'gSidebarMenuButtonInActive'
                            }
            `}
                    >
                        {item.label}{item.labelCurrent}
                    </button>
                ))}
            </nav>

            {/* Разделитель */}
            <div className="gSidebarMenuSeparator" />

            {/* Нижние подпункты */}
            <nav 
            // className="space-y-1"
            >
                {activeSubItems.map((subItem, index) => (
                    <a
                        key={index}
                        onClick={() => 
                            onClickMenuButton(navData[activeIndex].onClick, subItem)
                        }
                        className="gSidebarMenuBottomButton"
                    >
                        {subItem}
                    </a>
                ))}
            </nav>
        </div>
    );
};

export default SidebarMenu;