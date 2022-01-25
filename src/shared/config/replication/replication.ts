import fps_framework from "shared/modules/fps";
import {ReplicatedStorage, RunService, TweenService, Workspace} from "@rbxts/services";
import replicatedWeapons from "./replicatedWeapons";
import datatypes from "shared/types/datatypes";
import replicatedGeneral from "./replicatedGeneral";
import { mathf } from "shared/modules/System";

namespace replication {

    const stateCache: Map<Model, datatypes.movementState> = new Map();
    const characterCache: Map<Model, Record<string, AnimationTrack>> = new Map();
    const characterLeanCache: Map<Model, {value: NumberValue}> = new Map();
    const rappelInfo: Map<Model, {ropeContainer: Part, update: RBXScriptConnection}> = new Map();

    export type action =
        'toggleReload'| 'setCFrame'| 'toggleAim'| 'toggleStance'| 'toggleRappelling'| 'updateRappelRope' |
        'vault'| 'equip'| 'unequip'| 'togglePlant'| 'toggleDefuse'| 'setCamera' |
        'toggleLean'| 'updateCameraOrientation' | 'joinCamera' | 'leaveCamera' | 'updateMovementState';
    
    export function replicate(t: fps_framework, action: action, ...args: unknown[]) {
        t.replicationService.remotes.act.FireServer(action, ...args);
    }

    function addCharacterTracks(character: Model, tracks: Record<string, AnimationTrack>) {
        let cache = characterCache.get(character);
        if (cache) {
            for (const [i, v] of pairs(tracks)) {
                cache[i] = v;
            }
        }
        else {
            cache = tracks;
        }
        characterCache.set(character, cache);
    }

    function getCharacterTracks(character: Model) {
        return characterCache.get(character) || {};
    }

    function modifyCharacterTracks(character: Model, tracks: Record<string, 0 | 1>) {
        let cache = characterCache.get(character);
        if (!cache) {
            characterCache.set(character, {});
            return;
        }
        for (const [i, v] of pairs(tracks)) {
            if (cache[i]) {
                if (cache[i].IsPlaying && v === 1) continue;
                v === 0? cache[i].Stop(): cache[i].Play();
            }
        }
    }
    
    export const replicationFunctions: Partial<Record<action, (...args: any[]) => void>> = {
        toggleRappelling: (character: Model, t: boolean) => {
            if (t) {/*
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
                rope.Parent = p1;

                let t = 0;
                
                let cx = RunService.RenderStepped.Connect((dt) => {
                    t += 1 * dt;
                    a1.WorldPosition = originPosition;
                    a2.WorldPosition = mathf.bezierQuadraticV3(t, originPosition, mid, targetPosition);
                    if (t > 1) {
                        cx.Disconnect();
                    }
                })

                let c = RunService.RenderStepped.Connect(() => {

                })
                rappelInfo.set(character, {ropeContainer: p1, update: c})*/
            }
            else {
                let l = rappelInfo.get(character);
                if (!l) return;
                l.update.Disconnect();
                l.ropeContainer.Destroy();
            }
        },
        toggleLean: (character: Model, leanDirection: 1 | 0 | -1) => {
            let c = characterLeanCache.get(character);
            if (!c) {
                c = {value: new Instance("NumberValue")};
                characterLeanCache.set(character, c);
            }
            let t = TweenService.Create(c.value, new TweenInfo(.25), {Value: leanDirection});
            t.Play();
        },
        updateMovementState: (character: Model, state: datatypes.movementState) => {
            let cycleId = replicatedGeneral.state_walk_cycle.animation;
            let cycle2Id = replicatedGeneral.state_run_cycle.animation;
            let tracks = getCharacterTracks(character);
            let toModify: Record<string, 0 | 1> = {
                'stateWalkCycle': state === datatypes.movementState.walking? 1: 0,
                'stateRunCycle': state === datatypes.movementState.sprinting? 1: 0,
            };

            if (!tracks['stateWalkCycle']) {
                let animation = new Instance('Animation');
                animation.AnimationId = cycleId;
                animation.Parent = Workspace;

                let animator = character.WaitForChild('Humanoid').WaitForChild('Animator') as Animator;

                let track = animator.LoadAnimation(animation);

                animation.Destroy();
                addCharacterTracks(character, {'stateWalkCycle': track});
            }
            if (!tracks['stateRunCycle']) {
                let animation = new Instance('Animation');
                animation.AnimationId = cycle2Id;
                animation.Parent = Workspace;

                let animator = character.WaitForChild('Humanoid').WaitForChild('Animator') as Animator;

                let track = animator.LoadAnimation(animation);

                animation.Destroy();
                addCharacterTracks(character, {'stateRunCycle': track});
            }
            modifyCharacterTracks(character, toModify);
        },
        equip: (character: Model, weaponName: string, weaponSkin: string) => {
            (replicationFunctions.unequip as (character: Model) => void)(character);

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
            let map = getCharacterTracks(character);

            if (!map[`idle:${weaponName}:${weaponSkin}`]) {
                let animator = character.WaitForChild('Humanoid').WaitForChild('Animator') as Animator;

                let ainstance = new Instance("Animation");
                ainstance.Parent = character;
                ainstance.AnimationId = idle_anim_id;

                let anim = animator.LoadAnimation(ainstance);

                ainstance.Destroy();

                addCharacterTracks(character, {
                    [`idle:${weaponName}:${weaponSkin}`]: anim
                })
                anim.Play();
            }
            else {
                map[`idle:${weaponName}:${weaponSkin}`].Play();
            }

        },
        unequip: (character: Model) => {
            let weapon = character.FindFirstChild('weapon');
            let handle = character.FindFirstChild('handle');

            let map = getCharacterTracks(character);
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
        },
        setCFrame: (character: Model, cframe: CFrame) => {
            character.SetPrimaryPartCFrame(cframe);
        },
        setCamera: (character: Model, v3: Vector3) => {
            let neck = character.FindFirstChild('Head')?.FindFirstChild('Neck') as Motor6D;

            let info = characterLeanCache.get(character);
            
            let y = neck.C0.Y;
            let set = new CFrame(0, y, 0).mul(CFrame.Angles(0, -math.asin(v3.X), 0)).mul(CFrame.Angles(math.asin(v3.Y), 0, 0));
            neck.C0 = set;

            let torso = character.FindFirstChild('UpperTorso')?.FindFirstChild('Waist') as Motor6D;
            
            let y2 = torso.C0.Y;
            let set2 = new CFrame(0, y2, 0)
            .mul(CFrame.Angles(0, 0, math.rad(-10) * (info? (info as {value: NumberValue}).value.Value: 0)))
            .mul(CFrame.Angles(math.clamp(math.asin(v3.Y),
                math.rad(-45), math.rad(45)
            ), 0, 0));
            torso.C0 = torso.C0.Lerp(set2, .1);
        }
    }
    export function handleReplicate(action: action, ...args: unknown[]) {
        let f = replicationFunctions[action as keyof typeof replicationFunctions] as (...args: unknown[]) => void;
        f(...args as Parameters<typeof f>)
    };
}

export = replication;