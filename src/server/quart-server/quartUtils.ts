import characterHitbox from "server/classes/characterHitbox";
import partBoundary from "./classes/partBoundary";
import partGroup from "./classes/partGroup";

namespace quartUtils {

    export function partToPosition(parts: BasePart[]): Vector3[] {
        return parts.map((part) => {
            return part.Position
        });
    }

    export function groupParts(parts: (Part | UnionOperation)[]) {
        return new partGroup(parts);
    }

    export function firstKeyOfValue<V extends any, D extends Record<string, never>>(dictionary: D, value: V): keyof D | undefined {
        for (const [i, v] of pairs(dictionary)) {
            if (value === v) {
                return i;
            }
        }
        return;
    }

    class a {
        hello() {

        }
    }

    class b extends a {
        goodbye() {

        }
    }

    let x = new b().hello()

    export function toArray<T extends Record<any, any>>(dictionary: T): ValueOf<T>[] {
        let a: ValueOf<T>[] = [];

        for (const [_, v] of pairs(dictionary)) {
            a.push(v as ValueOf<T>);
        }
        
        return a;
    }

    export function toKeysArray<T extends Record<any, any>>(dictionary: T): (keyof T)[] {
        let a: (keyof T)[] = [];

        for (const [v, _] of pairs(dictionary)) {
            a.push(v as keyof T);
        }
        
        return a;
    }

    export function partBoundsFromRange(
        xMin: number,
        xMax: number,
        yMin: number,
        yMax: number,
        zMin: number,
        zMax: number,
    ): partBoundary {
        return new partBoundary(
            new NumberRange(xMin, xMax),
            new NumberRange(yMin, yMax),
            new NumberRange(zMin, zMax)
        )
    }

    export function partBoundsFromPart(part: BasePart): partBoundary {
        let size = part.Size;
        let cf = part.CFrame;
        let lv = cf.LookVector;
        let uv = cf.UpVector;
        let rv = cf.RightVector;
        let pos = cf.Position;

        let [xMin, xMax] = [pos.X - (rv.mul(size.X / 2)).X, pos.X + (rv.mul(size.X / 2)).X];
        let [yMin, yMax] = [pos.Y - (uv.mul(size.Y / 2)).Y, pos.Y + (uv.mul(size.Y / 2)).Y];
        let [zMin, zMax] = [pos.Z - (lv.mul(size.X / 2)).Z, pos.Z + (lv.mul(size.Z / 2)).Z];

        return new partBoundary(
            new NumberRange(xMin, xMax),
            new NumberRange(yMin, yMax),
            new NumberRange(zMin, zMax)
        );
    }
    /**
    BROKEN
     */
    export function* range(start: number, stop: number, step: number = 1) {
        return {
            [Symbol.iterator]() {
                return this;
            },
            next() {
                if (start < stop) {
                    start = start + step;
                    return {done: false, value: start}
                }
                return {done: true, value: stop}
            }
        }
    }

    export function fillDefaults<T extends Record<any, any>>(passed: Partial<T>, fill: T): T {
        for (const [i, v] of pairs(fill)) {
            if (passed[i as keyof typeof passed]) {
                continue;
            }
            else {
                passed[i as keyof typeof passed] = v as any;
            }
        }
        return passed as T;
    }

    export function createDefaultEntityModel(): Model {
        let p = new Instance("Part");
        p.Size = new Vector3(1, 1, 1);
        p.Anchored = true;
        p.Material = Enum.Material.Neon;
        p.Color = new Color3(0, 1, 1);
        p.CanCollide = true;

        let m = new Instance("Model");
        m.Name = 'default_entity';

        p.Parent = m;

        m.PrimaryPart = p

        return m;
    }

    export function createDefaultEntityHitbox() {
        let p = new Instance("Part");
        p.Size = new Vector3(1, 1, 1);
        p.Anchored = true;
        p.CanCollide = true;

        let m = new Instance("Model");
        m.Name = 'default_entity_hitbox!';

        p.Parent = m;

        m.PrimaryPart = p

        return m;
    }
}

export = quartUtils