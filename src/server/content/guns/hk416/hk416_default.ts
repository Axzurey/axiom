import characterClass from "server/character";
import weaponCore from "../../weaponCore";
import minerva from "shared/minerva";

export default class hk416_default extends weaponCore {
    constructor(client: Player, charclass: characterClass) {
        super(client, charclass);
        this.reloadLength = minerva.reloadLengths.mpx;
    }
}