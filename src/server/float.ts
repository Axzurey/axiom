import { PathfindingService, RunService, Workspace } from "@rbxts/services";
import minerva from "shared/minerva";
import { userid } from "./@server";
import characterClass from "./character";

interface bot {

}

namespace float {
    export enum gunTypes {
        primary, secondary, melee
    }
    export const gunTypeMap = {
        [gunTypes.primary]: ['mpx'],
        [gunTypes.melee]: ['knife'],
    }
    export const playerCharacterClasses: Record<userid, characterClass> = {};
    export type playerActions = 'fire' | 'reload' | 'useGadget'
    export function playerCanPerformAction(player: Player, action: playerActions) {
        switch (action) {
            default:
                let dir = playerCharacterClasses[player.UserId]
                if (dir.alive && !dir.hasEffect('stun')) {
                    return true;
                }
                break;
        }
        return false;
    }
    export enum playerContacts {
        body, limb, head
    }
    const contactMap = {
        'Head': playerContacts.head,
        'UpperTorso': playerContacts.body,
        'LowerTorso': playerContacts.body,
        'RightUpperleg': playerContacts.limb,
        'RightLowerLeg': playerContacts.limb,
        'RightFoot': playerContacts.limb,
        'LeftUpperleg': playerContacts.limb,
        'LeftLowerLeg': playerContacts.limb,
        'LeftFoot': playerContacts.limb,
        'RightUpperArm': playerContacts.limb,
        'RightLowerArm': playerContacts.limb,
        'RightHand': playerContacts.limb,
        'LeftUpperArm': playerContacts.limb,
        'LeftLowerArm': playerContacts.limb,
        'LeftArm': playerContacts.limb,
    }
    export function contactFromHit(hitName: string) {
        return contactMap[hitName as keyof typeof contactMap] || playerContacts.limb;
    }
    export function processImpact(sender: Player | bot, hit: BasePart, reciever: Player | bot) {
        let impactType = contactFromHit(hit.Name);
        return {
            impactLocation: impactType
        }
    }
    export function closestEnemyToPoint(point: Vector3): [Model | undefined, number] {
        let closestDistance = math.huge;
        let closestModel: Model | undefined = undefined;
        Workspace.GetChildren().forEach((v) => {
            let hrp = v.FindFirstChild("HumanoidRootPart") as BasePart;
            if (hrp) {
                let mag = (point.sub(hrp.Position)).Magnitude;
                if (mag < closestDistance) {
                    closestDistance = mag;
                    closestModel = v as Model;
                }
            }
        })
        return [closestModel, closestDistance];
    }
    export function dropBomb(position: Vector3) {
        //clone the bomb and just drop it;
        task.wait(minerva.timeTillDroppedBombCanBePickedUp);
        return true;
    }
}

export = float;