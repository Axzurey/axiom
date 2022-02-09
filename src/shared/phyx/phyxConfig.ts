import { ReplicatedStorage, RunService } from "@rbxts/services";

namespace phyxConfig {
    function createDir() {
        let f = ReplicatedStorage.FindFirstChild('phyx')
        if (f) return f;
        let d = new Instance('Folder');
        d.Name = 'phyx';
        d.Parent = ReplicatedStorage;

        let remotes = new Instance('Folder');
        remotes.Name = 'Remotes';
        remotes.Parent = d;
        return d;
    }

    export const directory = RunService.IsServer()? createDir(): ReplicatedStorage.WaitForChild('phyx') as Folder;
    export const remotes = directory.WaitForChild('Remotes') as Folder & {[key: string]: RemoteEvent | RemoteFunction}
}

export = phyxConfig;