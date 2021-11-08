import { Players, RunService, TweenService, UserInputService, Workspace } from "@rbxts/services";
import weaponCore from "shared/content/weaponCore";
import mpx_default from "shared/content/guns/mpx/mpx";
import sohk from "shared/sohk/init";
import { keybinds } from "shared/types/datatypes";
import fps_framework_types from "shared/types/fps";
import worldData from "shared/worlddata";
import spring from "./spring";
import { mathf } from "./System";
import knife_default from "shared/content/guns/knife_default";
import { illusoryDream } from "shared/content/abilities/illusoryDream";
import ability_core from "shared/content/abilitycore";
import interactions from "./interactions";
import mpx_techno from "shared/content/guns/mpx/mpx_techno";

export default class fps_framework extends sohk.sohkComponent {
    interactions = new interactions();
    camera: Camera = Workspace.CurrentCamera as Camera;
    client = Players.LocalPlayer;
    character = this.client.Character || (this.client.CharacterAdded.Wait()[0]);
    humanoid = this.character.WaitForChild("Humanoid") as Humanoid;
    reloading: boolean = false;
    aiming: boolean = false;
    toAim: boolean = false;
    pronePlaying: boolean = false;
    sneaking: boolean = false;
    sprinting: boolean = false;
    inspectingWeapon: boolean = false;
    leandirection: 1 | 0 | -1 = 0;
    lastlean: 1 | 0 | -1 = 0;
    stance: 1 | 0 | -1 = 1;
    speed: number = 12;

    rappelling: boolean = false;
    rappelWall: BasePart | undefined = undefined;

