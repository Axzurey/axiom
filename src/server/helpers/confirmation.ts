import characterHitbox from "server/classes/characterHitbox";
import env from "server/dumps/env";

namespace confirmation {
    /**
     * 
     * @param impact 
     * @returns [is a hitbox?, hitbox name, hitbox object]
     */
    export function isACharacterHitbox(impact: BasePart): [boolean, string | undefined, characterHitbox | undefined] {
        //todo
        let character: characterHitbox | undefined = undefined;
        let name: string | undefined = undefined;
        for (const [i, v] of pairs(env.characterHitboxes)) {
            if (impact.IsDescendantOf(v.character)) {
                character = v;
                name = i;
            }
        }
        return [character? true: false, name, character]
    }
}

export = confirmation;
//try overlapping beams or trails