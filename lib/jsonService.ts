// lib/jsonService.ts
import { dexie } from '@/lib/dexie';


type CardInJson = {
    uid: string,
    word: string,
    pinyin: string,
    translation: string,
    voice_file: string,
};

type JsonFetched = {
	version: number,
	data: CardInJson[],
};

type JsonFetchedResponse = {
  json: JSON,
  buffer: ArrayBuffer,
  hash: string,
}

type Card = {
    uid: string,
    hskLevel: string,
    tabInOrder: number,
    word: string,
    pinyin: string,
    translation: string,
    voice_file: string,
};

type AllCards = [{
            inOrder: number,
            hskLevel: string,
            cards: Card[],
}];

type AllTabs = {
    hskLevel: string,
    inOrder: number,
    cards: Card[],
}[];



type ShaSumsJson = {
    'hsk1_words.json': string,
    'hsk2_words.json': string,
    'hsk3_words.json': string,
    'hsk4_words.json': string,
    'hsk5_words.json': string,
    'hsk6_words.json': string,
    'hsk7_words.json': string,
};




// Известные пути к JSON файлам + прибавить  !!!!!!!!!!!!!!!/data/!!!!!!!!!!!!!
const JSON_FILES = [
    'hsk1_words.json',
    'hsk2_words.json',
    'hsk3_words.json',
    'hsk4_words.json',
    'hsk5_words.json',
    'hsk6_words.json',
    'hsk7_words.json',

];

const SHA_SUM_FILENAME = 'sha_sums.json'

const PATH_IN_SERVER = '/data/';

export class JsonService {

    // Загрузка SHA-SUMS
  static async fetchShaSumsFile(): Promise<ShaSumsJson> {
    
      const fileName = SHA_SUM_FILENAME
      const url = PATH_IN_SERVER + fileName.split('/').pop() || 'unknown';

      try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error(`Error fetching ${url}:`, error);
      throw error;
    }

