import { Players, ReplicatedStorage, RunService, Workspace } from "@rbxts/services";
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
import laser_turret from "./content/abilities/laser_turret";
import matchService, { roundState, roundStates, stateLengths, teamRoles, teams } from "shared/services/matchservice";
import minerva from "shared/minerva";

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
            let pos = args[0] as 'primary' | 'melee' | 'primaryAbility' | 'secondaryAbility';
            if (pos !== 'melee' && pos !== 'primary' && pos !== 'primaryAbility' && pos !== 'secondaryAbility') return;
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
        }
        
        let teamMembers: Record<teams, number[]> = { //userids of team members
            [teams.alpha]: [],
            [teams.beta]: [],
            [teams.bot]: [],
        }

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
                    if (playerWithBomb === player) {
                        let dir = clientdata[player.UserId];
                        if (dir.charClass.alive && dir.charClass.role === teamRoles.attack) {
                            playerWithBomb = undefined;
                            let c = player.Character;
                            if (!c) throw `no character`;
                            playerCanPickUpBomb = false;
                            playerCanPickUpBomb = float.dropBomb(c.GetPrimaryPartCFrame().Position);
                            //^ don't forget to finish that
                        }
                        else {
                            throw 'player is dead';
                        }
                    }
                    else {
                        throw `player doesn't have bomb`;
                    }
                    break;
                case 'startBombPlant':
                    //check if player is on the right team
                    //if (roundState !== 'action') return;
                    if (isBombPlanted) return;
                    let name = args[0] as string;
                    if (typeOf(name) !== 'string') return;
                    if (!player.Character) return
                    let part = Workspace.FindFirstChild(name, true) as Part;
                    if (!part) throw `part [${name}] can not be found as a descendant of workspace`;
                    //check if the part is the part selected to be the bomb 
                    if (isPlayerPlantingBomb) {
                        throw `player ${playerPlantingBomb? playerPlantingBomb.Name: '[can not find name]'} is already planting the bomb`
                    }
                    if (isBombPlanted) {
                        throw `bomb has already been planted`;
                    }
                    let pass = false;
                    let parts = Workspace.GetPartsInPart(part);
                    parts.forEach((v) => {
                        if (v.Name === 'HumanoidRootPart' && v.Parent === player.Character) {
                            pass = true;
                        }
                    })
                    if (pass) {
                        playerPlantingBomb = player;
                        isPlayerPlantingBomb = true;
                        bombStartedPlantingTime = tick();
                        matchService.playerStartsPlantingBomb.activate(player.Name, bombStartedPlantingTime);
                    }
                    else {
                        throw `player is not inside the bomb site bounds`;
                    }
                    break;
                case 'cancelBombPlant':
                    if (isPlayerPlantingBomb) {
                        if (playerPlantingBomb === player) {
                            playerPlantingBomb = undefined;
                            isPlayerPlantingBomb = false;
                            bombStartedPlantingTime = 0;
                            matchService.playerCancelsPlantingBomb.activate(player.Name, tick());
                        }
                        else {
                            throw 'you are not the player planting the bomb';
                        }
                    }
                    else {
                        throw 'no player is planting the bomb';
                    }
                    break;
                case 'finishBombPlant':
                    //if (roundState !== 'action') return;
                    if (player !== playerPlantingBomb) throw 'player cant finish a plant they didnt start';
                    let timeDifference = tick() - bombStartedPlantingTime;
                    let dfs = 0.75;
                    if (timeDifference < minerva.bombPlantTime - dfs) {
                        throw `player is taking too short a time to plant the bomb[${timeDifference}]`;
                    }
                    else {
                        if (playerPlantingBomb) {
                            bombPlantedTime = tick();
                            playerPlantingBomb = undefined;
                            isPlayerPlantingBomb = false;
                            isBombPlanted = true;
                            if (!player.Character) return;
                            let ignore = new RaycastParams();
                            ignore.FilterDescendantsInstances = [Workspace.FindFirstChild('ignore') as Folder, player.Character];
                            let result = Workspace.Raycast(player.Character?.GetPrimaryPartCFrame().Position, new Vector3(0, -10, 0), ignore);
                            if (!result) throw 'no result';
                            //FINISH THIS;
                            let position = result.Position;
                            matchService.playerFinishesPlantingBomb.activate(player.Name, bombPlantedTime);
                            let bomb = ReplicatedStorage.FindFirstChild('gameModels')?.FindFirstChild('bomb_active') as Model;
                            minerva.bombActivationSequence(bomb);
                            bomb.SetPrimaryPartCFrame(new CFrame(position));
                            bomb.Parent = Workspace;
                        }
                        else {
                            throw 'no player is planting the bomb';
                        }
                    }
                    break;
                case 'startBombDefuse':
                    let char = player.Character;
                    if (!char) return;
                    let box = Workspace.GetPartBoundsInBox(char.GetPrimaryPartCFrame(), 
                        new Vector3(minerva.defuseRange, minerva.defuseRange, minerva.defuseRange))
                    let bombFound = false;
                    box.forEach((v) => {
                        if (v.Name === minerva.bombName) {
                            bombFound = true;
                        }
                    })
                    if (bombFound) {
                        //check if player is on the right team
                        if (playerDefusingBomb) {
                            throw `player [${player.Name}] is already defusing the bomb`;
                        }
                        else if (isPlayerDefusingBomb) {
                            throw `[unknown] is already defusing the bomb`;
                        }
                        else {
                            if (isBombDefused) {
                                throw `Bomb has already been defused`;
                            }
                            else {
                                playerDefusingBomb = player; 
                                defusingStartedTime = tick();
                                isPlayerDefusingBomb = true;
                                matchService.playerStartsDefusingBomb.activate(player.Name, tick());
                            }
                        }
                    }
                    else {
                        throw 'bomb can not be found around the player';
                    }
                    break;
                case 'cancelBombDefuse':
                    if (isPlayerDefusingBomb) {
                        if (playerDefusingBomb === player) {
                            playerDefusingBomb = undefined;
                            isPlayerDefusingBomb = false;
                            defusingStartedTime = 0;
                            matchService.playerCancelsDefusingBomb.activate(player.Name, tick());
                        }
                        else {
                            throw 'you are not the player defusing the bomb';
                        }
                    }
                    else {
                        throw 'no player is defusing the bomb';
                    }
                    break;
                case 'finishBombDefuse':
                    if (player !== playerDefusingBomb) throw 'player cant finish a defuse they didnt start';
                    let tdiff = tick() - defusingStartedTime;
                    if (tdiff < minerva.bombDefuseTime) {
                        throw `player is taking too short a time to defuse the bomb[${tdiff}]`;
                    }
                    else {
                        if (playerDefusingBomb) {
                            bombDefusedTime = tick();
                            playerDefusingBomb = undefined;
                            isBombDefused = true;
                            matchService.playerFinishesDefusingBomb.activate(player.Name, bombDefusedTime);
                        }
                        else {
                            throw 'no player is defusing the bomb';
                        }
                    }
                    break;
                default:
                    throw `action [${action}] is not a performable action`;
                    break;
            }
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
                return (t.module as ability_Core).amount;
            }
        }

        this.replicationService.remotes.requestPlayerAbilityActive.OnServerInvoke = (client: Player, ...args: unknown[]) => {
            let ability = args[0] as 'primary' | 'secondary';
            if (ability !== 'primary' && ability !== 'secondary') return;
            let astf = clientdata[client.UserId].loadout;
            for (const [i, t] of pairs(astf)) {
                if (i !== 'primaryAbility' && i !== 'secondaryAbility') continue;
                return (t.module as ability_Core).active;
            }
        }

        this.replicationService.remotes.requestPlayerAbilityCooldown.OnServerInvoke = (client: Player, ...args: unknown[]) => {
            let ability = args[0] as 'primary' | 'secondary';
            if (ability !== 'primary' && ability !== 'secondary') return;
            let astf = clientdata[client.UserId].loadout;
            for (const [i, t] of pairs(astf)) {
                if (i !== 'primaryAbility' && i !== 'secondaryAbility') continue;
                return (t.module as ability_Core).cooldown;
            }
        }

        this.replicationService.remotes.equipItem.OnServerEvent.Connect((client: Player, ...args: unknown[]) => {
            let weapon = args[0] as string;
            for (const [i, v] of pairs(clientdata[client.UserId].loadout)) {
                if (i === 'primaryAbility' || i === 'secondaryAbility') continue;
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
                        module: new mpx_default(client, cls),
                    },
                    melee: {
                        name: 'knife',
                        module: new knife_default(client, cls),
                    },
                    primaryAbility: {
                        name: 'Illusory Dream',
                        module: new illusoryDream(client, cls),
                    },
                    secondaryAbility: {
                        name: 'Laser Turret',
                        module: new laser_turret(client, cls),
                    }
                }
            }
        })
    }
}

new main();