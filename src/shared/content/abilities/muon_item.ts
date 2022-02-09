import fps_framework from "shared/modules/fps";
import weaponCore from "../weaponCore";
import { TweenService, UserInputService } from "@rbxts/services";
import animationsMap from "../mapping/animations";
import path from "shared/phyx/path";

export default class muon_item extends weaponCore {
    isAGun = false;
    isAMelee = false;
    isBlank = true;
    term = 0;
    lastthrow = tick();
    throwcooldown = 2;
    constructor(ctx: fps_framework) {
        super(ctx, {
            name: 'muon',
            animationIds: {
                idle: animationsMap.muon_idle,
                fire: animationsMap.muon_throw,
            },
            slotType: 'extra1',
            skin: 'blank',
        });
        let inputX = UserInputService.InputBegan.Connect((input, gp) => {
            if (this.ctx.keyIs(input, 'fire') && !gp && this.equipped) {
                this.fire();
            }
        })
    }
    fire(): void {
        if (tick() - this.lastthrow < this.throwcooldown) return;
        this.term ++;
        if (this.animations.fire) {
            this.animations.fire.Play();
            task.wait(this.animations.fire.Length);
        }
        let origin = this.ctx.camera.CFrame;
        let direction = origin.LookVector;
        let position = this.viewmodel.GetPrimaryPartCFrame().Position;
        
        let names = ['casing', 'ore', 'ore_damp'];

        this.remotes.fire.FireServer(position, direction);
        this.ctx.proj_handler.newProjectile(`$client_projectile:muon:${this.term}`, 'ReplicatedStorage//guns//muon//muon_blank',
            position, direction, new Vector3(0, -50, 0), 100, 50
        )
        this.viewmodel.GetChildren().forEach((v) => {
            if (names.indexOf(v.Name) !== -1 && v.IsA('BasePart')) {
                coroutine.wrap(() => {
                    let last = v.Transparency;
                    v.Transparency = 1;
                    v.Anchored = true;
                    task.wait(.6);
                    v.Transparency = last;
                })()
            }
        })

        task.wait(.5);
        this.ctx.equip('primary');
    }
    update() {
        if(this.animations.idle && !this.animations.idle.IsPlaying) {
            this.animations.idle.Play();
        }
    }
}