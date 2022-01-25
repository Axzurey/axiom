import { RunService } from "@rbxts/services";
import fps_framework from "shared/modules/fps";

type cameraSet = Model & {
    view: Part,
}

export interface cameraConfig {
    instance: cameraSet,
    owner?: Player,
    maxUp: number,
    maxDown: number,
    maxLeft: number,
    maxRight: number,
}

export class camera {
    instance: cameraSet;
    playersOnCamera: Player[] = [];
    owner: Player | undefined = undefined;
    controlling: Player | undefined = undefined;
    originalOrientation: Vector3;
    config: cameraConfig;
    cameraId: string = "unknown camera";
    constructor(id: string, config: cameraConfig) {
        this.config = config;
        this.owner = config.owner;
        this.instance = config.instance;
        this.cameraId = id;
        this.originalOrientation = config.instance.view.Orientation;
    }
    playerAttemptsToControlCamera(player: Player, orientation: Vector3) {
        if (this.controlling === player) {
            let [rx, ry] = [orientation.X, orientation.Y];
            rx = math.clamp(rx, this.originalOrientation.X - this.config.maxDown, this.originalOrientation.X + this.config.maxUp);
            ry = math.clamp(ry, this.originalOrientation.Y - this.config.maxLeft, this.originalOrientation.Y + this.config.maxRight);

            this.instance.view.Orientation = new Vector3(rx, ry, this.originalOrientation.Z);
        }
    }
    playerStartsViewingCamera(player: Player) {
        this.playersOnCamera.push(player);
        if (player === this.owner) {
            this.controlling = player;
        }
        else if (this.playersOnCamera.indexOf(player) === 0 && (!this.owner || this.playersOnCamera.indexOf(this.owner) === -1)) {
            this.controlling = player;
        }
    }
    playerStopsViewingCamera(player: Player) {
        let index = this.playersOnCamera.indexOf(player);
        if (index !== -1) {
            this.playersOnCamera.remove(index);
        }
        if (player === this.controlling) {
            this.controlling = undefined;
        }
    }
}