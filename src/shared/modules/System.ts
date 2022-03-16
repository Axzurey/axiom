import { UserInputService, ContextActionService, RunService, Workspace, HttpService } from "@rbxts/services";

namespace System {
    let fpsclockstart = os.clock();
    let fpscounter = 0;

    let rs1 = RunService.Heartbeat.Connect((deltatime) => {
        process.deltatime = deltatime;
        fpscounter ++;
        if (os.clock() - fpsclockstart >= 1) {
            process.framerate = math.floor(fpscounter / (os.clock() - fpsclockstart));
            fpsclockstart = os.clock();
            fpscounter = 0;
        }
    });
    

    export namespace process {
        /**
         * deltatime from heartbeat
         */
        export let deltatime = 0;
        export let framerate = 0;
        export let ping = 0;
        /**
         * sequentially runs all the functions passing the output from the current function into the next function
         */
        export function pipe(...args: ((...args: any[]) => any)[]) {
            return function(...params: unknown[]) {
                let n: unknown = undefined;
                args.forEach((callback) => {
                    let c: unknown[]
                    if (n) {
                        c = typeOf(n) === 'table'? n as unknown[] : [n];
                    }
                    else {
                        c = typeOf(params) === 'table'? params : [params];
                    }
                    n = callback(...c);
                })
                return n;
            }
        }
    }

    export namespace Console {
        /**
         * A cooler print 😎
         */
        export function WriteLine(...args: unknown[]) {
            print(...args);
        }
    }
    class recursiveThread {
        private callback: (...args: any[]) => void;
        private alive: boolean = false;
        private every: number = 1;
        private calldt: number = math.huge;
        private args: any[] = [];
        constructor(callback: (...args: unknown[]) => void, every: number) {
            this.every = every;
            this.callback = callback;
            let calledAlive = false;
            let t = RunService.Stepped.Connect((st, dt) => {
                if (this.alive) {
                    calledAlive = true;
                }
                if (!this.alive && calledAlive) {
                    t.Disconnect(); return;
                }
                this.calldt += 1 * dt;
                if (this.calldt > this.every) {
                    this.calldt = 0;
                    this.callback(this.args)
                }
            })
        }
        terminate() {
            this.alive = false;
        }
        start(...args: unknown[]) {
            this.alive = true;
            this.args = args;
        }
    }
    class thread {
        private callback: (...args: any[]) => void;
        constructor(callback: (...args: unknown[]) => void) {
            this.callback = coroutine.wrap(callback);
        }
        start(...args: unknown[]) {
            this.callback(...args);
        }
    }
    export namespace Threading {
        /**
         * Cooler threads
         * @param callback
         * @returns a new thread that can be invoked multiple times by calling the start method
         */
        export function Thread(callback: (...args: any[]) => void): thread {
            return new thread(callback);
        }
        export function Recursive(callback: (...args: any[]) => void, every: number): recursiveThread {
            return new recursiveThread(callback, every);
        }
    }
    class timer {
        callback: () => void
        constructor(callback: () => void) {
            this.callback = callback
        }
        run(): Promise<string> {
            return new Promise((resolve, reject) => {
                try {
                    let n = os.clock();
                    this.callback();
                    resolve(`completed test in ${os.clock() - n} seconds`);
                } catch(e) {
                    reject(tostring(e))
                }
            })
        }
    }
    export namespace Timer {
        /**
         * Timers 😎
         * @param callback 
         * @returns a new timer class that can be invoked multiple times by calling the run method
         */
        export function benchmark(callback: () => void) {
            return new timer(callback)
        }
    }
    export namespace Raylibclasses {
        let geowedge = new Instance("WedgePart");
        geowedge.Anchored = true;
        geowedge.TopSurface = Enum.SurfaceType.Smooth;
        geowedge.BottomSurface = Enum.SurfaceType.Smooth;

