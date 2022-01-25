import characterClass from "server/character";
import weaponCore from "../../weaponCore";
import minerva from "shared/minerva";

export default class glock18_fade extends weaponCore {
    constructor(client: Player, charclass: characterClass) {
        super(client, charclass);
        this.reloadLength = minerva.reloadLengths.glock18;
        this.type = 'secondary';
        this.firerate = 1000;
        this.maxAmmo = 20;
        this.ammo = 20;
    }
}