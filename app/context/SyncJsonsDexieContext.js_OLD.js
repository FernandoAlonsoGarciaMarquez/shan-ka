"use client";

import { useEffect } from "react";
import { JsonService } from "@/lib/jsonService";
import { JsonServiceDexie } from "@/lib/jsonServiceDexie";
import { useLayout } from "@/app/context/LayoutContext";
import { useAllTabs } from "@/hooks/useAllTabs";
import { useUserData } from "@/hooks/useUserData";

function getSumFileByHsk(dict, index) {
    switch(index) {
        case 1: return dict['hsk1_words.json'];
        case 2: return dict['hsk2_words.json'];
        case 3: return dict['hsk3_words.json'];
        case 4: return dict['hsk4_words.json'];
        case 5: return dict['hsk5_words.json'];
        case 6: return dict['hsk6_words.json'];
        case 7: return dict['hsk7_words.json'];
        default: throw new Error(`Invalid index: ${index}`);
    }
}

function getSumDexie(dict, index) {
    switch(index) {
        case 1: return dict.hsk1;
        case 2: return dict.hsk2;
        case 3: return dict.hsk3;
        case 4: return dict.hsk4;
        case 5: return dict.hsk5;
        case 6: return dict.hsk6;
        case 7: return dict.hsk7;
        default: throw new Error(`Invalid index: ${index}`);
    }
}

function compareDictionaries(shaSumFile, shaSumDexie, index) {
    return getSumFileByHsk(shaSumFile, index) === getSumDexie(shaSumDexie, index);
}



export function SyncProvider({ children }) {
    const { allJsonsFetched, setAllJsonsFetched, allTabsHook } = useLayout();
    const { setAllTabsAsNew, saveAllTabsHskToDexie } = useAllTabs();
    const { userDexie }  = useUserData();


    useEffect(() => {
        if (userDexie && !allJsonsFetched) {
            let hskLevel = userDexie.hskLevel;
            let shaSumFile = {};
            JsonService.fetchShaSumsFile()
            .then(( fetchedShaSumFile ) => {
                shaSumFile = fetchedShaSumFile;
                const shaSumDexie = JsonServiceDexie.getShaSums();
                // console.log("shaSumDexie ",shaSumDexie);
                const isEqual = compareDictionaries(
                                shaSumFile,
                                shaSumDexie,
                                parseInt(hskLevel)
                            );
                return(isEqual);
            })
            .then(( isEqual) => {
                if (!isEqual) {
                    JsonService.loadOneJsonFile(hskLevel)
                    .then((malditoJson) => {
                        const newAllTabs = JsonService.takeOutNoUIDs(malditoJson.json.data, hskLevel);
                        setAllTabsAsNew(newAllTabs);
                        // console.log("maldito", malditoJson);
                        //  console.log("newAllTabs", newAllTabs);
                        if (malditoJson.hash === getSumFileByHsk(shaSumFile, parseInt(hskLevel))) {
                            saveAllTabsHskToDexie(newAllTabs);
                            // JsonServiceDexie.updateShaSumDexie(malditoJson.hash, parseInt(hskLevel));

                        };
                        for (let hskLevel = 1; hskLevel<=7; hskLevel++) {
                            if (hskLevel.toString() !== userDexie.hskLevel) {
                                JsonService.loadOneJsonFile(hskLevel.toString())
                                .then((malditoJson) => {
                                    // const shaSumSumFileByHsk = getSumFileByHsk(shaSumFile, parseInt(hskLevel))
                                    // console.log("malditoJson", malditoJson.hash);
                                    // console.log("shaSumFile", shaSumSumFileByHsk);

                                    const shaSumHskFile = getSumFileByHsk(shaSumFile, parseInt(hskLevel));

                                    if (malditoJson.hash === shaSumHskFile) {
                                        console.log("yes, hsk:", hskLevel);

                                        const newAllTabs = JsonService.takeOutNoUIDs(malditoJson.json.data, hskLevel);

                                            saveAllTabsHskToDexie(newAllTabs);
                                            JsonServiceDexie.updateShaSumDexie(shaSumHskFile, parseInt(hskLevel));

                                        
                
                                    };
                                });
                                

                            };

                        };

                    })

                }
                setAllJsonsFetched(true);

            })

        }


        // if(!allTabsHook || allTabsHook.length === 0 || 2===2) {
        //     JsonService.fetchShaSumsFile()
        //     .then(( shaSumFile ) => {
        //         const shaSumDexie = JsonServiceDexie.getShaSums();
        //         for (let i = 1; i <= 7; i ++) {
        //             const isEqual = compareDictionaries(shaSumFile, shaSumDexie, i);
        //             console.log(`isEqual? ${i}`, isEqual);

        //         };


        //     });
            

            // if (!allJsonsFetched && userDexie) {
            //     JsonService.loadOneJsonFile(userDexie.hskLevel)
            //     .then((malditoJson) => {
            //         setAllTabsAsNew(malditoJson.data);
            //         setAllJsonsFetched(true);
            //     })
            //     .then(() => {
            //         JsonService.loadAllJsonFiles();
            //     })
            // }
//
        // }

    }, [
        allJsonsFetched, setAllJsonsFetched, 
        allTabsHook,
        userDexie,
        setAllTabsAsNew,
    ]);


    return children;
}