        export class triangle {
            points = {a: new Vector3(), b: new Vector3(), c: new Vector3()};
            properties: Map<keyof WritableInstanceProperties<WedgePart>, any> = new Map();
            w0: WedgePart = geowedge.Clone();
            w1: WedgePart = geowedge.Clone();
            width0 = 0;
            width1 = 0;
            constructor(a: Vector3, b: Vector3, c: Vector3, width0?: number, width1?: number, properties?: Map<keyof WritableInstanceProperties<WedgePart>, any>) {
                this.setpoints(a, b, c);
                this.properties = properties || new Map();
                this.setwidth(width0 || 0, width1 || 0);
            }
            setpoints(a: Vector3, b: Vector3, c: Vector3) {
                this.points.a = a;
                this.points.b = b;
                this.points.c = c;
            }
            setwidth(width0: number, width1: number) {
                this.width0 = width0;
                this.width1 = width1;
            }
            draw(parent: Instance) {
                this.properties.forEach((val, key) => {
                    this.w0[key as never] = val as never;
                    this.w1[key as never] = val as never;
                });

                let [a, b, c] = [this.points.a, this.points.b, this.points.c];
                let [ab, ac, bc] = [b.sub(a), c.sub(a), c.sub(b)];
                let [abd, acd, bcd] = [ab.Dot(ab), ac.Dot(ac), bc.Dot(bc)];

                if (abd > acd && abd > bcd) {
                    [c, a] = [a, c];
                }
                else if (acd > bcd && acd > abd) {
                    [a, b] = [b, a];
                }

                [ab, ac, bc] = [b.sub(a), c.sub(a), c.sub(b)];

                let right = ac.Cross(ab).Unit;
                let up = bc.Cross(right).Unit;
                let back = bc.Unit;

                let height = math.abs(ab.Dot(up));

                this.w0.Size = new Vector3(this.width0, height, math.abs(ab.Dot(back)));
                this.w0.CFrame = CFrame.fromMatrix(a.add(b).div(2), right, up, back);
                this.w0.Parent = parent;

                this.w1.Size = new Vector3(this.width1, height, math.abs(ac.Dot(back)));
                this.w1.CFrame = CFrame.fromMatrix(a.add(c).div(2), right.mul(-1), up, back.mul(-1));
                this.w1.Parent = parent;
            }
        }
        let linepart = new Instance("Part");
        linepart.Anchored = true;
        export class line {
            properties: Map<Partial<keyof WritableInstanceProperties<Part>>, any>;
            points: {a: Vector3, b: Vector3}
            width0: number
            width1: number
            w0: Part = linepart.Clone();
            constructor(a: Vector3, b: Vector3, width0?: number, width1?: number, properties?: Map<Partial<keyof WritableInstanceProperties<Part>>, any>) {
                this.properties = properties || new Map();
                this.points = {
                    a: a,
                    b: b
                };
                this.width0 = width0 || .1;
                this.width1 = width1 || .1
            }
            setpoints(a: Vector3, b: Vector3, c: Vector3) {
                this.points.a = a;
                this.points.b = b;
            }
            setwidth(width0: number, width1: number) {
                this.width0 = width0;
                this.width1 = width1;
            }
            draw(parent: Instance) {
                this.properties.forEach((val, key) => {
                    this.w0[key as never] = val as never;
                });
                let lookat = CFrame.lookAt(this.points.b, this.points.a);
                let length = this.points.a.sub(this.points.b).Magnitude;
                let size = new Vector3(this.width0, this.width1, length);
                this.w0.CFrame = lookat.mul(new CFrame(0, 0, -length / 2));
                this.w0.Size = size;
                this.w0.Parent = parent;
            }
        }
    }

