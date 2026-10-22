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

type Card = {
    uid: string,
    hskLevel: string,
    tabInOrder: number,
    word: string,
    pinyin: string,
    translation: string,
    voice_file: string,
};

type CardsFetched = {
	version: number,
	data: Card[],
};


interface RawJson {
    id: number,
    fileName: string,
    data: string,
}

type ShaSumsDexie = {
    id: number,
    hsk1: string,
    hsk2: string,
    hsk3: string,
    hsk4: string,
    hsk5: string,
    hsk6: string,
    hsk7: string,
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


// async function sha256(data: string) {
//   const buffer =
//     typeof data === 'string'
//       ? new TextEncoder().encode(data)
//       : data;

//   const hash = await crypto.subtle.digest('SHA-256', buffer);

//   return [...new Uint8Array(hash)]
//     .map(b => b.toString(16).padStart(2, '0'))
//     .join('');
// }



export class JsonServiceDexie {

    static async sha256(data: string): Promise<string> {
        const buffer =
            typeof data === 'string'
                ? new TextEncoder().encode(data)
                : data;

        const hash = await crypto.subtle.digest('SHA-256', buffer);

        return [...new Uint8Array(hash)]
            .map((b) => b.toString(16).padStart(2, '0'))
            .join('');
    }


    // Загрузка SHA-SUMS
  static async getShaSums() {
    let newShaSums = {
                  hsk1: '0',
                  hsk2: '0',
                  hsk3: '0',
                  hsk4: '0',
                  hsk5: '0',
                  hsk6: '0',
                  hsk7: '0',
        }
    
    // let shaSums = null;
    // try {
        await dexie.shaSums.get(1)
        .then( async ( shaSumsDexie ) => {
          if (!shaSumsDexie) {
          await dexie.shaSums.put(newShaSums);
          } else {
            newShaSums = shaSumsDexie;
          }
          

        });
        // .then(() => {
        //   console.log("eeeweweew newShaSums", newShaSums);
        //   return(newShaSums);
        // });
        
        
    // }
    // } finally {
        
    // }

    


    // console.log('useUserData.getUserDexie : ', userDexie);
    return newShaSums
  }


  static async updateShaSumDexie(shaSum: string, hsk: number) {
    // console.log("updateShaSumDexie shaSum", shaSum);
    // Маппинг номера файла на ключ
    const keyMap: Record<number, keyof ShaSumsDexie> = {
        1: 'hsk1',
        2: 'hsk2', 
        3: 'hsk3',
        4: 'hsk4',
        5: 'hsk5', 
        6: 'hsk6',
        7: 'hsk7'
    };
    
    const key = keyMap[hsk];
    if (!key) throw new Error('Invalid file number. Must be 1-7');

    try {

        // let existing = await dexie.shaSums.get(1) as ShaSumsDexie | undefined;
        let existing = await dexie.shaSums.get(1) as ShaSumsDexie;

        
        // Если записи нет - создаем базовую структуру
        if (!existing) {
            existing = {
                id: 1,
                hsk1: '0',
                hsk2: '0',
                hsk3: '0',
                hsk4: '0',
                hsk5: '0',
                hsk6: '0',
                hsk7: '0'
            };
        }
        

        const updated: ShaSumsDexie = {
            ...existing,
            [key]: shaSum
        };
        
        // Сохраняем (put создаст новую или обновит существующую)
        await dexie.shaSums.put(updated);
        
        return
    } catch (error) {
        console.error('Error in updateShaSumDexie:', error);
        throw error;
    }
  }



  


  static async saveCardsHskLevel(jsonGetched:CardInJson[], hskLevel:string): Promise<void> {

    try {

        this.gogoDexieCreateTabIfIsnt(hskLevel);


        Promise.all(jsonGetched.map(async (card: CardInJson) => {
          if (!card.uid) return;
              this.gogoGetDexieCreateCardIfIsnt(card, hskLevel);
                }));

    } catch (error) {
      console.error(`❌ Error processing hskLevel ${hskLevel}:`, error);
      throw error;
    }
  }


   // проверяем есть ли таба 1 по hsk и если нет - создаем
    static async gogoDexieCreateTabIfIsnt(hskLevel:string): Promise<void> {
          dexie.transaction('rw', dexie.tabs, async () => {
                    console.log("creating tab: ", hskLevel)
                    const existingTab = await dexie.tabs
                        .where('hskLevel')
                        .equals(hskLevel)
                        .and(tab => tab.inOrder === 1)
                        .first();

                    if (!existingTab) {
                        await dexie.tabs.add({
                            hskLevel: hskLevel.toString(),
                            inOrder: 1,
                        });
                    }
                });
  }

   // проверяем есть ли карта по uid и если нет - создаем
    static async gogoGetDexieCreateCardIfIsnt(card: CardInJson, hskLevel:string): Promise<void> {
                await dexie.transaction('rw', dexie.cards, async () => {

                  try {
                        const existingCard = await dexie.cards
                        .where('uid')
                        .equals(card.uid)
                        .first();

                        if (!existingCard) {
                          const newCard = {
                                uid: card.uid,
                                hskLevel: hskLevel,
                                tabInOrder: 1,
                                pinyin: card.pinyin,
                                translation: card.translation,
                                word: card.word,
                                voice_file: card.voice_file,
                            }

                            await dexie.cards.add(newCard);
                        }

                  } catch (e) {
                    // statements to handle any exceptions
                    console.log("Boo Boo! ",e); // pass exception object to error handler
                    }
            });
    }

}