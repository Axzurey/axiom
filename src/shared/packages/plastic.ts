import { RunService, UserInputService } from '@rbxts/services';
import System from 'shared/modules/System'

function __createDefaultParticle2D() {
    const frame = new Instance("Frame");
    frame.Name = "particle";
    frame.AnchorPoint = new Vector2(.5, .5);
    const imagelabel = new Instance("ImageLabel");
    imagelabel.Name = "imagelabel";
    imagelabel.Parent = frame;
    imagelabel.Size = UDim2.fromScale(1, 1);
    const round = new Instance("UICorner");
    round.Name = "corner";
    round.Parent = frame;
    const imageround = new Instance("UICorner");
    imageround.Name = "corner";
    imageround.Parent = imagelabel;
    return frame;
}
const _particle2DModel = __createDefaultParticle2D();

function edgesFromObject(object: GuiObject) {
    const [position, size, rotation] = [object.AbsolutePosition, object.AbsoluteSize, object.Rotation];
    const [midx, midy] = [position.X + (size.X / 2), position.Y + (size.Y / 2)];
    
    const corners = [
        [midx + (size.X / 2), midy + (size.Y / 2)],
        [midx - (size.X / 2), midy + (size.Y / 2)], 
        [midx - (size.X / 2), midy - (size.Y / 2)],
        [midx + (size.X / 2), midy - (size.Y / 2)],
    ];

    let points: Vector2[] = [];
    
    function calculate(cornerx: number, cornery: number) {
        const [orx, ory] = [cornerx - midx, cornery - midy];
        const rx = (orx * math.cos(math.rad(rotation))) - (ory * math.sin(math.rad(rotation)));
        const ry = (orx * math.sin(math.rad(rotation))) + (ory * math.cos(math.rad(rotation)));

        const [p1, p2] = [rx + midx, ry + midy];
        return [p1, p2]
    }

    corners.forEach((l) => {
        let [p1, p2] = calculate(l[0], l[1]);
        points.push(new Vector2(p1, p2));
    })
    return points;
}

namespace plastic {
    export class raycast2dparams {
        instances: GuiObject[] = [];
        constructor() {
            
        }
    }
    class raycast2dresult {
        position: Vector2
        instance: GuiObject;
        constructor(vector: Vector2, instance: GuiObject) {
            this.position = vector;
            this.instance = instance;
        }
    }
    
    export function raycast2d(origin: Vector2, destination: Vector2, params: raycast2dparams, back: GuiObject) {
        let closest = math.huge;
        let closestpoint = new Vector2();
        let closestinstance: GuiObject | undefined;
        params.instances.forEach((object) => {
            const points = edgesFromObject(object);
            points.forEach((point, i) => {
                let f = new Instance("Frame");
                f.Position = UDim2.fromOffset(point.X, point.Y);
                f.Size = UDim2.fromOffset(10, 10);
                f.AnchorPoint = new Vector2(.5, .5);
                f.Name = tostring(i);
                f.BackgroundColor3 = Color3.fromRGB(0, 153, 255);
                f.Parent = back;
                let n = points[i + 1] || points[0];
                let [x1, y1] = [point.X, point.Y];
                let [x2, y2] = [n.X, n.Y];
                let [x3, y3] = [origin.X, origin.Y];
                let [x4, y4] = [destination.X, destination.Y];
                let x = System.mathf.getConvergence(x1, x2, y1, y2, x3, x4, y3, y4);
                if (x) {
                    let [u, t] = [x[0], x[1]];
                    if (t && u && t > 0 && t < 1 && u > 0) {
                        let point = new Vector2(x1 + t * (x2 - x1), y1 + t * (y2 - y1));
                        let m = origin.sub(point).Magnitude;
                        if (m < closest) {
                            closest = m;
                            closestpoint = point;
                            closestinstance = object;
                        };
                    }
                }
            })
        })
        let f = new Instance("Frame");
        f.Position = UDim2.fromOffset(closestpoint.X, closestpoint.Y);
        f.Size = UDim2.fromOffset(10, 10);
        f.Name = `div`;
        f.AnchorPoint = new Vector2(.5, .5);
        f.BackgroundColor3 = Color3.fromRGB(10, 255, 0);
        f.Parent = back;
        return closestinstance? new raycast2dresult(closestpoint, closestinstance) : undefined;
    }

