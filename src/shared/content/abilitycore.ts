import { ReplicatedStorage, Workspace } from "@rbxts/services";
import sohk from "shared/sohk/init";
import fps_framework from "shared/modules/fps";
import { unloaded_viewmodel, viewmodel } from "shared/types/fps";

export default abstract class ability_core extends sohk.sohkComponent {
    ctx: fps_framework;
    active: boolean = false;
    
    amount: number = 1;
    useDelay: number = 1;

    equipped: boolean = false;

    name: string = 'unknown ability';

    viewmodel: viewmodel | undefined = undefined;

    remotes: Record<string, RemoteEvent>;
    
    constructor(ctx: fps_framework, slot: 'primaryAbility') {
        super();
        this.ctx = ctx;
        this.remotes = this.replicationService.remotes.requestRemote.InvokeServer(slot);
        print(this.remotes, '<-------');
    }
    update() {}
    trigger() {
        this.remotes.trigger.FireServer(); //attempt to index nil with 'fireserver'
    }
}