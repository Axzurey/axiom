import { ReplicatedStorage, Workspace } from "@rbxts/services";
import sohk from "shared/sohk/init";
import fps_framework from "shared/modules/fps";
import { unloaded_viewmodel, viewmodel } from "shared/types/fps";

export default abstract class ability_core extends sohk.sohkComponent {
    ctx: fps_framework;
    active: boolean = false;
    
    amount: number = 1;
    useDelay: number = 1;

    cancelOnGunChange: boolean = false;

    equipped: boolean = false;
    forcesUnequip: boolean = false;

    name: string = 'unknown ability';

    viewmodel: viewmodel | undefined = undefined;

    remotes: Record<string, RemoteEvent>;

    canLeanWhileActive = true;
    canSprintWhileActive = true;
    canReloadWhileActive = true;
    canAimWhileActive = true;
    canRappelWhileActive = true;
    canVaultWhileActive = true;
    canInspectWhileActive = true;
    obscuresActions = false;
    
    constructor(ctx: fps_framework, slot: 'primaryAbility' | 'secondaryAbility') {
        super();
        this.ctx = ctx;
        this.remotes = this.replicationService.remotes.requestRemote.InvokeServer(slot);
    }
    update() {}
    trigger() {
        this.remotes.trigger.FireServer(); //attempt to index nil with 'fireserver'
    }
    cancel() {
        
    }
}