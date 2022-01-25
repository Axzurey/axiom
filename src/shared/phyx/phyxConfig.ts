import { ReplicatedStorage } from "@rbxts/services";

namespace phyxConfig {
    export const directory = ReplicatedStorage.WaitForChild('phyx') as Folder;
    export const remotes = directory.WaitForChild('Remotes') as Folder & {[key: string]: RemoteEvent | RemoteFunction}
}

export = phyxConfig;