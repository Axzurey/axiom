import weapons from "./weapons";

namespace skinIndex {
    export type rarity = 1 | 2 | 3 | 4 | 5 | 6

    export interface indexValue {
        weight: number,
        rarity: rarity,
        parent: keyof typeof weapons,
        me: string,
    }
    export const skins: Record<keyof typeof weapons, Record<string, indexValue>> = {
        ["mpx"]: {
            ["blue"]: {
                weight: 10,
                rarity: 1,
                parent: 'mpx',
                me: 'blue',
            },
            ["white"]: {
                weight: 10,
                rarity: 1,
                parent: 'mpx',
                me: 'white'
            },
            ["techo"]: {
                weight: 8,
                rarity: 3,
                parent: 'mpx',
                me: 'techno',
            },
        },
        ["knife"]: {
            
        }
    }
}

export = skinIndex;