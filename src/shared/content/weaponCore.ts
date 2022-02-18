import { Debris, ReplicatedStorage, RunService, TweenService, UserInputService, Workspace } from "@rbxts/services";
import sohk from "shared/sohk/init";
import fps_framework from "shared/modules/fps";
import System, { mathf, Threading } from "shared/modules/System";
import { unloaded_viewmodel, viewmodel } from "shared/types/fps";
import sightcore from "./sightcore";
import sightsMapping from "./mapping/sights";
import tracer from "shared/classes/tracer";
import interpolations from "shared/functions/interpolations";
import bullet from "shared/classes/bullet";
import minerva from "shared/minerva";
import worldData from "shared/worlddata";

interface animationIds {
    idle?: string,
    swing?: string,
    reload?: string,
    reloadFull?: string,
    action?: string,
    equip?: string,
    empty?: string,
    fire?: string,
}

const reloadExhaust = .55; //make this dynamic based on ping?

export default class weaponCore extends sohk.sohkComponent {
    void: boolean = false;
    name: string = 'unknown gun'
    ctx: fps_framework;
    viewmodel: viewmodel;
    animations: {
        idle?: AnimationTrack,
        empty?: AnimationTrack,
        fire?: AnimationTrack,
        reload?: AnimationTrack,
        reloadFull?: AnimationTrack,
        action?: AnimationTrack,
        equip?: AnimationTrack,
        swing?: AnimationTrack,
    } = {};

    extraAnimations: Record<string, AnimationTrack> = {};

    mousedown: boolean = false;
    equipped: boolean = false;

    firerate: number = 600;
    burstFireRate: number = 200;
    burstBulletRate: number = 800;

    reloadLength: number = 1.5;

    penetration: number = 3;

    spreadHipfirePenalty: number = 2;
    spreadMovementHipfirePenalty: number = 2;
    spreadUpPerShot: number = 2;

    spreadBin: number[] = [];

    viewModelRecoil: {x: number, y: number, z: number, rUp: number} = {
        x: 0,
        y: 0,
        z: .4,
        rUp: 0
    }

    equipping: boolean = false;

    knifeDelay: number = .75;

    stabDamage: number = 75;
    backStabDamage: number = 200;
    meleeRange: number = 7;

    inspectAnimation: AnimationTrack | undefined = undefined;

    bobSpeedModifier = 1;
    bobIntensityModifier = 1;

    canLean: boolean = true;
    canAim: boolean = true;
    canSprint: boolean = true;

    lastStab: number = tick();
    inspecting: boolean = false;

    isAMelee: boolean = false;
    isAGun: boolean = true;
    isBlank: boolean = false;

    weightMultiplier: number = 1.2;

    inverseMovementTilt: boolean = false;

    lastshot: number = tick();
    remotes: Record<string, RemoteEvent> = {};
    calls: Record<string, RemoteFunction> = {};

    fireModes: ('auto' | 'burst 2' | 'burst 3' | 'semi' | 'shotgun')[] = ['auto', 'semi', 'burst 3'];
    fireMode: number = 0;
    lastFireModeSwitch: number = tick();
    fireModeSwitchCooldown: number = .75;
    skin: string;

    recoilPattern: {x: number, y: number}[] = [
        {x: 5, y: 9}, {x: -3, y: 9}, {x: 5, y: 9}, {x: -5, y: 10}, {x: -8, y: 12}, {x: 8, y: 12},
        {x: 11, y: 14}, {x: -10, y: 16}, {x: 12, y: 14}
    ];
    recoilIndex: number = 0;
    lastRecoil: number = tick();
    recoilRegroupTime: number = 1;

    sight: sightcore | undefined = undefined;

    lastReload: number = tick();

    slotType: 'primary' | 'melee' | 'bomb' | 'special' | 'secondary' | 'extra1';

    vmOffset: CFrameValue = new Instance("CFrameValue");

    ammo: number = 0;
    maxAmmo: number = 0;
    ammoOverload: number = 0;
    reserve: number = 0;
    
