import { RunService, TweenService, Players, Workspace } from "@rbxts/services";
import spring from "shared/modules/spring";
import { mathf } from "shared/modules/System";
import sohk from "shared/sohk/init";

const client = Players.LocalPlayer;

const c = Workspace.CurrentCamera as Camera;

const rotations = {
    'top': 0,
    'bottom': 180,
    'right': 90,
    'left': 270,
}

export default class crosshairController {
    hairs: Record<'top' | 'bottom' | 'left' | 'right', {instance: ImageLabel, basePosition: Vector2}> = {
        'top': {
            instance: new Instance("ImageLabel"),
            basePosition: new Vector2(0, -20),
        },
        'bottom': {
            instance: new Instance("ImageLabel"),
            basePosition: new Vector2(0, 20),
        },
        'left': {
            instance: new Instance("ImageLabel"),
            basePosition: new Vector2(-20, 0),
        },
        'right': {
            instance: new Instance("ImageLabel"),
            basePosition: new Vector2(20, 0),
        },
    };

    public visible: boolean = false;
    public upperClamp: number = 10;

    private backdrop: ScreenGui;
    private coil = new Instance("NumberValue");
    private recoil = spring.create(15, 50, 3, 15);

    constructor() {
        let backdrop = new Instance("ScreenGui");
        backdrop.Name = 'crosshair:backdrop';
        backdrop.IgnoreGuiInset = true;
        backdrop.Parent = client.WaitForChild("PlayerGui");
        for (const [i, v] of pairs(this.hairs)) {
            v.instance.Name = i;
            v.instance.AnchorPoint = new Vector2(.5, .5);
            v.instance.Selectable = false;
            v.instance.Size = UDim2.fromOffset(15, 15);
            v.instance.Image = 'rbxassetid://8097026573';
            v.instance.BackgroundTransparency = 1;
            v.instance.Rotation = rotations[i];
            v.instance.Parent = backdrop;
        }
        this.backdrop = backdrop;
        RunService.RenderStepped.Connect((dt) => {
            this.onRender(dt);
        });
    }
    public toggleVisible(t: boolean, length: number) {
        TweenService.Create(this.coil, new TweenInfo(length), {
            Value: t? 1: 0
        }).Play();
    }
    private onRender(dt: number) {
        return;
        let offset = (math.clamp(this.recoil.update(dt).X, 0, this.upperClamp)) + 1;
        offset = mathf.lerp(0, offset, 1 - this.coil.Value);
        for (const [index, value] of pairs(this.hairs)) {
            value.instance.ImageTransparency = this.coil.Value;
            let position = value.basePosition.mul(offset);
            let bsp = c.ViewportSize.div(2);
            value.instance.Position = UDim2.fromOffset(position.X + bsp.X, position.Y + bsp.Y);
        }
    }
    pushRecoil(force: number, length: number) {
        this.recoil.shove(new Vector3(force * 15, 0, 0));
    }
}