    export interface particle2DParams {
        gravity: Vector2,
        size: Vector2 | number,
        transparency: number,
        image?: string | undefined,
        origin: Vector2,
        velocity: Vector2,
        amount: number,
        acceleration: Vector2,
        mass: number,
        parent?: GuiObject,
        rounding: number,
        color: Color3,
        borderColor: Color3 | ColorSequence
    }

    const default2dparams: particle2DParams = {
        gravity: new Vector2(),
        size: 30,
        transparency: 0,
        image: undefined,
        origin: new Vector2(500, 500),
        velocity: new Vector2(),
        amount: 1,
        acceleration: new Vector2(),
        mass: 1,
        rounding: 1,
        color: new Color3(1, 0, 0),
        borderColor: new Color3(0, 0, 0),
    }

    export class particle2D {
        private active = true;
        private config: particle2DParams
        private particles: {instance: Frame, alive: boolean, customParams: particle2DParams}[] = [];
        constructor(params: Partial<particle2DParams>) {
            this.config = {...default2dparams, ...params};
            let conn = RunService.Heartbeat.Connect((delta) => {
                if (!this.active) {conn.Disconnect(); return;}
                this.onupdate(delta);
            })
        }
        public createParticles(params: Partial<particle2DParams>) {
            let config = {...this.config, ...params};
            let localparticles: {instance: Frame, alive: boolean, customParams: particle2DParams}[] = []
            for (let i = 0; i < config.amount; i++) {
                let n = {instance: _particle2DModel.Clone(), alive: true, customParams: config};
                localparticles.push(n);
                this.particles.push(n);
                n.instance.Position = UDim2.fromOffset(config.origin.X, config.origin.Y);
                n.instance.AnchorPoint = new Vector2();
                n.instance.Size = typeOf(config.size) === "number"
                    ? 
                    UDim2.fromOffset(config.size as number, config.size as number) : 
                    UDim2.fromOffset((config.size as Vector2).X, (config.size as Vector2).Y);

                //let gforce = n.customParams.gravity.mul(n.customParams.mass)
                //n.customParams.acceleration = n.customParams.acceleration.add(gforce.div(n.customParams.mass));

                n.instance.Parent = config.parent;
            }
            return {
                applyImpulse(force: Vector2) {
                    localparticles.forEach((v) => {
                        v.customParams.acceleration = v.customParams.acceleration.add(force.div(v.customParams.mass));
                    })
                },
                destroyThese() {
                    localparticles.forEach(v => {
                        v.alive = false;
                        v.instance.Destroy();
                    })
                    localparticles.clear();
                }
            }
        }
        cleanUp() {
            this.particles.forEach((v) => {
                v.alive = false;
                v.instance.Destroy();
            })
            this.particles.clear();
        }
        private onupdate(deltaTime: number) {
            this.particles.forEach((v) => {
                if (!v.alive) { if (v.instance) {v.instance.Destroy()}; return;};
                coroutine.wrap(() => {
                    let instance = v.instance;
                    v.customParams.velocity = v.customParams.velocity.add(v.customParams.gravity.div(60).mul(deltaTime * 60));
                    v.customParams.velocity = v.customParams.velocity.add(v.customParams.acceleration);
                    let abs = instance.AbsolutePosition;
                    let ra = abs.add(v.customParams.velocity.mul(deltaTime * 60));
                    instance.Position = UDim2.fromOffset(ra.X, ra.Y);
                    v.customParams.acceleration = v.customParams.acceleration.mul(0);
                    v.instance.BackgroundColor3 = v.customParams.color;
                    const label = v.instance.FindFirstChild('imagelabel') as ImageLabel;
                    label.ImageColor3 = v.customParams.color;
                    label.BackgroundTransparency = 1;
                    instance.Transparency = v.customParams.transparency;
                    (v.instance.FindFirstChild("corner") as UICorner).CornerRadius = new UDim(v.customParams.rounding, 0);
                    ((v.instance.FindFirstChild("imagelabel") as ImageLabel).FindFirstChild("corner") as UICorner).CornerRadius = new UDim(v.customParams.rounding, 0);
                })();
            })
        }
    }
}

export = plastic;