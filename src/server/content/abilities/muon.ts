import { RunService } from "@rbxts/services";
import characterClass from "server/character";
import float from "server/float";
import when from "server/world";
import ability_Core from "../abilitycore";

export default class muon extends ability_Core {
    amount = 2;
    maxAmount = 2;
    constructor(client: Player, charclass: characterClass) {
        super(client, charclass);
        this.init();
        coroutine.wrap(() => {
            this.superStartCooldown();
        })()
    }
    override activate() {
        if (this.active || this.amount <= 0) return;
        if (this.currentCooldown > 0) return;
        print('activated muon core');
    }
}