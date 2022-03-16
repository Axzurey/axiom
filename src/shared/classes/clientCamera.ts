import { Players, RunService } from "@rbxts/services";
import fps_framework from "shared/modules/fps";
import get_camera_controlling_protocol from "shared/protocols/get_camera_controlling_protocol";
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
        originalOrientation: Vector3,
    }
    export class camera extends sohk.sohkComponent {
        instance: cameraSet;
        owner: Player | undefined = undefined;
        controlling: Player | undefined = undefined;
        originalOrientation: Vector3;
        config: cameraConfig;
        cameraId: string = "unknown camera";
        currentlyUsing: boolean = false;
        localCameraCFrame: CFrame;
        localOrientation: Vector3
        constructor(id: string, config: cameraConfig) {
            super();
            this.config = config;
            this.owner = config.owner;
            this.cameraId = id;
            this.instance = config.instance;
            this.originalOrientation = config.originalOrientation;

            this.localCameraCFrame = this.instance.view.CFrame;
            this.localOrientation = config.originalOrientation;
        }
        joinCamera() {
            this.instance.view.LocalTransparencyModifier = 1
            this.currentlyUsing = true;
            this.replicationService.remotes.act.FireServer('joinCamera', this.cameraId);
        }
        leaveCamera() {
            this.instance.view.LocalTransparencyModifier = 0
            this.currentlyUsing = false;
            this.replicationService.remotes.act.FireServer('leaveCamera', this.cameraId);
        }
        getCFrame() {
            coroutine.wrap(() => {
                this.controlling = get_camera_controlling_protocol.queryServer(this.cameraId)
            })()
            if (true) {
                let pos = this.localCameraCFrame.Position;
                let orientation = this.localOrientation;
                return new CFrame(pos).mul(CFrame.Angles(0, math.rad(orientation.X), 0))
                    .mul(CFrame.Angles(math.rad(orientation.Y), 0, 0));
            }
            else {
                return this.instance.view.CFrame;
            }
        }
        getOrientation() {
            if (true) {
                return this.localOrientation;
            }
            else {
                return this.instance.view.Orientation;
            }
        }
        setOrientation(orientationDelta: Vector3) {
            //if (this.controlling !== Players.LocalPlayer) return;
            let [rx, ry] = [orientationDelta.X + this.localOrientation.X, 
                orientationDelta.Y + this.localOrientation.Y];
            rx = math.clamp(rx, this.originalOrientation.X - this.config.maxDown, this.originalOrientation.X + this.config.maxUp);
            ry = math.clamp(ry, this.originalOrientation.Y - this.config.maxLeft, this.originalOrientation.Y + this.config.maxRight);

            this.localOrientation = new Vector3(rx, ry, this.originalOrientation.Z);

            this.replicationService.remotes.act.FireServer('updateCameraOrientation', this.cameraId, this.localOrientation);
        }
    }
}

export = clientCamera;