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
            let normalOver = mathf.normalize(maxHealth, maxHealth + minerva.allowedOverheal, health);
            if (health < maxHealth) normalOver = 0;
            let normalBase = mathf.normalize(0, maxHealth, health);
            let degrees = mathf.percentToDegrees(normalBase * 100);
            let degreesExtra = mathf.percentToDegrees(normalOver * 100);
            this.tree.health.slice1.gradient.Rotation = math.clamp(degrees, 0, 180);
            this.tree.health.slice2.gradient.Rotation = math.clamp(degrees - 180, 180, 360);
            this.tree.health.counter.Text = tostring(health);
        }

        const affixAmmo = (ammo: number, maxAmmo: number, reserve: number) => {
            this.tree.ammo.mag.Text = tostring(ammo);
            this.tree.ammo.reserve.Text = tostring(reserve);
            this.currentAmmo = ammo;
            this.currentMaxAmmo = maxAmmo;
            this.currentReserve = reserve;
        }

        this.replicationService.remotes.requestPlayerHealth.OnClientInvoke = (health: number, maxHealth: number) => {
            affixHealth(health, maxHealth);
        }
        
        this.replicationService.remotes.requestPlayerAmmo.OnClientInvoke = (ammo: number, maxAmmo: number, reserve: number) => {
            affixAmmo(ammo, maxAmmo, reserve);
        }

        this.replicationService.remotes.requestPlayerAbilityCooldown.OnClientInvoke = (ability: 'primary' | 'secondary', length: number) => {
           
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