import { PhysicsService, ReplicatedStorage, RunService, TweenService, Workspace } from "@rbxts/services";
import replicatedWeapons from "shared/config/replication/replicatedWeapons";
import animationsMap from "shared/content/mapping/animations";

type characterType = Model & {
    Humanoid: AnimationController & {
        Animator: Animator
    },
    HumanoidRootPart: BasePart
}

let leanCache: NumberValue | undefined = undefined;

export default class characterHitbox {
    character: characterType;
    animations: Record<string, AnimationTrack> = {};
    constructor(character: Model) {
        this.character = character as characterType;

        if (this.character.FindFirstChildOfClass('Humanoid')) {
            this.character.FindFirstChildOfClass('Humanoid')?.Destroy();
        }

        function config(v: Instance) {
            if (v.IsA('BasePart')) {
                v.Transparency = 1;
                v.CanCollide = false;
                v.CanTouch = false;
                v.Color = Color3.fromRGB(0, 255, 255)
                if (v.Name === 'HumanoidRootPart') {
                    v.Transparency = 1;
                }
            }
        }
        let deccon = this.character.DescendantAdded.Connect(config);
        this.character.GetDescendants().forEach(v => {
            config(v)
        })
        
        this.character.HumanoidRootPart.Anchored = true;
        this.character.Parent = Workspace.FindFirstChild('hitboxes');
    }
    setCFrame(cf: CFrame) {
        this.character.SetPrimaryPartCFrame(cf);
    }
    unequip() {
        let character = this.character;
        let weapon = character.FindFirstChild('weapon');
        let handle = character.FindFirstChild('handle');

        let map = this.animations
        if (map) {
            for (const [i, v] of pairs(map)) {
                let f = string.find(i, 'idle');
                if (f[0]) {
                    v.Stop();
                }
            }
        }

        if (weapon) {
            weapon.Destroy();
        }
        if (handle) {
            handle.Destroy();
        }
    }
    equip(weaponName: string, weaponSkin: string) {
        this.unequip()
        let character = this.character;
        let weapon = ReplicatedStorage.FindFirstChild('guns')?.FindFirstChild(weaponName)?.FindFirstChild(`${weaponName}_${weaponSkin}`) as Model;
        if (!weapon) throw `weapon of name ${weaponName} and skin ${weaponSkin} can not be found`;
        weapon = weapon.Clone();

        let handle = new Instance("Motor6D");
        handle.Part0 = character.FindFirstChild('UpperTorso') as BasePart;
        handle.Part1 = weapon.FindFirstChild('aimpart') as BasePart;
        handle.Parent = character;
        weapon.Name = 'weapon';
        weapon.Parent = character;
        
        let initialAnimationIndex = replicatedWeapons[weaponName as keyof typeof replicatedWeapons];
        let secondAnimationIndex = initialAnimationIndex[weaponSkin as keyof typeof initialAnimationIndex];
        let animations = secondAnimationIndex.animations;

        let idle_anim_id = animations.idle;
        let map = this.animations;

        if (!map[`idle:${weaponName}:${weaponSkin}`]) {
            let animator = character.WaitForChild('Humanoid').WaitForChild('Animator') as Animator;

            let ainstance = new Instance("Animation");
            ainstance.Parent = character;
            ainstance.AnimationId = idle_anim_id;

            let anim = animator.LoadAnimation(ainstance);

            ainstance.Destroy();

            this.addAnimations({
                [`idle:${weaponName}:${weaponSkin}`]: anim
            })
            anim.Play();
        }
        else {
            map[`idle:${weaponName}:${weaponSkin}`].Play();
        }
    }
    addAnimations(animations: Record<string, AnimationTrack>) {
        for (const [i, v] of pairs(animations)) {
            this.animations[i] = v;
        }
    }
    changeStance(form: 1 | 0 | -1) {
        
    }
    lean(direction: 1 | 0 | -1) {
        let c = leanCache as NumberValue
        if (!c) {
            c = new Instance("NumberValue");
            leanCache = c
        }
        let t = TweenService.Create(c, new TweenInfo(.25), {Value: direction});
        t.Play();
    }
    headTo(direction: Vector3) {
        let neck = this.character.FindFirstChild('Head')?.FindFirstChild('Neck') as Motor6D;

        let info = leanCache
        
        let y = neck.C0.Y;
        let set = new CFrame(0, y, 0).mul(CFrame.Angles(0, -math.asin(direction.X), 0))
            .mul(CFrame.Angles(math.asin(direction.Y), 0, 0));
        neck.C0 = set;

        let torso = this.character.FindFirstChild('UpperTorso')?.FindFirstChild('Waist') as Motor6D;
        
        let y2 = torso.C0.Y;
        let set2 = new CFrame(0, y2, 0)
        .mul(CFrame.Angles(0, 0, math.rad(-20) * (info? (info as NumberValue).Value: 0)))
        .mul(CFrame.Angles(math.clamp(math.asin(direction.Y),
            math.rad(-45), math.rad(45)
        ), 0, 0));
        torso.C0 = torso.C0.Lerp(set2, .2);
    }
    loadAnimations(animations: Record<string, keyof typeof animationsMap>) {
        let animator = this.character.Humanoid.Animator
        for (const [i, v] of pairs(animations)) {
            let id = animationsMap[v]
            let anim = new Instance('Animation');
            anim.Parent = Workspace
            anim.AnimationId = id
            let track = animator.LoadAnimation(anim);
            this.animations[i] = track
            anim.Destroy()
        }
    }
    playAnimation(animation: string) {
        if (!this.animations[animation]) throw `animation ${animation} could not be found!`
        this.animations[animation].Play();
    }
}