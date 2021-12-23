import float from "./float";

namespace world {
    export enum entityType {
        Player, Bot
    }
    export enum team {
        red, blue
    }
    export enum teamType {
        defenders, attackers
    }

    interface roundEndedConnection {
        disconnect: () => void,
        callback: (winner: team) => void,
    }
    interface entityKillConnection {
        disconnect: () => void,
        callback: (killer: Player, killed: Player | undefined, entityType: entityType, hitLocation: float.playerContacts) => void,
    }

    export function playerFiringRemoteThatIsntTheirs(client: Player) {
        print(`${client.Name} is doing illegal things`);
    }
    export function playerPositionDiffTooHigh(client: Player) {
        print(`${client.Name} is movin too fast!`);
    }
    export function playerPositionDeltaTooHigh(client: Player) {
        print(`${client.Name} has a high position delta(maybe they're lagging?)`);
    }

    let entityKillConnections: entityKillConnection[] = [];
    export abstract class entityKilled {
        static connect(callback: (killer: Player, killed: Player | undefined, entityType: entityType, hitLocation: float.playerContacts) => void): entityKillConnection {
            let t: entityKillConnection = {
                disconnect: () => {
                    let i = entityKillConnections.indexOf(t);
                    if (i !== -1) {
                        entityKillConnections.remove(i);
                    }
                },
                callback: callback,
            }
            entityKillConnections.push(t);
            return t;
        }   
        static entityDied(killer: Player, killed: Player | undefined, entityType: entityType, hitLocation: float.playerContacts) {
            entityKillConnections.forEach((v) => {
                coroutine.wrap(() => {
                    v.callback(killer, killed, entityType, hitLocation);
                })()
            })
        }
    }   
    
    export abstract class roundEnded {
        
    }
}

export = world;