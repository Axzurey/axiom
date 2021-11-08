import characterClass from "server/character";
import weaponCore from "../../weaponCore";

export default class mpx_techno extends weaponCore {
    constructor(client: Player, charclass: characterClass) {
        super(client, charclass);
    }
}