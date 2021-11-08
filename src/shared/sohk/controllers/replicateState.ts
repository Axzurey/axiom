import controllerTypes from "../types/controllers"
import instanceTypes from '../types/instances'
import renderfunctions from "../functions/render";

export default class replicateStateController {
    private remotelisteners: controllerTypes.remoteListeners;
    constructor(main: instanceTypes.frameworkmodel) {
        this.remotelisteners = {
            renderFunction: main.remotes.renderFunction
        }
        this.remotelisteners.renderFunction.OnClientEvent.Connect((...args: defined[]) => {
            let _functionname = args[0] as keyof typeof renderfunctions;
            args.shift();
            renderfunctions[_functionname](...args as Parameters<typeof renderfunctions[typeof _functionname]>);
        })
    }
}