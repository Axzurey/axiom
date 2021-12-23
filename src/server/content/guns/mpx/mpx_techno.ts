import characterClass from "server/character";
import minerva from "shared/minerva";
import weaponCore from "../../weaponCore";

export default class mpx_techno extends weaponCore {
    constructor(client: Player, charclass: characterClass) {
        super(client, charclass);
        this.reloadLength = minerva.reloadLengths.mpx;
    }
}