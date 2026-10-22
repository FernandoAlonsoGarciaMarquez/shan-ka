"use client";

import { useEffect } from "react";
import { JsonService } from "@/lib/jsonService";
import { JsonServiceDexie } from "@/lib/jsonServiceDexie";
import { useLayout } from "@/app/context/LayoutContext";
import { useAllTabs } from "@/hooks/useAllTabs";
import { useUserData } from "@/hooks/useUserData";

async function getSumFileByHsk(dict, index) {
        // console.log("getSumFileByHsk['hsk1_words.json'];", dict['hsk1_words.json']);

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

async function getSumDexie(dict, index) {
    // console.log("getSumDexie.hsk1;", dict.hsk1);
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

async function compareDictionaries(shaSumFile, shaSumDexie) {

    return (shaSumFile === shaSumDexie);
};
   



export function SyncProvider({ children }) {
    const { allJsonsFetched, setAllJsonsFetched, allTabsHook } = useLayout();
    const { firstJsonsFetched, setFirstJsonsFetched, } = useLayout();

    const { setAllTabsAsNew, saveAllTabsHskToDexie } = useAllTabs();
    const { userDexie }  = useUserData();


    useEffect(() => {


        if (userDexie && !firstJsonsFetched) {
            let hskLevel = userDexie.hskLevel;
            let shaSumFile = {};
            let shaSumDexie = {};
            JsonService.fetchShaSumsFile()
            .then(async ( fetchedShaSumFile ) => {
                // shaSumFile = fetchedShaSumFile;
                // shaSumDexie = JsonServiceDexie.getShaSums();
                const shaSumDexie = await JsonServiceDexie.getShaSums();

                return {
                    shaSumFile: fetchedShaSumFile,
                    shaSumDexie: shaSumDexie,
                }
            })
            .then( async (result) => {

                // console.log("fetched json shaSumDexie", result);
                shaSumFile = await getSumFileByHsk(result.shaSumFile, parseInt(hskLevel));
                shaSumDexie = await getSumDexie(result.shaSumDexie,  parseInt(hskLevel));


                return {
                    shaSumFile: shaSumFile,
                    shaSumDexie: shaSumDexie,
                    hskLevel: hskLevel
                };})

                .then(async (result) => {
                    // console.log("result", result);
                    const isEqual = await compareDictionaries(
                                result.shaSumFile,
                                result.shaSumDexie,
                                parseInt(result.hskLevel)
                            );
                    return(isEqual);

                })

             .then(async ( isEqual) => {
                // console.log("isEqual ",isEqual);
                if (!isEqual) {
                    await JsonService.loadOneJsonFile(hskLevel)
                    .then(async (malditoJson) => {
                        const newAllTabs = JsonService.takeOutNoUIDs(malditoJson.json.data, hskLevel);
                        setAllTabsAsNew(newAllTabs);
                        // shaSumDexie = await JsonServiceDexie.getShaSums()
                        const shaSumHskFile = await getSumFileByHsk(shaSumFile, parseInt(hskLevel));
                        const shaSumHhkDexie = await getSumDexie(shaSumDexie, parseInt(hskLevel));
                        return {
                            shaSumHskFile: shaSumHskFile,
                            shaSumHhkDexie: shaSumHhkDexie,
                            malditoJson: malditoJson,
                            newAllTabs:newAllTabs
                        }
                    })
                        // const shaSumHskFile = await getSumFileByHsk(shaSumFile, parseInt(hskLevel));
                        // const shaSumHhkDexie = await getSumDexie(shaSumDexie, parseInt(hskLevel));
                    .then( async ( result) => {
                        // console.log("result.shaSumHskFile ", result);
                            if ((result.malditoJson.hash === result.shaSumHskFile) && 
                                (result.shaSumHskFile !== result.shaSumHhkDexie)) {
                                saveAllTabsHskToDexie(result.newAllTabs);
                                // console.log("result.shaSumHskFile ", result.shaSumHskFile);

                                // await JsonServiceDexie.updateShaSumDexie(result.shaSumHskFile, parseInt(hskLevel));

                        }

                    })
                    // .then(async () => {
                    //     await JsonServiceDexie.getShaSums()
                    //     .then((result) => {
                    //         console.log("kkk result", result);
                            
                    //     })
                        
                    // })

                }
                })



        setFirstJsonsFetched(true);
        };

        if (userDexie && firstJsonsFetched && !allJsonsFetched) {
            // console.log("!allJsonsFetched");
            // let shaSumFile = {};
            // let shaSumDexie = {};
            // const userHskLevel = userDexie.hskLevel;
            JsonService.fetchShaSumsFile()
            .then(async ( fetchedShaSumFile ) => {
                const shaSumDexie = await JsonServiceDexie.getShaSums();

                return {
                    shaSumFile: fetchedShaSumFile,
                    shaSumDexie: shaSumDexie
                }
            })
            .then( async ( shaLsls ) => {
                const shaLslsSsSSs = shaLsls;

                for (let hskLevel = 1; hskLevel<=7; hskLevel++) {
                    // if (hskLevel.toString() !== userHskLevel) {
                    if (true) {

                        await JsonService.loadOneJsonFile(hskLevel.toString())
                        .then(( malditoJson) => {
                                return ({
                                        malditoJson: malditoJson,
                                        shaLslsSsSSs: shaLslsSsSSs,

                        })

                        })

                        .then(async (plsplspls) => {
                            const shaSumHskFile = await getSumFileByHsk(plsplspls.shaLslsSsSSs.shaSumFile, parseInt(hskLevel));
                            const shaSumHhkDexie = await getSumDexie(plsplspls.shaLslsSsSSs.shaSumDexie, parseInt(hskLevel));


                            return {
                                shaSumHskFile: shaSumHskFile,
                                shaSumHhkDexie: shaSumHhkDexie,
                                malditoJson: plsplspls.malditoJson
                            }
                        })
                        .then((result ) => {
                            // console.log("result: ", result);

                            if ((result.malditoJson.hash === result.shaSumHskFile) && 
                                    (result.shaSumHskFile !== result.shaSumHhkDexie)) {

                                const newAllTabs = JsonService.takeOutNoUIDs(result.malditoJson.json.data, hskLevel);

                                    saveAllTabsHskToDexie(newAllTabs);
                                    JsonServiceDexie.updateShaSumDexie(result.shaSumHskFile, parseInt(hskLevel));

                                

                            };
                        });
                    };
                    

                };

            });

            setAllJsonsFetched(true);

        };


        

    }, [
        allJsonsFetched, setAllJsonsFetched, 
        firstJsonsFetched, setFirstJsonsFetched,
        allTabsHook,
        userDexie,
        setAllTabsAsNew,
        saveAllTabsHskToDexie,
    ]);


    return children;
}