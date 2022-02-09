import { ContextActionService, RunService, UserInputService, Workspace } from "@rbxts/services"

export enum cameraConfig {
    unlimited = math.huge
}

export default class cameraController {
    private adornee: Camera;
    private follow: BasePart;

    locked: boolean = false;
    /**
     * offset from param follow
     */
    headHeightOffset: number = 1;

    private currentCFrame: CFrame;

    cameraAngleX: number = 0;
    cameraAngleY: number = 0;

    maxAngleY: number = 80;
    minAngleY: number = -80;

    maxAngleX: number = cameraConfig.unlimited;
    minAngleX: number = -cameraConfig.unlimited;

    angularMultiplier: {x: number, y: number} = {x: 0, y: 0};

    sensitivityMultiplierX: number = .75;
    sensitivityMultiplierY: number = .75;

    lastCFrame: CFrame;

    constructor(cam: Camera, follow: BasePart) {
        this.adornee = cam;
        this.follow = follow;
        this.currentCFrame = follow.CFrame;
        this.lastCFrame = follow.CFrame;
        let inputAction = ContextActionService.BindAction('cameraInput', (actionName: string, state: Enum.UserInputState, input: InputObject) => {
            if (this.locked) return;
            if (state === Enum.UserInputState.Change) {
                this.cameraAngleX = math.clamp(this.cameraAngleX - input.Delta.X * this.sensitivityMultiplierX, this.minAngleX, this.maxAngleX);
                this.cameraAngleY = math.clamp(this.cameraAngleY - input.Delta.Y * .4 * this.sensitivityMultiplierY, this.minAngleY, this.maxAngleY);
            }
        }, false, Enum.UserInputType.MouseMovement);
    }
    getLast() {
        return this.lastCFrame;
    }
    setCFrame(cf: CFrame) {
        this.currentCFrame = cf;
        this.adornee.CFrame = cf;
    }
    render(beforeAngleDelta?: CFrame[] | undefined, afterAngleDelta?: CFrame[]) {
        /*
        this.adornee.CameraType = Enum.CameraType.Scriptable;
        this.lastCFrame = this.adornee.CFrame;

        UserInputService.MouseBehavior = Enum.MouseBehavior.LockCenter;

        let [followX, followY, followZ] = [this.follow.Position.X, this.follow.Position.Y, this.follow.Position.Z];
        let base = new CFrame(followX, followY + this.headHeightOffset, followZ);

        let final = base
        if (beforeAngleDelta) {
            beforeAngleDelta.forEach((v) => {
                final = final.mul(v);
            })
        }

        final = final
            .mul(CFrame.Angles(0, math.rad(this.cameraAngleX), 0))
            .mul(CFrame.Angles(math.rad(this.cameraAngleY), 0, 0))

        if (afterAngleDelta) {
            afterAngleDelta.forEach((v) => {
                final = final.mul(v);
            })
        }

        let [rx, ry, rz] = final.ToOrientation();

        final = new CFrame(final.Position).mul(CFrame.fromOrientation(rx, ry, rz));

        this.adornee.CFrame = final;
        this.currentCFrame = final;

        return [base.mul(CFrame.Angles(0, math.rad(this.cameraAngleX), 0))
            .mul(CFrame.Angles(math.rad(this.cameraAngleY), 0, 0)), final];*/
        
        let [rx, ry, rz] = this.adornee.CFrame.ToOrientation();

        rx = math.rad(math.clamp(math.deg(rx), this.minAngleX, this.maxAngleX));
        ry = math.rad(math.clamp(math.deg(ry), this.minAngleY, this.maxAngleY));

        this.adornee.CFrame = new CFrame(this.adornee.CFrame.Position).mul(CFrame.fromOrientation(rx, ry, rz));
    }
}