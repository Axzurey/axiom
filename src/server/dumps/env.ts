import { PhysicsService } from "@rbxts/services";
import characterClass from "server/character";
import characterHitbox from "server/classes/characterHitbox";

namespace env {
    export const characterClasses: Record<number, characterClass> = {}
    export const characterHitboxes: Record<string, characterHitbox> = {};
}

export = env;