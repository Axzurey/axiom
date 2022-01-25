import { RunService, Workspace } from "@rbxts/services";

export default class tracer {
    constructor(origin: Vector3, direction: Vector3, lifeTime: number, color: Color3) {

        let t = 5;
        let velocity = 1000;

        let bin = new Instance('Part');
        bin.Anchored = true;
        bin.CanCollide = false;
        bin.CanTouch = false;
        bin.CanQuery = false;
        bin.Size = new Vector3();
        bin.Position = origin.add(direction.mul(t));
        bin.Transparency = 1;
        bin.Parent = Workspace.FindFirstChild('ignore');

        let a1 = new Instance('Attachment');
        a1.Position = new Vector3(0, 0, 2);
        a1.Parent = bin;
        let a2 = new Instance('Attachment');
        a2.Position = new Vector3(0, 0, -2);
        a2.Parent = bin;

        let b = new Instance('Trail');
        b.Brightness = 10;
        b.Color = new ColorSequence(color);
        b.Lifetime = .01;
        b.LightInfluence = 0;
        b.FaceCamera = true;
        b.WidthScale = new NumberSequence([
            new NumberSequenceKeypoint(0, .01),
            new NumberSequenceKeypoint(1, 0)
        ]);
        b.MaxLength = 15;


        b.Attachment0 = a1;
        b.Attachment1 = a2;

        b.Parent = bin;

        let start = tick();

        let rs = RunService.RenderStepped.Connect((dt) => {
            t += velocity * dt;
            if (tick() - start >= lifeTime) {
                rs.Disconnect();
                bin.Destroy();
                return;
            }
            let d = origin.add(direction.mul(t));
            bin.CFrame = CFrame.lookAt(d, d.mul(2));
        });
    }
}