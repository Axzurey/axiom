import { Players, RunService, TweenService, UserInputService, Workspace } from "@rbxts/services";
import weaponCore from "shared/content/weaponCore";
import mpx_default from "shared/content/guns/mpx/mpx";
import sohk from "shared/sohk/init";
import datatypes, { keybinds } from "shared/types/datatypes";
import fps_framework_types from "shared/types/fps";
import worldData from "shared/worlddata";
import spring from "./spring";
import { mathf } from "./System";
import knife_default from "shared/content/guns/knife/knife_default";
import { illusoryDream } from "shared/content/abilities/illusoryDream";
import ability_core from "shared/content/abilitycore";
import localConfig from "shared/config/localConfig";
import crosshairController from "shared/content/crosshairController";
import laser_turret from "shared/content/abilities/laser turret";
import minerva from "shared/minerva";
import matchService, { teamRoles, teams } from "shared/services/matchservice";
import bombClass from "shared/content/bombClass";
import bomb from "shared/content/bomb";
import match_hud from "./match_hud";
import replication, { action } from "shared/config/replication/replication";
import glock18_fade from "shared/content/guns/glock18/glock18_fade";
import knife_saber from "shared/content/guns/knife/knife_saber";
import clientService from "shared/services/clientService";
import clientCamera from "shared/classes/clientCamera";
import interpolations from "shared/functions/interpolations";
import arms from "./arms";

export default class fps_framework extends sohk.sohkComponent {
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
    wantsToSprint: boolean = false;

    defusingBomb: boolean = false;
    bombDefusingTime: number = 0;

    plantingBomb: boolean = false;
    bombPlantingTime: number = 0;

    rappelling: boolean = false;
    rappelWall: BasePart | undefined = undefined;
    exitingRappel: boolean = false;
    enteringRappel: boolean = false;

    vaulting: boolean = false;

    bombClass: bombClass = new bombClass(this);
    matchHud: match_hud = new match_hud();

    offsets = {
        aimPercent: new Instance("NumberValue"),
        sprintPercent: new Instance("NumberValue"),
        movementTilt: new CFrame(),
        cameraMovementTilt: new CFrame(),
        movementOscillation: new CFrame(),
        cameraLean: new Instance("CFrameValue"),
        gunLean: new Instance("CFrameValue"),
        stance: new Instance("CFrameValue"),
        aimOscillation: new CFrame(),
        zoomFovMultiplier: new Instance("NumberValue"),
        aimSensitivityMultiplier: new Instance("NumberValue"),
    };
    springs = {
        recoil: spring.create(5, 75, 3, 4),
        viewModelRecoil: spring.create(5, 85, 3, 10),
    };

    team: teams = teams.alpha;
    teamRole: teamRoles = teamRoles.attack;

