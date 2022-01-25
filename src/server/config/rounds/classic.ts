import { Workspace, ReplicatedStorage, RunService } from "@rbxts/services";
import minerva from "shared/minerva";
import matchService, { roundState, roundStates, teams, stateLengths } from "shared/services/matchservice";
import classicRoundLoop from "../[gm] classic";

export default class classicRound {
    timer: number = 0;
    roundEnded: boolean = false;

    playerWithBomb: Player | undefined = undefined;

    bombPlanted: boolean = false;
    bombDefused: boolean = false;

    bombBeingPlanted: boolean = false;
    bombBeingDefused: boolean = false;

    timeBombStartedBeingPlanted: number = 0;
    timeBombStartedBeingDefused: number = 0;
    timeBombWasPlanted: number = 0;
    timeBombWasDefused: number = 0;

    playerThatPlantedBomb: Player | undefined = undefined;
    playerThatDefusedBomb: Player | undefined = undefined;

    playerPlantingBomb: Player | undefined = undefined;
    playerDefusingBomb: Player | undefined = undefined;

    bombCanBePickedUp: boolean = false;

    parent: classicRoundLoop;

    roundState: roundState = 'selection';

    constructor(parent: classicRoundLoop) {
        this.parent = parent;
        this.nextState('selection');
        let c = RunService.Heartbeat.Connect((dt) => {
            this.timer = math.clamp(this.timer - 1 * dt, 0, this.timer);
            matchService.timerUpdated.activate(this.timer);
            for (let [i, v] of pairs(this.parent.teamMembers)) {
                if (i === teams.bot) continue;
                let alivePlayers = 0;
                v.forEach((x) => {
                    let userdata = this.parent.clientData[x.UserId];
                    if (userdata.charClass.alive) {
                        alivePlayers ++;
                    }
                })
                if (alivePlayers < 1) {
                    //other team won;
                }
            }
            if (this.timer <= 0) {
                if (this.roundState === 'action' && this.bombBeingPlanted) {
                    return;
                }
                this.nextState();
            }
        })
    }
    nextState(override?: roundState) {
        let index = roundStates.indexOf(this.roundState);
        let nextIndex = index + 1;
        if (roundStates[nextIndex] === 'planted') {
            nextIndex ++;
        }
        if (index === roundStates.size() - 1) {
            nextIndex = 0;
        }
        if (override) {
            this.roundState = override;
        }
        else {
            this.roundState = roundStates[nextIndex];
        }
        if (this.roundState === 'selection') {
            
        }
        else if (this.roundState === 'roundEnding') {
            //let winner = checkForWinner();
            //matchService.roundEnded.activate(winner, this.teamPoints[winner], this.parent.currentRound);
        }
        matchService.roundStateUpdated.activate(this.roundState);
        this.timer = stateLengths[this.roundState];
    }
    startBombPlant(player: Player) {
        if (this.bombPlanted) return;
        if (!player.Character) return
        let p = Workspace.GetPartBoundsInBox(player.Character.GetPrimaryPartCFrame(), new Vector3(.1, .1, .1));
        let foundSite: string | undefined = undefined;
        p.forEach((v) => {
            let f = v.Name.find('bombSite');
            if (f[0]) {
                print(v.Name, '$<found>');
                foundSite = v.Name;
            }
        })//not working??
        if (!foundSite) return;
        //check if the part is the part selected to be the bomb 
        if (this.bombBeingPlanted) {
            throw `player ${this.playerPlantingBomb? this.playerPlantingBomb.Name: '[can not find name]'} is already planting the bomb`
        }
        if (this.bombPlanted) {
            throw `bomb has already been planted`;
        }
        if (foundSite) {
            this.playerPlantingBomb = player;
            this.bombBeingPlanted = true;
            this.timeBombStartedBeingPlanted = tick();
            matchService.playerStartsPlantingBomb.activate(player.Name, this.timeBombWasPlanted);
        }
        else {
            throw `player is not inside the bomb site bounds`;
        }
    }
    cancelBombPlant(player: Player | undefined, overwrite: boolean = false) {
        if (this.bombBeingPlanted) {
            if ((player && this.playerPlantingBomb === player) || overwrite) {
                this.playerPlantingBomb = undefined;
                this.bombBeingPlanted = false;
                this.timeBombStartedBeingPlanted = 0;
                matchService.playerCancelsPlantingBomb.activate(player? player.Name: minerva.serverName, this.timeBombStartedBeingPlanted);
            }
            else {
                throw 'you are not the player planting the bomb';
            }
        }
        else {
            throw 'no player is planting the bomb';
        }
    }
    completeBombPlant(player: Player) {
        if (player !== this.playerPlantingBomb) throw 'player cant finish a plant they didnt start';
        let timeDifference = tick() - this.timeBombStartedBeingPlanted;
        let dfs = 0.75;
        if (timeDifference < minerva.bombPlantTime - dfs) {
            throw `player is taking too short a time to plant the bomb[${timeDifference}]`;
        }
        else {
            if (this.playerPlantingBomb) {
                this.timeBombWasPlanted = tick();
                this.playerPlantingBomb = undefined;
                this.bombBeingPlanted = false;
                this.bombPlanted = true;
                if (!player.Character) return;
                let ignore = new RaycastParams();
                ignore.FilterDescendantsInstances = [Workspace.FindFirstChild('ignore') as Folder, player.Character];
                let result = Workspace.Raycast(player.Character?.GetPrimaryPartCFrame().Position, new Vector3(0, -10, 0), ignore);
                if (!result) throw `no result for bomb plant completion`;
                //FINISH THIS;
                let position = result.Position;
                matchService.playerFinishesPlantingBomb.activate(player.Name, this.timeBombWasPlanted);
                let bomb = ReplicatedStorage.FindFirstChild('gameModels')?.FindFirstChild('bomb_active') as Model;
                minerva.bombActivationSequence(bomb);
                bomb.SetPrimaryPartCFrame(new CFrame(position));
                bomb.Parent = Workspace;
                this.playerThatPlantedBomb = player;
                this.nextState('planted');
            }
            else {
                throw 'no player is planting the bomb';
            }
        }
    }
    startBombDefuse(player: Player) {
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
            if (this.playerDefusingBomb) {
                throw `player [${player.Name}] is already defusing the bomb`;
            }
            else if (this.bombBeingDefused) {
                throw `[unknown] is already defusing the bomb`;
            }
            else {
                if (this.bombDefused) {
                    throw `Bomb has already been defused`;
                }
                else {
                    this.playerDefusingBomb = player; 
                    this.timeBombStartedBeingDefused = tick();
                    this.bombBeingDefused = true;
                    matchService.playerStartsDefusingBomb.activate(player.Name, this.timeBombStartedBeingDefused);
                }
            }
        }
        else {
            throw 'bomb can not be found around the player';
        }
    }
    cancelBombDefuse(player: Player | undefined, overwrite: boolean = false) {
        if (this.bombBeingDefused) {
            if ((player && this.playerDefusingBomb === player) || overwrite) {
                this.playerDefusingBomb = undefined;
                this.bombBeingDefused = false;
                this.timeBombStartedBeingDefused = 0;
                matchService.playerCancelsDefusingBomb.activate(player? player.Name: minerva.serverName, 
                    this.timeBombStartedBeingDefused   
                );
            }
            else {
                throw 'you are not the player defusing the bomb';
            }
        }
        else {
            throw 'no player is defusing the bomb';
        }
    }
    completeBombDefuse(player: Player) {
        if (player !== this.playerDefusingBomb) throw 'player cant finish a defuse they didnt start';
        let tdiff = tick() - this.timeBombStartedBeingDefused
        let dsf = .75;
        if (tdiff < minerva.bombDefuseTime - dsf) {
            throw `player is taking too short a time to defuse the bomb[${tdiff}]`;
        }
        else {
            if (this.playerDefusingBomb) {
                this.timeBombWasDefused = tick();
                this.playerDefusingBomb = undefined;
                this.bombDefused = true;
                matchService.playerFinishesDefusingBomb.activate(player.Name, 
                    this.timeBombWasDefused   
                );
                this.playerThatDefusedBomb = player;
            }
            else {
                throw 'no player is defusing the bomb';
            }
        }
    }
    endRound() {
        this.roundEnded = true;
    }
}