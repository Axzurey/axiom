import { Players } from "@rbxts/services";
import { paths } from "shared/config/paths";
import path from "shared/phyx/path";

const client = Players.LocalPlayer;

const playergui = client.WaitForChild('PlayerGui')

type promptInstance = Frame & {
    keyblock: Frame & {
        key: TextLabel
    },
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
        this.instance.keyblock.key.Text = key.Name.upper();
    }
    changeKey(key: Enum.KeyCode | Enum.UserInputType) {
        if (!this.active) throw `this instance has already been destroyed`
        this.instance.keyblock.key.Text = key.Name.upper();
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