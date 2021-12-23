import { playerContacts } from "server/float";
import { entityKilled, entityType } from "server/world";

namespace missions {
    export const missions = [
        {
            'name': 'Sharp Shooter',
            'goal': 'get 10 headshot kills on players',
            'startValue': 0,
            'goalValue': 10,
            'rewardAmount': 1000,
            'rewardType': missionRewards.experience,
            'listener': (increment: (n: number) => void) => {
                let conn = entityKilled.connect((killer, killed, entity, hitLocation) => {
                    if (hitLocation === playerContacts.head && entity === entityType.Player) {
                        increment(1);
                    }
                })
                return {
                    disconnect: () => {
                        conn.disconnect();
                    }
                }
            }
        },
        {
            'name': 'Trainee',
            'goal': 'kill 50 bots',
            'startValue': 0,
            'goalValue': 50,
            'rewardAmount': 250,
            'rewardType': missionRewards.credits,
            'listener': (increment: (n: number) => void) => {
                let conn = entityKilled.connect((killer, killed, entity, hitLocation) => {
                    if (entity === entityType.Bot) {
                        increment(1);
                    }
                })
                return {
                    disconnect: () => {
                        conn.disconnect();
                    }
                }
            }
        }
    ];
}

export = missions;