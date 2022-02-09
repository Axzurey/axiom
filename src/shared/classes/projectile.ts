import { Players, RunService, Workspace } from "@rbxts/services";

interface projectileConfig {
    onHit: () => void,
    onTerminated: () => void,
    instance: Model,
    velocity: number,
    direction: Vector3,
    origin: Vector3,
    gravity: Vector3,
    lifeTime: number,
    ignoreInstances: Instance[],
    ignoreNames?: string[],
    ignorePlayers?: Player[],
    ignoreEverything?: boolean,
}

interface entityStructure {
    character: Model,
    player: Player | undefined,
}

/**
 * 
 * @param acceleration acceleration at the point of ***elapsedTime***
 * @param initialVelocity self explanitory
 * @param initialPosition self explanitory
 * @param elapsedTime time since motion started
 * @returns the vector that the projectile would be at for ***elapsedTime***
 */
function motion(acceleration: Vector3, initialVelocity: Vector3, initialPosition: Vector3, elapsedTime: number) {
    let firstHalf = acceleration.mul(.5).mul(elapsedTime ** 2);
    let secondHalf = initialVelocity.mul(elapsedTime);
    return firstHalf.add(secondHalf).add(initialPosition);
}

export default class projectile {
    config: projectileConfig;
    alive: boolean = true;
    terminate() {
        this.alive = false;
    }
    constructor(config: projectileConfig) {
        if (!config.instance.PrimaryPart) throw `instance doesn't have a primary part set`
        this.config = config;
        let t = 0;
        let instance = config.instance;
        let rs = RunService.Heartbeat.Connect((dt) => {
            t += 1 * dt;
            if (!this.alive) {
                rs.Disconnect();
                config.onTerminated();
            }
            if (t > config.lifeTime) {
                rs.Disconnect();
                config.onTerminated();
            }

            let acceleration = config.gravity;
            let velocity = config.direction.mul(config.velocity);
            let initialPosition = config.origin;

            let currentPosition = motion(acceleration, velocity, initialPosition, t);
            let nextPosition = motion(acceleration, velocity, initialPosition, t + 1 / 60);

            let direction = CFrame.lookAt(currentPosition, nextPosition).LookVector;
            let distance = (nextPosition.sub(currentPosition)).Magnitude;

            instance.SetPrimaryPartCFrame(CFrame.lookAt(currentPosition, nextPosition));

            let params = new RaycastParams();
            params.FilterDescendantsInstances = [...config.ignoreInstances, instance];

            let result: RaycastResult | undefined = undefined;
            let resultPass = false;

            if (!config.ignoreEverything) {
                while (!resultPass) {
                    let r = Workspace.Raycast(currentPosition, direction.mul(distance).add(direction.mul((config.instance.PrimaryPart as BasePart).Size.Z / 2)), params);
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
            }
            
            if (result) {
                let position = result.Position;
                currentPosition = position;
                instance.SetPrimaryPartCFrame(CFrame.lookAt(currentPosition, nextPosition));
                rs.Disconnect();
                config.onHit();
            }
            else {
               currentPosition = currentPosition;
               instance.SetPrimaryPartCFrame(CFrame.lookAt(currentPosition, nextPosition));
            }
        })
    }
}