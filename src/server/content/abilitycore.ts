import { RunService } from "@rbxts/services";
import characterClass from "server/character";
import sohk from "shared/sohk/init";

export default abstract class ability_Core extends sohk.sohkComponent {
    client: Player;
    alive: boolean = true;

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
    slot: 'primary' | 'secondary' = 'primary';
    constructor(client: Player, charclass: characterClass) {
        super();
        this.client = client;
        this.charclass = charclass;
    }
    superDeductAmount(x: number = 1) {
        this.amount = math.clamp(this.amount - x, 0, this.maxAmount);
        this.replicationService.remotes.requestPlayerAbilityAmount.InvokeClient(
            this.client, this.slot, this.amount
        );
    }
    superToggleActive(a: boolean) {
        this.active = a;
        this.replicationService.remotes.requestPlayerAbilityActive.InvokeClient(
            this.client, this.slot, this.active
        );
    }
    superStartCooldown() {
        this.currentCooldown = this.cooldown;
        let pass = false;
        let conn = RunService.Heartbeat.Connect((dt) => {
            this.currentCooldown = math.clamp(this.currentCooldown - 1 * dt, 0, this.currentCooldown);
            if (this.currentCooldown <= 0 || !this.alive) {conn.Disconnect(); pass = true;};
            this.replicationService.remotes.requestPlayerAbilityCooldown.InvokeClient(
                this.client, this.slot, this.currentCooldown, this.cooldown
            );
        })
        while (!pass) {task.wait()};
    }
    superStartActivation() {
        if (!this.activationSequence) {
            this.replicationService.remotes.requestPlayerAbilityTimeLeft.InvokeClient(
                this.client, this.slot, 1, 1, false
            );
            return;
        }
        this.timeLeft = this.activationLength;
        let conn = RunService.Heartbeat.Connect((dt) => {
            this.timeLeft = math.clamp(this.timeLeft - 1 * dt, 0, this.timeLeft);
            if (this.timeLeft <= 0 || !this.alive) {
                conn.Disconnect();
            }
            this.replicationService.remotes.requestPlayerAbilityTimeLeft.InvokeClient(
                this.client, this.slot, this.timeLeft, this.activationLength, this.activationSequence
            );
        })
    }
    /**
     * DON'T FORGET TO CALL THIS!
     */
    public init() {
        coroutine.wrap(() => {
            this.replicationService.remotes.requestPlayerAbilityAmount.InvokeClient(
                this.client, this.slot, this.amount
            );
        })()
    }
    public activate(args: unknown[]) {

    }
    public destroy() {
        this.alive = false;
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