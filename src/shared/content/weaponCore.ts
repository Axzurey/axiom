import { Debris, ReplicatedStorage, RunService, UserInputService, Workspace } from "@rbxts/services";
import sohk from "shared/sohk/init";
import fps_framework from "shared/modules/fps";
import System from "shared/modules/System";
import { unloaded_viewmodel, viewmodel } from "shared/types/fps";

interface animationIds {
    idle: string,
    swing?: string,
    reload?: string,
    reloadFull?: string,
}

export default class weaponCore extends sohk.sohkComponent {
    name: string = 'unknown gun'
    ctx: fps_framework;
    viewmodel: viewmodel;
    animations: {
        idle?: AnimationTrack,
        swing?: AnimationTrack,
    } = {idle: undefined};

    mousedown: boolean = false;
    equipped: boolean = false;

    firerate: number = 600;
    burstFireRate: number = 200;
    burstBulletRate: number = 800;

    knifeDelay: number = .75;

    stabDamage: number = 75;
    backStabDamage: number = 200;
    meleeRange: number = 7;

    inspectAnimation: AnimationTrack | undefined = undefined;

    canLean: boolean = true;
    canAim: boolean = true;
    canSprint: boolean = true;

    lastStab: number = tick();
    inspecting: boolean = false;

    isAMelee: boolean = false;
    isAGun: boolean = true;

    weightMultiplier: number = 1.2;

    inverseMovementTilt: boolean = false;

    lastshot: number = tick();
    remotes: Record<string, RemoteEvent> = {};

    fireModes: ('auto' | 'burst 2' | 'burst 3' | 'semi' | 'shotgun')[] = ['auto', 'semi', 'burst 3'];
    fireMode: number = 0;
    lastFireModeSwitch: number = tick();
    fireModeSwitchCooldown: number = .75;
    skin: string;

    recoil: {x: number, y: number} = {x: 2, y: 1.8}
    