    export namespace Raylib {
        export function DrawTri(a: Vector3, b: Vector3, c: Vector3, width0?: number, width1?: number, properties?: Map<Partial<keyof WritableInstanceProperties<WedgePart>>, any>): Raylibclasses.triangle {
            return new Raylibclasses.triangle(a, b, c, width0, width1, properties);
        }
        export function DrawLine(a: Vector3, b: Vector3, width0?: number, width1?: number, properties?: Map<Partial<keyof WritableInstanceProperties<Part>>, any>): Raylibclasses.line {
            return new Raylibclasses.line(a, b, width0, width1, properties);
        }
    }

    export namespace mathf {
        //local
        const randomGenerator = new Random();
        const sin = math.sin;
        const tan = math.tan;
        const abs = math.abs;
        const cos = math.cos; //can swap with sin for roblox lookvector space
        const atan2 = math.atan2;
        const asin = math.asin;
        const acos = math.acos;
        const rad = math.rad; //:: x * pi / 180 
        const deg = math.deg; //:: x * 180 / pi
        const pi = math.pi;
    
        //types
    
        //constants
        export const inf = math.huge;
        export const e = 2.718281;
        export const tau = pi * 2;
        export const phi = 2.618033;
        export const earthGravity = 9.807;
        export const lightSpeed = 299792458;
        
