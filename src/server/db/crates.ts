import skinIndex from "./skinIndex";

namespace crates {
    export const plasmaCrate: (skinIndex.indexValue)[] = [
        skinIndex.skins.mpx.blue
    ]


    type guarantee = ''

    export function rollPlasmaCrate(g: guarantee) {
        let t: skinIndex.indexValue[] = [];
        for (const [_, v] of pairs(plasmaCrate)) {
            for (let i = 0; i < v.weight; i++) {
                t.push(v);
            }
        }
        let selection = t[math.random(0, t.size() - 1)];
        return selection;
    }
}

export = crates;