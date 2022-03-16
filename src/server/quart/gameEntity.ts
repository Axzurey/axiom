import characterHitbox from "server/classes/characterHitbox"
import aiModel from "./quartAiModel"
import quartUtils, { createDefaultEntityHitbox, createDefaultEntityModel } from "./quartUtils"

/**
 * note: hitbox is only for bullets & other hit detection, not collisons
 */
export interface entityConfig {
    baseHealth: number,
    maxHealth: number,
    model: Model | (() => Model),
    hitbox: characterHitbox | Model | (() => Model),
    baseSpeed: number,
    stationary: boolean,
    invincible: boolean,
    aiModel?: aiModel
}

const defaultConfig: entityConfig = {
    baseHealth: 100,
    maxHealth: 100,
    model: createDefaultEntityModel,
    hitbox: createDefaultEntityHitbox,
    baseSpeed: 10,
    stationary: false,
    invincible: false,
}

export default abstract class gameEntity {
    config: entityConfig
    constructor(config: Partial<entityConfig>) {
        this.config = quartUtils.fillDefaults(config, defaultConfig);
    }
    onDeath() {}
    onHeartbeat() {}
    takeDamage(damage: number) {}
    heal(healthIncrement: number) {}
    moveTo(position: Vector3) {}
    rotateTo(rotation: Vector3) {}
    onUpdate(deltaTime: number) {}
}