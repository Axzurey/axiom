import { Players } from "@rbxts/services";
import { clientData } from "server/@server";
import { teamRoles, teams } from "shared/services/matchservice";
import classicRound from "./rounds/classic";

export default class classicRoundLoop {
    currentRound: number = 1;
    pointsToWin: number = 3;
    rounds: classicRound[] = [];

    teamPoints: Record<teams, number> = {
        [teams.alpha]: 0,
        [teams.beta]: 0,
        [teams.bot]: 0,
    };
    teamRoles: Record<teams, teamRoles> = {
        [teams.alpha]: teamRoles.attack,
        [teams.beta]: teamRoles.defend,
        [teams.bot]: teamRoles.void,
    };
    teamMembers: Record<teams, Player[]> = {
        [teams.alpha]: [],
        [teams.beta]: [],
        [teams.bot]: [],
    };

    clientData: Record<number, clientData>;

    constructor(clientData: Record<number, clientData>) {
        this.clientData = clientData;
        let teamHasReachedGoal: boolean = false; //for when the game ends
        coroutine.wrap(() => {
            while (!teamHasReachedGoal) {
                let round = this.newRound();
                while (!round.roundEnded) task.wait();
            }
        })()
    }
    newRound() {
        let round = new classicRound(this);
        this.rounds.push(round);
        this.currentRound ++;
        return round;
    }
    getRound() {
        return this.rounds[this.currentRound - 2];
    }
    setPlayerWithBomb(player: Player | undefined, skipAll: boolean = false) {
        let round = this.getRound();
        if (!skipAll) {
            if (!round.bombCanBePickedUp) return;
        }
        round.playerWithBomb = player;
    }
    dropBomb(player: Player, skipAll: boolean = false) {
        let round = this.getRound();
        if (!skipAll) {
            round.playerWithBomb = undefined;
        }
        else if (round.playerWithBomb === player) {
            round.playerWithBomb = undefined;
        }
    }
    isPlayerAlive(player: Player) {
        let round = this.getRound();
    }
}