    constructor(ctx: fps_framework, data: {
        name: string,
        animationIds: animationIds,
        slotType: 'primary' | 'melee',
        skin: string,
    }) {
        super();
        this.name = data.name;
        this.ctx = ctx;
        this.skin = data.skin;
        let vm = ReplicatedStorage.FindFirstChild('viewmodel')?.Clone() as unloaded_viewmodel;
        let gun = ReplicatedStorage.FindFirstChild('guns')?.FindFirstChild(this.name)?.FindFirstChild(`${this.name}_${this.skin}`)?.Clone();
        gun?.GetChildren().forEach((v) => {
            if (v.IsA('BasePart')) {
                v.CanCollide = false;
                v.Anchored = false;
            }
            v.Parent = vm;
        })

        let ap = vm.FindFirstChild('aimpart') as BasePart;
        if (ap) {
            let m0 = new Instance("Motor6D");
            m0.Part0 = ap;
            m0.Part1 = vm.rightArm;
            m0.Parent = vm;

            let m1 = new Instance("Motor6D");
            m1.Part0 = ap;
            m1.Part1 = vm.leftArm;
            m1.Parent = vm;

            let m2 = new Instance("Motor6D");
            m2.Part0 = vm.rootpart;
            m2.Part1 = ap;
            m2.Parent = vm;

            vm.PrimaryPart = ap;
        }
        else {
            throw `no aimpart found in gun ${this.name}`;
        }

        let p = data.slotType;

        this.remotes = (ReplicatedStorage.FindFirstChild("remotes")?.FindFirstChild("requestLoad") as RemoteFunction).InvokeServer(p)
        
        this.viewmodel = vm as viewmodel;
        this.viewmodel.SetPrimaryPartCFrame(new CFrame(0, -10000, 0));
        this.viewmodel.Parent = Workspace.CurrentCamera;

        let temp = new Instance("Folder");
        temp.Name = `${os.clock()}:temp:animation`;
        temp.Parent = Workspace;

        for (const [i, v] of pairs(data.animationIds)) {
            let a = new Instance("Animation");
            a.AnimationId = v;
            a.Parent = temp;
            if (i === 'idle') {
                this.animations['idle'] = this.viewmodel.controller.animator.LoadAnimation(a);
            }
            if (i === 'swing') {
                this.animations['swing'] = this.viewmodel.controller.animator.LoadAnimation(a);
            }
        }

        let conn = UserInputService.InputBegan.Connect((input, gp) => {
            if (this.ctx.keyIs(input, 'fire') && this.equipped) {
                this.mousedown = true;
            }
        })
        let conn2 = UserInputService.InputEnded.Connect((input) => {
            if (this.ctx.keyIs(input, 'fire') && this.equipped) {
                this.mousedown = false;
            }
        })

        this.viewmodel.Parent = undefined;
        temp.Destroy();
    }
    equip() {
        this.equipped = true;
        this.viewmodel.Parent = this.ctx.camera;
    }
    unequip() {
        this.equipped = false;
        this.viewmodel.Parent = undefined;
    }
    toggleInspect(t: boolean) {
        this.inspecting = t;
        if (t) {
            if (this.inspectAnimation) {
                this.inspectAnimation.Play(.25);
            }
        }
        else {
            if (this.inspectAnimation) {
                this.inspectAnimation.Stop();
            }
        }
    }
    switchFireMode() {
        if (tick() - this.lastFireModeSwitch < this.fireModeSwitchCooldown) return;
        if (this.fireMode >= this.fireModes.size() - 1) {
            this.fireMode = 0;
        }
        else {
            this.fireMode ++;
        }
        this.remotes.firemode.FireServer();
    }
    reload() {
        if (this.ctx.interactions.currentAmmo >= this.ctx.interactions.currentMaxAmmo) return;
        this.remotes.reload.FireServer();
    }
    cancelReload() {
        this.remotes.cancelReload.FireServer();
        this.ctx.reloading = false;
    }
    fire() {
        if (this.isAGun) {
            if (this.ctx.interactions.currentAmmo <= 0) return;
            if (this.fireMode === this.fireModes.indexOf('burst 2') || this.fireMode === this.fireModes.indexOf('burst 3')) {
                if (tick() - this.lastshot < (60 / this.burstFireRate)) return;
            }
            else {
                if (tick() - this.lastshot < (60 / this.firerate)) return;
            }
            if (this.fireMode === this.fireModes.indexOf('semi')) {
                this.mousedown = false;
            }
            if (this.fireMode === this.fireModes.indexOf('burst 3')) {
                let ca = this.ctx.interactions.currentAmmo;
                for (let i = 0; i <= 2; i++) {
                    if (!this.mousedown) break;
                    if (i >= ca) break;
                    this.ctx.springs.recoil.shove(new Vector3(-this.recoil.x, this.recoil.y, 0).div(1).mul(System.process.deltatime * 60));

                    this.lastshot = tick();
                    this.viewmodel.audio.fire.Play();
                    let effectorigin = this.viewmodel.barrel.Position;
                    let direction = this.ctx.camera.CFrame.LookVector;
                    let model = ReplicatedStorage.FindFirstChild('bullet_trail')?.Clone() as BasePart;
                    model.Parent = Workspace;
                    model.Position = effectorigin;
                    let trail = model.FindFirstChild('trail') as Trail;
                    model.CanCollide = false;
                    model.CanTouch = false;
                    model.Anchored = false;
                    model.ApplyImpulse(direction.mul(1000));
                    Debris.AddItem(model, 3);
    
                    this.remotes.fire.FireServer(this.ctx.camera.CFrame.Position, this.ctx.camera.CFrame.LookVector);
                    task.wait(60 / this.burstBulletRate);
                }
                return;
            }
            if (this.fireMode === this.fireModes.indexOf('burst 2')) {
                let ca = this.ctx.interactions.currentAmmo;
                for (let i = 0; i <= 1; i++) {
                    if (i >= ca) break;
                    this.ctx.springs.recoil.shove(new Vector3(-this.recoil.x, this.recoil.y, 0).div(1).mul(System.process.deltatime * 60));
    
                    this.lastshot = tick();
                    this.viewmodel.audio.fire.Play();
                    let effectorigin = this.viewmodel.barrel.Position;
                    let direction = this.ctx.camera.CFrame.LookVector;
                    let model = ReplicatedStorage.FindFirstChild('bullet_trail')?.Clone() as BasePart;
                    model.Parent = Workspace;
                    model.Position = effectorigin;
                    let trail = model.FindFirstChild('trail') as Trail;
                    model.CanCollide = false;
                    model.CanTouch = false;
                    model.Anchored = false;
                    model.ApplyImpulse(direction.mul(1000));
                    Debris.AddItem(model, 3);
    
                    this.remotes.fire.FireServer(this.ctx.camera.CFrame.Position, this.ctx.camera.CFrame.LookVector);
                    task.wait(60 / this.burstBulletRate);
                }
                return;
            }
            this.ctx.springs.recoil.shove(new Vector3(-this.recoil.x, this.recoil.y, 0).div(1).mul(System.process.deltatime * 60));
    
            this.lastshot = tick();
            this.viewmodel.audio.fire.Play();
            let effectorigin = this.viewmodel.barrel.Position;
            let direction = this.ctx.camera.CFrame.LookVector;
            let model = ReplicatedStorage.FindFirstChild('bullet_trail')?.Clone() as BasePart;
            model.Parent = Workspace;
            model.Position = effectorigin;
            let trail = model.FindFirstChild('trail') as Trail;
            model.CanCollide = false;
            model.CanTouch = false;
            model.Anchored = false;
            model.ApplyImpulse(direction.mul(1000));
            Debris.AddItem(model, 3);
    
            this.remotes.fire.FireServer(this.ctx.camera.CFrame.Position, this.ctx.camera.CFrame.LookVector);
        }
        else if (this.isAMelee) {
            if (tick() - this.lastStab < this.knifeDelay) return;
            this.lastStab = tick();
            //this.viewmodel.audio.fire.Play();
            let cf = this.ctx.camera.CFrame;
            if (this.animations.swing) {
                this.animations.swing.Play();
            }
            else {
                print("no swing animation");
            }
            this.remotes.melee.FireServer(cf.Position, cf.LookVector);
        }
    }
    update() {
        if(this.animations.idle && !this.animations.idle.IsPlaying) {
            this.animations.idle.Play();
        }
        if (this.mousedown) {
            this.fire();
        }
    }
}