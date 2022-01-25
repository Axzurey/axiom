import characterClass from "server/character";
import weaponCore from "../../weaponCore";

export default class knife_saber extends weaponCore {
    isAGun = false;
    isAMelee = true;
    maxAmmo = -1;
    constructor(client: Player, charclass: characterClass) {
        super(client, charclass);
    }
}