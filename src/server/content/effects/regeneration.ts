import characterClass from "server/character";
import effect from "../effectcore";

export default class regeneration extends effect {
    healthPerKill = 50;
    timeToHeal = 2.5;
    healed: number = 0;
    constructor(ctx: characterClass) {
        super(ctx);
    }
    public override everyFrame(dt: number) {
        if (this.healed > this.healthPerKill) {
            this.destroy();
        }
        let h = (this.healthPerKill / this.timeToHeal) * dt;
        this.healed += h;
        this.ctx.healDamage(h);
    }
}