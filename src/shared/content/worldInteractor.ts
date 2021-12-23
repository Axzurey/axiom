import { Workspace } from "@rbxts/services";
import fps_framework from "shared/modules/fps";
import earth from "shared/packages/earth";
import sohk from "shared/sohk/init";

export default class worldInteractor extends sohk.sohkComponent {
    ctx: fps_framework;
    placementRange: number = 15;
    object: Model;
    constructor(ctx: fps_framework, object: Model) {
        super();
        this.ctx = ctx;
        this.object = object;
        this.object.GetDescendants().forEach((v) => {
            if (v.IsA('BasePart')) {
                v.CanCollide = false;
                v.CanTouch = false;
                v.CanQuery = false;
                v.Anchored = true;
            }
        })
        this.object.Parent = ctx.camera;
    }
    placeInCameraWall() {
        let ignore = new RaycastParams();
        ignore.FilterDescendantsInstances = [this.ctx.character, this.ctx.camera, Workspace.FindFirstChild('ignore') as Folder];
        let cameracf = this.ctx.camera.CFrame;
        let result = Workspace.Raycast(cameracf.Position, cameracf.LookVector.mul(this.placementRange), ignore);
        if (result) {
            let normal = result.Normal;
            let position = result.Position;
            let hit = result.Instance;
            let [_cframe, size] = this.object.GetBoundingBox();
            if (!hit.IsA('Part')) return;
            if (normal === earth.normals.up || normal === earth.normals.down) return;
            
            let clampX = math.clamp(position.X, (hit.Position.X - hit.Size.X / 2) + size.X / 2, 
                (hit.Position.X + hit.Size.X / 2) - size.X / 2);
            let clampZ = math.clamp(position.Z, (hit.Position.Z - hit.Size.Z / 2) + size.X / 2, 
                (hit.Position.Z + hit.Size.Z / 2) - size.X / 2);

            let wallOffset = normal.mul(size.div(2));

            this.object.SetPrimaryPartCFrame(CFrame.lookAt(
                new Vector3(clampX, position.Y, clampZ).add(wallOffset),
                new Vector3(cameracf.LookVector.X, position.Y, cameracf.LookVector.Z)
            ))
        }
        else {

        }
    }
    getSurfaceCFrame(): CFrame | false {
        let ignore = new RaycastParams();
        ignore.FilterDescendantsInstances = [this.ctx.character, this.ctx.camera, Workspace.FindFirstChild('ignore') as Folder];
        let cameracf = this.ctx.camera.CFrame;
        let result = Workspace.Raycast(cameracf.Position, cameracf.LookVector.mul(this.placementRange), ignore);
        if (result) {
            let normal = result.Normal;
            let position = result.Position;
            let hit = result.Instance;
            let size = this.object.PrimaryPart?.Size as Vector3;
            if (!hit.IsA('Part')) return false;
            if (normal === earth.normals.up) {
                //something to make sure the position doesn't overflow off the edge.
                let clampX = math.clamp(position.X, (hit.Position.X - hit.Size.X / 2) + size.X / 2, 
                    (hit.Position.X + hit.Size.X / 2) - size.X / 2)
                let clampZ = math.clamp(position.Z, (hit.Position.Z - hit.Size.Z / 2) + size.X / 2, 
                    (hit.Position.Z + hit.Size.Z / 2) - size.X / 2)
                //if you wanna prohibit, check if clampX is not position.X and same for y
                return CFrame.lookAt(
                    new Vector3(clampX, position.Y, clampZ).add(new Vector3(0, size.Y / 2, 0)), 
                    new Vector3(cameracf.LookVector.X, position.Y, cameracf.LookVector.Z)
                );
            }
            else {
                //remember to clamp the following
                if (hit.Position.Y < position.Y) {
                    let posRemY = new Vector3(position.X, 0, position.Z)
                    let topSurface = hit.Position.Y + (hit.Size.Y / 2);
                    let finalPositionSurface = posRemY.add(new Vector3(0, topSurface, 0));
                    return CFrame.lookAt(
                        finalPositionSurface.add(normal.mul(-1).mul(
                            size.div(2)
                        ).add(new Vector3(0, size.Y / 2, 0))),
                        new Vector3(cameracf.LookVector.X, position.Y, cameracf.LookVector.Z));
                }
                else {
                    let camdownsub = this.ctx.camera.CFrame.Position.Y - this.placementRange;
                    let t = ignore.FilterDescendantsInstances
                    t.push(hit);
                    ignore.FilterDescendantsInstances = t;
                    let result2 = Workspace.Raycast(position, new Vector3(0, camdownsub, 0), ignore);
                    if (result2) {
                        let refixedTargetPosition = result2.Position;
                        return CFrame.lookAt(
                            refixedTargetPosition.add((normal.mul(
                                size.div(2)
                            ))).add(new Vector3(0, size.Y / 2, 0)), 
                            new Vector3(cameracf.LookVector.X, position.Y, cameracf.LookVector.Z));
                    }
                    else {
                        return false;
                    }
                }
            }
        }
        else {
            return false;
        }
    }
    getSurfaceRightInfront(pushForward: number, checkDown: number) {
        let ignore = new RaycastParams();
        ignore.FilterDescendantsInstances = [this.ctx.character, this.ctx.camera, Workspace.FindFirstChild('ignore') as Folder];

        let result = Workspace.Raycast(this.ctx.character.GetPrimaryPartCFrame().
            Position.add(new Vector3(pushForward)), 
            new Vector3(0, checkDown, 0),
            ignore
        );
        let size = (this.object.FindFirstChild('base') as BasePart).Size;
        if (result) {
            let uph = result.Position.add(new Vector3(0, size.Y / 2, 0));
            let cf = this.ctx.camera.CFrame;
            let look = new Vector3(cf.LookVector.X, uph.Y, cf.LookVector.Z);
            let cfx = CFrame.lookAt(uph, look);
            return cfx;
        }
    }
    destroy() {
        this.object.Destroy();
    }
}