    constructor(ctx: fps_framework, data: {
        name: string,
        animationIds: animationIds,
        slotType: 'primary' | 'secondary' | 'melee' | 'bomb' | 'special' | 'extra1',
        skin: string,
        attachments?: {sight?: string},
    }) {
        super();
        this.name = data.name;
        this.ctx = ctx;
        this.skin = data.skin;
        this.slotType = data.slotType;
        let vm = ReplicatedStorage.FindFirstChild('viewmodel')?.Clone() as unloaded_viewmodel;
        let gun = ReplicatedStorage.FindFirstChild('guns')?.FindFirstChild(this.name)?.FindFirstChild(`${this.name}_${this.skin}`)?.Clone();
        if (data.slotType === 'bomb') {
            gun = ReplicatedStorage.FindFirstChild('gameModels')?.FindFirstChild('bomb')?.Clone();
        }
        
        let sightSelection: sightcore | undefined = undefined;
        if (data.attachments) {
            if (data.attachments.sight) {
                sightSelection = new sightsMapping[data.attachments.sight as keyof typeof sightsMapping];
            }
        }
        if (!gun) throw `gun ${data.name} can not be found`;
        gun?.GetChildren().forEach((v) => {
            if (v.IsA('BasePart')) {
                v.CanCollide = false;
                v.Anchored = false;
            }
            if (v.Name === 'iron_front' || v.Name === 'iron_back') {
                v.Destroy();
                return;
            }
            v.Parent = vm;
        })

        this.viewmodel = vm as viewmodel;

        let ap = vm.FindFirstChild('aimpart') as BasePart;
        if (ap) {

            if (sightSelection) {
                this.mountSight(sightSelection);
            }
            else {
                warn('no sight');
            }

            let m0 = new Instance("Motor6D");
            m0.Part0 = ap;
            m0.Name = 'rightMotor';
            m0.Part1 = vm.rightArm;
            m0.Parent = vm;

            let m1 = new Instance("Motor6D");
            m1.Part0 = ap;
            m1.Part1 = vm.leftArm;
            m1.Name = 'leftMotor';
            m1.Parent = vm;

            let m2 = new Instance("Motor6D");
            m2.Part0 = vm.rootpart;
            m2.Name = 'apMotor';
            m2.Part1 = ap;
            m2.Parent = vm;

            vm.PrimaryPart = ap;
        }
        else {
            throw `no aimpart found in gun ${this.name}`;
        }

        let p = data.slotType;
        if (this.slotType !== 'bomb') {
            let r = (ReplicatedStorage.FindFirstChild("remotes")?.FindFirstChild("requestLoad") as RemoteFunction).InvokeServer(p) as {
                remotes: Record<string, RemoteEvent>,
                calls: Record<string, RemoteFunction>,
            }
            if (r) {
                this.remotes = r.remotes;
                this.calls = r.calls;  
            }
        }

        this.viewmodel.SetPrimaryPartCFrame(new CFrame(0, -10000, 0));
        this.viewmodel.Parent = Workspace.CurrentCamera;

        let temp = new Instance("Folder");
        temp.Name = `${os.clock()}:temp:animation`;
        temp.Parent = Workspace;

        for (const [i, v] of pairs(data.animationIds)) {
            let a = new Instance("Animation");
            a.AnimationId = v;
            a.Parent = temp;
            this.animations[i] = this.viewmodel.controller.animator.LoadAnimation(a)
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
        if (sightSelection) {
            sightSelection.mountFinisher(this.viewmodel);
        }

        this.viewmodel.Parent = undefined;
        temp.Destroy();
        coroutine.wrap(() => {
            task.wait(1);
            if (this.isAGun) {
                const ammoThread = Threading.Recursive(() => {
                    let [ammo, maxAmmo, ammoOverload, reserve] = this.calls.requestAmmo.InvokeServer();
                    this.ammo = ammo;
                    this.maxAmmo = maxAmmo;
                    this.ammoOverload = ammoOverload;
                    this.reserve = reserve;
                }, .25);
                ammoThread.start();
             }
        })()
    }
    mountSight(sight: sightcore) {
        this.sight = sight;
        sight.mount(this.viewmodel);
    }
    equip() {
        if (this.void) return;
        this.equipped = true;
        this.viewmodel.Parent = this.ctx.camera;
        this.equipping = true;
        coroutine.wrap(() => {
            this.vmOffset.Value = new CFrame(0, -5, 0).mul(CFrame.Angles(math.rad(90), 0, 0))
            let t = TweenService.Create(this.vmOffset, new TweenInfo(.2), {
                Value: new CFrame(),
            })
            t.Play();
            task.wait(.1);
            if (this.animations.equip) {
                this.animations.equip.Play();
                if (this.isAGun) {
                    let c2 = this.animations.equip.GetMarkerReachedSignal('bolt_out').Connect(() => {
                        this.viewmodel.audio.boltback.Play();
                    })
                    let c1 = this.animations.equip.GetMarkerReachedSignal('bolt_in').Connect(() => {
                        this.viewmodel.audio.boltforward.Play();
                    })
                    task.wait(this.animations.equip.Length);
                    c1.Disconnect();
                    c2.Disconnect();
                }
                else {
                    task.wait(this.animations.equip.Length);
                }
            }
            this.equipping = false;
        })()
    }
    unequip() {
        this.equipped = false;
        this.viewmodel.Parent = undefined;
    }
    toggleInspect(t: boolean) {
        if (this.void) return;
        if (this.isBlank) return;
        this.inspecting = t;
        if (this.slotType === 'bomb') return;
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
        if (this.void) return;
        if (this.isBlank) return;
        if (this.slotType === 'bomb') return;
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
        if (this.void) return;
        if (this.isBlank) return;
        if (this.slotType === 'bomb') return;
        if (this.reserve === 0) return;
        if (this.equipping) return;
        if (tick() - this.lastReload < reloadExhaust) return;
        if (this.ammo >= this.maxAmmo + this.ammoOverload) return;
        this.ctx.reloading = true;
        if (this.animations.reload) {
            this.animations.reload.Play();
            let c1 = this.animations.reload.GetMarkerReachedSignal('magout').Connect(() => {
                this.viewmodel.audio.magout.Play();
            })
            let c2 = this.animations.reload.GetMarkerReachedSignal('magin').Connect(() => {
                this.viewmodel.audio.magin.Play();
            })
            let c3 = this.animations.reload.GetMarkerReachedSignal('magdrop').Connect(() => {
                let clone = this.viewmodel.mag.Clone();
                clone.Anchored = false;
                clone.CanCollide = true;
                clone.Parent = Workspace.FindFirstChild('ignore');
            })
            this.animations.reload.Stopped.Connect(() => {
                c1.Disconnect();
                c2.Disconnect();
                c3.Disconnect();
            })
        }
        task.wait(this.reloadLength);
        if (!this.ctx.reloading) return;
        this.remotes.reload.FireServer();
        this.lastReload = tick();
        this.ctx.reloading = false;
    }
    cancelReload() {
        if (this.void) return;
        if (this.isBlank) return;
        if (this.slotType === 'bomb') return;
        if (this.remotes.cancelReload) {
           this.remotes.cancelReload.FireServer(); 
        }
        this.ctx.reloading = false;
        if (this.animations.reload && this.animations.reload.IsPlaying) {
            this.animations.reload.Stop(.25);
        }
    }
    recoilVM() {
        if (this.animations.fire) {
            this.animations.fire.Play();
        }
        this.ctx.springs.viewModelRecoil.shove(new Vector3(
            this.viewModelRecoil.x, this.viewModelRecoil.y, this.viewModelRecoil.z
        ));

        let f1 = this.viewmodel.barrel.WaitForChild("muzzle").WaitForChild("f1") as ParticleEmitter;
        let f2 = this.viewmodel.barrel.WaitForChild("muzzle").WaitForChild("f2") as ParticleEmitter;
        let f = this.viewmodel.barrel.WaitForChild("muzzle").WaitForChild("flash") as ParticleEmitter;
        f.Emit(1);
        f1.Emit(3);
        f2.Emit(1);

        if (tick() - this.lastRecoil >= this.recoilRegroupTime) {
            this.recoilIndex = 0;
        }
        else {
            this.recoilIndex ++;
        }
        this.lastRecoil = tick();

        let recoilValue = this.recoilPattern[this.recoilIndex] || this.recoilPattern[this.recoilPattern.size() - 1];

        this.ctx.springs.recoil.shove(new Vector3(-recoilValue.x / 25, recoilValue.y / 25, 0))
        this.ctx.crosshair.pushRecoil(2, this.recoilRegroupTime);
    }
    fireScan() {
        let mult = this.spreadBin.size() + 1;
        let calculated = this.spreadUpPerShot * mult * (this.ctx.aiming? 0: this.spreadHipfirePenalty) * (this.ctx.humanoid.MoveDirection.Magnitude === -0? 1: this.spreadMovementHipfirePenalty);
        calculated = math.clamp(calculated, -5, 5);
        
        let random = new Random();
        let finalX = random.NextNumber(-calculated, calculated);
        let finalY = random.NextNumber(-calculated, calculated);
        
        let origin = this.ctx.camera.CFrame;
        let spread = CFrame.Angles(math.rad(finalX), math.rad(finalY), 0);

        //let direction = origin.mul(spread).LookVector;
        let direction = this.ctx.crosshair.getSpreadDirection(this.ctx.camera);

        let effectorigin = this.viewmodel.barrel.Position;
        let trace = new tracer(effectorigin, direction, 1.5, new Color3(0, 1, 1));

        this.remotes.shoot.FireServer(origin.Position, direction);
        this.spreadBin.push(0);
        coroutine.wrap(() => {
            task.wait(1);
            this.spreadBin.pop();
        })()
    }
    fire() {
        if (this.void) return;
        if (this.isBlank) return;
        if (this.equipping) return;
        if (this.slotType === 'bomb') return;
        if (this.ctx.reloading) return;
        if (this.isAGun) {
            if (this.ammo <= 0) {
                if (this.reserve > 0) {
                    this.reload();
                    return;
                }
                else {
                    return;
                }
            };
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
                let ca = this.ammo;
                for (let i = 0; i <= 2; i++) {
                    if (!this.mousedown) break;
                    if (i >= ca) break;
                    this.recoilVM();
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
                let ca = this.ammo;
                for (let i = 0; i <= 1; i++) {
                    if (i >= ca) break;
                    this.recoilVM();
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
            if (this.fireMode === this.fireModes.indexOf('auto')) {
                this.recoilVM();
                this.lastshot = tick();
                this.viewmodel.audio.fire.Play();
                this.fireScan();
                /*
                let model = ReplicatedStorage.FindFirstChild('bullet_trail')?.Clone() as BasePart;
                model.Parent = Workspace;
                model.Position = effectorigin;
                let trail = model.FindFirstChild('trail') as Trail;
                model.CanCollide = false;
                model.CanTouch = false;
                model.Anchored = false;
                model.ApplyImpulse(direction.mul(1000));
                Debris.AddItem(model, 3);*/
                this.remotes.fire.FireServer(this.ctx.camera.CFrame.Position, this.ctx.camera.CFrame.LookVector);
            }
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
        if (this.void) return;
        if (this.isBlank) return;
        if (this.ammo === 0 && this.animations.empty) {
            if (this.animations.idle) {
                this.animations.idle.Stop();
            }
            if (!this.animations.empty.IsPlaying) {
               this.animations.empty.Play(); 
            }
        }
        else if(this.animations.idle && !this.animations.idle.IsPlaying) {
            if (this.animations.empty) {
                this.animations.empty.Stop();
            }

            this.animations.idle.Play();
        }
        if (this.mousedown && this.equipped && !this.equipping) {
            this.fire();
        }
    }
    destroy() {
        this.void = true;
    }
}