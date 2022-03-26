import { RunService } from "@rbxts/services";
import quartUtils from "./quartUtils"

export interface aiModelParams {
    physicalModel: Model | (() => Model),
}

const defaultParams: aiModelParams = {
    physicalModel: quartUtils.createDefaultEntityModel
}
/**
 * an "ai" model
 */
export default class aiModel {
    config: aiModelParams;
    enabled: boolean = true;
    model: Model;
    constructor(config: Partial<aiModelParams>) {
        this.config = quartUtils.fillDefaults(config, defaultParams)
        this.model = (typeOf(config.physicalModel) === 'Instance') ? config.physicalModel as Model: (config.physicalModel as () => Model)()
        let c = RunService.Heartbeat.Connect((dt) => {
            this.onHeartbeat(dt);
        })
    }
    onHeartbeat(dt: number) {}
    disable() {
        this.enabled = false;
    }
    enable() {
        this.enabled = true;
    }
}