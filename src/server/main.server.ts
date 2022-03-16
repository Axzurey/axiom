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
import characterHitbox from "./classes/characterHitbox";
import clientService from "shared/services/clientService";
import clientCamera from "shared/classes/clientCamera";
import camera_request_protocol from "shared/protocols/camera_request_protocol";
import get_camera_controlling_protocol from "shared/protocols/get_camera_controlling_protocol";
import { bot } from "./logicCircuit/bot";
import hostileEntityModel from "./quart/aiModels/hostileEntityModel";
import quartUtils from "./quart/quartUtils";

const sk = new sohk();

export class main extends sohk.sohkComponent {
    replChar: characterReplicator = new characterReplicator();
    cameras: camera[] = [];
    cameraIdValue = 0;
    clientdata: Record<userid, clientData>;
    initCams() {
        coroutine.wrap(() => {
            print("cameras being initialized!!!")
            let cambin = Workspace.FindFirstChild('cameras') as Folder;
            cambin.GetChildren().forEach((cameraModel) => {
                let [x, y, z] = CFrame.lookAt(new Vector3(0, 1, 0), new Vector3(0, 0, 0)).ToOrientation()
                let cameraClass = new camera(tostring(this.cameraIdValue), {
                    instance: cameraModel as Model & {
                        view: Part
                    },
                    maxUp: 45,
                    maxDown: 90,
                    maxRight: 45,
                    maxLeft: 90,
                    originalOrientation: new Vector3(x, y, z)
                });
                this.cameraIdValue ++;
                this.cameras.push(cameraClass)
            })
        })()
    }
    initProtocols() {
        camera_request_protocol.connectServer(() => {
            let cameras: Record<string, clientCamera.cameraConfig> = {};
            this.cameras.forEach((cam) => {
                cameras[cam.cameraId] = cam.config;
            })

            return cameras;
        })
        get_camera_controlling_protocol.connectServer((cameraid: string) => {
            this.cameras.forEach((v) => {
                if (v.cameraId === cameraid) {
                    return v.controlling
                }
            })
            return undefined;
        })
    }
    constructor() {
        super();

        const remotes = ReplicatedStorage.FindFirstChild("remotes");

        let clientdata: Record<userid, clientData> = {};
        this.clientdata = clientdata;

        this.initCams()
        this.initProtocols()

        coroutine.wrap(() => {
            for (let i = 0; i < 1; i++) {
                
                let model = ReplicatedStorage.WaitForChild("bot").Clone() as Model

                model.SetPrimaryPartCFrame(
                    new CFrame(model.GetPrimaryPartCFrame().Position.add(new Vector3(math.random(-10, 10), 0, math.random(-10, 10)))))

                model.Parent = Workspace.WaitForChild('bots')

                let clone = model.Clone();

                clone.SetPrimaryPartCFrame(model.GetPrimaryPartCFrame().mul(new CFrame(0, 0, 5)))

                let hitbox = new characterHitbox(clone)

                const amodel = new hostileEntityModel({
                    physicalModel: model,
                    seeksTarget: true,
                })

                let b = Workspace.WaitForChild("roaming").GetChildren() as BasePart[]

                amodel.predefineddLocations = quartUtils.partToPosition(b)

                let botx = new bot({
                    baseHealth: 100,
                    maxHealth: 100,
                    model: model,
                    hitbox: hitbox,
                    baseSpeed: 10,
                    stationary: false,
                    invincible: true,
                    aiModel: amodel
                })
            }
        })()

        function t() {
            let character = Workspace.WaitForChild('fae') as Model;

            let clone = character.Clone();

            clone.SetPrimaryPartCFrame(character.GetPrimaryPartCFrame().mul(new CFrame(0, 0, 5)))

            let hitbox = new characterHitbox(clone)

            env.characterHitboxes[`bot:1:hitbox`] = hitbox;

            const cls = new characterClass(undefined, hitbox, character);

            env.characterClasses[132] = cls;
        }

        t()

        Players.PlayerAdded.Connect((client) => {

            let character = client.Character || client.CharacterAdded.Wait()[0];
            character.Archivable = true;

            let clone = character.Clone();
            clone.Archivable = true
            clone.Name = 'hitbox'
            let hitbox = new characterHitbox(clone)

            env.characterHitboxes[`player:${client.UserId}:hitbox`] = hitbox;

            const cls = new characterClass(client, hitbox, character);

            env.characterClasses[client.UserId] = cls;
            this.replChar.newPlayer(client);

            //load animations for hitbox

            float.playerCharacterClasses[client.UserId] = cls;
            clientdata[client.UserId] = {
                charClass: cls,
                loadout: {
                    primary: {
                        name: 'hk416',
                        skin: 'default',
                        module: new hk416_default(client, cls),
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