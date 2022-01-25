import { Workspace } from "@rbxts/services";

interface breachConfig {
    breachRange: number,
    breachShape: Vector3,
    breachType: Enum.PartType,
    allowedNames: string[],
    position: Vector3,
    lookAt: Vector3,
}

export default class breach {
    constructor(config: breachConfig) {
        let shape = config.breachShape;
        let bType = config.breachType;
        let position = config.position;
        let range = config.breachRange;
        let lookAt = config.lookAt;

        let b = new Instance("Part");
        b.Anchored = true;
        b.CanCollide = false;
        b.CanQuery = false;
        b.CanTouch = false;

        b.Size = shape.mul(range);
        b.Shape = bType;
        b.Material = Enum.Material.Neon;
        b.Color = new Color3(1, 1, 1)
        b.CFrame = CFrame.lookAt(position, lookAt);

        b.Parent = Workspace.FindFirstChild('ignore');

        let op = new OverlapParams();
        let results = Workspace.GetPartsInPart(b, op) as BasePart[];
        results.filter((v) => {
            return config.allowedNames.indexOf(v.Name) !== -1;
        });
        
        results.forEach((v) => {
            coroutine.wrap(() => {
                let newPart = v.SubtractAsync([b]);
                v.GetChildren().forEach((n) => {
                    n.Parent = newPart;
                })
                newPart.Parent = v.Parent;
                v.Destroy();
            })()
        })
        b.Destroy();
    }
}