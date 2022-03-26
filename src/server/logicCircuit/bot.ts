import gameEntity, { entityConfig } from "server/quart-server/gameEntity";

export class bot extends gameEntity {
    constructor(params: entityConfig) {
        super(params);
    }
}