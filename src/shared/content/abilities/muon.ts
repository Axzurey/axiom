import { Players, RunService } from "@rbxts/services";
import fps_framework from "shared/modules/fps";
import ability_core from "../abilitycore";

export default class muon extends ability_core {
    name = 'Muon Core';
    details = `eh`;
    constructor(ctx: fps_framework) {
        super(ctx, 'primaryAbility');
    }
    override trigger() {
        this.remotes.trigger.FireServer();
        this.ctx.equip('extra1');
    }
}
//Kiriya Hakushaku Ke no Roku Shimai