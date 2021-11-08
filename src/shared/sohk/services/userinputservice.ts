import { UserInputService, Workspace } from "@rbxts/services";
import generalTypes, { unixTime } from "../types/general";

export default class UISCONTROLLER {
    _uisevents: Record<string, RBXScriptConnection> = {};
    _whenKeyLifted: Map<Enum.KeyCode | Enum.UserInputType, {
        callback: (gameProcessed: boolean, unixTime: generalTypes.unixTime) => void,
        disconnect: () => void,
        alive: boolean,
    }[]> = new Map();
    _whenKeyPressed: Map<Enum.KeyCode | Enum.UserInputType, {
        callback: (gameProcessed: boolean, unixTime: generalTypes.unixTime) => void,
        disconnect: () => void,
        alive: boolean,
    }[]> = new Map()
    constructor() {
        this._uisevents.inputBegan = UserInputService.InputBegan.Connect((input, gp) => {
            if (this._whenKeyPressed.has(input.KeyCode) || this._whenKeyPressed.has(input.UserInputType)) {
                let events = this._whenKeyPressed.get(input.KeyCode) || this._whenKeyPressed.get(input.UserInputType);
                events?.forEach((v) => {
                    if (!v.alive) {
                        events?.remove(events?.indexOf(v));
                        return;
                    }
                    coroutine.wrap(v.callback)(gp, os.time());
                });
            }
        })
        this._uisevents.inputEnded = UserInputService.InputEnded.Connect((input) => {
            if (this._whenKeyLifted.has(input.KeyCode) || this._whenKeyLifted.has(input.UserInputType)) {
                let events = this._whenKeyLifted.get(input.KeyCode) || this._whenKeyLifted.get(input.UserInputType);
                events?.forEach((v) => {
                    if (!v.alive) {
                        events?.remove(events?.indexOf(v));
                        return;
                    }
                    coroutine.wrap(v.callback)(false, os.time());
                });
            }
        })
    }
    whenKeyPressed(input: Enum.KeyCode | Enum.UserInputType, callback: (gameProcessed: boolean, unixTime: generalTypes.unixTime) => void) {
        let c = {
            callback: callback,
            disconnect: function() {
                this.alive = false;
            },
            alive: true
        }
        let r = (this._whenKeyPressed.get(input) || []);
        r.push(c);
        this._whenKeyPressed.set(input, r);
    }
    whenKeyLifted(input: Enum.KeyCode | Enum.UserInputType, callback: (gameProcessed: boolean, unixTime: generalTypes.unixTime) => void) {
        let c = {
            callback: callback,
            disconnect: function() {
                this.alive = false;
            },
            alive: true
        }
        let r = (this._whenKeyLifted.get(input) || []);
        r.push(c);
        this._whenKeyLifted.set(input, r);
    };
    getCurrentMovementVector(humanoid: Humanoid) {
        let camera = Workspace.CurrentCamera as Camera;
        let direction = camera.CFrame.VectorToObjectSpace(humanoid.MoveDirection);
        return direction;
    }
}