import { RunService } from "@rbxts/services";
import characterClass from "server/character";
import sohk from "shared/sohk/init";

export default abstract class ability_Core extends sohk.sohkComponent {
    client: Player;

    amount: number = 0;
    maxAmount: number = 1;
    active: boolean = false;
    /**
     * how long it takes from 0 to get the next charge(seconds)
     */
    timeTillNextIncrease: number | false = false;
    amountPerIncrease: number = 1;
    increasesWithKills: number | false = false;
    /**
     * the current amount of kills that have gone towards this.increasesWithKills
     */
    chachedKillCount: number = 0;
    /**
     * the charge is basically 1 * dt(every second) and increases until it reaches this.timeTillNextIncrease
     * at which it will return to 0
     */
    charge: number = 0;
    cooldown: number = 0;
    cooldownSet: number = 5;

    remotesRequested: boolean = false;
    charclass: characterClass
    slot: string = 'primary';
    constructor(client: Player, charclass: characterClass) {
        super();
        this.client = client;
        this.charclass = charclass;
    }
    superStartCooldown() {
        coroutine.wrap(() => {
            while (true) {
                task.wait(1);
                this.cooldown = math.clamp(this.cooldown - 1, 0, this.cooldown);
                coroutine.wrap(() => {
                    this.replicationService.remotes.requestPlayerAbilityCooldown.InvokeClient(
                        this.client, this.slot, this.cooldown
                    )
                })()
                if (this.cooldown <= 0) break;
            }
        })()
    }
    /**
     * DON'T FORGET TO CALL THIS!
     */
    public init() {
        let lastEpch = tick();
        if (this.timeTillNextIncrease) {
            let increaseConnection = RunService.Stepped.Connect((_time, dt) => {
                this.charge += 1 * dt;
                if (this.charge >= this.timeTillNextIncrease) {
                    this.charge = 0;
                    this.amount += this.amountPerIncrease;
                }
            })
            if (tick() - lastEpch > .1) {
                coroutine.wrap(() => {
                    this.replicationService.remotes.requestPlayerAbilityActive.InvokeClient(
                        this.client, this.slot, this.active
                    )
                })()
                coroutine.wrap(() => {
                    this.replicationService.remotes.requestPlayerAbilityAmount.InvokeClient(
                        this.client, this.slot, this.amount
                    )
                })()
            }
        }
    }
    activate() {

    }
    loadRemotes() {
        if (this.remotesRequested) return;
        this.remotesRequested = true;
        
        let use = new Instance("RemoteEvent");
        use.OnServerEvent.Connect((player) => {
            if (player !== this.client) return;
            this.activate();
        })
        use.Parent = this.dump;
        return {
            trigger: use,
        }
    }
}