        //functions
        export function angleBetween(v1: Vector3, v2: Vector3): number {
            return acos(math.clamp(v1.Dot(v2), -1, 1));
        }
        export function vectorIsClose(v1: Vector3, v2: Vector3, limit: number): boolean {
            return v1.sub(v2).Magnitude <= limit ? true : false;
        };
        export function vector2IsSimilar(v1: Vector2, v2: Vector2, limit: number): boolean {
            if (math.abs(v1.X - v2.X) > limit) return false;
            if (math.abs(v1.Y - v2.Y) > limit) return false;
            return true;
        };
        export function random(min: number = 0, max: number = 1, count: number = 1): number | number[] {
            if (count === 1) {
                return randomGenerator.NextNumber(min, max);
            }
            else {
                let numbers: number[] = [];
                for (let i=0; i < count; i++) {
                    numbers.push(randomGenerator.NextNumber(min, max));
                }
                return numbers;
            }
        };
        export function pointsOnCircle(radius: number, points: number, center?: Vector2): Vector2[] {
            let parray: Vector2[] = []
            let cpo = 360 / points
            for (let i = 1; i <= points; i++) {
                let theta = math.rad(cpo * i)
                let x = cos(theta) * radius
                let y = sin(theta) * radius
                parray.push(center? new Vector2(x, y).add(center) : new Vector2(x, y))
            }
            return parray
        };
        export function translationRequired(a: CFrame, b: CFrame): CFrame {
            return a.Inverse().mul(b);
        };
        export function vector2FromAngle(angle: number, radius?: number): Vector2 { //for a unit circle
            return new Vector2(cos(rad(angle) * (radius || 1)), sin(rad(angle)) * (radius || 1)) // x = cos(angle:rad) * r, y = sin(angle:rad) * r
        };
        export function angleFromVector2(v: Vector2): number { //for a unit circle
            return atan2(v.Y, v.X); //theta = atan2(y, x)
        }
        export function normalize(min: number, max: number, value: number): number {
            if (value > max) return max;
            if (value < min) return min;
            return (value - min) / (max - min);
        }
        export function denormalize(min: number, max: number, value: number): number {
            return (value * (max - min) + min);
        }
        export function uExtendingSpiral(t: number) {
            return new Vector2(t * cos(t), t * sin(t));
        }
        /**
         * 
         * @param x1 line 1 x1
         * @param x2 line 1 x2
         * @param y1 line 1 y1
         * @param y2 line 1 y2
         * @param x3 line 2 x1
         * @param x4 line 2 x2
         * @param y3 line 2 y1
         * @param y4 line 2 y2
         * [x, y], [x, y] --line1
         * [x, y], [x, y] --line2
         * @returns the x and y co-ordinates that the lines intersect at. If they do not intersect, it returns undefined.
         */
        export function getConvergence(x1: number, x2: number, y1: number, y2: number, x3: number, x4: number, y3: number, y4: number) {
            let den = (x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4);
            if (den === 0) return;
            let t = ((x1 - x3) * (y3 - y4) - (y1 - y3) * (x3 - x4)) / den;
            let u = -((x1 - x2) * (y1 - y3) - (y1 - y2) * (x1 - x3)) / den;
            return [u, t];
        }
        export function uSquare(rotation: number = 0, radius: number): Vector2[] {
            let cx = 0;
            let cy = 0;
            function rotate(v1: Vector2) {
                let tx = v1.X - cx;
                let ty = v1.Y - cy;

                let rotatedX = tx * cos(rotation) - ty * sin(rotation);
                let rotatedY = tx * sin(rotation) - ty * cos(rotation);

                return new Vector2(rotatedX + cx, rotatedY + cy);
            }
            let x1 = new Vector2(1, 1).mul(radius);
            let x2 = new Vector2(1, -1).mul(radius);
            let x3 = new Vector2(-1, -1).mul(radius);
            let x4 = new Vector2(-1, 1).mul(radius);
            return [rotate(x1), rotate(x2), rotate(x3), rotate(x4)];
        }
        export function slope(v1: Vector2, v2: Vector2): number {
            return (v2.Y - v1.Y) / (v2.X - v1.X);
        }
        export function lerp(v0: number, v1: number, t: number): number {
            return v0 + (v1 - v0) * t
        }
        export function lerpV3(v0: Vector3, v1: Vector3, t: number): Vector3 {
            return v0.add(v1.sub(v0).mul(t));
        }
        export function degToRad(args: [number, number, number]) {
            let newargs: [number, number, number] = [-1, -1, -1];
            args.forEach((v, i) => {
                newargs[i] = math.rad(v);
            })
            return newargs;
        }
        export function computeDistanceFromLineSegment(a: Vector3, b: Vector3, c: Vector3) {
            let px = a.sub(b).Cross(c.sub(b)).Magnitude;
            let py = c.sub(b).Magnitude;
            return px / py;
        }
        export function percentToDegrees(percent: number) {
            return percent * 360 / 100;
        }
        export function xToDegrees(x: number, clamp: number) {
            return x * 360 / clamp;
        }
        export function degreesToPercent(degrees: number) {
            return degrees / 360 * 100;
        }
        export function bezierQuadratic(t: number, p0: number, p1: number, p2: number): number {
            return (1 - t) ^ 2 * p0 + 2 * (1 - t) * t * p1 + t ^ 2 * p2;
        }
        export function bezierQuadraticV3(t: number, p0: Vector3, p1: Vector3, p2: Vector3): Vector3 {
            let l1 = lerpV3(p0, p1, t);
            let l2 = lerpV3(p1, p2, t);
            let q = lerpV3(l1, l2, t);
            return q;
        }
        /**
         * 
         * @param part the part to check for the point on
         * @param point the point to get the closest vector on the part to
         * @returns 
         */
        export function closestPointOnPart(part: BasePart, point: Vector3) {
            let t = part.CFrame.PointToObjectSpace(point);
            let hs = part.Size.div(2);

            return part.CFrame.mul(new Vector3(
                math.clamp(t.X, -hs.X, hs.X),
                math.clamp(t.Y, -hs.Y, hs.Y),
                math.clamp(t.Z, -hs.Z, hs.Z),
            ))
        }
        export function plotInWorld(v3: Vector3, color: Color3 = Color3.fromRGB(0, 255, 255)) {
            let p = new Instance('Part');
            p.Size = new Vector3(.1, .1, .1);
            p.Color = color;
            p.Anchored = true;
            p.CanCollide = false;
            p.CanQuery = false;
            p.CanTouch = false;
            p.Position = v3;
            p.Shape = Enum.PartType.Ball;
            p.Material = Enum.Material.Neon;
            p.Parent = Workspace;
        }
    }
    
