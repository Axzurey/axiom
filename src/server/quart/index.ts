import _globalIgnore from "./globalIgnore";
import quartInteractiveRay, { interactiveRayParams } from "./quartInteractiveRay";

namespace quart {
    export function interactiveRaycast(origin: Vector3, direction: Vector3, config: interactiveRayParams) {
        return new quartInteractiveRay(config).cast(origin, direction)
    }
}

export = quart;