import { ReplicatedStorage, RunService } from "@rbxts/services";
import remoteloader from "./remotes";

const directory = ReplicatedStorage

export default function load_all_files() {
    if (RunService.IsClient()) return;
    const main = new Instance("Folder");
    main.Parent = directory;
    main.Name = 'sohk';
    const remotesdirectory = new Instance("Folder");
    remotesdirectory.Name = 'remotes';
    remotesdirectory.Parent = main;
    for (const [name, remote] of pairs(remoteloader)) {
        remote.Name = name
        remote.Parent = remotesdirectory;
    }
}