    offsets = {
        aimPercent: new Instance("NumberValue"),
        sprintPercent: new Instance("NumberValue"),
        movementTilt: new CFrame(),
        cameraMovementTilt: new CFrame(),
        cameraLean: new Instance("CFrameValue"),
        gunLean: new Instance("CFrameValue"),
        stance: new Instance("CFrameValue"),
        aimOscillation: new CFrame(),
    };
    springs = {
        recoil: spring.create(5, 75, 3, 4),
    };
    keybinds: keybinds = {
        primary: Enum.KeyCode.One,
        secondary: Enum.KeyCode.Two,
        melee: Enum.KeyCode.Three,
        fire: Enum.UserInputType.MouseButton1,
        reload: Enum.KeyCode.R,
        aim: Enum.UserInputType.MouseButton2,
        leanLeft: Enum.KeyCode.Q,
        leanRight: Enum.KeyCode.E,
        prone: Enum.KeyCode.LeftControl,
        crouch: Enum.KeyCode.C,
        sprint: Enum.KeyCode.LeftShift,
        sneak: Enum.KeyCode.LeftAlt,
        vault: Enum.KeyCode.Space,
        rappel: Enum.KeyCode.Space,
        fireMode: Enum.KeyCode.V,
        primarySkill: Enum.KeyCode.G,
        inspect: Enum.KeyCode.Y,
        /*
        secondarySkill: Enum.KeyCode.H,
        ping: Enum.KeyCode.Z,
        leaderBoard: Enum.KeyCode.Tab,*/
    }
    loadout: fps_framework_types.loadout = {
        primary: {
            module: new mpx_techno(this),
            equipped: false,
        },
        melee: {
            module: new knife_default(this),
            equipped: false,
        }
    }
    skills: fps_framework_types.abilityloadout = {
        primaryAbility: {
            module: new illusoryDream(this),
            equipped: false,
        },
    }
    keyIs(input: InputObject, str: keyof keybinds) {
        if (this.keybinds[str] === input.KeyCode || this.keybinds[str] === input.UserInputType) return true;
        return false;
    }
    constructor() {
        super();
        this.replicationService.remotes.replicateCharacter.OnClientEvent.Connect((...args: unknown[]) => {
            let player = args[0] as Player;
            let cf = args[1] as CFrame;
            if (player.Character) {
                player.Character.SetPrimaryPartCFrame(cf);
            }
        })
        let gameplayrender = RunService.RenderStepped.Connect((dt) => {
            this.update(dt);
        })
        let inputhandler = UserInputService.InputBegan.Connect((input, gp) => {
            if (gp) return;
            if (this.keyIs(input, 'primary')) {
                this.equip('primary');
            }
            if (this.keyIs(input, 'melee')) {
                this.equip('melee');
            }
            if (this.keyIs(input, 'aim')) {
                this.toggleAim(true);
            }
            if (this.keyIs(input, 'leanLeft')) {
                this.toggleLean(-1);
            }
            if (this.keyIs(input, 'leanRight')) {
                this.toggleLean(1);
            }
            if (this.keyIs(input, 'prone')) {
                this.toggleStance(-1);
            }
            if (this.keyIs(input, 'inspect')) {
                this.inspect();
            }
            if (this.keyIs(input, 'crouch')) {
                this.toggleStance(0);
            }
            if (this.keyIs(input, 'sprint')) {
                this.toggleSprint(true);
            }
            if (this.keyIs(input, 'sneak')) {
                this.toggleSneak(true);
            }
            if (this.keyIs(input, 'vault')) {
                coroutine.wrap(() => {
                    this.attemptVault();
                })()
            }
            if (this.keyIs(input, 'rappel')) {
                this.attemptRappel();
            }
            if (this.keyIs(input, 'primarySkill')) {
                this.skills.primaryAbility.module.trigger();
            }
            if (this.keyIs(input, 'reload')) {
                this.reload();
            }
            if (this.keyIs(input, 'fireMode')) {
                let eq = this.getEquipped();
                if (eq && eq.module.isAGun) {
                    eq.module.switchFireMode();
                }
            }
        })
        let inputhandler2 = UserInputService.InputEnded.Connect((input) => {
            if (this.keyIs(input, 'aim')) {
                this.toggleAim(false);
            }
            if (this.keyIs(input, 'sprint')) {
                this.toggleSprint(false);
            }
            if (this.keyIs(input, 'sneak')) {
                this.toggleSneak(false);
            }
        })
    }
    unequip() {
        let equipped = this.getEquipped();
        if (equipped) {
            equipped.module.cancelReload();
            equipped.module.unequip();
            equipped.module.toggleInspect(false);
            equipped.equipped = false;
        }
    }
    toggleLean(t: 1 | 0 | -1) {
        let equipped = this.getEquipped();
        if (!equipped || !equipped.module.canLean) return;
        equipped.module.toggleInspect(false);
        let info = new TweenInfo(.25)
        this.lastlean = this.leandirection;
        if (t === this.leandirection) {
            t = 0;
        }
        this.leandirection = t;
        if (t === 1) {
            TweenService.Create(this.offsets.cameraLean, info, {
                Value: new CFrame(1, 0, 0).mul(CFrame.Angles(0, 0, math.rad(-5)))}).Play();
            TweenService.Create(this.offsets.gunLean, info, {
                Value: new CFrame().mul(CFrame.fromEulerAnglesYXZ(0, 0, math.rad(-16)))}).Play();
        }
        else if (t === -1) {
            TweenService.Create(this.offsets.cameraLean, info, {
                Value: new CFrame(-1, 0, 0).mul(CFrame.Angles(0, 0, math.rad(5)))}).Play();
            TweenService.Create(this.offsets.gunLean, info, {
                Value: new CFrame().mul(CFrame.fromEulerAnglesYXZ(0, 0, math.rad(16)))}).Play();
        }
        else {
            TweenService.Create(this.offsets.cameraLean, info, {
                Value: new CFrame(0, 0, 0)}).Play();
            TweenService.Create(this.offsets.gunLean, info, {
                Value: new CFrame().mul(CFrame.fromEulerAnglesYXZ(0, 0, 0))}).Play();
        }
    }
    toggleSprint(t: boolean) {
        if (this.rappelling) return;
        let equipped = this.getEquipped();
        if (!equipped || !equipped.module.canSprint) return;
        equipped.module.toggleInspect(false);
        this.toggleStance(1);
        this.toggleSneak(false);

        this.sprinting = t;
        if (t) {

        }
        else {
            
        }
    }
    toggleSneak(t: boolean) {
        if (this.sprinting) return;
        if (this.stance !== 1) return;
        this.sneaking = t;
    }
    toggleStance(t: 1 | 0 | -1) {
        if (this.rappelling) return;
        if (this.pronePlaying) return;
        if (this.sprinting) return;
        this.toggleSneak(false);
        let info1 = new TweenInfo(.35);
        let info2 = new TweenInfo(.6);
        let info = this.stance === -1 || t === -1? info2: info1
        if (t === this.stance && t === 0) {
            t = 1;
        }
        if (t === this.stance) return;
        this.pronePlaying = this.stance === -1 || t === -1? true: false;
        coroutine.wrap(() => {
            if (this.pronePlaying) {
                task.wait(info.Time);
                this.pronePlaying = false;
            }
        })()
        this.stance = t;
        if (t === 1) {
            TweenService.Create(this.offsets.stance, info, {Value: new CFrame()}).Play();
        }
        else if (t === 0) {
            TweenService.Create(this.offsets.stance, info, {Value: new CFrame(0, -1.5, 0)}).Play();
        }
        else if (t === -1) {
            TweenService.Create(this.offsets.stance, info, {Value: new CFrame(0, -2.5, 0)}).Play();
        }
    }
    toggleAim(t: boolean) {
        let equipped = this.getEquipped();
        if (!equipped || !equipped.module.canAim) return;
        equipped.module.toggleInspect(false);
        let ti = new TweenInfo(.5, Enum.EasingStyle.Quart, Enum.EasingDirection.Out);
        if (t) {
            if (this.sprinting) {
                this.toAim = true;
                let s = RunService.RenderStepped.Connect(() => {
                    if (!this.sprinting) {s.Disconnect(); this.toAim = false;};
                    TweenService.Create(this.offsets.aimPercent, ti, {Value: 1}).Play();
                    this.aiming = true;
                })
            }
            else {
              this.aiming = true;
                TweenService.Create(this.offsets.aimPercent, ti, {Value: 1}).Play();  
            }
        }
        else {
            this.toAim = false;
            this.aiming = false;
            TweenService.Create(this.offsets.aimPercent, ti, {Value: 0}).Play();
        }
    }
 