      // return fetchedJson
  }  

    // Загрузка JSONа по уровню hsk
  static async loadOneJsonFile(hskLevel:string): 
  // Promise<CardsFetched> {
  // Promise<JsonFetched> {
    Promise<JsonFetchedResponse> {

    
      const position_in_this_array = parseInt(hskLevel) - 1;
      const fileName = JSON_FILES[position_in_this_array];

      const url = PATH_IN_SERVER + fileName.split('/').pop() || 'unknown';

      const fetchedJson = await this.fetchJson(url)


      return fetchedJson
  }
  
 static takeOutNoUIDs(cards:CardInJson[], hskLevel:string) {



   // cards.map(card => {
   const filteredCards: Card[] = cards
      .filter(card => card.uid)
      .map(card => ({
        ...card,
        hskLevel: hskLevel.toString(),
        tabInOrder: 1,
      }));


    const allTabs: AllTabs = [{
      hskLevel: hskLevel.toString(),
      inOrder: 1,
      cards: filteredCards,
    }];

    return allTabs;
  }

      
   


    // cards.filter(card => card.uid)
    //   .map(card =>
    //     ({...card, hskLevel:hskLevel, tabInOrder: 1})
    //   );
    // return cards;

   //}


                                  // if (!existingCard) {
                                  // const newCard = {
                                  //       uid: card.uid,
                                  //       hskLevel: hskLevel,
                                  //       tabInOrder: 1,
                                  //       pinyin: card.pinyin,
                                  //       translation: card.translation,
                                  //       word: card.word,
                                  //       voice_file: card.voice_file,
                                  //   }

                                  //   await dexie.cards.add(newCard);


 


  // // Загрузка всех JSON файлов
  // static async loadAllJsonFiles(): Promise<void> {
  //   // Создаем массив промисов для параллельной загрузки
  //   const promises = JSON_FILES.map((fileName) => {
  //     // Извлекаем имя файла из пути

  //     const path = PATH_IN_SERVER + fileName.split('/').pop() || 'unknown';
  //     return this.loadAndProcessJson(fileName, path);
  //   });

  //   await Promise.all(promises);
  //   // console.log('🎉 All JSON files loaded and processed!');
  // }

    // Загрузка JSON с сервера
  static async fetchJson(url: string): Promise<JsonFetchedResponse> {
    const response = await fetch(url);

    if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
    }

    const buffer = await response.arrayBuffer();

    const hashBuffer = await crypto.subtle.digest('SHA-256', buffer);

    const hash = [...new Uint8Array(hashBuffer)]
        .map(b => b.toString(16).padStart(2, '0'))
        .join('');

    const json = JSON.parse(new TextDecoder().decode(buffer));

    return {
        json,
        buffer,
        hash,
    };
    
    // try {
    //   const response = await fetch(url);
    //   if (!response.ok) {
    //     throw new Error(`HTTP error! status: ${response.status}`);
    //   }
    //   return await response.json();
    // } catch (error) {
    //   console.error(`Error fetching ${url}:`, error);
    //   throw error;
    // }
  }

}

  // //get ver if is exists or add an entry there ver0
  // // hsk_level - version (JSON FILES BLYAD)
  // static async lAPJGetDexieDictVerGet(hskLevel:string): Promise<number> {
  //     let dexieEntryVersion = 0;
  //     await dexie.dictionaryVersion
  //         .where('hskLevel')
  //         .equals(hskLevel)
  //         .first()
  //         .then((dexieDVerEntry) => {
            
  //           // почему 2 раза выполняется?!?!??!! ?! ?! ? !? !?! ?! ?! !! ?  ?  
  //           // console.log("KKDLSKD RESULT ___", result);
  //           if (!dexieDVerEntry) {
  //             dexie.dictionaryVersion.add({
  //               hskLevel: hskLevel,
  //               version: 0
  //             });
  //           } else if (dexieDVerEntry) {
  //             dexieEntryVersion = dexieDVerEntry.version
  //           }
  //         });
  //     return dexieEntryVersion
  // }

  // static async lAPJGetDexieDictVerUpdate(hskLevel:string, version:number): Promise<void> {
  //         dexie.transaction('rw', dexie.dictionaryVersion, async () => {
  //           const existingVersion = await dexie.dictionaryVersion
  //           .where('hskLevel')
  //           .equals(hskLevel)
  //           .first();

  //           if (! existingVersion ) {
  //             await dexie.dictionaryVersion.add({
  //                   hskLevel: hskLevel,
  //                   version: version
  //           });

  //           } else {
  //             await dexie.dictionaryVersion
  //             .update(existingVersion.id, {
  //                   hskLevel: hskLevel,
  //                   version: version
  //           });
  //           }
  //         });
  // }
  //   // проверяем есть ли таба 1 по hsk и если нет - создаем
  //   static async lAPJGetDexieCreateTabIfIsnt(hskLevel:string): Promise<void> {
  //         dexie.transaction('rw', dexie.tabs, async () => {
  //                   console.log("creating tab: ", hskLevel)
  //                   const existingTab = await dexie.tabs
  //                       .where('hskLevel')
  //                       .equals(hskLevel)
  //                       .and(tab => tab.inOrder === 1)
  //                       .first();

  //                   if (!existingTab) {
  //                       await dexie.tabs.add({
  //                           hskLevel: hskLevel.toString(),
  //                           inOrder: 1,
  //                       });
  //                   }
  //               });
  // }

  //   // проверяем есть ли карта по uid и если нет - создаем
  //   static async lAPJGetDexieCreateCardIfIsnt(card: CardInJson, hskLevel:string): Promise<void> {
  //                       await dexie.transaction('rw', dexie.cards, async () => {

  //                         try {
  //                               const existingCard = await dexie.cards
  //                               .where('uid')
  //                               .equals(card.uid)
  //                               .first();

  //                               if (!existingCard) {
  //                                 const newCard = {
  //                                       uid: card.uid,
  //                                       hskLevel: hskLevel,
  //                                       tabInOrder: 1,
  //                                       pinyin: card.pinyin,
  //                                       translation: card.translation,
  //                                       word: card.word,
  //                                       voice_file: card.voice_file,
  //                                   }

  //                                   await dexie.cards.add(newCard);
  //                               }

  //                         } catch (e) {
  //                           // statements to handle any exceptions
  //                           console.log("Boo Boo! ",e); // pass exception object to error handler
  //                           }
  //                   });
  // }

//  // Загрузка и сохранение одного JSON файла с проверкой версии </>
//   static async loadAndProcessJson(fileName: string, url: string): Promise<void> {

//     try {

//         // проверяем, есть ли цифра в файл нэйме для передачи в Version
//         const hskLevelMatch = fileName.match(/\d+/);
//         const hskLevel = ( hskLevelMatch ? hskLevelMatch[0] : null);

//         if (hskLevel) {

//           // 1) берем версию локально из декси
//           await this.lAPJGetDexieDictVerGet(hskLevel)

//             // 2) делаем фетч версии (ЦЕЛОГО ЖСОНА ПОКАМИСТЬ)
//             //  с сервера и + заворачиваем полученную версию с декси
//           .then((dexieEntryVersion) => {
//             const fetchedJson = this.fetchJson(url);
//             return Promise.all([dexieEntryVersion, fetchedJson]);
//           }) // 3) СРАВНИВАЕМ ИХ
//           .then(([dexieEntryVersion, fetchedJson]) => {
//               if (dexieEntryVersion < fetchedJson.version) {

//                     this.lAPJGetDexieDictVerUpdate(hskLevel, fetchedJson.version);
//                     this.lAPJGetDexieCreateTabIfIsnt(hskLevel);

//                     const rawJson = fetchedJson.data;
//                         Promise.all(rawJson.map(async (card: CardInJson) => {
//                           if (!card.uid) return;
//                               this.lAPJGetDexieCreateCardIfIsnt(card, hskLevel);
//                               // console.log("card", card);
//                 }));
//               }

//               // ну--кааа сэт табс здесь хуйнем
//           });

//       }


//     } catch (error) {
//       console.error(`❌ Error processing ${fileName}:`, error);
//       throw error;
//     }
//   }
// }