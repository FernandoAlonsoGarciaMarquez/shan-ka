import { Dexie, type EntityTable } from "dexie"

interface User {
    id: number,
    name: string,
    hskLevel: string,
    theme: string,
    mode: string,
    majorUpdate: number,
}

interface Tab {
    id: number,
    inOrder: number,
    hskLevel: string,
}

interface Card {
    id: number,
    uid: string,
    hskLevel: string,
    tabInOrder: number,
    pinyin: string,
    translation: string,
    word: string,
    voice_file: string,
}


interface RawJson {
    id: number,
    fileName: string,
    data: string,
}

interface ShaSums {
    id: number,
    hsk1: string,
    hsk2: string,
    hsk3: string,
    hsk4: string,
    hsk5: string,
    hsk6: string,
    hsk7: string,
}





const dexie = new Dexie("AllTabsDatabase") as Dexie & {

    user: EntityTable< User, "id" >
    tabs: EntityTable< Tab, "id" >
    cards: EntityTable< Card, "id" >
    rawJson: EntityTable< RawJson, "id" >
    shaSums: EntityTable< ShaSums, "id" >
}



dexie.version(1).stores({
    user: "++id, name, hskLevel, theme, majorUpdate",
    tabs: "++id, uid, inOrder, hskLevel",
    cards: "++id, &uid, hskLevel, tabInOrder, pinyin, translation, word, voice_file",
    rawJson: "++id, fileName, data",
    shaSums: "++id, hsk1, hsk2, hsk3, hsk4, hsk5, hsk6, hsk7",

})

dexie.version(2).stores({
    user: "++id, name, hskLevel, theme, mode, majorUpdate",
    tabs: "++id, uid, inOrder, hskLevel",
    cards: "++id, &uid, hskLevel, tabInOrder, pinyin, translation, word, voice_file",
    rawJson: "++id, fileName, data",
    shaSums: "++id, hsk1, hsk2, hsk3, hsk4, hsk5, hsk6, hsk7",

})

export type { User, Tab, Card, 
                RawJson,
                ShaSums

             }
export { dexie }
