import { RunService, TweenService, Players, Workspace } from "@rbxts/services";
import elastic from "shared/modules/elastic";
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

interface multiplierCallback {
    value: NumberValue | IntValue,
    disconnect: () => void,
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
    //private recoil = spring.create(15, 50, 3, 15);
    private spring = new Instance('NumberValue')

    private elastic = new elastic(0);

    private multiplierCallbacks: multiplierCallback[] = [];

    private lastshove: number = tick();

    constructor() {
        let backdrop = new Instance("ScreenGui");
        backdrop.Name = 'crosshair:backdrop';
        backdrop.IgnoreGuiInset = true;
        backdrop.Parent = client.WaitForChild("PlayerGui");
        for (const [i, v] of pairs(this.hairs)) {
            v.instance.Name = i;
            v.instance.AnchorPoint = new Vector2(.5, .5);
            v.instance.Selectable = false;
            v.instance.Size = UDim2.fromOffset(10, 10);
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
        let offset = this.calculateOffset();
        for (const [index, value] of pairs(this.hairs)) {
            value.instance.ImageTransparency = this.coil.Value;
            let position = value.basePosition.mul(offset);
            let bsp = c.ViewportSize.div(2);
            value.instance.Position = UDim2.fromOffset(position.X + bsp.X, position.Y + bsp.Y);
        }
    }
    addMultiplierValue(value: NumberValue | IntValue) {
        let t = {
            value: value,
            disconnect: () => {
                let index = this.multiplierCallbacks.indexOf(t);
                if (index !== -1) {
                    this.multiplierCallbacks.remove(index);
                }
            }
        }
        return t;
    }
    calculateOffset() {

        let offset = (math.clamp(this.elastic.p, 0, this.upperClamp)) + 1;
        offset = mathf.lerp(0, offset, 1 - this.coil.Value);
        
        let multiplier = 1;
        this.multiplierCallbacks.forEach((v) => {
            multiplier += v.value.Value;
        })
        offset *= multiplier;
        return offset;
    }
    getSpreadDirection(camera: Camera) {
        let screenSizeMid = camera.ViewportSize.sub(new Vector2(0, 36*2)).div(2);
        let random = new Random();

        let offset = this.calculateOffset();

        let sens = 10;

        let up = random.NextNumber(-offset * sens, offset * sens);
        let right = random.NextNumber(-offset * sens, offset * sens);

        let ray = camera.ScreenPointToRay(screenSizeMid.X + right, screenSizeMid.Y + up);

        return ray.Direction;
    }
    pushRecoil(force: number, length: number, incremental: boolean = true) {
        /*let info = new TweenInfo(.1, Enum.EasingStyle.Quad, Enum.EasingDirection.InOut);
        let infoClose = new TweenInfo(.2, Enum.EasingStyle.Quad, Enum.EasingDirection.InOut);
        coroutine.wrap(() => {
            TweenService.Create(this.spring, info, {
                Value: force / 2 + (incremental? this.spring.Value: 0)
            }).Play();
            this.lastshove = tick();
            task.wait(length);
            if (tick() - this.lastshove >= 1) {
                TweenService.Create(this.spring, infoClose, {
                    Value: 0
                }).Play();
            }
        })()*/
        this.elastic.s = 10;
        this.elastic.d = 1;
        this.elastic.Accelerate(force * 10);
        this.lastshove = tick();
        coroutine.wrap(() => {
            task.wait(length);
            if (tick() - this.lastshove > .25) {
                //this.elastic.Accelerate(0)
            } 
        })()
        //examine some recoil scripts
        //this.recoil.shove(new Vector3(force, 0, 0));
    }
}