import phyxRemoteProtocol from "shared/phyx/phyxRemoteProtocol";

const projectile_protocol_freeze = new phyxRemoteProtocol<
    () => void,
    (instanceId: string, at: CFrame,
        ) => void
>('projectile_protocol_freeze', 'Event');

export = projectile_protocol_freeze;