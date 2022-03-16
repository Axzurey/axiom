import { RunService, Workspace } from "@rbxts/services";
import { mathf } from "shared/modules/System";

namespace colorfool {
    export namespace types {
        export type normalVector = Vector3;
        export enum cloneColorType {
            keep
        }

        export enum flags {
            lookToNextPoint, lookToPreviousPoint, lookToDefinedNormal,
            
        }
    }
    
    namespace utilityClasses {
        export class reference<T> {
            private value: T;
            constructor(initialValue: T) {this.value = initialValue};
            getValue() {
                return this.value
            }
            setValue(value: T) {
                this.value = value;
            }
        }
    }

    export namespace utility {
        export function createReference<T>(initialValue: T) {
            return new utilityClasses.reference(initialValue)
        }
    }
    export namespace effectors {
        export class orbitCircular {
            anchor: BasePart;
            active: boolean = true;

            flags: types.flags[] = [];

            /**
             * basically generated points
             */
            detail: number = 360;

            constructor(anchor: BasePart) {
                this.anchor = anchor;
            }
            render(orbitalPoint: Vector3 | utilityClasses.reference<Vector3>, orbitRadius: number | utilityClasses.reference<number>) {
                let connection = RunService.Stepped.Connect((_t, dt) => {

                    let point = new Vector3()
                    if (typeOf(orbitalPoint) === 'Vector3') {
                        point = orbitalPoint as Vector3
                    }
                    else {
                        point = (orbitalPoint as utilityClasses.reference<Vector3>).getValue();
                    }

                    let radius = 0;
                    if (typeOf(orbitRadius) === 'number') {
                        radius = orbitRadius as number
                    }
                    else {
                        radius = (orbitRadius as utilityClasses.reference<number>).getValue();
                    }
                    
                    let orbitPath = mathf.pointsOnCircle(radius, 360);
                })
            }
            destroy() {
            }
        }
        export class gyration {
            anchor: BasePart;
            active: boolean = true;
            /**
             * should be a normalized vector3 value
             */
            rotationAxis: Vector3 = new Vector3(1, 0, 0);
            /**
             * speed in degrees / second.
             * Eg. a value of 180 would be half a full rotation a second
             */
            rotationSpeed: number = 360 / 100;
            constructor(anchor: BasePart) {
                this.anchor = anchor;
            }
            render() {
                let conn = RunService.Stepped.Connect((_t, dt) => {
                    if (!this.active) {
                        conn.Disconnect();
                    }
                    this.anchor.Rotation = this.anchor.Rotation.add(
                        this.rotationAxis.mul(this.rotationSpeed).mul(dt)
                    );
                })
            }
            destroy() {
                this.active = false;
            }
        }
        export class pulse {
            active: boolean = true;
            anchor: BasePart;
            private activeFloaters: BasePart[] = [];
            /**
             * the delay between creating effects(lower = more expensive)
             */
            delay: number = .25;
            growVector: types.normalVector = new Vector3(1, 1, 1);
            cloneMaterial: Enum.Material = Enum.Material.Neon;
            cloneColor: Color3 | types.cloneColorType = Color3.fromRGB(69, 0, 255);
            targetSize: number = 15;
            growRate: number = .1;
            transparencyRate: number = .01;
            parent: Instance = Workspace;
            constructor(anchor: BasePart) {
                this.anchor = anchor;
            }
            render() {
                coroutine.wrap(() => {
                    while (true) {
                        if (!this.active) break;
                        let originalSize = this.anchor.Size;
                        task.wait(this.delay);

                        let floater = this.anchor.Clone();
                        floater.Material = this.cloneMaterial;
                        floater.Name = `${this.anchor.Name}:floater:${this.activeFloaters.size()}`
                        floater.Parent = this.parent;
                        if (typeOf(this.cloneColor) === "Color3") {
                            floater.Color = this.cloneColor as Color3;
                        }
    
                        this.activeFloaters.push(floater);
                        let t = 0;
                        
                        let run = RunService.Heartbeat.Connect((dt) => {
                            if (t >= this.targetSize) {
                                run.Disconnect();
                                let t = this.activeFloaters.indexOf(floater)
                                if (t !== -1) {
                                    this.activeFloaters.remove(t);
                                }
                                floater.Destroy();
                                return;
                            }
                            t += this.growRate * dt * 60;
                            floater.Size = originalSize.add(this.growVector.mul(t));
                            floater.CFrame = this.anchor.CFrame;
                            floater.Transparency += this.transparencyRate * dt * 60;
                        })
                    }
                })()
            }
            destroy() {
                this.active = false;
                this.activeFloaters.forEach((v) => {
                    v.Destroy();
                })
            }
        }
    }
    export namespace operations {
        export class mirror {
            active: boolean = true;
            anchor: BasePart;
            point: Vector3 = new Vector3();
            axis: types.normalVector = new Vector3(1, 1, 1);
            parent: Instance = Workspace;
            private mobjects: BasePart[] = [];
            constructor(anchor: BasePart) {
                this.anchor = anchor;
            }
            render() {
                let clone = this.anchor.Clone();
                this.mobjects.push(clone);
                let conn = RunService.Heartbeat.Connect(() => {
                    if (!this.active) {conn.Disconnect(); return};
                    clone.Position = this.anchor.Position.mul(this.axis.mul(-1));
                    if (clone.Parent !== this.parent) {
                        clone.Parent = this.parent;
                    }
                })
            }
            destroy() {
                this.active = false;
                this.mobjects.forEach((v) => {
                    v.Destroy();
                })
            }
        }

        export class array {
            active: boolean = true;
            anchor: BasePart;
            iterations: number = 2;
            factor: Vector3 = new Vector3(0, 20, 0);
            factorOffsetsAnchorSize: boolean = false;
            private objects: BasePart[] = [];
            parent: Instance = Workspace;
            constructor(anchor: BasePart) {
                this.anchor = anchor;
            }
            render() {
                let conn = RunService.Heartbeat.Connect(() => {
                    if (!this.active) {conn.Disconnect(); return;}
                    let diff = this.iterations - this.objects.size()
                    if (diff > 0) {
                        for (let iteration = 0; iteration < diff; iteration++) {
                            let offset = this.factorOffsetsAnchorSize? this.anchor.Size: new Vector3();
                            let newvector = this.anchor.Position.add(offset).add(this.factor.mul(iteration + 1)); //so it's not 0, and doesn't have the same position as anchor
                            let c = this.anchor.Clone();
                            c.Position = newvector;
                            c.Parent = this.parent;
                            this.objects.push(c);
                        }
                    }
                    this.objects.forEach((v, iteration) => {
                        let offset = this.factorOffsetsAnchorSize? this.anchor.Size: new Vector3();
                        v.Position = this.anchor.Position.add(offset).add(this.factor.mul(iteration + 1));
                    })
                })
            }
            destroy() {
                this.active = false;
                this.objects.forEach((v) => {
                    v.Destroy();
                })
            }
        }
    }
}

export = colorfool;