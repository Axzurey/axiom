import { Players, ReplicatedStorage, RunService, Workspace } from "@rbxts/services";
import sohk from "shared/sohk/init";
import mpx_default from "./content/guns/mpx/mpx_default";
import when from "./world";
import { playerAction } from "shared/sohk/types/general";
import characterReplicator from "./characterReplicator";
import { userid, clientData } from "./@server";
import knife_default from "./content/guns/knife/knife_default";
import illusoryDream from "./content/abilities/illustoryDream";
import characterClass from "./character";
import float from "./float";
import weaponCore from "./content/weaponCore";
import ability_Core from "./content/abilitycore";
import mpx_techno from "./content/guns/mpx/mpx_techno";
import laser_turret from "./content/abilities/laser_turret";
import matchService, { roundState, roundStates, stateLengths, teamRoles, teams } from "shared/services/matchservice";
import minerva from "shared/minerva";
import classicRoundLoop from "./config/[gm] classic";
import serverReplication from "./helpers/serverReplication";
import glock18_fade from "./content/guns/glock18/glock18_fade";
import knife_saber from "./content/guns/knife/knife_saber";
import { camera } from "./classes/camera";
import muon_item from "./content/abilities/muon_item";
import env from "./dumps/env";
import hk416_default from "./content/guns/hk416/hk416_default";

const sk = new sohk();