    equip(item: keyof fps_framework_types.loadout) {
        if (this.getEquipped() === this.loadout[item]) return;
        this.toggleAim(false);
        this.unequip();
        let iteminfo = this.loadout[item];
        iteminfo.module.equip();
        iteminfo.equipped = true;
        this.replicationService.remotes.equipItem.FireServer(iteminfo.module.name);
        if (!iteminfo.module.canLean) {
            this.toggleLean(0);
        }
        function isKeyCode(e: Enum.UserInputType | Enum.KeyCode) {
            if (e.EnumType === Enum.KeyCode) return true; return false;
        }
        let passAim = false;
        if (isKeyCode(this.keybinds.aim)) {
            if (UserInputService.IsKeyDown(this.keybinds.aim as Enum.KeyCode)) {
                passAim = true;
            }
        }
        else {
            if (UserInputService.IsMouseButtonPressed(this.keybinds.aim as Enum.UserInputType)) {
                passAim = true;
            }
        }
        if (passAim && iteminfo.module.canAim) {
            this.toggleAim(true);
        }
    }
    getEquipped() {
        for (const [index, ind] of pairs(this.loadout)) {
            if (ind.equipped) return ind
        }
    }
    reload() {
        if (this.reloading) return;
        this.toggleSprint(false);
        this.toggleAim(false);
        this.reloading = true;
        let eq = this.getEquipped();
        if (!eq) return;
        if (eq.module.isAGun) {
            eq.module.toggleInspect(false);
            (eq.module as weaponCore).reload();
        }
        this.reloading = false;
    }
    attemptRappel() {
        if (this.rappelling) return;
        let eq = this.getEquipped();
        if (!eq) return;
        eq.module.toggleInspect(false);
        print('attempting');
        let p = Workspace.GetPartsInPart(this.character.FindFirstChild('HumanoidRootPart') as BasePart);
        let selected: BasePart | undefined = undefined;
        p.forEach(v => {
            if (worldData.rappelGates[v.Name as keyof typeof worldData.rappelGates]) {
                selected = v as BasePart;
            }
        })
        if (selected) {
            this.rappelWall = selected;
            this.rappelling = true;
            print('rappelling');
        }
        else {
            print('no result')
        }
    }
    attemptVault() {
        const vaultdistance = 8;
        const ignore = new RaycastParams();
        ignore.FilterDescendantsInstances = [this.camera, this.character];
        let result = Workspace.Raycast(this.camera.CFrame.Position, this.camera.CFrame.LookVector.mul(vaultdistance), ignore);
        if (result) {
            let partsIn = Workspace.GetPartsInPart(result.Instance);
            let kill = false;
            partsIn.forEach((v) => {
                if (v.Parent === this.character) {
                    kill = true;
                    return;
                }
            })
            if (kill) return;
            const [hit, position, normal] = [result.Instance, result.Position, result.Normal];
            if (worldData.vaultGates[hit.Name as keyof typeof worldData.vaultGates]) {
                let eq = this.getEquipped();
                if (!eq) return;
                eq.module.toggleInspect(false);
                let craft1 = new Vector3(position.X, 0, position.Z);
                const targetPosition = craft1.add(normal.mul(-1).mul(5)).add(new Vector3(0, hit.Position.Y + (hit.Size.Y / 2), 0));
                const targetCFrame = CFrame.lookAt(targetPosition, normal.mul(-1).mul(999));
                let t = TweenService.Create(this.character.PrimaryPart as BasePart, new TweenInfo(.75), {CFrame: targetCFrame})
                t.Play();
            }
        }
        else {
            print("can't vault")
        }
    }
    inspect() {
        let eq = this.getEquipped();
        if (!eq) return;
        eq.module.toggleInspect(true);
    }
    NRMLDistanceFromWall() {
        let current = this.camera.CFrame;
        let ignore = new RaycastParams();
        ignore.FilterDescendantsInstances = [this.camera, this.character];
        let leanto = this.leandirection === 1? 1: -1
        if (this.leandirection === 0) {
            leanto = this.lastlean;
        }
        let result = Workspace.Raycast(current.Position,
            current.RightVector.mul(3).mul(leanto), ignore);
        if (result) {
            let dst = (current.Position.sub(result.Position)).Magnitude;
            let nrm = mathf.normalize(0, 1, dst - 1.2);
            return nrm;
        }
        else {
            return 1;
        }
    }
    update(dt: number) {
        let equipped = this.getEquipped();
        if (equipped && equipped.module.viewmodel) {

            let rootpart = this.character.FindFirstChild("HumanoidRootPart") as BasePart;

            let vm = equipped.module.viewmodel;
            let env = equipped.module;
            let cf = vm.offsets.idle.Value;

            cf = cf.Lerp(vm.offsets.idle.Value, 1); //sprint
            cf = cf.Lerp(new CFrame(0, 0, -.2), this.offsets.aimPercent.Value); //aim

            let moveDirection = this.uisController.getCurrentMovementVector(this.humanoid);

            let cmTiltMOD = equipped.module.inverseMovementTilt? -1: 1;

            moveDirection = moveDirection.mul(cmTiltMOD);

            this.offsets.movementTilt = this.offsets.movementTilt.Lerp(
                CFrame.Angles(0, 0, (1 - moveDirection.X) * .05)
            , .1)

            let fluct = this.sneaking? 2: 5;

            this.offsets.aimOscillation = this.offsets.aimOscillation.Lerp(
                this.aiming && moveDirection.Magnitude !== 0?
                CFrame.Angles(0, 0, this.renderService.flux(fluct, .1)): CFrame.Angles(0, 0, 0)
            , .1)
            
            this.offsets.cameraMovementTilt = this.offsets.cameraMovementTilt.Lerp(
                this.aiming? new CFrame():
                new CFrame(0, math.sin(tick()) * .01, math.sin(tick()) * .01).mul(
                    new CFrame(moveDirection.X * .04, 0, moveDirection.Z * .04))
            , .1);

            let recoil = this.springs.recoil.update(dt);

            if (this.rappelling && this.rappelWall) {
                let mvDT = new Vector3();
                if (UserInputService.IsKeyDown('W')) {
                    mvDT = mvDT.add(new Vector3(0, 1, 0));
                }
                if (UserInputService.IsKeyDown('A')) {
                    mvDT = mvDT.add(new Vector3(-1, 0, 0));
                }
                if (UserInputService.IsKeyDown('S')) {
                    mvDT = mvDT.add(new Vector3(0, -1, 0));
                }
                if (UserInputService.IsKeyDown('D')) {
                    mvDT = mvDT.add(new Vector3(1, 0, 0));
                }
    
                let rappelvel = 10;
                let org = this.character.GetPrimaryPartCFrame();

                let ignore = new RaycastParams(); //for detecting if there's anything above or below them
                ignore.FilterDescendantsInstances = [this.camera, this.character];
                let rayup = Workspace.Raycast(org.Position, new Vector3(0, 2, 0), ignore);
                let raydown = Workspace.Raycast(org.Position, new Vector3(0, -2, 0), ignore);
                if (raydown) mvDT = mvDT.add(new Vector3(0, 1, 0));
                if (rayup) mvDT = mvDT.sub(new Vector3(0, 1, 0));

                mvDT = mvDT.mul(this.sneaking? .35: 1); //for sneaking

                let pos = this.rappelWall.CFrame.Position;
                let size = this.rappelWall.Size;

                let ry = this.rappelWall.CFrame.VectorToObjectSpace(mvDT);
                let tochar = this.character.GetPrimaryPartCFrame().VectorToObjectSpace(ry);

                let targetCFrame = this.character.GetPrimaryPartCFrame()
                    .mul(new CFrame(tochar.mul(rappelvel * dt)))
                
                let clx = math.clamp(targetCFrame.X, pos.X - size.X / 2, pos.X + size.X / 2);
                let cly = math.clamp(targetCFrame.Y, pos.Y - size.Y / 2, pos.Y + size.Y / 2);
                let clz = math.clamp(targetCFrame.Z, pos.Z - size.Z / 2, pos.Z + size.Z / 2);

                let [ox, oy, oz] = targetCFrame.ToOrientation();

                let v3 = new Vector3(clx, cly, clz);

                targetCFrame = new CFrame(v3).mul(CFrame.fromOrientation(ox, oy, oz));

                this.character.SetPrimaryPartCFrame(targetCFrame);

                rootpart.Anchored = true;
            }
            else {
                rootpart.Anchored = false;
            }

            this.replicationService.remotes.replicateCharacter.FireServer(this.character.GetPrimaryPartCFrame())
            
            let l1 = new Vector3().Lerp(this.offsets.cameraLean.Value.Position, this.NRMLDistanceFromWall());
            let l = new CFrame(l1).mul(CFrame.Angles(...mathf.degToRad(this.offsets.cameraLean.Value.ToOrientation())));

            vm.SetPrimaryPartCFrame(this.camera.CFrame
                .mul(cf)
                .mul(this.offsets.stance.Value)
                .mul(l)
                .mul(this.offsets.gunLean.Value)
                .mul(this.offsets.cameraMovementTilt)
                .mul(this.offsets.movementTilt)
                .mul(this.offsets.aimOscillation)
            );

            UserInputService.MouseIconEnabled = false;
            this.camera.CFrame = this.camera.CFrame
                .mul(this.offsets.stance.Value)
                .mul(l)
                .mul(CFrame.Angles(math.rad(recoil.Y), math.rad(recoil.X), 0))
            

            let mod1 = this.pronePlaying? 0: 1;
            let mod2 = this.stance === 0? .5: 1;
            let mod3 = this.stance === -1? .2: 1;
            let mod4 = this.sneaking? .4: 1;
            let mod5 = this.sprinting? 1.45: 1;
            let mod6 = this.rappelling? 0: 1;
            this.humanoid.WalkSpeed = this.speed * mod1 * mod2 * mod3 * mod4 * mod5 * mod6 * equipped.module.weightMultiplier;
            equipped.module.update();
        }
    }
}