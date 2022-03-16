import { RunService, TweenService, Workspace } from "@rbxts/services";
import { paths } from "shared/config/paths";
import interpolations from "shared/functions/interpolations";
import colorfool from "shared/packages/colorfool";
import path from "shared/phyx/path";
import { finisherParams } from "./finisherInfo";

type portal = Model & {
    portal: BasePart,
    gear1: BasePart,
    gear2: BasePart,
    gear3: BasePart,
    centerGear: BasePart,
}

type sword = Model & {
    blade: BasePart,
    outline: BasePart
}
export default function(params: finisherParams) {
    print('hello, it worked', params);

    const portal = path.pathToInstance(paths.mechanicaPortal).Clone() as portal;
    const sword = path.pathToInstance(paths.mechanicaSword).Clone() as sword

    const character = params.character;

    const targetCFrame = character.GetPrimaryPartCFrame();

    const backOffset = targetCFrame.mul(new CFrame(0, 0, -10));

    portal.SetPrimaryPartCFrame(backOffset);
    sword.SetPrimaryPartCFrame(backOffset);

    const defaultSizes: Map<BasePart, Vector3> = new Map();

    portal.GetChildren().forEach((v) => {
        if (v.IsA('BasePart')) {
            defaultSizes.set(v, v.Size);
            v.Size = new Vector3()
        }
    })

    sword.GetChildren().forEach((v) => {
        if (v.IsA('BasePart')) {
            defaultSizes.set(v, v.Size);
            v.Size = new Vector3()
        }
    })

    portal.Parent = Workspace.FindFirstChild('ignore');
    sword.Parent = Workspace.FindFirstChild('ignore');

    defaultSizes.forEach((v, k) => {
        TweenService.Create(k, new TweenInfo(.25, Enum.EasingStyle.Quad, Enum.EasingDirection.InOut), {
            Size: v
        }).Play()
    })

    task.wait(.1);

    let t0 = 0;
    let c1 = RunService.RenderStepped.Connect((dt) => {
        t0 = math.clamp(t0 + 5 * dt, 0, 1);
        let delta = interpolations.interpolateV3(t0, backOffset.Position, targetCFrame.Position, 'quadIn');
        sword.SetPrimaryPartCFrame(CFrame.lookAt(delta, targetCFrame.Position));
        if (t0 >= 1) {
            c1.Disconnect();
        }
    })

    let pulse = new colorfool.effectors.pulse(portal.centerGear);
    pulse.growVector = new Vector3(1, -1, 1);
    pulse.parent = Workspace.FindFirstChild('ignore') as Folder
    pulse.render()

    task.wait(10);

    pulse.destroy();
}