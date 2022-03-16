import { RunService } from "@rbxts/services";
import { teamRoles, teams } from "shared/services/matchservice";
import sohk from "shared/sohk/init";
import characterHitbox from "./classes/characterHitbox";
import effect from "./content/effectcore";
import regeneration from "./content/effects/regeneration";

const allEffects: Record<string, typeof effect> = {regeneration: regeneration}; //like that ;)

type character = Model & {
    Humanoid: Humanoid,
    HumanoidRootPart: BasePart,
}

export default class characterClass extends sohk.sohkComponent {
    client: Player | undefined;
    isABot: boolean;

    maxHealth: number = 100;
    health: number = 75;
    alive: boolean = false;
    allowedOverheal: number = 75;

    team: teams = teams.alpha;
    role: teamRoles = teamRoles.attack;

    effects: {name: string, effect: effect}[] = [];
    lastOverheal: number = tick();
    overhealFloatTime: number = 5;
    overhealDecrement: number = 5;

    rappelling: boolean = false;
    lastRappel: number = tick();
    RAPPEL_COOLDOWN: number = 1;

    hitbox: characterHitbox
    character: character
    /**
     * 
     * @param client omit this parameter if it's a bot
     */
    constructor(client: Player | undefined, hitbox: characterHitbox, character: Model) {
        super();
        this.client = client;
        this.isABot = client? false: true
        this.alive = true;

        this.character = character as character;

        this.hitbox = hitbox;

        let conn = RunService.Stepped.Connect((st, dt) => {
            if (!this.client) {conn.Disconnect(); return;}
            let hum = this.client.Character?.FindFirstChildOfClass('Humanoid');
            if (hum) {
                hum.Health = this.health;
                hum.MaxHealth = this.maxHealth; 
            }
            if (tick() - this.lastOverheal > this.overhealFloatTime && this.health > this.maxHealth) {
                this.health = math.clamp(math.floor(this.health - this.overhealDecrement * dt), 
                    this.maxHealth,
                    this.maxHealth + this.allowedOverheal
                )
            }
        })
    }
    hasEffect(effect: string) {
        let pass = false;
        this.effects.forEach((v) => {
            if (v.name === effect) {
                pass = true;
            }
        })
        return pass;
    }
    revive(reviveHealth: number) {
        this.health = reviveHealth;
    }
    inflictEffect(effect: keyof typeof allEffects, length: number) {
        let eff = new allEffects[effect](this);
        let c = {name: effect, effect: eff};
        this.effects.push(c);
    }
    healDamage(health: number, ignoreDead: boolean = false) {
        if (!this.alive && !ignoreDead) return;
        health = math.ceil(health);
        this.health = math.clamp(this.health + health, 0, this.maxHealth + this.allowedOverheal);
        if (this.health > this.maxHealth) {
            this.lastOverheal = tick();
        }
        coroutine.wrap(() => {
            if (!this.client) return;
            this.replicationService.remotes.requestPlayerHealth.InvokeClient(this.client, this.health, this.maxHealth)
        })()
    }
    inflictDamage(damage: number) {
        this.health = math.clamp(this.health - damage, 0, this.maxHealth + this.allowedOverheal);
        if (this.health <= 0) {
            this.alive = false;
        }
        else {
            this.alive = true;
        }
        coroutine.wrap(() => {
            if (!this.client) return;
            this.replicationService.remotes.requestPlayerHealth.InvokeClient(this.client, this.health, this.maxHealth)
        })() 
    }
}