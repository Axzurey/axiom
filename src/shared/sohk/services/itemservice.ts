import { RunService, UserInputService } from "@rbxts/services";
export default abstract class item {
    itemName: string = 'unnamed item';
    equipped: boolean = false;
    lastUsed: number = tick();
    cooldown: number = 1;
    itemData: Record<string, any> = {};
    constructor() {}
    triggerEvent() {
        if (RunService.IsClient()) {
            this.itemData.inputevent = UserInputService.InputBegan.Connect((input, gp) => {
                if (gp) return;
                if (!this.equipped) return;
                if (input.UserInputType === Enum.UserInputType.MouseButton1) {
                    if (tick() - this.lastUsed < this.cooldown) return;
                    this.lastUsed = tick();
                    this.activate();
                }
            })
        }
    }
    equip() {
        this.equipped = true
    }
    unequip() {
        this.equipped = false;
    }
    destroy() {
        this.unequip();
        if (this.itemData.inputevent) {
            (this.itemData.inputevent as RBXScriptConnection).Disconnect();
        }
    }
    activate() {
        print('Hello, this is the default activation method!');
    }
}