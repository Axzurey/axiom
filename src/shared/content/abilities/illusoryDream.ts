import { Players, RunService } from "@rbxts/services";
import fps_framework from "shared/modules/fps";
import ability_core from "../abilitycore";

export class illusoryDream extends ability_core {
    name = 'Illusory Dream';
    details = `When a kill is gained, apply [regeneration] to self.`;
    constructor(ctx: fps_framework) {
        super(ctx, 'primaryAbility');
    }
    override trigger() {
        let conn = RunService.RenderStepped.Connect((dt) => {
            if (!this.active) {conn.Disconnect(); return;};
        })
        this.remotes.trigger.FireServer();
    }
}
//Kiriya Hakushaku Ke no Roku Shimai