import { RunService } from "@rbxts/services";
import { mathf } from "./modules/System";

namespace anime {
    export abstract class directions {
        static screenUp() {
            return {
                update: () => {
                    return [0, 1];
                }
            }
        }
        static screenRight() {
            return {
                update: () => {
                    return [1, 0];
                }
            }
        }
        static screenLeft() {
            return {
                update: () => {
                    return [-1, 0];
                }
            }
        }
        static screenDown() {
            return {
                update: () => {
                    return [0, -1];
                }
            }
        }
    }

    type animatableProperties = 'size' | 'positon' | 'color' | 'rotation';
    type animatablePropertyTypes = Vector2 | Color3 | number;

    export enum animationStyle {
        linear, quadratic
    }

    interface animationKeyframe {
        property: animatableProperties,
        value: animatablePropertyTypes,
        time: number,
        style: animationStyle,
    }

    export class animationParams {
        constructor() {}
        keyframes: animationKeyframe[] = [];
    }

    export function animate<T extends GuiObject>(instance: T, animateParams: animationParams) {
        //parse the params, find out what to do each frame and what comes next, v = dt, remember;
        let keyframeGroups: Record<animatableProperties, animationKeyframe[]> = {
            'color': [],
            'size': [],
            'rotation': [],
            'positon': [],
        }
        let longesttime = 0;
        animateParams.keyframes.forEach((v) => {
            keyframeGroups[v.property].push(v);
            if (v.time > longesttime) longesttime = v.time;
        })
        let lstcall = tick();
        let currentTime = 0;
        let currentColor: Color3 = keyframeGroups.color[0].value as Color3;
        let conn = RunService.Stepped.Connect((_time, dt) => {
            currentTime = math.clamp(currentTime + 1 * dt, 0, longesttime);
            if (currentTime === longesttime) {conn.Disconnect()};
            for (const [_i, v] of pairs(keyframeGroups)) {
                if (v.size() === 0) continue;
                let now: animationKeyframe | undefined;
                let nextFrame: animationKeyframe | undefined;
                for (const [i, x] of pairs(v)) {
                    if (x.time === 0) {
                        if (currentTime > v[i].time) {
                            continue;
                        }
                        now = x;
                        nextFrame = v[i];
                        break;
                    }
                    else if (currentTime > x.time) {
                        now = v[i - 1];
                        nextFrame = v[i];
                        break;
                    }
                }
                
                function envelop(t: animatableProperties, ...args: unknown[]) {
                    switch (t) {
                        case 'color':
                            let r = args[0] as number;
                            let g = args[1] as number;
                            let b = args[2] as number;
                            instance.BackgroundColor3 = new Color3(r, g, b);
                            currentColor = new Color3(r, g, b);
                            break;
                        case 'positon':
                            let x = args[0] as number;
                            let y = args[1] as number;
                            instance.Position = UDim2.fromOffset(x, y);
                            break;
                        case 'rotation':
                            let t = args[0] as number;
                            instance.Rotation = t;
                            break;
                        case 'size': 
                            let x1 = args[0] as number;
                            let y1 = args[1] as number;
                            instance.Size = UDim2.fromOffset(x1, y1);
                            break;
                        default:
                            throw `invalid property`;
                            break;
                    }
                }
                if (now && nextFrame) {
                    switch (now.property) {
                        case 'positon':
                            let v2 = now.value as Vector2;
                            let n2 = nextFrame.value as Vector2;
                            let _timeNormal = mathf.normalize(now.time, nextFrame.time, currentTime);
                            let valueX = mathf.lerp(v2.X, n2.X, _timeNormal);
                            let valueY = mathf.lerp(v2.Y, n2.Y, _timeNormal);
                            envelop(now.property, valueX, valueY);
                            break;
                        case 'color':
                            let c3 = now.value as Color3;
                            let n3 = nextFrame.value as Color3;
                            let timeNormal = mathf.normalize(now.time, nextFrame.time, currentTime);
                            let valueR = mathf.lerp(c3.R, n3.R, timeNormal);
                            let valueG = mathf.lerp(c3.G, n3.G, timeNormal);
                            let valueB = mathf.lerp(c3.B, n3.B, timeNormal);
                            envelop(now.property, valueR, valueG, valueB);
                            break;
                        case 'rotation':
                            let nT = now.value as number;
                            let nxT = nextFrame.value as number;
                            let __timeNormal = mathf.normalize(now.time, nextFrame.time, currentTime);
                            let valueT = mathf.lerp(nT, nxT, __timeNormal);
                            envelop(now.property, valueT);
                            break;
                        case 'size':
                            let s1 = now.value as Vector2;
                            let s2 = nextFrame.value as Vector2;
                            let _xtimeNormal = mathf.normalize(now.time, nextFrame.time, currentTime);
                            let valuex = mathf.lerp(s1.X, s2.X, _xtimeNormal);
                            let valuey = mathf.lerp(s1.Y, s2.Y, _xtimeNormal);
                            envelop(now.property, valuex, valuey);
                        default:
                            throw `invalid property`
                            break;
                    }
                }
            }
        })
    }
}

export = anime;