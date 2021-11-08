import controllerTypes from './controllers'

namespace instanceTypes {
    export type frameworkmodel = Folder & {
        remotes: Folder & controllerTypes.remoteListeners
    }
}

export = instanceTypes;