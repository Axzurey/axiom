import { Players, RunService, Workspace } from "@rbxts/services";

interface projectileImpactResult {
    characterHits: entityStructure[],
    instanceHits: BasePart[],
}

interface projectileConfig {
    onHit: (result: projectileImpactResult) => number,
    onTerminated: () => void,
    instance: Model,
    velocity: number,
    direction: Vector3,
    origin: Vector3,
    gravity: Vector3,
    explosionRadius: number,
    maxDistance: number,
    explodeAtMaxDistance?: boolean,
    ignoreInstances: Instance[],
    ignoreNames?: string[],
    ignorePlayers?: Player[],
}

interface entityStructure {
    character: Model,
    player: Player | undefined,
}

export default class projectile {
    private config: projectileConfig;
    private getAllInExplosionRadius(position: Vector3, radius: number): [entityStructure[], BasePart[]] {
        let overlap = new OverlapParams();
        overlap.MaxParts = 999;
        overlap.FilterDescendantsInstances = this.config.ignoreInstances;
        let all = Workspace.GetPartBoundsInRadius(position, radius, overlap) as BasePart[];
        let characters: entityStructure[] = [];
        all.forEach((v, i) => {
            if (this.config.ignoreNames && this.config.ignoreNames.indexOf(v.Name) !== -1) {
                all.remove(i);
                return;
            };
            if (v.Name === "HumanoidRootPart") {
                let char = v.Parent as Model;
                let player = Players.GetPlayerFromCharacter(char);
                if (player && this.config.ignorePlayers && this.config.ignorePlayers.indexOf(player) !== -1) {
                    return;
                };
                characters.push({character: char, player: player});
                all.remove(i);
            }
        })
        return [characters, all];
    }
    private explode(position: Vector3) {
        let hits = this.getAllInExplosionRadius(position, this.config.explosionRadius);
        this.config.onHit({
            instanceHits: hits[1],
            characterHits: hits[0],
        });
    }
    constructor(config: projectileConfig) {
        this.config = config;
        let t = 0;
        let currentPosition = config.origin;
        let instance = config.instance;
        let rs = RunService.Stepped.Connect((_, dt) => {
            t += config.velocity * dt;

            if (config.explodeAtMaxDistance && t > config.maxDistance) {
                rs.Disconnect();
                this.explode(currentPosition);
            }
            else if (t > config.maxDistance) {
                rs.Disconnect();
                config.onTerminated();
            }

            let deltadown = config.gravity.mul(dt);
            let deltafront = config.origin.add(config.direction.mul(t)).sub(deltadown);

            let params = new RaycastParams();
            params.FilterDescendantsInstances = config.ignoreInstances;

            let result: RaycastResult | undefined = undefined;
            let resultPass = false;

            while (!resultPass) {
               let r = Workspace.Raycast(currentPosition, deltafront, params);
               if (r) {
                   let h = r.Instance;
                   if (config.ignoreNames && config.ignoreNames.indexOf(h.Name) !== -1) continue;
                   let c = h.Parent;
                   let p = Players.GetPlayerFromCharacter(c);
                   if (p && config.ignorePlayers && config.ignorePlayers.indexOf(p) !== -1) continue;
                   result = r;
                   resultPass = true;
               }
               else {
                   resultPass = true;
               }
            }
            if (result) {
                let position = result.Position;
                currentPosition = position;
                instance.SetPrimaryPartCFrame(CFrame.lookAt(currentPosition, currentPosition.mul(2)));
                rs.Disconnect();
                this.explode(position);
            }
            else {
               currentPosition = deltafront;
               instance.SetPrimaryPartCFrame(CFrame.lookAt(currentPosition, currentPosition.mul(2)));
            }
        })
    }
}