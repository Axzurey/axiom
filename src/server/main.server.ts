import { Players, ReplicatedStorage, Workspace } from "@rbxts/services";
import sohk from "shared/sohk/init";
import mpx_default from "./content/guns/mpx/mpx_default";
import when from "./world";
import { playerAction } from "shared/sohk/types/general";
import characterReplicator from "./characterReplicator";
import { userid, clientData } from "./@server";
import knife_default from "./content/guns/knife_default";
import illusoryDream from "./content/abilities/illustoryDream";
import characterClass from "./character";
import float from "./float";
import weaponCore from "./content/weaponCore";
import ability_Core from "./content/abilitycore";
import mpx_techno from "./content/guns/mpx/mpx_techno";

const sk = new sohk();

class main extends sohk.sohkComponent {
    constructor() {
        super();
        const replChar = new characterReplicator();

        const remotes = ReplicatedStorage.FindFirstChild("remotes");

        let clientdata: Record<userid, clientData> = {};

        const loadreq = remotes?.FindFirstChild("requestLoad") as RemoteFunction
        loadreq.OnServerInvoke = function(client: Player, ...args: unknown[]) {
            let pos = args[0] as 'primary' | 'melee';
            if (pos !== 'primary' && pos !== 'melee') return;
            return clientdata[client.UserId].loadout[pos].module.loadRemotes();
        }

        this.replicationService.remotes.requestRemote.OnServerInvoke = function(client: Player, ...args: unknown[]) {
            let pos = args[0] as 'primary' | 'melee' | 'primaryAbility';
            print('actv');
            if (pos !== 'melee' && pos !== 'primary' && pos !== 'primaryAbility') return;
            print("actv p1");
            return clientdata[client.UserId].loadout[pos].module.loadRemotes();
        }

        this.replicationService.remotes.updatePlayerAction.OnServerEvent.Connect((client, ...args: unknown[]) => {
            let action = args[0] as playerAction;
            if (!action) return;
            let dataset = {
                character: client.Character,
                action: action,
                animations: {},
            }
            Players.GetPlayers().forEach((v) => {
                if (v === client) return;
                this.replicationService.remotes.updatePlayerAction.FireClient(v, dataset)
            })
        })

        this.replicationService.remotes.requestPlayerHealth.OnServerInvoke = (client) => {
            let cl = clientdata[client.UserId].charClass;
            return [cl.health, cl.maxHealth];
        }

        this.replicationService.remotes.requestPlayerAmmo.OnServerInvoke = (client) => {
            for (const [i, v] of pairs(clientdata[client.UserId].loadout)) {
                if ((v.module as weaponCore).equipped) {
                    return [(v.module as weaponCore).ammo, (v.module as weaponCore).maxAmmo + (v.module as weaponCore).ammoOverload];
                }
            }
            return [1, 2];
        }

        this.replicationService.remotes.requestPlayerAbilityAmount.OnServerInvoke = (client: Player, ...args: unknown[]) => {
            let ability = args[0] as 'primary' | 'secondary';
            if (ability !== 'primary' && ability !== 'secondary') return;
            let astf = clientdata[client.UserId].loadout;
            for (const [i, t] of pairs(astf)) {
                if (i !== 'primaryAbility') continue;
                return (t.module as ability_Core).amount;
            }
        }

        this.replicationService.remotes.requestPlayerAbilityActive.OnServerInvoke = (client: Player, ...args: unknown[]) => {
            let ability = args[0] as 'primary' | 'secondary';
            if (ability !== 'primary' && ability !== 'secondary') return;
            let astf = clientdata[client.UserId].loadout;
            for (const [i, t] of pairs(astf)) {
                if (i !== 'primaryAbility') continue;
                return (t.module as ability_Core).active;
            }
        }

        this.replicationService.remotes.requestPlayerAbilityCooldown.OnServerInvoke = (client: Player, ...args: unknown[]) => {
            let ability = args[0] as 'primary' | 'secondary';
            if (ability !== 'primary' && ability !== 'secondary') return;
            let astf = clientdata[client.UserId].loadout;
            for (const [i, t] of pairs(astf)) {
                if (i !== 'primaryAbility') continue;
                return (t.module as ability_Core).cooldown;
            }
        }

        this.replicationService.remotes.equipItem.OnServerEvent.Connect((client: Player, ...args: unknown[]) => {
            let weapon = args[0] as string;
            for (const [i, v] of pairs(clientdata[client.UserId].loadout)) {
                print(v.name, weapon);
                if (v.name === weapon) {
                    (v.module as weaponCore).equip();
                    break;
                }
                else {
                    (v.module as weaponCore).unequip();
                }
            }
        })

        this.replicationService.remotes.toggleData.Event.Connect((m: string, ...args: unknown[]) => {
            switch (m) {
                case 'equip':
                    let player = args[0] as Player;
                    let slot = args[1] as 'primary' | 'secondary' | 'melee';
                    for (const [index, value] of pairs(clientdata[player.UserId].loadout)) {
                        if (index !== 'primary' && index !== 'melee') return;
                        if ((value.module as weaponCore).type === slot) {
                            continue;
                        }
                        else {
                            (value.module as weaponCore).unequip();
                        }
                    }
                    break;
            
                default:
                    error(`invalid case: ${type}`);
                    break;
            }
        })
        
        Players.PlayerAdded.Connect((client) => {
            const cls = new characterClass(client);
            replChar.newPlayer(client);
            float.playerCharacterClasses[client.UserId] = cls;
            clientdata[client.UserId] = {
                charClass: cls,
                loadout: {
                    primary: {
                        name: 'mpx',
                        module: new mpx_techno(client, cls),
                    },
                    melee: {
                        name: 'knife',
                        module: new knife_default(client, cls),
                    },
                    primaryAbility: {
                        name: 'Illusory Dream',
                        module: new illusoryDream(client, cls),
                    },
                }
            }
        })
    }
}

new main();