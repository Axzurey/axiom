import { RunService } from "@rbxts/services";
import characterClass from "server/character";
import float from "server/float";
import when from "server/world";
import ability_Core from "../abilitycore";

export default class mysticPortals extends ability_Core {
    amount = 2; //green and purple portals. can toggle between which ones to place
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
        print('activated i guess?');
        let char = this.client.Character;
        if (/*float.playerCanPerformAction(this.client, 'useGadget')*/ true) {
            this.superToggleActive(true);
            this.superDeductAmount();
            let conn = when.entityKilled.connect((killer, killed, entityType) => {
                switch (entityType) {
                    case when.entityType.Bot:
                        this.charclass.inflictEffect('regeneration', 10);
                        print(`bot killed by ${killer.Name}`);
                        break;
                    
                    default:
                        print("nothing killed")
                        break;
                }
            })
            let c = RunService.Heartbeat.Connect(() => {
                if (!this.alive) {
                    conn.disconnect();
                    c.Disconnect();
                }
            })
            this.superStartActivation();
            task.wait(this.activationLength);
            conn.disconnect();
            this.superToggleActive(false);
            this.superStartCooldown();
        }
    }
}