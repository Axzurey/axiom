import partGroup from './classes/partGroup';
import quartEnvironment from './quartEnvironment';

namespace define {
    export function defineRoom(roomId: string, bounding: partGroup) {
        quartEnvironment.rooms[roomId] = {bounding: bounding};
    }
}

export = define;