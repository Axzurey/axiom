import connection from "shared/connections/sohkConnection";
import clientCamera from "shared/classes/clientCamera";

namespace clientService {
    export class createCamera extends connection<(cameraId: string, config: clientCamera.cameraConfig) => void>() {
        static selfName = "createCamera";
    }
    export class cameraOrientationUpdated extends connection<(cameraId: string, orientation: Vector3) => void>() {
        static selfName = "cameraOrientationUpdated";
    }
    export class cameraControllerUpdated extends connection<(cameraId: string, controller: Player) => void>() {
        static selfName = "cameraControllerUpdated";
    }
}

export = clientService;