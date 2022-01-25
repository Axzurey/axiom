import { RunService } from "@rbxts/services";
import fps_framework from "shared/modules/fps";
import sohk from "shared/sohk/init";

type cameraSet = Model & {
    view: Part,
}


namespace clientCamera {
    export interface cameraConfig {
        instance: cameraSet,
        owner?: Player,
        maxUp: number,
        maxDown: number,
        maxLeft: number,
        maxRight: number,
    }
    export class camera extends sohk.sohkComponent {
        instance: cameraSet;
        owner: Player | undefined = undefined;
        controlling: Player | undefined = undefined;
        originalOrientation: Vector3;
        config: cameraConfig;
        cameraId: string = "unknown camera";
        constructor(id: string, config: cameraConfig) {
            super();
            this.config = config;
            this.owner = config.owner;
            this.cameraId = id;
            this.instance = config.instance;
            this.originalOrientation = config.instance.view.Orientation;
        }
        joinCamera() {
            this.replicationService.remotes.act.FireServer('joinCamera', this.cameraId);
        }
        leaveCamera() {
            this.replicationService.remotes.act.FireServer('leaveCamera', this.cameraId);
        }
        getOrientation() {
            return this.instance.view.Orientation;
        }
        setOrientation(orientation: Vector3) {
            this.replicationService.remotes.act.FireServer('updateCameraOrientation', this.cameraId, orientation);
        }
    }
}

export = clientCamera;