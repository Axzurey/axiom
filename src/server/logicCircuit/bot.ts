import gameEntity, { entityConfig } from "server/quart/gameEntity";

export class bot extends gameEntity {
    constructor(params: entityConfig) {
        super(params);
    }
}