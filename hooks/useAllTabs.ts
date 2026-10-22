'use client';


import { dexie  } from "@/lib/dexie";
import { useState, useEffect, useCallback } from "react";
// import { useLayout } from "@/app/context/LayoutContext";
import { useLayout as useLayoutUntyped  } from "@/app/context/LayoutContext";

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

type AllTabs = {
    hskLevel: string,
    inOrder: number,
    cards: Card[],
}[];

// Определяем тип возвращаемого хука] (там js здесь типизируем)
interface LayoutReturnType {
  oldHskLevel: string;
  setOldHskLevel: (value: string) => void;
  allTabsHook: AllTabs[];
  setAllTabsHook: React.Dispatch<React.SetStateAction<AllTabs>>;
}

const useLayout = useLayoutUntyped as () => LayoutReturnType;

async function getUsedHskLevelDexie(){
    let hskLevel = '0';
    await dexie.user.get(1)
    .then((user) => {
        if (user) {
            hskLevel = user.hskLevel
        }
    });

    return hskLevel;

    // const user = await dexie.user.get(1);
    // return user.hskLevel
}


export function useAllTabs() {

    // const [ allTabsHook, setAllTabsHook ] = useState<AllTabs>([]);

    const { allTabsHook, setAllTabsHook } = useLayout();
    const { oldHskLevel, setOldHskLevel  } = useLayout();
    const { userDexie } = useUserData();


// -------------- нейрофеофан ----------обновляем JSONы напрямую ---- и в allTabsHook их ---------------
    function updateCardLocally(cardUid:string, 
                                toTabInOrder:number, 
                                setAllTabsHook:React.Dispatch<React.SetStateAction<AllTabs>>,
                                isLastTab:boolean,
                                hskLevel:string
                            ) {

        async function sssetAllTabsHook() {
     
            setAllTabsHook(prevAllTabs => {
                if (!prevAllTabs) return prevAllTabs;

                let movedCard: Card | null = null;

                // 1. Убираем карточку из старой группы (иммутабельно)
                const withoutCard = prevAllTabs.map(group => {
                    const newCards = group.cards.filter((card) => {
                    if (card.uid === cardUid) {
                        movedCard = { ...card, tabInOrder: toTabInOrder };
                        return false; // не включаем её в новый массив — то есть удаляем
                    }
                    return true; // остальные оставляем
                    });

                    return { ...group, cards: newCards }; // новый объект группы с новым массивом cards
                });

                if (!movedCard) return prevAllTabs; // карточка не найдена — ничего не меняем               

                if (isLastTab) {
                    withoutCard.push(
                        {
                            hskLevel: hskLevel,
                            inOrder: toTabInOrder,
                            cards: [],
                        }
                    );
                    // console.log("is last tab fffff", withoutCard);

                }

                return withoutCard.map(group => {
                    if (group.inOrder === toTabInOrder) {
                    return { ...group, cards: [movedCard as Card, ...group.cards] };
                    }
                    return group;
                });

                
                });

            // console.log("skk card uid: ", cardUid);
            // console.log("skk toTabInOrder: ", toTabInOrder);
            return

        }

    sssetAllTabsHook()

    }
// -------------- нейрофеофан --------------------------------------------------------------------


    const ssetAllTabs = useCallback( (tabs: AllTabs) => {
        // console.log("ssetAllTabs ALLLLLTALLTALTLABBABFBSBSSB", tabs);
        setAllTabsHook([...tabs]);   
        // setAllTabsHook(tabs);   

    }, [setAllTabsHook]);




    useEffect(() => {
        async function ssetOldHskLevel(newHskLevel:string) {
                setOldHskLevel(newHskLevel);
        }

        async function load() {
            if (userDexie) {
                const [tabs, cards] = await Promise.all([
                dexie.tabs.toArray(),
                dexie.cards.toArray(),
                ]);

            
                const hskLevel = userDexie.hskLevel;

                const result = 
                    tabs.filter(tab => 
                        parseInt(tab.hskLevel) === parseInt(hskLevel))
                        .map(tab => ({...tab,
                    cards: cards.filter(card => 
                                    card.tabInOrder === tab.inOrder &&
                                    card.hskLevel === hskLevel.toString()                                
                                ),
                }));

                ssetAllTabs(result);
                ssetOldHskLevel(userDexie.hskLevel);
            }
            
        }

 

        if (userDexie && (userDexie.hskLevel !== oldHskLevel) ) {                    
                load();
        };

        

    }, [
        userDexie,
        oldHskLevel,
        setOldHskLevel,
        allTabsHook,
        ssetAllTabs,
    ]);


    const updateCardTabInOrderDexie = async(cardUid: string, 
                                            toTabInOrder: number,
                                            isLastTab: boolean,
                                            hskLevel: string
                                        ) => {
        // Локальное обновление состояния — без похода в БД
        updateCardLocally(cardUid, 
                            toTabInOrder,  
                            setAllTabsHook, 
                            isLastTab,
                            hskLevel
                        );


        dexie.cards
                .where('uid')
                .equals(cardUid)
                .modify({ tabInOrder: toTabInOrder });


        if ( isLastTab ) {
            const existingTab = await dexie.tabs
                .where('hskLevel')
                .equals(hskLevel)
                .and(tab => tab.inOrder === toTabInOrder)
                .first();

            if (!existingTab) {
                await dexie.tabs.add({
                    hskLevel:hskLevel,
                    inOrder: toTabInOrder,
                })
            }

        }

        return allTabsHook

    }



    async function updateAllTabsDexie() {
        console.log("useAllTasb updateAllTabsDexie");
        const [tabs, cards] = await Promise.all([
                dexie.tabs.toArray(),
                dexie.cards.toArray(),
            ]);

            getUsedHskLevelDexie()
            .then((hskLevel) => {
                const result =
                tabs.filter(tab => 
                    parseInt(tab.hskLevel) === parseInt(hskLevel))
                    .map(tab => ({...tab,
                cards: cards.filter(card => 
                                card.tabInOrder === tab.inOrder &&
                                card.hskLevel === hskLevel.toString()                                
                            ),
                }));
                return result;

            })
            .then((result) => {
                ssetAllTabs(result);

            });

    }

    async function saveAllTabsHskToDexie(allTabs:AllTabs) {
        // console.log("saveAllTabs: ", allTabs);
        // const hskLevel = allTabs[0].hskLevel;
        allTabs.map(tab => {

            dexie.tabs
                .where('hskLevel')
                .equals(tab.hskLevel.toString())
                .and(catcheDTab => catcheDTab.inOrder === tab.inOrder)
                .first()
            .then(( existingTab  ) => {
                // console.log("existingTab", existingTab);
                 if (!existingTab) {
                    
                dexie.tabs.add({
                    hskLevel:tab.hskLevel.toString(),
                    inOrder: 1,
                })
            };

            });



            tab.cards.map(card => {
                // const existingCard = dexie.cards
                dexie.cards

                    .where('uid')
                    .equals(card.uid)
                    .first()
                    .then((existingCard) => {
                         if (existingCard) {
                            dexie.cards.update
                            (existingCard.id, card);
                        } else {
                            dexie.cards.add(card);
                        };

                    })

               


            })
        })

        

           


    }

    // создаем allTabs с одним табом из массива карточек
    // async function setAllTabsAsNew(cards: Card[]) {
        // const hskLevel = cards[0]?.hskLevel ?? '0';
        // // console.log("CARDDSS", cards);
        // const tab = {
        //     hskLevel,
        //     inOrder: 1,
        //     cards: cards,
        // };

        // const result: AllTabs = [{ ...tab, cards }];
        // console.log('setAllTAbsAsNew RESULLTT', result);
        // console.log('setAllTAbsAsNew RESULLTT', typeof(result));
        // console.log('setAllTAbsAsNew allTabsHook', allTabsHook);
        // console.log('setAllTAbsAsNew allTabsHook', typeof(allTabsHook));
        async function setAllTabsAsNew(allTabs: AllTabs) {

            setAllTabsHook(allTabs);

        // ssetAllTabs(result);
    }



    return {
        allTabsHook,
        updateAllTabsDexie,
        updateCardTabInOrderDexie,
        setAllTabsAsNew,
        saveAllTabsHskToDexie,
    };

}