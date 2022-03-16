import characterHitbox from "server/classes/characterHitbox";

namespace quartUtils {

    export function partToPosition(parts: BasePart[]): Vector3[] {
        return parts.map((part) => {
            return part.Position
        });
    }

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