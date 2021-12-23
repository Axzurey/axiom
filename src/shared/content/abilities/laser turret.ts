import { ReplicatedStorage, RunService, UserInputService, Workspace } from "@rbxts/services";
import fps_framework from "shared/modules/fps";
import ability_core from "../abilitycore";
import worldInteractor from "../worldInteractor";

export default class laser_turret extends ability_core {
    ctx: fps_framework;
    placeconn: RBXScriptConnection | undefined;
    useconn: RBXScriptConnection | undefined;
    fp: worldInteractor;
    obscuresActions = true;
    cancelOnGunChange = true;
    model: Model;
    constructor(ctx: fps_framework) {
        super(ctx, 'secondaryAbility');
        this.ctx = ctx;
        const model = ReplicatedStorage.FindFirstChild('abilities')?.FindFirstChild('transparent_versions')?.FindFirstChild('laser_turret')?.Clone() as Model;
        this.fp = new worldInteractor(this.ctx, model);
        this.model = model;
    }
    place() {
        let cf = this.fp.getSurfaceCFrame();
        if (cf && this.active && this.amount > 0) {
            /*
            let model = ReplicatedStorage.FindFirstChild('abilities')?.FindFirstChild('laser_turret')?.Clone() as Model;
            model.SetPrimaryPartCFrame(cf);
            model.Parent = Workspace.FindFirstChild("world");*/
            this.remotes.trigger.FireServer(cf);
            this.amount --;
        }
        if (this.amount < 1) {
            this.cancel();
        }
    }
    override trigger() {
        if (this.amount < 1) return;
        this.placeconn = RunService.RenderStepped.Connect(() => {
            let cf = this.fp.getSurfaceCFrame();
            if (cf) {
                let [_cf, size] = this.model.GetBoundingBox();
                let reg = Workspace.GetPartBoundsInBox(cf, size);
                let touching = false;
                reg.forEach((v) => {
                    if (v.Parent === Workspace.FindFirstChild('ignore') as Folder || v.Parent === this.model) return;
                    touching = true;
                })
                if (touching) {
                    this.model.GetChildren().forEach((v) => {
                        if (v.IsA('BasePart')) {
                            v.Color = Color3.fromRGB(255, 0, 0);
                        }
                    })
                }
                else {
                    this.model.GetChildren().forEach((v) => {
                        if (v.IsA('BasePart')) {
                            v.Color = Color3.fromRGB(0, 255, 255);
                        }
                    })
                }
                this.model.SetPrimaryPartCFrame(cf); 
            }
            this.model.Parent = this.ctx.camera;
        });
        this.useconn = UserInputService.InputBegan.Connect((input, gp) => {
            if (gp) return;
            if (this.ctx.keyIs(input, 'fire')) {
                this.place();
            }
        })
        this.ctx.unequip(true);
        print('triggered');
        this.active = true;
    }
    override cancel() {
        if (this.placeconn) {
            this.placeconn.Disconnect();
            this.model.Parent = undefined;
        }
        if (this.useconn) {
            this.useconn.Disconnect();
        }
        this.active = false;
    }
}