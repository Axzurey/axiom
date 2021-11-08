declare enum missionRewards {
    experience, credits, gunskin
}

declare enum missionAction {
    hit, abilityUse, roundWin, login, 
}

declare interface missionAccomplishmentParameters {
    hit: {
        hit: BasePart,
        damageDealt: number,
        isAPlayer: boolean,
        isABot: boolean,
        humanoidHealth: number,
    }
}