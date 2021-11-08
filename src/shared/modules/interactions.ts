import { Players } from "@rbxts/services"
import sohk from "shared/sohk/init";
import { mathf, Threading } from "./System";

class interactions extends sohk.sohkComponent {
    client = Players.LocalPlayer;
    hud = this.client.WaitForChild("PlayerGui").WaitForChild("hud") as ScreenGui;
    information = this.hud.WaitForChild("info") as ImageLabel;
    informationbar = {
        ammoIcon: this.information.WaitForChild("ammoicon") as ImageLabel,
        ammoText: this.information.WaitForChild("ammo") as TextLabel,
        healthBar: {
            red: this.information.WaitForChild("healthred") as Frame,
            green: this.information.WaitForChild("healthred").WaitForChild("healthgreen") as Frame,
            blue: this.information.WaitForChild("healthred").WaitForChild("healthgreen").WaitForChild("healthblue") as Frame,
        },
        ammoBar: {
            red: this.information.WaitForChild("ammored") as Frame,
            grey: this.information.WaitForChild("ammored").WaitForChild("ammogray") as Frame,
        },
        healthIcon: this.information.WaitForChild("healthicon") as ImageLabel,
        healthText: this.information.WaitForChild("health") as TextLabel,
    }
    allowedOverheal: number = 75;
    currentAmmo: number = 0;
    currentMaxAmmo: number = 0;

    constructor() {
        super();

        const calculateAndAffixHealth = (health: number, maxHealth: number) => {
            this.informationbar.healthText.Text = `${health} | ${maxHealth}`;
            let nrml = mathf.normalize(maxHealth, maxHealth + this.allowedOverheal, health);
            if (health < maxHealth) nrml = 0;
            let nrml2 = mathf.normalize(0, maxHealth, health);
            this.informationbar.healthBar.green.Size = UDim2.fromScale(math.clamp(nrml2, 0, 1), 1);
            this.informationbar.healthBar.blue.Size = UDim2.fromScale(math.clamp(nrml, 0, 1), 1);
        }

        const calculateAndAffixAmmo = (ammo: number, maxAmmo: number) => {
            this.informationbar.ammoText.Text = maxAmmo !== -1? `${ammo} | ${maxAmmo}`: '';
            let nrml = mathf.normalize(0, maxAmmo, ammo);
            this.informationbar.ammoBar.grey.Size = UDim2.fromScale(math.clamp(nrml, 0, 1), 1);
            this.currentAmmo = ammo;
            this.currentMaxAmmo = maxAmmo;
        }

        const calculateAndAffixAbilityCooldown = (ability: 'primary' | 'secondary', length: number) => {

        }

        this.replicationService.remotes.requestPlayerHealth.OnClientInvoke = (health: number, maxHealth: number) => {
            calculateAndAffixHealth(health, maxHealth);
        }
        
        this.replicationService.remotes.requestPlayerAmmo.OnClientInvoke = (ammo: number, maxAmmo: number) => {
            print("recieved ammo");
            calculateAndAffixAmmo(ammo, maxAmmo);
        }

        this.replicationService.remotes.requestPlayerAbilityCooldown.OnClientInvoke = (ability: 'primary' | 'secondary', length: number) => {
            calculateAndAffixAbilityCooldown(ability, length);
        }
        
        const healthThread = Threading.Recursive(() => {
            let [health, maxHealth] = this.replicationService.remotes.requestPlayerHealth.InvokeServer();
            calculateAndAffixHealth(health, maxHealth);
        }, 1 / 15);
        healthThread.start();
        
        const ammoThread = Threading.Recursive(() => {
            let [ammo, maxAmmo] = this.replicationService.remotes.requestPlayerAmmo.InvokeServer();
            calculateAndAffixAmmo(ammo, maxAmmo)
        }, 1 / 15);
        ammoThread.start();
        /*
        const abilityThread = Threading.Recursive(() => {
            
        }, 1 / 15);
        abilityThread.start();*/
        
    }
}

export = interactions