import { Players, RunService } from "@rbxts/services";
import fps_framework from "shared/modules/fps";
import ability_core from "../abilitycore";

export class dissolve extends ability_core {
    name = 'Dissolve';
    details = `Throw a punch that applies [corrosion] to affected surfaces & damages any enemies it may hit.`;
    constructor(ctx: fps_framework) {
        super(ctx, 'primaryAbility');
        //this.ctx.loadout.blank.module.setUpExtraAnimation('hello');
    }
    override trigger() {
        this.remotes.trigger.FireServer();
        //this.ctx.equip('blank');
    }
}
//Kiriya Hakushaku Ke no Roku Shimai