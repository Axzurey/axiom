import { RunService, Workspace } from "@rbxts/services";

namespace colorfool {
    export namespace types {
        export type normalVector = Vector3;
        export enum cloneColorType {
            keep
        }
    }
    export namespace effectors {
        export class pulse {
            active: boolean = true;
            anchor: BasePart;
            private activeFloaters: BasePart[] = [];
            /**
             * the delay between creating effects(lower = more expensive)
             */
            delay: number = .25;
            growVector: types.normalVector = new Vector3(-1, 1, 1);
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