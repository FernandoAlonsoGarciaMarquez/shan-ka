'use client';

import { dexie  } from "@/lib/dexie";
import { useLiveQuery } from "dexie-react-hooks";
import { useEffect } from "react";
// import { requireUserData } from "../modules/cards/cards.actions";


async function getUserDexie(){
    // const user = await dexie.user.get(1);
    let userDexie = null;
    try {
        userDexie = await dexie.user.get(1);
    } finally {
        
    }

    

    // если нет юзера в localStorage - создаем. majorUpdate0 тащится из Actions
    if (!userDexie) {
        // console.log("there is NO user, getting session");
        // const userSession = await requireUserData();
        // console.log('userSession: ', userSession);

        const userSession = {
            name: "username",
            hskLevel: "1",
            theme: "",
            mode: "explore",
            majorUpdate: 0
        }
        await dexie.user.put(userSession);
    }

    // console.log('useUserData.getUserDexie : ', userDexie);
    return userDexie
}


async function updateUserData(field: string, value: string) {
    // Создаем объект динамически
    const changes = { [field]: value };
    const result = await dexie.user.update(1, changes);
    return result;
}


export function useUserData() {

    const userDexie = useLiveQuery(
        () => dexie.user.get(1),
        []
    );

    useEffect(() => {
            if (!userDexie) { getUserDexie() };
    }, [userDexie]); 
    

    async function updateUserDexie(field: string, value: string) {
        const result = await updateUserData(field, value);
        return result;
    }

    return {
        userDexie,
        updateUserDexie,
    };

}