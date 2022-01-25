import { RunService, Workspace } from "@rbxts/services";

interface wireDetection {
    hit: BasePart,
    position: Vector3,
    normal: Vector3,
}

interface wireConfig {
    onHit: (result: wireDetection) => void,
    point1: () => Vector3,
    point2: () => Vector3,
    whitelist: BasePart[],
}

export default class wire {
    private enabled: boolean = true;
    private disconnected: boolean = false;
    constructor(config: wireConfig) {
        let check = RunService.Stepped.Connect(() => {
            if (!this.enabled) return;
            if (this.disconnected) {check.Disconnect(); return}
            let p1 = config.point1();
            let p2 = config.point2();
            let mag = (p1.sub(p2)).Magnitude;
            let direction = (p2.sub(p1)).Unit;

            let ignore = new RaycastParams();
            ignore.FilterDescendantsInstances = config.whitelist;
            ignore.FilterType = Enum.RaycastFilterType.Whitelist;
            let result = Workspace.Raycast(p1, direction.mul(mag), ignore);
            if (result) {
                config.onHit({
                    hit: result.Instance,
                    position: result.Position,
                    normal: result.Normal,
                });
            }
        })
    }
    enable() {
        this.enabled = true;
    }
    disable() {
        this.enabled = false;
    }
    disconnect() {
        this.disconnected = true;
    }
}