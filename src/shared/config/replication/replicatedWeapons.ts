import animationsMap from "shared/content/mapping/animations";

interface t {
    idle: string
};

const replicatedWeapons: Record<string, Record<string, {animations: t}>> = {
    ["mpx"]: {
        ["default"]: {
            animations: {
                idle: animationsMap.mpx_idle_3p,
            }
        }
    },
    ["glock18"]: {
        ["fade"]: {
            animations: {
                idle: animationsMap.mpx_idle_3p,
            }
        }
    },
    ["knife"]: {
        ["default"]: {
            animations: {
                idle: animationsMap.mpx_idle_3p,
            }
        },
        ["saber"]: {
            animations: {
                idle: animationsMap.mpx_idle_3p,
            }
        },
    }
}

export = replicatedWeapons;