    iHaveBomb: boolean = false;

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
        primaryAbility: Enum.KeyCode.G,
        inspect: Enum.KeyCode.Y,
        secondaryAbility: Enum.KeyCode.H,
        "plant/defuse": Enum.KeyCode.F,
        dropBomb: Enum.KeyCode.Four,
        toggleCamera: Enum.KeyCode.B,
        /*
        ping: Enum.KeyCode.Z,
        leaderBoard: Enum.KeyCode.Tab,*/
    }
    loadout: fps_framework_types.loadout = {
        primary: {
            module: new mpx_default(this, {sight: 'holographic'}),
            equipped: false,
            sight: {
                name: 'holographic',
            }
        },
        secondary: {
            module: new glock18_fade(this, {sight: undefined}),
            equipped: false,
        },
        melee: {
            module: new knife_saber(this),
            equipped: false,
        },
        bomb: {
            module: new bomb(this),
            equipped: false,
        }
    }
    Abilities: fps_framework_types.abilityloadout = {
        primaryAbility: {
            module: new illusoryDream(this),
            equipped: false,
        },
        secondaryAbility: {
            module: new laser_turret(this),
            equipped: false,
        },
    }
    lastMovementState: datatypes.movementState = datatypes.movementState.idle;
    isKeyCode(e: Enum.UserInputType | Enum.KeyCode) {
        if (e.EnumType === Enum.KeyCode) return true; return false;
    }
    crosshair = new crosshairController(); //don't forget a backdrop
    keyIs(input: InputObject, str: keyof keybinds) {
        if (this.keybinds[str] === input.KeyCode || this.keybinds[str] === input.UserInputType) return true;
        return false;
    }
    getAllActiveAbilities() {
        let t: {module: ability_core, equipped: boolean}[] = [];
        for (const [i, v] of pairs(this.Abilities)) {
            if (v.module.active) {
                t.push(v);
            }
        }
        return t;
    }
    cameras: clientCamera.camera[] = [];
    onCamera: boolean = false;
    selectedCamera: number = 0;

    constructor() {
        super();
        clientService.createCamera.connect((cameraid, config) => {
            let cam = new clientCamera.camera(cameraid, config);
            this.cameras.push(cam);
        })
        matchService.playerPicksUpBomb.connect((playerName) => {
            if (this.client.Name === playerName) {
                this.iHaveBomb = true;
            }
        })
        RunService.BindToRenderStep('cameraLock', Enum.RenderPriority.Camera.Value + 200, (dt) => {
            let [rx, ry, rz] = this.camera.CFrame.ToOrientation();
            if (this.rappelling && this.rappelWall) {
                ry = math.clamp(math.deg(ry), -110, 110);
            }
            else {
                ry = math.deg(ry);
            }
            if (this.stance === -1) {
                rx = math.clamp(math.deg(rx), -60, 90);
            }
            else {
                rx = math.deg(rx);
            }
            this.camera.CFrame = new CFrame(this.camera.CFrame.Position).mul(
                CFrame.fromOrientation(math.rad(rx), math.rad(ry), rz)
            )
        })
        matchService.playerDropsBomb.connect(() => {
            this.iHaveBomb = false;
        })
        this.replicationService.remotes.act.OnClientEvent.Connect((action: action, ...args: unknown[]) => {
            replication.handleReplicate(action, ...args);
        })
        let gameplayrender = RunService.RenderStepped.Connect((dt) => {
            this.update(dt);
        })
        let inputhandler = UserInputService.InputBegan.Connect((input, gp) => {
            if (gp) return;
            if (this.keyIs(input, 'primary')) {
                this.equip('primary');
            }
            if (this.keyIs(input, 'secondary')) {
                this.equip('secondary');
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
            if (this.keyIs(input, 'dropBomb')) {
                if (this.teamRole === teamRoles.attack) {
                    this.dropBomb();
                }
            }
            if (this.keyIs(input, 'plant/defuse')) {
                if (this.teamRole === teamRoles.attack) {
                    this.initiatePlant();
                }
                else {
                    this.initiateDefuse();
                }
            }
            if (this.keyIs(input, 'rappel')) {
                this.attemptRappel();
            }
            if (this.keyIs(input, 'primaryAbility')) {
                this.Abilities.primaryAbility.module.trigger();
            }
            if (this.keyIs(input, 'secondaryAbility')) {
                print('abouta trigger');
                this.Abilities.secondaryAbility.module.trigger();
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
    unequip(noPass: boolean = false) {
        this.getAllActiveAbilities().forEach((v) => {
            if (v.module.cancelOnGunChange && v.module.active) {
                v.module.cancel();
            }
        })
        let equipped = this.getEquipped();
        if (equipped) {
            equipped.module.cancelReload();
            equipped.module.unequip();
            equipped.module.toggleInspect(false);
            equipped.equipped = false;
        }
        if (noPass) {
            this.replicationService.remotes.equipItem.FireServer(undefined);
        }
    }
    toggleLean(t: 1 | 0 | -1) {
        if (this.reloading) return;
        if (this.sprinting) return;
        let forceReturn = false;
        this.getAllActiveAbilities().forEach((v) => {
            if (v.module.obscuresActions || !v.module.canLeanWhileActive) {
                forceReturn = true;
            }
        })
        if (forceReturn) return;
        let equipped = this.getEquipped();
        if (!equipped || (!equipped.module.canLean && t !== 0)) return;
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
        this.replicationService.remotes.act.FireServer('toggleLean', this.leandirection);
    }
    dropBomb() {
        //check if they have the bomb;
        this.replicationService.remotes.performAction.FireServer('dropBomb');
    }
    initiateDefuse() {
        if (!minerva.isBombPlanted) return;
        let p = Workspace.GetPartBoundsInBox(this.character.GetPrimaryPartCFrame(), 
            new Vector3(minerva.defuseRange, minerva.defuseRange, minerva.defuseRange));
        let bombFound: boolean = false;
        p.forEach((v) => {
            if (v.Name === minerva.bombName) {
                bombFound = true;
            }
        })
        if (bombFound) {
            this.replicationService.remotes.performAction.FireServer('startBombDefuse');
            this.defusingBomb = true;
            let r = RunService.RenderStepped.Connect((dt) => {
                let isDown = false;
                if (this.isKeyCode(this.keybinds["plant/defuse"])) {
                    if (UserInputService.IsKeyDown(this.keybinds["plant/defuse"] as Enum.KeyCode)) {
                        isDown = true;
                    }
                }
                else {
                    if (UserInputService.IsMouseButtonPressed(this.keybinds["plant/defuse"] as Enum.UserInputType)) {
                        isDown = true;
                    }
                }
                if (isDown) {
                    this.bombPlantingTime = math.clamp(this.bombDefusingTime + 1 * dt, 0, minerva.bombDefuseTime);
                    if (this.bombDefusingTime >= minerva.bombDefuseTime) {
                        this.replicationService.remotes.performAction.FireServer('finishBombDefuse');
                        r.Disconnect();
                        this.defusingBomb = false;
                        this.bombDefusingTime = 0;
                    }
                }
                else {
                    r.Disconnect();
                    this.replicationService.remotes.performAction.FireServer('cancelBombDefuse');
                    this.defusingBomb = false;
                    this.bombDefusingTime = 0;
                }
            })
        }
    }
    initiatePlant() {
        if (minerva.isBombPlanted) return;
        let p = Workspace.GetPartBoundsInBox(this.character.GetPrimaryPartCFrame(), new Vector3(.1, .1, .1));
        let foundSite: string | undefined = undefined;
        p.forEach((v) => {
            let f = v.Name.find('bombSite');
            if (f[0]) {
                print(v.Name, '$<found>');
                foundSite = v.Name;
            }
        })//not working??
        if (!foundSite) return;
        this.equip('bomb');
        this.replicationService.remotes.performAction.FireServer('startBombPlant', foundSite);
        this.toggleStance(0, true);
        this.plantingBomb = true;
        let r = RunService.RenderStepped.Connect((dt) => {
            let isDown = false;
            if (this.isKeyCode(this.keybinds["plant/defuse"])) {
                if (UserInputService.IsKeyDown(this.keybinds["plant/defuse"] as Enum.KeyCode)) {
                    isDown = true;
                }
            }
            else {
                if (UserInputService.IsMouseButtonPressed(this.keybinds["plant/defuse"] as Enum.UserInputType)) {
                    isDown = true;
                }
            }
            if (isDown) {
                this.bombPlantingTime = math.clamp(this.bombPlantingTime + 1 * dt, 0, minerva.bombPlantTime);
                if (this.bombPlantingTime >= minerva.bombPlantTime) {
                    this.replicationService.remotes.performAction.FireServer('finishBombPlant');
                    r.Disconnect();
                    this.plantingBomb = false;
                    this.bombPlantingTime = 0;
                    this.equip('primary');
                }
            }
            else {
                r.Disconnect();
                this.replicationService.remotes.performAction.FireServer('cancelBombPlant');
                this.plantingBomb = false;
                this.bombPlantingTime = 0;
                this.equip('primary');
            }
        })
    }
    toggleSprint(t: boolean) {
        if (this.rappelling) return;
        if (this.reloading) return;
        let forceReturn = false;
        this.getAllActiveAbilities().forEach((v) => {
            if (v.module.obscuresActions || !v.module.canSprintWhileActive) {
                forceReturn = true;
            }
        })
        if (forceReturn) return;
        let equipped = this.getEquipped();
        if (!equipped || !equipped.module.canSprint) return;

        this.wantsToSprint = t;
        if (t) {
            equipped.module.toggleInspect(false);
            this.toggleStance(1);
            this.toggleSneak(false);
            this.toggleLean(0);
        }
        else {
            
        }
    }
    toggleSneak(t: boolean) {
        if (this.sprinting) return;
        if (this.stance !== 1) return;
        this.sneaking = t;
    }
    toggleStance(t: 1 | 0 | -1, force?: true) {
        if (this.rappelling) return;
        if (this.pronePlaying) return;
        if (this.sprinting) return;
        if (this.plantingBomb || this.defusingBomb) return;
        this.toggleSneak(false);
        let info1 = new TweenInfo(.35);
        let info2 = new TweenInfo(.6);
        let info = this.stance === -1 || t === -1? info2: info1
        if (t === this.stance && t === 0 && !force) {
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
        let forceReturn = false;
        this.getAllActiveAbilities().forEach((v) => {
            if (v.module.obscuresActions || !v.module.canAimWhileActive) {
                forceReturn = true;
            }
        })
        if (forceReturn) return;
        equipped.module.toggleInspect(false);
        let ti = new TweenInfo(.5, Enum.EasingStyle.Quart, Enum.EasingDirection.Out);
        if (t) {
            if (this.reloading) return;
            if (this.sprinting) {
                this.toAim = true;
                let s = RunService.RenderStepped.Connect(() => {
                    if (!this.sprinting) {s.Disconnect(); this.toAim = false;};
                    this.crosshair.toggleVisible(true, .5);
                    TweenService.Create(this.offsets.aimPercent, ti, {Value: 1}).Play();
                    TweenService.Create(this.offsets.zoomFovMultiplier, ti, {Value: 1}).Play();
                    TweenService.Create(this.offsets.aimSensitivityMultiplier, ti, {Value: 1}).Play();
                    this.aiming = true;
                })
            }
            else {
                this.aiming = true;
                this.crosshair.toggleVisible(true, .5);
                TweenService.Create(this.offsets.aimPercent, ti, {Value: 1}).Play();
                TweenService.Create(this.offsets.zoomFovMultiplier, ti, {Value: 1}).Play();  
                TweenService.Create(this.offsets.aimSensitivityMultiplier, ti, {Value: 1}).Play();
            }
        }
        else {
            this.toAim = false;
            this.aiming = false;
            this.crosshair.toggleVisible(false, .5);
            TweenService.Create(this.offsets.aimPercent, ti, {Value: 0}).Play();
            TweenService.Create(this.offsets.zoomFovMultiplier, ti, {Value: 0}).Play();
            TweenService.Create(this.offsets.aimSensitivityMultiplier, ti, {Value: 0}).Play();
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
        let forceReturn = false;
        this.getAllActiveAbilities().forEach((v) => {
            if (v.module.obscuresActions || !v.module.canReloadWhileActive) {
                forceReturn = true;
            }
        })
        if (forceReturn) return;
        this.toggleSprint(false);
        this.toggleAim(false);
        this.toggleLean(0);
        let eq = this.getEquipped();
        if (!eq) return;
        if (eq.module.isAGun) {
            eq.module.toggleInspect(false);
            (eq.module as weaponCore).reload();
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
            if (passAim) {
                this.toggleAim(true);
            }
        }
    }
    attemptRappel() {
        if (this.rappelling) return;
        let forceReturn = false;
        this.getAllActiveAbilities().forEach((v) => {
            if (v.module.obscuresActions || !v.module.canRappelWhileActive) {
                forceReturn = true;
            }
        })
        if (forceReturn) return;
        let eq = this.getEquipped();
        if (!eq) return;
        eq.module.toggleInspect(false);
        
        let p = Workspace.GetPartsInPart(this.character.FindFirstChild('HumanoidRootPart') as BasePart);
        let selected: BasePart | undefined = undefined;
        p.forEach(v => {
            if (worldData.rappelGates[v.Name as keyof typeof worldData.rappelGates]) {
                selected = v as BasePart;
            }
        })
        if (selected) {
            this.rappelWall = selected as BasePart;
            this.enteringRappel = true;

            let rappelExiting = false;
            let started = tick();

            let p1 = new Instance("Part");
            p1.Size = new Vector3();
            p1.Anchored = true;
            p1.Transparency = 1;
            p1.CanCollide = false;
            p1.Parent = Workspace.FindFirstChild('ignore');

            let a1 = new Instance('Attachment');
            a1.Parent = p1;

            let a2 = new Instance('Attachment');
            a2.Parent = p1;

            let rope = new Instance("RopeConstraint");
            rope.Length = 0;
            rope.Visible = true;
            rope.Attachment0 = a1;
            rope.Attachment1 = a2;
            rope.Parent = Workspace.FindFirstChild('ignore');

            //let v = mathf.bezierQuadraticV3(t, p, mid, endgoal)
            
            let origin = this.character.GetPrimaryPartCFrame().sub(new Vector3(0, (this.character.PrimaryPart as BasePart).Size.Y / 2, 0));
            let originPosition = origin.Position
            let target = this.rappelWall.FindFirstChild('exit') as Part;
            let targetPosition = mathf.closestPointOnPart(target, originPosition);
            let mid = mathf.lerpV3(originPosition, targetPosition, .95).add(new Vector3(0, 10, 0));

            let t = 0;
            let c = RunService.RenderStepped.Connect((dt) => {
                t += 1 * dt;
                a1.WorldPosition = originPosition;
                a2.WorldPosition = mathf.bezierQuadraticV3(t, originPosition, mid, targetPosition);
                this.replicationService.remotes.act.FireServer('updateRappelRope', a2.WorldPosition);
                if (t > 1) {
                    c.Disconnect();
                    this.enteringRappel = false;
                }
            })

            task.wait(1);
            this.rappelling = true;
            this.replicationService.remotes.act.FireServer('toggleRappelling', true);
            
            let conn = RunService.RenderStepped.Connect(() => {
                if (!this.rappelling || !this.rappelWall) {
                    conn.Disconnect(); return;
                }
                let cf = this.character.GetPrimaryPartCFrame()
                let targetPosition = mathf.closestPointOnPart(target, cf.Position);
                a1.WorldPosition = cf.Position.sub(new Vector3(0, (this.character.PrimaryPart as BasePart).Size.Y / 2, 0));;
                a2.WorldPosition = targetPosition;
                this.replicationService.remotes.act.FireServer('updateRappelRope', a2.WorldPosition);
                if (UserInputService.IsKeyDown(this.keybinds.rappel as Enum.KeyCode || Enum.UserInputType) && !rappelExiting) {
                    if (tick() - started < 1) return;
                    let dropLenience = 4;
                    let human = this.character.FindFirstChild('HumanoidRootPart') as BasePart;
                    let requiredY = this.rappelWall.Position.Y + this.rappelWall.Size.Y / 2;
                    let dequiredY = this.rappelWall.Position.Y - this.rappelWall.Size.Y / 2 + dropLenience;
                    let humanY = (human).Position.Y;
                    function cpop(part: Part, point: Vector3) {// closest point on part
                        let t = part.CFrame.PointToObjectSpace(point);
                        let hs = part.Size.div(2);

                        return part.CFrame.mul(new Vector3(
                            math.clamp(t.X, -hs.X, hs.X),
                            math.clamp(t.Y, -hs.Y, hs.Y),
                            math.clamp(t.Z, -hs.Z, hs.Z),
                        ))
                    }
                    let origin = this.character.GetPrimaryPartCFrame();
                    let searchSize = new Vector3(.1, .1, 10)
                    let searchBox = Workspace.GetPartBoundsInBox(origin, searchSize);
                    let _target: Part | undefined = undefined;
                    searchBox.forEach((v) => {
                        if (v.Name === 'window') {
                            _target = v as Part;
                        }
                    })
                    if (_target) {
                        let target = _target as Part;
                        let endPosition = target.Position.add(target.CFrame.LookVector.mul(5));

                        let mid = target.Position.sub(new Vector3(0, target.Size.Y / 2));

                        let firstP = target.Position.sub(target.CFrame.LookVector.mul(8));

                        this.exitingRappel = true;
                        rappelExiting = true;
                        mathf.plotInWorld(origin.Position, Color3.fromRGB(255, 250, 0))
                        mathf.plotInWorld(origin.Position, new Color3(1, 0, 0))
                        mathf.plotInWorld(mid, Color3.fromRGB(61, 255, 0))
                        mathf.plotInWorld(endPosition, Color3.fromRGB(173, 0, 255))

                        let ctal: Map<BasePart, boolean> = new Map();
                        this.character.GetChildren().forEach((v) => {
                            if (!v.IsA("BasePart")) return;
                            ctal.set(v, v.CanCollide);
                            v.CanCollide = false;
                        })

                        this.rappelling = false;

                        let t = 0;
                        let t01 = 0;
                        let firstdone = false;
                        let setFirst = false;

                        //test again
                        //teleporting back to original origin
                        let c = RunService.RenderStepped.Connect((dt) => {
                            if (t01 >= 1) {
                                t += 1 / 1.25 * dt;
                                if (!firstdone && !setFirst) {
                                    firstdone = true;
                                    setFirst = true;
                                }
                            }
                            else {
                                t01 += 1.3 * dt;
                            }
                            if (t >= 1) {c.Disconnect();
                                ctal.forEach((v, i) => {
                                    i.CanCollide = v;
                                })
                                this.exitingRappel = false;
                                rope.Destroy();
                                p1.Destroy();
                                this.replicationService.remotes.act.FireServer('toggleRappelling', false);
                                return;
                            }
                            if (firstdone) {
                                firstdone = false;
                                //let bezier01 = mathf.lerpV3(origin.Position, firstP, t01)
                                //origin = CFrame.lookAt(bezier01, target.Position.add(target.CFrame.LookVector.mul(20)));
                                //this.character.SetPrimaryPartCFrame(origin);
                            }
                            if (t01 >= 0) {
                                let cald = interpolations.interpolate(t, 0, 1, 'quadIn')
                                let cald2 = interpolations.interpolate(t, 0, 1, 'quadOut')
                                let bezier01 = mathf.lerpV3(origin.Position, firstP, math.clamp(cald2, 0, 1));
                                let bezier = mathf.bezierQuadraticV3(cald, bezier01, mid, endPosition);
                                mathf.plotInWorld(bezier)
                                this.character.SetPrimaryPartCFrame(CFrame.lookAt(bezier, target.Position.add(target.CFrame.LookVector.mul(20))));
                            }
                            else {
                                if (setFirst) return;
                                let cald = interpolations.interpolate(t01, 0, 1, 'quadOut')
                                let bezier01 = mathf.lerpV3(origin.Position, firstP, cald)
                                mathf.plotInWorld(bezier01, Color3.fromRGB(125, 150, 0))
                                this.character.SetPrimaryPartCFrame(CFrame.lookAt(bezier01, target.Position.add(target.CFrame.LookVector.mul(20))));
                            }
                        })
                    }
                    else if (humanY >= requiredY) {
                        rappelExiting = true;
                        this.exitingRappel = true;

                        let target = this.rappelWall.FindFirstChild('exit') as Part;
                        let p = this.character.GetPrimaryPartCFrame().Position;

                        let closest = cpop(target, p);
                        let direction = CFrame.lookAt(p, closest).LookVector;
                        let endgoal = p.add(new Vector3(direction.X * 5, math.abs(closest.Y - p.Y) + 7, direction.Z * 5));
                        
                        let t = 0;

                        let mid = mathf.lerpV3(p, endgoal, .25).add(new Vector3(0, 5, 0));
                        let tz = [p, mid, endgoal];
                        tz.forEach((v, i) => {
                            let zz1 = Workspace.FindFirstChild('zz')?.Clone() as Part;
                            zz1.Parent = Workspace.FindFirstChild('ignore');
                            zz1.Position = v;
                            zz1.Color = new Color3(1, 0, 0)
                            zz1.Name = tostring(`v${i + 1}`);
                        })

                        let ctal: Map<BasePart, boolean> = new Map();
                        this.character.GetChildren().forEach((v) => {
                            if (!v.IsA("BasePart")) return;
                            ctal.set(v, v.CanCollide);
                            v.CanCollide = false;
                        })

                        this.rappelling = false;

                        let c = RunService.RenderStepped.Connect((dt) => {
                            t += 1 * dt;
                            
                            let v = mathf.bezierQuadraticV3(t, p, mid, endgoal)
                            
                            let [rx, ry, rz] = this.character.GetPrimaryPartCFrame().ToOrientation()
                            this.character.SetPrimaryPartCFrame(new CFrame(v).mul(CFrame.Angles(rx, ry, rz)))
                            if (t > 1) {
                                c.Disconnect();
                                ctal.forEach((value, key) =>{
                                    key.CanCollide = value;
                                })
                                this.exitingRappel = false;
                                rope.Destroy();
                                p1.Destroy();
                                this.replicationService.remotes.act.FireServer('toggleRappelling', false);
                            }
                        })
                    }
                    else if (humanY <= dequiredY) {
                        rappelExiting = true;
                        this.exitingRappel = true;

                        let p = this.character.GetPrimaryPartCFrame().Position;

                        let ignore = new RaycastParams();
                        ignore.FilterDescendantsInstances = [
                            this.camera,
                            this.character,
                            Workspace.FindFirstChild('ignore') as Folder,
                            this.rappelWall as BasePart,
                        ];

                        let result = Workspace.Raycast(p, new Vector3(0, -15, 0), ignore);

                        this.rappelling = false;

                        if (result) {
                            let pos = result.Position;
                            let diff = new Vector3(0, math.abs(pos.Y - p.Y), 0);
                            let ofinz = this.rappelWall.CFrame.LookVector.mul(-1).mul(2)
                            let target = pos.add(diff).add(ofinz);
                            let t = 0;
                            let c = RunService.RenderStepped.Connect((dt) => {
                                t += 1 * dt;
                                let [rx, ry, rz] = this.character.GetPrimaryPartCFrame().ToOrientation()
                                let v = mathf.lerpV3(p, target, t);
                                this.character.SetPrimaryPartCFrame(new CFrame(v).mul(CFrame.Angles(rx, ry, rz)))
                                
                                if (t > 1) {
                                    c.Disconnect();
                                    this.exitingRappel = false;
                                    rope.Destroy();
                                    p1.Destroy();
                                    this.replicationService.remotes.act.FireServer('toggleRappelling', false);
                                }
                            })
                        }
                    }
                }
            })
        }
        else {
            print('no result')
        }
    }
    attemptVault() {
        let forceReturn = false;
        this.getAllActiveAbilities().forEach((v) => {
            if (v.module.obscuresActions || !v.module.canVaultWhileActive) {
                forceReturn = true;
            }
        })
        if (forceReturn) return;
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
                const origin = this.character.GetPrimaryPartCFrame();
                const targetPosition = craft1.add(normal.mul(-1).mul(5)).add(new Vector3(0, hit.Position.Y + (hit.Size.Y / 2), 0));
                const targetCFrame = CFrame.lookAt(targetPosition, normal.mul(-1).mul(999));

                let mid = mathf.lerpV3(origin.Position, targetPosition, .5).add(new Vector3(0, 2, 0));

                let ctal: Map<BasePart, boolean> = new Map();
                this.character.GetChildren().forEach((v) => {
                    if (!v.IsA("BasePart")) return;
                    ctal.set(v, v.CanCollide);
                    v.CanCollide = false;
                })

                let t = 0;

                let closest = mathf.closestPointOnPart(hit, origin.Position).add(this.camera.CFrame.RightVector.mul(-1));
                let equipped = this.getEquipped();
                if (equipped) {
                    mathf.plotInWorld(closest, new Color3(1, 1, 0))
                    arms.smoothArmLookAt(this.camera, equipped.module.viewmodel, 'left', closest);
                }
                
                this.vaulting = true;
                let c = RunService.RenderStepped.Connect((dt) => {
                    t += 2 * dt;
                    if (t >= 1) {
                        c.Disconnect();
                        this.vaulting = false;
                        ctal.forEach((v, i) => {
                            i.CanCollide = v;
                        })
                        return;
                    }
                    let l = interpolations.interpolate(t, 0, 1, "quadInOut");
                    let bez = mathf.bezierQuadraticV3(l, origin.Position, mid, targetPosition);
                    this.character.SetPrimaryPartCFrame(CFrame.lookAt(bez, targetCFrame.Position.add(targetCFrame.LookVector)));
                });
            }
        }
        else {
            print("can't vault")
        }
    }
    inspect() {
        let forceReturn = false;
        this.getAllActiveAbilities().forEach((v) => {
            if (v.module.obscuresActions || !v.module.canInspectWhileActive) {
                forceReturn = true;
            }
        })
        if (forceReturn) return;
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
            let nrm = mathf.normalize(0, 1, dst - 1.2); //magic number :/
            return nrm;
        }
        else {
            return 1;
        }
    }
    update(dt: number) {
        let equipped = this.getEquipped();
        
        let rootpart = this.character.FindFirstChild("HumanoidRootPart") as BasePart;
        replication.replicate(this, 'setCamera', rootpart.CFrame.ToObjectSpace(this.camera.CFrame).LookVector);
        if (this.onCamera) {
            let index = this.selectedCamera;
            if (index >= this.cameras.size()) index = 0;

            this.cameras.forEach((v, i) => {
                if (i === index) {
                    v.joinCamera();
                }
                else {
                    v.leaveCamera();
                }
            })
        }
        else if (equipped && equipped.module.viewmodel) {
            
            let vm: fps_framework_types.viewmodel = equipped.module.viewmodel;
            let env = equipped.module;
            let cf = vm.offsets.idle.Value;

            cf = cf.Lerp(vm.offsets.idle.Value, 1); //sprint
            cf = cf.Lerp(new CFrame(0, 0, -.2), this.offsets.aimPercent.Value); //aim

            let moveDirection = this.uisController.getCurrentMovementVector(this.humanoid);

            let cmTiltMOD = equipped.module.inverseMovementTilt? -1: 1;

            moveDirection = moveDirection.mul(cmTiltMOD);
            this.offsets.movementTilt = this.offsets.movementTilt.Lerp(
                CFrame.Angles(0, 0,
                    moveDirection.X === 1 || moveDirection.X === -1? (0 - moveDirection.X) * .15: .05) //going straight forwards still bugging out
            , .1)

            let currentMovementState: datatypes.movementState = datatypes.movementState.idle;

            let md = this.humanoid.MoveDirection;
            if (md.X !== 0 || md.Z !== 0) {
                if (this.sprinting) {
                    currentMovementState = datatypes.movementState.sprinting
                }
                else {
                   currentMovementState = datatypes.movementState.walking 
                }
            }
            else if (md.Y !== 0) {
                currentMovementState = datatypes.movementState.falling
            }
            this.replicationService.remotes.act.FireServer('updateMovementState', currentMovementState)

            const oscMVMT = this.cameraService.bobLemnBern(
                this.rappelling? 3 : this.humanoid.WalkSpeed / 3 * env.bobSpeedModifier,
                this.rappelling? .15: this.humanoid.WalkSpeed / 50 * env.bobIntensityModifier);
            
            this.offsets.movementOscillation = this.offsets.movementOscillation.Lerp(
                moveDirection.Magnitude === 0? new CFrame(): 
                new CFrame(new Vector3(oscMVMT[1], oscMVMT[0], 0).mul(this.aiming? 0.1: 1)),
                .1
            )
            
            this.offsets.cameraMovementTilt = this.offsets.cameraMovementTilt.Lerp(
                this.aiming? new CFrame():
                new CFrame(0, math.sin(tick()) * .01, math.sin(tick()) * .01).mul(
                    new CFrame(moveDirection.X * .04, 0, moveDirection.Z * .04))
            , .1);

            let recoil = this.springs.recoil.update(dt);
            
            let l1 = new Vector3().Lerp(this.offsets.cameraLean.Value.Position, this.NRMLDistanceFromWall());
            let l = new CFrame(l1).mul(CFrame.Angles(...mathf.degToRad(this.offsets.cameraLean.Value.ToOrientation())));

            let recoilvmVector = this.springs.viewModelRecoil.update(dt);
            
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

                mvDT = mvDT.mul(.5); //just making it slower
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
            else if (this.exitingRappel) {
                rootpart.Anchored = true;
            }
            else {
                rootpart.Anchored = false;
            }

            if (this.vaulting) {
                rootpart.Anchored = true;
            }
            else if (!this.rappelling && !this.exitingRappel && !this.enteringRappel) {
                rootpart.Anchored = false;
            }

            let [rx, ry, rz] = this.camera.CFrame.ToOrientation();
            //setting things to cam causes lag;
            vm.SetPrimaryPartCFrame(new CFrame(this.camera.CFrame.Position)
                .mul(env.vmOffset.Value)
                .mul(this.offsets.stance.Value)
                .mul(CFrame.fromOrientation(rx, ry, rz))
                .mul(cf)
                .mul(new CFrame(recoilvmVector))
                .mul(l)
                //.mul(this.offsets.aimOscillation)
                .mul(this.offsets.movementTilt)
                .mul(this.offsets.movementOscillation)
                .mul(this.offsets.gunLean.Value)
                .mul(this.offsets.cameraMovementTilt)
            );

            UserInputService.MouseIconEnabled = false;
            
            this.camera.CFrame = new CFrame(this.camera.CFrame.Position)
                .mul(this.offsets.stance.Value)
                .mul(CFrame.fromOrientation(rx, ry, rz))
                .mul(l)
                .mul(CFrame.Angles(math.rad(recoil.Y), math.rad(recoil.X), 0))
                .mul(this.offsets.movementOscillation)
            
            let mod1 = this.pronePlaying? 0: 1;
            let mod2 = this.stance === 0? .5: 1;
            let mod3 = this.stance === -1? .2: 1;
            let mod4 = this.sneaking? .4: 1;
            let mod5 = this.sprinting? 1.45: 1;
            let mod6 = this.rappelling? 0: 1;
            let mod7 = this.aiming? .85: 1;
            let mod8 = this.plantingBomb? 0: 1;
            let mod9 = this.exitingRappel? 0: 1;
            let mod10 = this.enteringRappel? 0: 1;
            
            this.sprinting = (this.wantsToSprint) //check if they're moving forward

            this.humanoid.WalkSpeed = this.speed * mod1 * mod2 * mod3 * mod4 * mod5 * mod6 * mod7 * mod8
                * mod9 * mod10
                * equipped.module.weightMultiplier;
            
            let zoom = equipped.module.sight?.zoom || 1;

            UserInputService.MouseDeltaSensitivity = mathf.lerp(localConfig.sensitivity, localConfig.aimSensitivity, this.offsets.aimSensitivityMultiplier.Value);
            
            this.camera.FieldOfView = mathf.lerp(localConfig.fov, localConfig.fov / zoom, this.offsets.zoomFovMultiplier.Value);
            
            equipped.module.update();
        }
        replication.replicate(this, 'setCFrame', this.character.GetPrimaryPartCFrame());

        this.humanoid.JumpPower = 0;
        this.humanoid.UseJumpPower = true;
    }
}