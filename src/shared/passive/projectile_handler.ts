import projectile from "shared/classes/projectile";
import path from "shared/phyx/path";
import { Players, Workspace } from "@rbxts/services";
import projectile_protocol_create from "shared/protocols/projectile_protocol_create";
import projectile_protocol_freeze from "shared/protocols/projectile_protocol_freeze";

export default class projectile_handler {
    projectiles: Record<string, {
        instance: Model,
        path: projectile
    }> = {};
    constructor() {
        projectile_protocol_create.connectClient((instanceId: string, instancePath: string, origin: Vector3, direction: Vector3, gravity: Vector3,
            velocity: number, lifeTime: number) => {
                this.newProjectile(instanceId, instancePath, origin, direction, gravity, velocity, lifeTime)
        })
        projectile_protocol_freeze.connectClient((instanceId: string, at: CFrame) => {
            this.freezeProjectile(instanceId, at);
        })
    }
    newProjectile(instanceId: string, instancePath: string, origin: Vector3, direction: Vector3, gravity: Vector3,
        velocity: number, lifeTime: number) {

        let inst = path.pathToInstance(instancePath).Clone() as Model;
        inst.Parent = Workspace;

        let proj = new projectile({
            origin: origin,
            direction: direction,
            gravity: gravity,
            velocity: velocity,
            lifeTime: lifeTime,
            instance: inst,
            ignoreInstances: [],
            ignoreEverything: true,
            onHit: () => {},
            onTerminated: () => {},
        })

        this.projectiles[instanceId] = {path: proj, instance: inst};
    }
    freezeProjectile(instanceId: string, at: CFrame) {
        let proj = this.projectiles[instanceId];
        if (!proj) {print('no proj'); return};
        proj.path.terminate();
        proj.instance.GetChildren().forEach((v) => {
            if (v.IsA("BasePart")) {
                v.Anchored = true;
            }
        })
        task.wait(.1);
        proj.instance.SetPrimaryPartCFrame(at);
        print('set')
    }
    terminateProjectile(instanceId: string) {

    }
}