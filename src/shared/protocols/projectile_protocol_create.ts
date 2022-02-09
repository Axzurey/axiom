import phyxRemoteProtocol from "shared/phyx/phyxRemoteProtocol";

const projectile_protocol_create = new phyxRemoteProtocol<
    () => void,
    (instanceId: string, instancePath: string, origin: Vector3, direction: Vector3, gravity: Vector3,
        velocity: number, lifeTime: number,
        ) => void
>('projectile_protocol_create', 'Event');

export = projectile_protocol_create;