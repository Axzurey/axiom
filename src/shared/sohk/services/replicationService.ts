import { ReplicatedStorage, RunService } from "@rbxts/services";
import remotes from "../connections/remotes";

if (RunService.IsClient()) {
    for (const [index, value] of pairs(remotes)) {
        remotes[index] = ReplicatedStorage.WaitForChild("sohk").WaitForChild("remotes").WaitForChild(index) as RemoteFunction & RemoteEvent & BindableEvent & BindableFunction;
        value.Destroy();
    }
}

export default class replicationService {
    static remotes = remotes;
    constructor() {}
}