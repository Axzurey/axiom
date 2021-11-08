import { RunService, Workspace } from "@rbxts/services";
import System, { mathf } from "../modules/System";

////// next do some graphing stuff, bar graphs specifically.

//particle base
function __createDefaultParticle() {
    const particleModel = new Instance("Part");
    particleModel.Transparency = 1;
    particleModel.CanCollide = false;
    particleModel.Anchored = true;
    particleModel.CanTouch = false;
    particleModel.CanQuery = false;
    particleModel.Size = new Vector3(0, 0, 0);
    particleModel.CastShadow = false;
    particleModel.Name = "particle";
    particleModel.Shape = Enum.PartType.Ball;
    const a1 = new Instance("Attachment");
    const a2 = new Instance("Attachment");
    a1.Parent = particleModel;
    a2.Parent = particleModel;
    a1.Name = "a1";
    a2.Name = "a2";
    a1.Position = new Vector3(.5, 0, 0);
    a2.Position = new Vector3(-.5, 0, 0);
    const glow = new Instance("PointLight");
    glow.Name = "glow";
    glow.Parent = particleModel;
    glow.Brightness = 2;
    glow.Range = 3;
    const glow2 = new Instance("SpotLight");
    glow2.Name = "spot";
    glow2.Parent = particleModel;
    const trail = new Instance("Trail");
    trail.Name = "trail";
    trail.Attachment0 = a1;
    trail.Attachment1 = a2;
    trail.Lifetime = .2;
    trail.MinLength = .1;
    trail.Parent = particleModel;
    const force = new Instance("BodyForce");
    force.Name = "force";
    force.Parent = particleModel;
    const effect = new Instance("ParticleEmitter");
    effect.Enabled = false;
    effect.Name = "effect";
    effect.Parent = particleModel;
    effect.Rate = 0;
    effect.Drag = math.huge;
    effect.LockedToPart = true;
    effect.Lifetime = new NumberRange(math.huge);
    effect.SpreadAngle = new Vector2(0, 0);
    const fire = new Instance("Fire");
    fire.Enabled = false;
    fire.Name = "fire";
    fire.Parent = particleModel;
    const smoke = new Instance("Smoke");
    smoke.Enabled = false;
    smoke.Name = "smoke";
    smoke.Parent = particleModel;
    return particleModel;
}

const particleModel = __createDefaultParticle();

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
const particle2DModel = __createDefaultParticle2D();

function getParticle() {
    return particleModel.Clone();
}

namespace saturn {
    export interface particleParams {
        amount: number,
        impulseFromLookVector: boolean,
        color: ColorSequence,
        collisions: boolean,
        texture: string,
        spreadAngle: Vector2,
        drag: number,
        transparency: NumberSequence,
        zOffset: number,
        lightEmission: number,
        lightInfluence: number,
        size: number,
        emissiondirection: Enum.ParticleOrientation,
        static: boolean,
        anchored: boolean,
        rate: number,
        origin: CFrame,
        velocity: Vector3,
        impulse?: Vector3 | number,
        fire: boolean,
        fireColor: Color3,
        fireColor2: Color3,
        fireRise: number,
        fireSize: number,
        smoke: boolean,
        smokeColor: Color3,
        smokeOpacity: number,
        smokeRise: number,
        smokeSize: number,
        glow: boolean,
        glowColor: Color3,
        glowRange: number,
        glowCastsShadows: boolean,
        glowBrightness: number,
        glowType: 'targetted' | 'aura',
        glowAngle: number,
        glowDirection: Enum.NormalId,
        trail: boolean,
        trailColor: ColorSequence,
        trailFacesCamera: boolean,
        trailLightEmission: number,
        trailLightInfluence: number,
        trailTexture: string,
        trailTextureLength: number,
        trailTextureMode: Enum.TextureMode,
        trailTransparency: NumberSequence,
        trailLifetime: number,
        trailMaxLength: number,
        trailMinlength: number,
        trailWidthScale: NumberSequence,
    }

