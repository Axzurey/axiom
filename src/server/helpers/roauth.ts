import { Workspace } from "@rbxts/services";
import vmAuth from "./viewmodelAuth";

namespace roauth {
    /**
     * you can change this to use more auth methods from other files
     */
    export const subAuths = {
        'viewmodel': vmAuth,
    }

    let LOGICAL_MAX_DISTANCE_ABOVE_PLATFORM = 100;
    /**
     * 
     * @param v1 origin
     * @param v2 destination
     * @param t delta
     */
    export function isALogicalDistanceWithinTime(v1: Vector3, v2: Vector3, time: number, speed: number) {
        let distance = (v1.sub(v2)).Magnitude;
        //d = v * t;
        let difference = (speed * time) - distance;
        if (difference < 0 || difference < -speed / (math.pi ^ 2)) {
            return true;
        }
        return false;
    }
    export function flyingAbovePlatform(v: Vector3, ignore: Instance[] = []) {
        let params = new RaycastParams();
        params.FilterDescendantsInstances = ignore;
        let result = Workspace.Raycast(v, new Vector3(0, -500, 0), params);
        if (result) {
            let pos = result.Instance.Position;
            let distance = (pos.sub(v)).Magnitude;
            if (distance > LOGICAL_MAX_DISTANCE_ABOVE_PLATFORM) {
                return false;
            }
            return true;
        }
        else {
            return false;
        }
    }
}

export = roauth;