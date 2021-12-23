import { Workspace } from "@rbxts/services";

namespace earth {
    export const normals = {
        up: new Vector3(0, 1, 0),
        down: new Vector3(0, -1, 0),
        right: new Vector3(1, 0, 0),
        left: new Vector3(-1, 0, 0),
        front: new Vector3(0, 0, 1),
        back: new Vector3(0, 0, -1),
    }


    export function getHighestNormal(part: Part) {
        const worldup = new Vector3(0, 1, 0);
        let nrmls = [
            part.CFrame.LookVector,
            part.CFrame.UpVector,
            part.CFrame.RightVector,
            part.CFrame.LookVector.mul(-1),
            part.CFrame.UpVector.mul(-1),
            part.CFrame.RightVector.mul(-1),
        ];
        let lowestnormal = new Vector3();
        let lowestdot = math.huge;
        nrmls.forEach((n) => {
            let dot = n.Dot(worldup)
            if (dot < lowestdot) {
                lowestdot = dot;
                lowestnormal = n;
            }
        })
        return lowestnormal;
    }
}

export = earth;