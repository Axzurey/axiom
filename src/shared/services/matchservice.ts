import connection from 'shared/connections/sohkConnection';

namespace matchService {

    export enum damagableWeapons {
        mpx, knife, greekfire
    }

    export enum naturalDamage {
        height
    }

    export enum teams {
        alpha, beta, bot
    }

    export enum teamRoles {
        defend, attack, void
    }

    export enum damageType {
        penetration, explosion, fire, falling
    }

    interface damageData {
        damage: number,
        damageType: damageType
    }

    export interface killerData {
        playerName: string,
        team: teams,
        with: Record<damagableWeapons & naturalDamage, damageData[]>, //format this for every bit of damage dealt with a gun that doesn't match another;
    }

    export const roundStateConversions: Record<roundState, string> = {
        'action': 'Action Phase',
        'planted': 'Bomb Planted',
        'prep': 'Preperation Phase',
        'roundEnding': 'Round Ended',
        'selection': 'Selection Phase',
    }

    export interface victimData {
        playerName: string,
        team: teams,
    }

    export interface playerStats {
        playerName: string,
        team: teams,
        kills: number,
        deaths: number,
        assists: number,
        health?: number,
        points: number,
    }

    export interface chatMessageData {
        playerName: string,
        message: string, //only allow the message to be sent to teammates for team chat, global for all chat
        teams: teams,
    }

    export type roundState = 'selection' | 'prep' | 'action' | 'planted' | 'roundEnding';
    export const roundStates: roundState[] = ['selection', 'prep', 'action', 'planted', 'roundEnding'];
    export const stateLengths: Record<roundState, number> = {
        selection: 10,
        prep: 10,
        action: 10,
        planted: 10,
        roundEnding: 5,
    }
    /**
     * time planted would be in unix time using tick()
     */
    export class timerUpdated extends connection<(roundTime: number) => void>() {
        static selfName = 'timerUpdate';
    }
    export class roundStateUpdated extends connection<(state: roundState) => void>() {
        static selfName = 'roundState';
    }
    export class playerFinishesDefusingBomb extends connection<(playerName: string, timePlanted: number) => void>() {
        static selfName = 'playerFinishesDefusingBomb';
    }
    export class playerStartsDefusingBomb extends connection<(playerName: string, timeStarted: number) => void>() {
        static selfName = 'playerStartsDefusingBomb';
    }
    export class playerCancelsDefusingBomb extends connection<(playerName: string, timeCancelled: number) => void>() {
        static selfName = 'playerCancelsDefusingBomb';
    }
    export class playerFinishesPlantingBomb extends connection<(playerName: string, timePlanted: number) => void>() {
        static selfName = 'playerFinishesPlantingBomb';
    }
    export class playerStartsPlantingBomb extends connection<(playerName: string, timeStarted: number) => void>() {
        static selfName = 'playerStartsPlantingBomb';
    }
    export class playerCancelsPlantingBomb extends connection<(playerName: string, timeCancelled: number) => void>() {
        static selfName = 'playerCancelsPlantingBomb';
    }
    export class playerSendsChatMessage extends connection<(chatMessageData: chatMessageData) => void>() {
        static selfName = 'playerSendsChatMessage';
    }
    export class playerDies extends connection<(killerData: killerData, victimData: victimData) => void>() {
        static selfName = 'playerGetsKill';
    }
    export class roundEnded extends connection<(winningTeam: teams, points: number, roundNumber: number) => void>() {
        static selfName = 'teamGetsPoint';
    }
    export class playerStatsUpdated extends connection<(playerStats: playerStats) => void>() {
        static selfName = 'playerStatsUpdated';
    }
    export class playerDropsBomb extends connection<() => void>() {
        static selfName = 'playerDropsBomb';
    }
    export class playerPicksUpBomb extends connection<(playerName: string) => void>() {
        static selfName = 'playerPicksUpBomb';
    }
}

export = matchService;