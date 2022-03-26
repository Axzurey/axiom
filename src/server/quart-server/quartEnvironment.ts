import partGroup from "./classes/partGroup";
import _globalIgnore from "./globalIgnore";

namespace quartEnvironment {
    export const globalIgnore = new _globalIgnore({ignores:{}})
    export const eventLoops: Record<'render' | 'stepped' | 'heartbeat', Record<string, RBXScriptConnection>> = {
        render: {},
        stepped: {},
        heartbeat: {}
    }
    export interface roomType {
        bounding: partGroup
    }
    export const rooms: Record<string, roomType> = {}
}

export = quartEnvironment;