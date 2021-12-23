import { Players, RunService } from "@rbxts/services";
import fps_framework from "shared/modules/fps";
import ability_core from "../abilitycore";

export class presenceDetector extends ability_core {
    constructor(ctx: fps_framework) {
        super(ctx, 'secondaryAbility');
    }
    override trigger() {
        this.ctx.unequip();
    }
}