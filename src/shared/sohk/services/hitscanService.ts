import { Workspace } from "@rbxts/services";

export default class hitScanService {
    constructor() {}
    static scanForHitAsync(config: {
        position: Vector3,
        direction: Vector3,
        distance: number,
        ignore?: Instance[],
        filterType?: Enum.RaycastFilterType,
    }) {
        /*
        return new Promise<RaycastResult | undefined>((resolve, reject) => {
            try {
                let params = new RaycastParams();
                params.FilterDescendantsInstances = config.ignore || [];
                params.FilterType = config.filterType || Enum.RaycastFilterType.Blacklist;
                params.IgnoreWater = true;
                let result = Workspace.Raycast(config.position, config.direction.mul(config.distance), params);
                resolve(result);
            }
            catch(e) {
                reject(e);
            }
        })*/
        let params = new RaycastParams();
        params.FilterDescendantsInstances = config.ignore || [];
        params.FilterType = config.filterType || Enum.RaycastFilterType.Blacklist;
        params.IgnoreWater = true;
        let result = Workspace.Raycast(config.position, config.direction.mul(config.distance), params);
        
        return result;
    }
}