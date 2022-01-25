import { Players } from "@rbxts/services";
import { main } from "server/main.server";
import { action } from "shared/config/replication/replication";
import verifyTypes from "shared/functions/verifyTypes";
import datatypes from "shared/types/datatypes";

namespace serverReplication {
    export const serverReplicationFunctions: Partial<Record<action, (me: main, player: Player, action: action, ...args: never[]) => void>> = {
        toggleLean: (me: main, player: Player, action: action, direction: 1 | 0 | -1) => {
            if (direction !== 1 && direction !== 0 && direction !== -1) return;
            me.replicationService.remotes.act.FireAllClients(action, player.Character, direction);
        },
        updateCameraOrientation: (me: main, player: Player, action: action, cameraid: string, orientation: Vector3) => {
            let c1 = verifyTypes([{expected: "string", value: cameraid}, {expected: "Vector3", value: orientation}]);
            if (!c1) return;
        },
        joinCamera: (me: main, player: Player, action: action, cameraid: string) => {
            let c1 = verifyTypes([{expected: "string", value: cameraid}]);
            if (!c1) return;
            me.cameras.forEach((v) => {
                if (v.cameraId === cameraid) {
                    v.playerStartsViewingCamera(player);
                }
                else {
                    v.playerStopsViewingCamera(player);
                }
            });
        },
        leaveCamera: (me: main, player: Player, action: action, cameraid: string) => {
            let c1 = verifyTypes([{expected: "string", value: cameraid}]);
            if (!c1) return;
            me.cameras.forEach((v) => {
                if (v.cameraId === cameraid) {
                    v.playerStopsViewingCamera(player);
                }
            });
        },
        toggleRappelling: (me: main, player: Player, action: action, rappel: boolean) => { 
            let c1 = verifyTypes([{expected: "boolean", value: rappel}]);
            if (!c1) return;
            let charclass = me.clientdata[player.UserId].charClass;
            if (charclass.alive && tick() - charclass.lastRappel >= charclass.RAPPEL_COOLDOWN) {
                charclass.rappelling = rappel;
            }
        },
        updateRappelRope: (me: main, player: Player, action: action, position: Vector3) => {
            let c1 = verifyTypes([{expected: "Vector3", value: position}]);
            if (!c1) return;
            me.replicationService.remotes.act.FireAllClients(action, player.Character, position);
        },
        updateMovementState: (me: main, player: Player, action: action, state: datatypes.movementState) => {
            if (!datatypes.movementState[state]) throw `${state} is not a valid movementState`;
            me.replicationService.remotes.act.FireAllClients(action, player.Character, state);
        },
        setCFrame: (me: main, player: Player, action: action, cf: CFrame) => {
            let c1 = verifyTypes([{expected: "CFrame", value: cf}]);
            if (!c1) return;
            let valid = me.replChar.validateCFrame(player, cf);
            if (valid) {
                me.replChar.setCFrame(player, cf);
                Players.GetPlayers().forEach(v => {
                    if (v === player) return;
                    me.replicationService.remotes.act.FireClient(v, action, player.Character, cf);
                })
            }
            else {
                let last = me.replChar.getLast(player);
                me.replicationService.remotes.act.FireClient(player, action, player.Character, last);
            }
        },
        setCamera: (me: main, player: Player, action: action, v3: Vector3) => {
            let c1 = verifyTypes([{expected: "Vector3", value: v3}]);
            if (!c1) return;
            me.replicationService.remotes.act.FireAllClients(action, player.Character, v3);
        },
        equip: (me: main, player: Player, action: action, weaponName: string, weaponSkin: string) => {
            let c1 = verifyTypes([{expected: "string", value: weaponName}, {expected: "string", value: weaponSkin}]);
            if (!c1) return;
            me.replicationService.remotes.act.FireAllClients(action, player.Character, weaponName, weaponSkin);
        }
    }
}

export = serverReplication;