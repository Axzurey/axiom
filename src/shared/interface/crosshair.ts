import { RunService, TweenService } from "@rbxts/services";
import spring from "shared/modules/spring";

export default class crosshair {
    instance: Frame;
    direction: Vector2;
    originOffset: number;
    spring = spring.create(15, 30, 10, 15);
    anchor: NumberValue = new Instance('NumberValue');

    alive: boolean = true;
    constructor(direction: Vector2, originOffset: number, size: Vector2, parent: Instance) {
        let frame = new Instance("Frame");
        frame.Size = UDim2.fromOffset(size.X, size.Y);
        frame.Position = UDim2.fromOffset(direction.X * originOffset, direction.Y * originOffset);
        frame.BackgroundColor3 = Color3.fromRGB(140, 251, 143);
        frame.Parent = parent;

        this.instance = frame;
        this.direction = direction;
        this.originOffset = originOffset;

        let connection = RunService.RenderStepped.Connect((dt) => {
            if (!this.alive) {
                connection.Disconnect();
                return;
            }
            let update = this.spring.update(dt);
            let newvector = this.direction.mul(update.X + this.originOffset);
            this.instance.Position = UDim2.fromOffset(newvector.X, newvector.Y)
        })
    }
    set(offset: number, time: number) {
        TweenService.Create(this.anchor, new TweenInfo(time), {
            Value: offset
        })
    }
    shove(offset: number) {
        this.spring.shove(new Vector3(offset))
    }
    destroy() {
        this.alive = false;
    }
}