import {Workspace} from '@rbxts/services';

namespace renderService {

    export function flux(freq: number, amp: number) {
        return math.sin(tick() * freq) * amp;
    }

    export function getPointsOnCircle(points: number, radius: number) {
        let arr: {x: number, y: number}[] = [];
        let dsts = 360 / points;
        for (let i = 1; i <= points; i++) {
            print(i)
            let theta = math.rad(dsts * i);
            let x = math.cos(theta) * radius;
            let y = math.sin(theta) * radius;
            arr.push({x: x, y: y});
        }
        return arr;
    }

    export function drawHexagon(center: Vector3, faceNormal: Vector3) {
        let outerpoints = getPointsOnCircle(6, 10);
        let triangles: triangle[] = [];
        outerpoints.forEach((now, after) => {
            let nextIndex = outerpoints[after + 1] || outerpoints[0];
            let first = new Vector3(now.x, now.y, 0).add(center);
            let second = new Vector3(nextIndex.x, nextIndex.y, 0).add(center);
            const tri = new triangle(first, second, center, 1, 1, {Color: new Color3(0, 0, 1), Material: Enum.Material.Neon});
            tri.draw(Workspace);
            triangles.push(tri);
        })
    }

    //triangle class stuff
    const geowedge = new Instance("WedgePart");
    geowedge.Anchored = true;
    geowedge.TopSurface = Enum.SurfaceType.Smooth;
    geowedge.BottomSurface = Enum.SurfaceType.Smooth;

    export class triangle {
        points = {a: new Vector3(), b: new Vector3(), c: new Vector3()};
        properties: Partial<Record<keyof WritableInstanceProperties<WedgePart>, any>> = {};
        w0: WedgePart = geowedge.Clone();
        w1: WedgePart = geowedge.Clone();
        width0 = 0;
        width1 = 0;
        constructor(a: Vector3, b: Vector3, c: Vector3, width0?: number, width1?: number, properties?: Partial<Record<keyof WritableInstanceProperties<WedgePart>, any>>) {
            this.setpoints(a, b, c);
            this.properties = properties || {};
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
            for (const [key, val] of pairs(this.properties)) {
                this.w0[key as never] = val as never;
                this.w1[key as never] = val as never;
            }

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
}

export = renderService;