    export namespace stringf {
        //types
        export type lowerLetters = 'a' | 'b' | 'c' | 'd' | 'e' | 'f' | 'g' | 'h' | 'i' | 'j' | 'k' | 'l' | 'm' | 'n' | 'o' | 'p' | 'q' | 
        'r' | 's' | 't' | 'u' | 'v' | 'w' | 'x' | 'y' | 'z';
        export type upperLetters = 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G' | 'H' | 'I' | 'J' | 'K' | 'L' | 'M' | 'N' | 'O' | 'P' | 'Q' | 
        'R' | 'S' | 'T' | 'U' | 'V' | 'W' | 'X' | 'Y' | 'Z';
        export type basenumber = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;
        export type specialCharset1 = '!' | '@' | '#' | '$' | '%' | '^' | '&' | '`' | '~' | "'" | '"' | '/' | '|' | '\\' | '?' | '*' |
            '+' | '-' | ',';
        export type specialCharset2 = '(' | ')' | '<' | '>' | '[' | ']' | '{' | '}';
        export type specialCharset3 = '_' | '-' | ':' | ';' | '.';
    
        //constants
        export const lowerCase: lowerLetters[] = ['a' , 'b' , 'c' , 'd' , 'e' , 'f' , 'g' , 'h' , 'i' , 'j' , 'k' , 'l' , 'm' , 'n' , 'o' , 'p' , 'q' , 
            'r' , 's' , 't' , 'u' , 'v' , 'w' , 'x' , 'y' , 'z'];
        export const upperCase: upperLetters[] = ['A' , 'B' , 'C' , 'D' , 'E' , 'F' , 'G' , 'H' , 'I' , 'J' , 'K' , 'L' , 'M' , 'N' , 'O' , 'P' , 'Q' , 
            'R' , 'S' , 'T' , 'U' , 'V' , 'W' , 'X' , 'Y' , 'Z'];
        export const basenumbers: basenumber[] = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
        export const specialCharsets1: specialCharset1[] = ['!' , '@' , '#' , '$' , '%' , '^' , '&' , '`' , '~' , "'" , '"' , '/' , ',' , '\\' , '?' , '*' ,
            '+' , '-' , ','];
        export const specialCharsets2: specialCharset2[] = ['(' , ')' , '<' , '>' , '[' , ']' , '{' , '}'];
        export const specialCharsets3: specialCharset3[] = ['_' , '-' , ':' , ';' , '.'];
    
        //functions
        export function toHMS(seconds: number): string {
            return string.format('%02i:%02i:%02i', seconds / 60 ^ 2, seconds / 60 % 60, seconds % 60);
        }
        export function toDHMSRAW(seconds: number) {
            let d = math.floor(seconds / 86400);
            let h = math.floor((seconds % 86400) / 3600);
            let m = math.floor((seconds % 3600) / 60);
            let s = math.floor(seconds % 60);
            return [d, h, m, s]
        }
        export function toDHMS(seconds: number) {
            let d = math.floor(seconds / 86400);
            let h = math.floor((seconds % 86400) / 3600);
            let m = math.floor((seconds % 3600) / 60);
            let s = math.floor(seconds % 60);
            return string.format('%02i:%02i:%02i:%02i', d, h, m, s)
        }
        /*
        export function toDHMSRAW(seconds: number) {
            let d = math.floor(seconds / 86400);
            let rem = seconds & 86400;
            let h: string | number = math.floor(rem % 3600);
            rem = rem % 3600;
            let m: string | number = math.floor(rem / 60);
            rem = rem % 60;
            let s: string | number = rem;
            if (h < 10) {
                h = "0" + h;
            }
            if (m < 10) {
                m = "0" + m;
            }
            if (s < 10) {
                s = "0" + s
            }
            return [d, h, m, s];
        }*/
    }
}

export = System;