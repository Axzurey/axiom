import { RunService } from "@rbxts/services";
import characterClass from "server/character";
import float from "server/float";
import when from "server/world";
import ability_Core from "../abilitycore";

export default class illusoryDream extends ability_Core {
    amount = 1;
    maxAmount = 1;
    timer: number = 0;
    timer_max: number = 30;
    constructor(client: Player, charclass: characterClass) {
        super(client, charclass);
        this.init();
        let conn = RunService.Heartbeat.Connect((dt) => {
            if (this.amount <= 0) {conn.Disconnect(); return;};
            if (this.active) {
                this.timer = math.clamp(this.timer + 1 * dt, 0, this.timer_max);
                if (this.timer >= this.timer_max) {
                    this.active = false;
                }
            }
        })
    }
    override activate() {
        if (this.active || this.amount <= 0) return;
        if (this.cooldown > 0) return;
        print('activated i guess?');
        let char = this.client.Character;
        if (/*float.playerCanPerformAction(this.client, 'useGadget')*/ true) {
            this.active = true;
            this.amount --;
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
            task.wait(10);
            conn.disconnect();
            this.superStartCooldown();
        }
    }
}