import { Players, Workspace } from "@rbxts/services";
import { globalIgnore } from "./quartEnvironment";

export interface interactiveRayParams {
    useGlobalIgnore: boolean,
    ignorePlayers: boolean,
}

export default class quartInteractiveRay {
    config: interactiveRayParams
    constructor(config: interactiveRayParams) {
        this.config = config
    }
    cast(origin: Vector3, direction: Vector3) {
        let terminated = false;
        let ignore = new RaycastParams();
        let final: RaycastResult | undefined = undefined
        while (!terminated) {
            let result = Workspace.Raycast(origin, direction);
            if (result) {
                if (this.config.useGlobalIgnore && globalIgnore.isIgnored(result.Instance)) {
                    ignore.FilterDescendantsInstances.push(result.Instance);
                    continue; //it is ignored, try again and add it to ray ignore
                }
                else if (this.config.ignorePlayers && Players.GetPlayerFromCharacter(result.Instance.Parent)) {
                    ignore.FilterDescendantsInstances.push(result.Instance.Parent as Instance);
                    continue; //if they're a player, ignore em.
                }
                final = result;
                terminated = true;
            }
            else {
                terminated = true;
            }
        }
        return final
    }
}