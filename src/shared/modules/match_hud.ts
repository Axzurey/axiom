import { Players, ReplicatedStorage } from "@rbxts/services"
import minerva from "shared/minerva";
import sohk from "shared/sohk/init";
import { mathf, Threading } from "./System";

const _hudFolder = ReplicatedStorage.WaitForChild('hud') as Folder;

export default class match_hud extends sohk.sohkComponent {
    client = Players.LocalPlayer;
    hud = this.client.WaitForChild("PlayerGui").WaitForChild("game_hud") as ScreenGui;
    hudItems = {
        teammateIcon: _hudFolder.WaitForChild('teammate_icon') as Frame & {
            container: Frame & {
                operator_icon: ImageLabel,
            },
            health_red: Frame & {
                health_green: Frame & {
                    health_blue: Frame,
                },
            },
        },
        enemy_icon: _hudFolder.WaitForChild('enemy_icon') as Frame & {
            container: Frame & {
                operator_icon: ImageLabel,
            },
        },
    };
    tree = {
        ammo: {
            'icon_container': this.hud.WaitForChild('ammo').WaitForChild('ammo_icon_container') as Frame,
            'mag': this.hud.WaitForChild('ammo').WaitForChild('mag') as TextLabel,
            'reserve': this.hud.WaitForChild('ammo').WaitForChild('reserve') as TextLabel,
        },
        health: {
            slice1: {
                'gradient': this.hud.WaitForChild('health_bar').WaitForChild('slice1').WaitForChild('img').WaitForChild('UIGradient') as UIGradient,
                'image': this.hud.WaitForChild('health_bar').WaitForChild('slice1').WaitForChild('img') as ImageLabel,
            },
            slice2: {
                'gradient': this.hud.WaitForChild('health_bar').WaitForChild('slice2').WaitForChild('img').WaitForChild('UIGradient') as UIGradient,
                'image': this.hud.WaitForChild('health_bar').WaitForChild('slice2').WaitForChild('img') as ImageLabel,
            },
            slice3: {
                'gradient': this.hud.WaitForChild('health_bar').WaitForChild('slice3').WaitForChild('img').WaitForChild('UIGradient') as UIGradient,
                'image': this.hud.WaitForChild('health_bar').WaitForChild('slice3').WaitForChild('img') as ImageLabel,
            },
            slice4: {
                'gradient': this.hud.WaitForChild('health_bar').WaitForChild('slice4').WaitForChild('img').WaitForChild('UIGradient') as UIGradient,
                'image': this.hud.WaitForChild('health_bar').WaitForChild('slice4').WaitForChild('img') as ImageLabel,
            },
            counter: this.hud.WaitForChild('health_bar').WaitForChild('health_number') as TextLabel,
        },
        primaryAbility: {
            slice1: {
                'gradient': this.hud.WaitForChild('primary_ability').WaitForChild('slice1').WaitForChild('img').WaitForChild('UIGradient') as UIGradient,
                'image': this.hud.WaitForChild('primary_ability').WaitForChild('slice1').WaitForChild('img') as ImageLabel,
            },
            slice2: {
                'gradient': this.hud.WaitForChild('primary_ability').WaitForChild('slice2').WaitForChild('img').WaitForChild('UIGradient') as UIGradient,
                'image': this.hud.WaitForChild('primary_ability').WaitForChild('slice2').WaitForChild('img') as ImageLabel,
            },
            image: this.hud.WaitForChild('primary_ability').WaitForChild('icon') as ImageLabel,
            amount: this.hud.WaitForChild('primary_ability').WaitForChild('amount') as TextLabel,
            keybind: this.hud.WaitForChild('primary_ability').WaitForChild('keybind') as TextLabel,
            instance: this.hud.WaitForChild('primary_ability') as Frame,
            gradient: this.hud.WaitForChild('primary_ability').WaitForChild('UIGradient') as UIGradient,
        },
        secondaryAbility: {
            slice1: {
                'gradient': this.hud.WaitForChild('secondary_ability').WaitForChild('slice1').WaitForChild('img').WaitForChild('UIGradient') as UIGradient,
                'image': this.hud.WaitForChild('secondary_ability').WaitForChild('slice1').WaitForChild('img') as ImageLabel,
            },
            slice2: {
                'gradient': this.hud.WaitForChild('secondary_ability').WaitForChild('slice2').WaitForChild('img').WaitForChild('UIGradient') as UIGradient,
                'image': this.hud.WaitForChild('secondary_ability').WaitForChild('slice2').WaitForChild('img') as ImageLabel,
            },
            image: this.hud.WaitForChild('secondary_ability').WaitForChild('icon') as ImageLabel,
            amount: this.hud.WaitForChild('secondary_ability').WaitForChild('amount') as TextLabel,
            keybind: this.hud.WaitForChild('secondary_ability').WaitForChild('keybind') as TextLabel,
            instance: this.hud.WaitForChild('secondary_ability') as Frame,
            gradient: this.hud.WaitForChild('secondary_ability').WaitForChild('UIGradient') as UIGradient,
        },
        teammateBar: this.hud.WaitForChild('teammate_bar') as Frame,
        enemyBar: this.hud.WaitForChild('enemy_bar') as Frame,
        team_points: this.hud.WaitForChild('team_points').WaitForChild('counter') as TextLabel,
        enemy_points: this.hud.WaitForChild('enemy_points').WaitForChild('counter') as TextLabel,
        phase: this.hud.WaitForChild('phase') as TextLabel,
        timer: this.hud.WaitForChild('timer') as TextLabel,
    }
    currentAmmo: number = 0;
    currentMaxAmmo: number = 0;
    currentReserve: number = 0;
    constructor() {
        super();

        const affixHealth = (health: number, maxHealth: number) => {
            let normalOver = mathf.normalize(maxHealth, 200, health);
            if (health < maxHealth) normalOver = 0;
            let normalBase = math.clamp(mathf.normalize(0, maxHealth, health), 0, 1);
            let degrees = mathf.percentToDegrees(normalBase * 100);
            let degreesExtra = mathf.percentToDegrees(normalOver * 100);
            this.tree.health.slice1.gradient.Rotation = math.clamp(degrees, 0, 180);
            this.tree.health.slice2.gradient.Rotation = math.clamp(degrees, 180, 360);
            this.tree.health.slice3.gradient.Rotation = math.clamp(degreesExtra, 0, 180);
            this.tree.health.slice4.gradient.Rotation = math.clamp(degreesExtra, 180, 360);
            this.tree.health.counter.Text = tostring(health);
            if (health > 25) {
                this.tree.health.counter.TextColor3 = new Color3(0, 0, 0);
            }
            else {
                this.tree.health.counter.TextColor3 = Color3.fromRGB(150, 0, 0);
            }
        }

        const affixAmmo = (ammo: number, maxAmmo: number, reserve: number) => {
            this.tree.ammo.mag.Text = tostring(ammo);
            this.tree.ammo.reserve.Text = tostring(reserve);
            this.currentAmmo = ammo;
            this.currentMaxAmmo = maxAmmo;
            this.currentReserve = reserve;
        }

        const affixAbilityCooldown = (ability: 'primary' | 'secondary', lengthLeft: number, max: number) => {
            print('affixing')
            let nrml = mathf.normalize(0, max, max - lengthLeft);
            let degrees = mathf.percentToDegrees(nrml * 100);
            let index = this.tree[(`${ability}Ability` as 'primaryAbility' | 'secondaryAbility')];
            index.slice1.gradient.Rotation = math.clamp(degrees, 0, 180);
            index.slice2.gradient.Rotation = math.clamp(degrees, 180, 360);
            if (nrml === 1) {
                index.slice1.image.ImageColor3 = new Color3(0, 1, 1);
                index.slice2.image.ImageColor3 = new Color3(0, 1, 1);
            }
            else {
                index.slice1.image.ImageColor3 = new Color3(1, 0, 0);
                index.slice2.image.ImageColor3 = new Color3(1, 0, 0);
            }
        }

        const affixActive = (ability: 'primary' | 'secoondary', active: boolean) => {
            let index = this.tree[(`${ability}Ability` as 'primaryAbility' | 'secondaryAbility')];
        }

        const affixAbilityTimeLeft = (ability: 'primary' | 'secondary', timeLeft: number, length: number) => {
            let index = this.tree[(`${ability}Ability` as 'primaryAbility' | 'secondaryAbility')];
            let nrml = mathf.normalize(0, length, timeLeft);
            index.gradient.Transparency = new NumberSequence(
                [
                    new NumberSequenceKeypoint(0, 0),
                    new NumberSequenceKeypoint(1 - nrml, 0),
                    new NumberSequenceKeypoint(1 - nrml, 1),
                    new NumberSequenceKeypoint(1, 1),
                ]//its giving a weird overlap bugging thing idk check it
            )
        }

        this.replicationService.remotes.requestPlayerAbilityTimeLeft.OnClientInvoke = (ability: 'primary' | 'secondary', timeLeft: number, length: number) => {
            affixAbilityTimeLeft(ability, timeLeft, length);
        }

        this.replicationService.remotes.requestPlayerHealth.OnClientInvoke = (health: number, maxHealth: number) => {
            affixHealth(health, maxHealth);
        }
        
        this.replicationService.remotes.requestPlayerAmmo.OnClientInvoke = (ammo: number, maxAmmo: number, reserve: number) => {
            affixAmmo(ammo, maxAmmo, reserve);
        }

        this.replicationService.remotes.requestPlayerAbilityAmount.OnClientInvoke = (ability: 'primary' | 'secoondary', active: boolean) => {

        }

        this.replicationService.remotes.requestPlayerAbilityCooldown.OnClientInvoke = (ability: 'primary' | 'secondary', lengthLeft: number, max: number) => {
            affixAbilityCooldown(ability, lengthLeft, max);
        }
        
        const healthThread = Threading.Recursive(() => {
            let [health, maxHealth] = this.replicationService.remotes.requestPlayerHealth.InvokeServer();
            affixHealth(health, maxHealth);
        }, 1 / 15);
        healthThread.start();
        
        const ammoThread = Threading.Recursive(() => {
            let [ammo, maxAmmo, reserve] = this.replicationService.remotes.requestPlayerAmmo.InvokeServer();
            affixAmmo(ammo, maxAmmo, reserve);
        }, 1 / 15);
        ammoThread.start();
    }
}