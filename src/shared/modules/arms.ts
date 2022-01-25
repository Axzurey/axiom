import { ReplicatedStorage, RunService, TweenService } from "@rbxts/services";
import interpolations from "shared/functions/interpolations";
import fps_framework_types from "shared/types/fps";

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
        let origin = new CFrame(-2, -2, -.5);
        let c = RunService.Stepped.Connect((_, dt) => {
            t += 1 / 2 * dt;
            if (t >= 4) {
                return;
            }
            let direction = camera.CFrame.Position.add(CFrame.lookAt(camera.CFrame.Position, position).LookVector.mul(5000));
            let rf = viewmodel.rootpart.CFrame;
            let offset = (rf.sub(rf.Position)).Inverse();
            let d = interpolations.interpolate(t, 0, 1, "quadInOut");
            
            selected.Transform = offset.mul(CFrame.lookAt(new Vector3(), direction)).mul(origin)
        });
        print('playing tween');
    }
}