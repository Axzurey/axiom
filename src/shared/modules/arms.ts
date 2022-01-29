import { ReplicatedStorage, RunService, TweenService } from "@rbxts/services";
import interpolations from "shared/functions/interpolations";
import fps_framework_types from "shared/types/fps";
import { mathf } from "./System";

const left_rest = new CFrame(-1, -.5, .5);
const right_rest = new CFrame(0, -.5, .5);

export default class arms {
    viewmodel: fps_framework_types.arm_viewmodel;
    constructor() {
        let arms = ReplicatedStorage.FindFirstChild('viewmodel:blank') as fps_framework_types.arm_viewmodel;
        this.viewmodel = arms;
    }
    static smoothArmLookAt(camera: Camera, viewmodel: fps_framework_types.viewmodel, arm: 'left' | 'right', position: Vector3) {
        let selected = arm === 'right'? viewmodel.rightMotor: viewmodel.leftMotor;
        /*let t = TweenService.Create(selected, new TweenInfo(.2, Enum.EasingStyle.Sine, Enum.EasingDirection.InOut), {
            CFrame: CFrame.lookAt(selected.Position, position).mul(CFrame.Angles(0, math.pi / 2, 0))
        });
        t.Play();*/
        let t = 0;
        let oTra = selected.Transform;
        let c = RunService.Stepped.Connect((_, dt) => {
            t += 2 * dt;
            if (t > 1) {
                c.Disconnect();
                return;
            }
            let f = left_rest;

            f = viewmodel.rootpart.CFrame.ToWorldSpace(f);
            let target = CFrame.lookAt(f.Position, position);
            let final = viewmodel.rootpart.CFrame.ToObjectSpace(target);

            let camLook = viewmodel.rootpart.CFrame.VectorToObjectSpace(camera.CFrame.LookVector);
            let pointLook = final.LookVector;
            let dot = -camLook.Dot(pointLook);

            let goal = final.mul(new CFrame(camera.CFrame.LookVector.mul(-viewmodel.leftArm.Size.Z * (dot + 1))));
            selected.Transform = selected.Transform.Lerp(goal, math.clamp(t * 2, 0, 1))

        });
        print('playing tween');
    }
}