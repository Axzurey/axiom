import { Debris, ReplicatedStorage, RunService, TweenService, Workspace } from "@rbxts/services";
import animationsMap from "./content/mapping/animations";
import bulletHoleMap from "./content/mapping/bulletHoleMap";
import matchService from "./services/matchservice";

namespace minerva {
    export const allowedOverheal: number = 50;

    export const reloadLengths = {
        mpx: 1.28, glock18: 1.4,
    }

    export const bombPlantTime = 5;
    export const bombDefuseTime = 5;
    export const defuseRange = 8;
    export const timeTillDroppedBombCanBePickedUp = .5;
    export const bombName = '@entity.bomb';

    export const serverName = 'Minerva System';

    export let isBombPlanted: boolean = false;

    if (RunService.IsClient()) {
        matchService.playerFinishesPlantingBomb.connect((playername, timeplanted) => {
            isBombPlanted = true;
        })
    }

    export function createSoundAt(position: Vector3, parent: Instance, volume: number, id: string) {
        let p = new Instance('Attachment');
        let s = new Instance("Sound");
        s.Volume = volume;
        s.SoundId = id;
        s.Parent = p;
        p.Parent = parent;
        p.WorldPosition = position;
        s.Play();
        Debris.AddItem(p, 3);
    }

    export function createBulletHole(position: Vector3, normal: Vector3, material: Enum.Material, bulletSize: number = 12, imageColor: Color3 = new Color3(1, 1, 1)) {
        let p = new Instance("Part");
        p.CanCollide = false;
        p.Anchored = true;
        p.CanQuery = false;
        p.CanTouch = false;
        p.Size = new Vector3(1, 1, 0);
        p.Transparency = 1;
        p.CFrame = CFrame.lookAt(position, position.add(normal));
        let scrgui = new Instance('SurfaceGui');
        scrgui.PixelsPerStud = 50;
        scrgui.SizingMode = Enum.SurfaceGuiSizingMode.PixelsPerStud;
        scrgui.Parent = p;
        let img = new Instance('ImageLabel');
        let pull = bulletHoleMap[material.Name as keyof typeof bulletHoleMap] || bulletHoleMap['other'];
        img.Image = pull;
        img.ImageColor3 = imageColor;
        img.Size = UDim2.fromOffset(bulletSize, bulletSize);
        img.AnchorPoint = new Vector2(.5, .5);
        img.Position = UDim2.fromScale(.5, .5);
        img.BackgroundTransparency = 1;
        img.Parent = scrgui;
        p.Parent = Workspace.FindFirstChild('ignore');
        let start = tick();
        let c = RunService.Stepped.Connect((_t, dt) => {
            if (img.ImageTransparency >= 1) {
                c.Disconnect(); p.Destroy(); return;
            }
            if (tick() - start > 10) {
                img.ImageTransparency += 2 * dt;
            }
        })
    }

    export function bombActivationSequence(bomb: Model) {
        let animator = bomb.FindFirstChild('AnimationController')?.FindFirstChild('Animator') as Animator;
        let am = new Instance('Animation');
        am.AnimationId = animationsMap.bomb_activation_sequence;
        am.Parent = ReplicatedStorage;
        let animation = animator.LoadAnimation(am);
        am.Destroy();
        animation.Play();

        let objs = {
            t1: bomb.FindFirstChild('tubing1') as BasePart,
            t2: bomb.FindFirstChild('tubing2') as BasePart,
            t3: bomb.FindFirstChild('tubing3') as BasePart,
            ball: bomb.FindFirstChild('ball') as BasePart,
            ring: bomb.FindFirstChild('ring') as BasePart,
        }

        animation.Stopped.Connect(() => {
            for (const [i, v] of pairs(objs)) {
                v.Transparency = 0;
            }
        })
        coroutine.wrap(() => {
            animation.Stopped.Wait();
            bomb.GetChildren().forEach((v) => {
                if (!v.IsA('BasePart')) return;
                v.Anchored = true;
            })
            let delta = 1;
            let bg = 0;
            let t = 0;
            let c = RunService.Heartbeat.Connect((dt) => {
                delta += 1 * dt;
                t += 1 * dt;
                objs.ball.CFrame = objs.ball.CFrame.mul(CFrame.Angles(math.rad(5 * delta * dt), 0, 0));
                objs.ring.CFrame = objs.ring.CFrame.mul(CFrame.Angles(0, math.rad(5 * delta * 2 * dt), 0));
                bg = math.clamp(bg + (matchService.stateLengths.planted / 12) * dt, 0, 255);
                objs.ball.Color = Color3.fromRGB(255, bg, bg);
                objs.ring.Color = Color3.fromRGB(150, bg, bg);
                if (t >= matchService.stateLengths.planted) {
                    let t1 = new TweenInfo(.25, Enum.EasingStyle.Exponential);
                    let t2 = new TweenInfo(1, Enum.EasingStyle.Exponential);
                    TweenService.Create(objs.ring, t1, {
                        Size: new Vector3(0, 0, 0)
                    }).Play();
                    task.wait(.25);
                    TweenService.Create(objs.ball, t2, {
                        Size: new Vector3(300, 300, 300)
                    }).Play();
                    task.wait(3);
                    TweenService.Create(objs.ball, t2, {
                        Size: new Vector3(0, 0, 0)
                    }).Play();
                    task.wait(1);
                    c.Disconnect();
                }
            })
        })()
    }
}

export = minerva;