import { Workspace } from "@rbxts/services";

const renderfunctions = {
    drawPart(position: Vector3, size: Vector3) {
        let p = new Instance("Part");
        p.Size = size;
        p.Position = position;
        p.Parent = Workspace;
    }
}

export = renderfunctions;