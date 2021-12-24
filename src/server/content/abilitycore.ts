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
    cooldown: number = 30;
    currentCooldown: number = 0;

    timeLeft: number = 10;
    activationLength: number = 10;
    activationSequence: boolean = true;

    remotesRequested: boolean = false;
    charclass: characterClass
    slot: string = 'primary';
    constructor(client: Player, charclass: characterClass) {
        super();
        this.client = client;
        this.charclass = charclass;
    }
    superStartCooldown() {
        this.currentCooldown = this.cooldown;
        let pass = false;
        let conn = RunService.Heartbeat.Connect((dt) => {
            this.currentCooldown = math.clamp(this.currentCooldown - 1 * dt, 0, this.currentCooldown);
            if (this.currentCooldown <= 0) {conn.Disconnect(); pass = true;};
            this.replicationService.remotes.requestPlayerAbilityCooldown.InvokeClient(
                this.client, this.slot, this.currentCooldown, this.cooldown
            );
        })
        while (!pass) {task.wait()};
    }
    superStartActivation() {
        this.timeLeft = this.activationLength;
        let conn = RunService.Heartbeat.Connect((dt) => {
            this.timeLeft = math.clamp(this.timeLeft - 1 * dt, 0, this.timeLeft);
            if (this.timeLeft <= 0) {
                conn.Disconnect();
            }
            this.replicationService.remotes.requestPlayerAbilityTimeLeft.InvokeClient(
                this.client, this.slot, this.timeLeft, this.activationLength
            );
        })
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
    activate(args: unknown[]) {

    }
    loadRemotes() {
        if (this.remotesRequested) return;
        this.remotesRequested = true;
        
        let use = new Instance("RemoteEvent");
        use.OnServerEvent.Connect((player, ...args) => {
            if (player !== this.client) return;
            this.activate(args);
        })
        use.Parent = this.dump;
        return {
            trigger: use,
        }
    }
}