    const defaultParams: particleParams = {
        impulseFromLookVector: false,
        amount: 1,
        color: new ColorSequence(Color3.fromRGB(127, 0, 255)),
        collisions: false,
        static: true,
        anchored: false,
        rate: 0,
        origin: new CFrame(0, 10, 0),
        velocity: new Vector3(),
        impulse: undefined,
        fire: false,
        fireColor: new Color3(1, 0, 0),
        fireColor2: Color3.fromRGB(252, 153, 128),
        fireRise: 0,
        fireSize: 1,
        smoke: false,
        smokeColor: new Color3(1, 1, 1),
        smokeOpacity: 1,
        smokeRise: 0,
        smokeSize: .1,
        glow: true,
        glowColor: new Color3(1, 1, 0),
        glowRange: 10,
        glowCastsShadows: true,
        glowBrightness: 2,
        glowType: 'aura',
        glowAngle: 45,
        glowDirection: Enum.NormalId.Front,
        trail: true,
        trailColor: new ColorSequence(new Color3(0, 1, 1)),
        trailFacesCamera: true,
        trailLightEmission: 1,
        trailLightInfluence: 1,
        trailTexture: '',
        trailTextureLength: 1,
        trailTextureMode: Enum.TextureMode.Static,
        trailTransparency: new NumberSequence(.5),
        trailLifetime: 2,
        trailMaxLength: 0,
        trailMinlength: .1,
        trailWidthScale: new NumberSequence(1),
        texture: 'rbxasset://textures/particles/sparkles_main.dds',
        spreadAngle: new Vector2(0, 0),
        transparency: new NumberSequence(0),
        zOffset: 0,
        lightEmission: 1,
        drag: math.huge,
        lightInfluence: 1,
        size: 1,
        emissiondirection: Enum.ParticleOrientation.FacingCamera,
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
                let n = {instance: particle2DModel.Clone(), alive: true, customParams: config};
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

    export class sprite {
        private position: Vector2 = new Vector2();
        private rotation: number = 0;
        private acceleration: Vector2 = new Vector2();
        private velocity: Vector2 = new Vector2();
        constructor() {};
        transformPosition(position: Vector2) {};
        applyImpulse(force: Vector2) {};
        setPosition(position: Vector2) {};
        getPosition(): Vector2 {return new Vector2()};
        update(dt: number) {};
        render() {};
    }

    export function drawSphere(position: Vector3, size: number, additionalProperties?: Map<Partial<keyof WritableInstanceProperties<Part>>, any>) {
        let s = new Instance("Part");
        s.Shape = Enum.PartType.Ball;
        s.Size = new Vector3(size, size, size);
        s.Position = position;
        s.BottomSurface = Enum.SurfaceType.SmoothNoOutlines;
        s.TopSurface = Enum.SurfaceType.SmoothNoOutlines;
        s.RightSurface = Enum.SurfaceType.SmoothNoOutlines;
        s.LeftSurface = Enum.SurfaceType.SmoothNoOutlines;
        s.FrontSurface = Enum.SurfaceType.SmoothNoOutlines;
        s.BackSurface = Enum.SurfaceType.SmoothNoOutlines;
        s.Anchored = true;
        if (additionalProperties) {
            additionalProperties.forEach((value, index) => {
                s[index as never] = value as never;
            })
        }
        return s;
    }

    export class Entity {
        private instance: BasePart;
        private shape: Enum.PartType = Enum.PartType.Block;
        constructor(instancename: keyof BasePart) {
            this.instance = new Instance(instancename as keyof CreatableInstances) as BasePart;
        }
        reshape(shape: 'sphere' | 'block' | 'cylinder') {
            switch (shape) {
                case 'block':
                    this.shape = Enum.PartType.Block;
                    break;
                case 'sphere':
                    this.shape = Enum.PartType.Ball;
                    break;
                case 'cylinder':
                    this.shape = Enum.PartType.Cylinder;
                    break;
                default:
                    break;
            }
        }
        colorBy(color: Color3) {
            let base = this.instance.Color;
            this.instance.Color = new Color3(color.R + base.R, color.G + base.G, color.B + base.B);
            return this;
        }
        colorTo(color: Color3) {
            this.instance.Color = color;
            return this;
        }
        getIntersecting() {
            let parts = Workspace.GetPartsInPart(this.instance);
            return parts;
        }
        setProps(properties: Partial<WritableInstanceProperties<BasePart>>) {
            for (const [index, value] of pairs(properties)) {
                this.instance[index as never] = value as never;
            }
            return this;
        };
        rotateBy(rotation: Vector3 | CFrame) {
            if (typeOf(rotation) === "CFrame") {
                let cf = this.instance.CFrame;
                let p = cf.Position;
                let [rx, ry, rz] = cf.ToOrientation();
                this.instance.CFrame = new CFrame(p).mul(new CFrame(new Vector3(rx, ry, rz))).mul(rotation as CFrame);
            }
            else if (typeOf(rotation) === "Vector3") {
                this.instance.Orientation = this.instance.Orientation.add(rotation as Vector3);
            }
            return this;
        };
        rotateTo(rotation: Vector3 | CFrame) {
            if (typeOf(rotation) === "CFrame") {
                this.instance.CFrame = new CFrame(this.instance.CFrame.Position).mul(rotation as CFrame);
            }
            else if (typeOf(rotation) === "Vector3") {
                this.instance.Orientation = rotation as Vector3;
            }
            return this;
        };
        translateBy(position: Vector3) {
            this.instance.Position = this.instance.Position.add(position);
            return this;
        };
        translateTo(position: Vector3) {
            this.instance.Position = position;
            return this;
        };
    }

    export class particle {
        private config: particleParams;
        private active = true;
        private particles: {instance: Part, customparams: particleParams, alive: boolean}[] = [];
        constructor(params: Partial<particleParams>) {
            this.config = {...defaultParams, ...params};
            let conn = RunService.Heartbeat.Connect(() => {
                if (!this.active) {conn.Disconnect(); return;}
                this.onupdate();
            })
        }
        cleanUp() {
            this.particles.forEach((v) => {
                v.alive = false;
            })
        }
        destroy() {
            this.active = false;
            this.cleanUp();
        }
        createParticles(params?: Partial<particleParams>) {
            let config = {...this.config, ...params};
            let pars = params? config: this.config;
            let localparticles: {instance: Part, customparams: particleParams, alive: boolean}[] = [];
            for (let i = 0; i < pars.amount; i++) {
                let p = getParticle();
                p.Anchored = pars.anchored;
                p.Parent = Workspace.Terrain;
                let c = {instance: p, customparams: pars, alive: true}
                this.particles.push(c);
                let emt = p.FindFirstChild("effect") as ParticleEmitter;
                emt.Rate = pars.rate;
                emt.Drag = pars.drag;
                emt.SpreadAngle = pars.spreadAngle;
                emt.Clear();
                emt.Emit(1);
                p.CFrame = pars.origin;
                localparticles.push(c);
                if (pars.impulse) {
                    if (pars.impulseFromLookVector) {
                        assert(typeOf(pars.impulse) === "number", 'impulse must be a number when the impulseFromLookvector is enabled')
                        p.ApplyImpulse(p.CFrame.LookVector.mul((pars.impulse as number) / 100));
                    }
                    else {
                        assert(typeOf(pars.impulse) === "Vector3", 'impulse must be a vector3 if you are not using the impulseFromLookVector property')
                        p.ApplyImpulse((pars.impulse as Vector3).div(1000));
                    }
                }
            }
            return {
                change: (params?: Partial<particleParams>) => {
                    localparticles.forEach((v) => {
                        let configr = {...v.customparams, ...params};
                        v.customparams = configr;
                        print(v.customparams)
                        print(this.particles[this.particles.indexOf(v)])
                    })
                },
                resetLinearVelocity: () => {
                    localparticles.forEach((v) => {
                        let l = v.instance.Anchored;
                        v.instance.Anchored = true;
                        while (!v.instance.AssemblyLinearVelocity.FuzzyEq(new Vector3(), .001)) {
                            v.instance.AssemblyLinearVelocity = new Vector3();
                            task.wait(1/60 * 2);
                        }
                        v.instance.Anchored = l;
                    })
                },
                destroyThese: () => {
                    localparticles.forEach((v) => {
                        v.alive = false;
                    })
                }
            }
        }
        private onupdate() {
            this.particles.forEach((md, i) => {
                let v = md.instance;
                let config = md.customparams;
                coroutine.wrap(() => {
                    if (!md.alive) {
                        md.instance.Destroy();
                        this.particles.remove(i);
                        return;
                    }
                    if (!config) return;
                    v.CanCollide = config.collisions;
                    v.Anchored = config.anchored;
                    let trail = v.FindFirstChild('trail') as Trail;
                    let fire = v.FindFirstChild('fire') as Fire;
                    let smoke = v.FindFirstChild('smoke') as Smoke;
                    let glow = v.FindFirstChild('glow') as PointLight;
                    let spot = v.FindFirstChild('spot') as SpotLight;
                    let force = v.FindFirstChild('force') as BodyForce;
                    let effect = v.FindFirstChild('effect') as ParticleEmitter;
                    
                    trail.Color = config.trailColor;
                    trail.FaceCamera = config.trailFacesCamera;
                    trail.Enabled = config.trail;
                    trail.Lifetime = config.trailLifetime;
                    trail.LightEmission = config.trailLightEmission;
                    trail.LightInfluence = config.trailLightInfluence;
                    trail.MaxLength = config.trailMaxLength;
                    trail.MinLength = config.trailMinlength;
                    trail.Texture = config.trailTexture;
                    trail.TextureLength = config.trailTextureLength;
                    trail.TextureMode = config.trailTextureMode;
                    trail.Transparency = config.trailTransparency
                    trail.WidthScale = config.trailWidthScale;
    
    
                    glow.Brightness = config.glowBrightness;
                    glow.Color = config.glowColor;
                    glow.Range = config.glowRange;
                    glow.Shadows = config.glowCastsShadows;
    
                    spot.Brightness = config.glowBrightness;
                    spot.Color = config.glowColor;
                    spot.Angle = config.glowAngle;
                    spot.Face = config.glowDirection;
                    spot.Range = config.glowRange;
                    spot.Shadows = config.glowCastsShadows;
    
    
                    smoke.Size = config.smokeSize;
                    smoke.Color = config.smokeColor;
                    smoke.Enabled = config.smoke;
                    smoke.RiseVelocity = config.smokeRise;
                    smoke.Opacity = config.smokeOpacity;
    
    
                    fire.Color = config.fireColor;
                    fire.Enabled = config.fire;
                    fire.Heat = config.fireRise;
                    fire.Size = config.fireSize;
                    fire.SecondaryColor = config.fireColor2;
    
    
                    effect.Rate = config.static? 0: config.rate;
                    effect.Color = config.color;
                    effect.SpreadAngle = config.spreadAngle;
                    effect.Transparency = config.transparency;
                    effect.Texture = config.texture;
                    effect.Enabled = true;
                    effect.Drag = config.drag;
    
                    force.Force = config.velocity;

                    if (config.glow) {
                        switch (config.glowType) {
                            case 'aura':
                                glow.Enabled = true;
                                spot.Enabled = false;
                                break;
                            case 'targetted':
                                glow.Enabled = false;
                                spot.Enabled = true;
                                break;
                            default:
                                error('unknown glowType')
                                break;
                        }
                    }
                    else {
                        glow.Enabled = false;
                        spot.Enabled = false;
                    }
                })()
            })
        }
    }
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
    export function edgesFromObject(object: GuiObject) {
        const [position, size, rotation] = [object.AbsolutePosition, object.AbsoluteSize, object.Rotation];
        const [midx, midy] = [position.X + (size.X / 2), position.Y + (size.Y / 2)];
        
        const corners = [
            [midx + (size.X / 2), midy + (size.Y / 2)],
            [midx - (size.X / 2), midy + (size.Y / 2)], 
            [midx - (size.X / 2), midy - (size.Y / 2)],
            [midx + (size.X / 2), midy - (size.Y / 2)],
        ];
        const edges = {
            topright: corners[0],
            topleft: corners[1],
            bottomleft: corners[2],
            bottomright: corners[3],
        }
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

}

export = saturn;