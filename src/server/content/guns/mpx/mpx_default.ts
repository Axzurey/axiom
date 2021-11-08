import characterClass from "server/character";
import weaponCore from "../../weaponCore";

export default class mpx_default extends weaponCore {
    constructor(client: Player, charclass: characterClass) {
        super(client, charclass);
    }
}