export class main extends sohk.sohkComponent {
    replChar: characterReplicator = new characterReplicator();
    cameras: camera[] = [];
    clientdata: Record<userid, clientData>;
    constructor() {
        super();

        const remotes = ReplicatedStorage.FindFirstChild("remotes");

        let clientdata: Record<userid, clientData> = {};
        this.clientdata = clientdata;

        Players.PlayerAdded.Connect((client) => {
            const cls = new characterClass(client);
            env.characterClasses[client.UserId] = cls;
            this.replChar.newPlayer(client);
            float.playerCharacterClasses[client.UserId] = cls;
            clientdata[client.UserId] = {
                charClass: cls,
                loadout: {
                    primary: {
                        name: 'mpx',
                        skin: 'default',
                        module: new mpx_default(client, cls),
                    },
                    secondary: {
                        name: 'glock18',
                        skin: 'fade',
                        module: new glock18_fade(client, cls),
                    },
                    melee: {
                        name: 'knife',
                        skin: 'saber',
                        module: new knife_saber(client, cls),
                    },
                    primaryAbility: {
                        name: 'Illusory Dream',
                        module: new illusoryDream(client, cls),
                    },
                    secondaryAbility: {
                        name: 'Laser Turret',
                        module: new laser_turret(client, cls),
                    },
                    extra1: {
                        name: 'Muon Core',
                        skin: 'blank',
                        module: new muon_item(client, cls),
                    }
                }
            }
        })

        const loadreq = remotes?.FindFirstChild("requestLoad") as RemoteFunction
        loadreq.OnServerInvoke = function(client: Player, ...args: unknown[]) {
            let pos = args[0] as 'primary' | 'melee' | 'secondary';
            if (!clientdata[client.UserId].loadout[pos]) return;
            return clientdata[client.UserId].loadout[pos].module.loadRemotes();
        }

        this.replicationService.remotes.requestRemote.OnServerInvoke = function(client: Player, ...args: unknown[]) {
            let pos = args[0] as 'primary' | 'secondary' | 'melee' | 'primaryAbility' | 'secondaryAbility';
            if (pos !== 'melee' && pos !== 'secondary' && pos !== 'primary' && pos !== 'primaryAbility' && pos !== 'secondaryAbility') return;
            return clientdata[client.UserId].loadout[pos].module.loadRemotes();
        }

        const gameModeController = new classicRoundLoop(clientdata);

        type performableAction = 'finishBombPlant' | 'cancelBombPlant' | 'startBombPlant' |
            'startBombDefuse' | 'cancelBombDefuse' | 'finishBombDefuse' | 'dropBomb';

        let isPlayerPlantingBomb: boolean = false;
        let isBombPlanted: boolean = false;
        let playerPlantingBomb: Player | undefined = undefined;
        let bombStartedPlantingTime: number = 0;
        let bombPlantedTime: number = 0;

        let isPlayerDefusingBomb: boolean = false;
        let playerDefusingBomb: Player | undefined = undefined;
        let defusingStartedTime: number = 0;
        let bombDefusedTime: number = 0;
        let isBombDefused: boolean = false;

        let playerWithBomb: Player | undefined = undefined;
        let playerCanPickUpBomb: boolean = false;

        let roundNumber: number = 1;

        let timer: number = 0;
        let roundState: roundState = 'selection';

        let currentTeamRoles: Record<teams, teamRoles> = {
            [teams.alpha]: teamRoles.attack,
            [teams.beta]: teamRoles.defend,
            [teams.bot]: teamRoles.void,
        };

        let teamPoints: Record<teams, number> = {
            [teams.alpha]: 0,
            [teams.beta]: 0,
            [teams.bot]: 0,
        };
        
        let teamMembers: Record<teams, number[]> = { //userids of team members
            [teams.alpha]: [],
            [teams.beta]: [],
            [teams.bot]: [],
        };

        function checkForWinner() {
            let winner: teams = teams.alpha;
            if (isBombDefused) {
                for (let [i, v] of pairs(currentTeamRoles)) {
                    if (v === teamRoles.defend) {
                        winner = i;
                    }
                }
            }
            else if (isBombPlanted) {
                for (let [i, v] of pairs(currentTeamRoles)) {
                    if (v === teamRoles.attack) {
                        winner = i;
                    }
                    
                }
            }
            else {
                for (let [i, v] of pairs(currentTeamRoles)) {
                    if (v === teamRoles.defend) {
                        winner = i;
                    }
                }
            }
            return winner;
        }

        function nextState(override?: roundState) {
            let index = roundStates.indexOf(roundState);
            let nextIndex = index + 1;
            if (index === roundStates.size() - 1) {
                nextIndex = 0;
            }
            roundState = roundStates[nextIndex];
            if (override) {
                roundState = override;
            }
            if (roundState === 'selection') {
                roundNumber ++;
            }
            if (roundState === 'roundEnding') {
                let winner = checkForWinner();
                matchService.roundEnded.activate(winner, teamPoints[winner], roundNumber);
            }
            matchService.roundStateUpdated.activate(roundState);
            timer = stateLengths[roundState];
        }

        const matchStep = RunService.Stepped.Connect((_t, dt) => {
            timer = math.clamp(timer - 1 * dt, 0, timer);
            matchService.timerUpdated.activate(timer);
            for (let [i, v] of pairs(teamMembers)) {
                if (i === teams.bot) continue;
                let alivePlayers = 0;
                v.forEach((x) => {
                    let userdata = clientdata[x];
                    if (userdata.charClass.alive) {
                        alivePlayers ++;
                    }
                })
                if (alivePlayers < 1) {
                    //other team won;
                }
            }
            if (timer >= stateLengths[roundState]) {
                if (roundState === 'action' && isPlayerPlantingBomb) {
                    return;
                }
                nextState();
            }
        })

        this.replicationService.remotes.performAction.OnServerEvent.Connect((player, action, ...args: unknown[]) => {
            let ignoreDead = false;
            let dir = clientdata[player.UserId];
            /*if ((action as performableAction) === 'hola') {
                ignoreDead = true;
            }*/
            if (!ignoreDead && !dir.charClass.alive) return;
            switch (action as performableAction) {
                case 'dropBomb':
                    gameModeController.dropBomb(player, true);
                    break;
                case 'startBombPlant':
                    gameModeController.getRound().startBombPlant(player);
                    break;
                case 'cancelBombPlant':
                    gameModeController.getRound().cancelBombPlant(player);
                    break;
                case 'finishBombPlant':
                    //if (roundState !== 'action') return;
                    gameModeController.getRound().completeBombPlant(player);
                    break;
                case 'startBombDefuse':
                    gameModeController.getRound().startBombDefuse(player);
                    break;
                case 'cancelBombDefuse':
                    gameModeController.getRound().cancelBombDefuse(player);
                    break;
                case 'finishBombDefuse':
                    gameModeController.getRound().completeBombDefuse(player);
                    break;
                default:
                    throw `action [${action}] is not a performable action`;
                    break;
            }
        })

        this.replicationService.remotes.act.OnServerEvent.Connect((client, ...args: unknown[]) => {
            let dir = serverReplication.serverReplicationFunctions;
            let f = dir[args[0] as keyof typeof dir] as unknown as (me: this, client: Player, ...args: unknown[]) => void;
            let t = (args as defined[]).shift();
            f(this, client, t, ...args as Parameters<typeof f>);
        })

        this.replicationService.remotes.requestPlayerHealth.OnServerInvoke = (client) => {
            let cl = clientdata[client.UserId].charClass;
            return [cl.health, cl.maxHealth];
        }

        this.replicationService.remotes.requestPlayerAmmo.OnServerInvoke = (client) => {
            for (const [i, v] of pairs(clientdata[client.UserId].loadout)) {
                if ((v.module as weaponCore).equipped) {
                    return [(v.module as weaponCore).ammo, (v.module as weaponCore).maxAmmo + (v.module as weaponCore).ammoOverload, (v.module as weaponCore).reserve];
                }
            }
            return [0, 0];
        }

        this.replicationService.remotes.requestPlayerAbilityAmount.OnServerInvoke = (client: Player, ...args: unknown[]) => {
            let ability = args[0] as 'primary' | 'secondary';
            if (ability !== 'primary' && ability !== 'secondary') return;
            let astf = clientdata[client.UserId].loadout;
            for (const [i, t] of pairs(astf)) {
                if (i !== 'primaryAbility' && i !== 'secondaryAbility') continue;
                return [i, (t.module as ability_Core).amount];
            }
        }

        this.replicationService.remotes.requestPlayerAbilityActive.OnServerInvoke = (client: Player, ...args: unknown[]) => {
            let ability = args[0] as 'primary' | 'secondary';
            if (ability !== 'primary' && ability !== 'secondary') return;
            let astf = clientdata[client.UserId].loadout;
            for (const [i, t] of pairs(astf)) {
                if (i !== 'primaryAbility' && i !== 'secondaryAbility') continue;
                return [i, (t.module as ability_Core).active];
            }
        }

        this.replicationService.remotes.requestPlayerAbilityTimeLeft.OnServerInvoke = (client: Player, ...args: unknown[]) => {
            let ability = args[0] as 'primary' | 'secondary';
            if (ability !== 'primary' && ability !== 'secondary') return;
            let astf = clientdata[client.UserId].loadout;
            for (const [i, t] of pairs(astf)) {
                if (i !== 'primaryAbility' && i !== 'secondaryAbility') continue;
                let op = (t.module as ability_Core).activationSequence? 1: 0;
                return [i, (t.module as ability_Core).timeLeft ^ op, (t.module as ability_Core).activationLength ^ op, (t.module as ability_Core).activationSequence];
            };
        }

        this.replicationService.remotes.requestPlayerAbilityCooldown.OnServerInvoke = (client: Player, ...args: unknown[]) => {
            let ability = args[0] as 'primary' | 'secondary';
            if (ability !== 'primary' && ability !== 'secondary') return;
            let astf = clientdata[client.UserId].loadout;
            for (const [i, t] of pairs(astf)) {
                if (i !== 'primaryAbility' && i !== 'secondaryAbility') continue;
                return [i, (t.module as ability_Core).currentCooldown, (t.module as ability_Core).cooldown];
            }
        }

        this.replicationService.remotes.equipItem.OnServerEvent.Connect((client: Player, ...args: unknown[]) => {
            let weapon = args[0] as string;
            for (const [i, v] of pairs(clientdata[client.UserId].loadout)) {
                if (i === 'primaryAbility' || i === 'secondaryAbility') continue;
                if (v.name === weapon) {
                    (v.module as weaponCore).equip();
                    let dir = serverReplication.serverReplicationFunctions;
                    let f = dir['equip'] as unknown as (me: this, client: Player, ...args: unknown[]) => void;
                    f(this, client, 'equip', v.name, (v as {skin: string}).skin);
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
                        if (index !== 'primary' && index !== 'melee' && index !== 'secondary') return;
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
    }
}

new main();