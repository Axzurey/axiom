import { Players } from "@rbxts/services";
import { paths } from "shared/config/paths";
import { mathf } from "shared/modules/System";
import path from "shared/phyx/path";

const client = Players.LocalPlayer;

const playergui = client.WaitForChild('PlayerGui')

type promptInstance = Frame & {
    progress: Frame & {
        centerText: TextLabel,
        left: Frame & {
            cycle: Frame & {
                UIStroke: UIStroke & {
                    UIGradient: UIGradient
                }
            }
        }
        right: Frame & {
            cycle: Frame & {
                UIStroke: UIStroke & {
                    UIGradient: UIGradient
                }
            }
        }
    }
    prefix: TextLabel,
    suffix: TextLabel,
}

export default class actionPrompt {
    instance: promptInstance;
    holder: Frame;
    active: boolean = true;
    constructor(prefix: string, suffix: string, key: Enum.KeyCode | Enum.UserInputType) {
        let instancePath = paths.actionPrompt;
        let instance = path.pathToInstance(instancePath).Clone() as promptInstance;
        this.instance = instance;

        let pr = playergui.WaitForChild('prompts')
        let holder = pr.WaitForChild('holder') as Frame;

        this.holder = holder;

        this.instance.prefix.Text = prefix;
        this.instance.suffix.Text = suffix;
        this.instance.progress.centerText.Text = key.Name.upper();

        this.updatePercentageDelta(0)
    }
    updatePercentageDelta(normalizedPercentage: number) {
        let denormal = mathf.denormalize(0, 360, normalizedPercentage);
        print(denormal)
        this.instance.progress.right.cycle.UIStroke.UIGradient.Rotation = math.clamp(denormal, 0, 180);
        if (denormal > 180) {
            denormal = denormal - 180
        }
        this.instance.progress.left.cycle.UIStroke.UIGradient.Rotation = -180 - math.clamp(denormal, -180, 0);
    }
    changeKey(key: Enum.KeyCode | Enum.UserInputType) {
        if (!this.active) throw `this instance has already been destroyed`
        this.instance.progress.centerText.Text = key.Name.upper();
    }
    show() {
        if (!this.active) throw `this instance has already been destroyed`
        this.instance.Parent = this.holder;
    }
    hide() {
        if (!this.active) throw `this instance has already been destroyed`
        this.instance.Parent = undefined;
    }
    destroy() {
        if (!this.active) throw `this instance has already been destroyed`
        this.instance.Destroy();
        this.active = false;
    }
}