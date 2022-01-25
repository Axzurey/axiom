import { ReplicatedStorage, RunService, Workspace } from "@rbxts/services";
import { sohkConnection } from "./sohkTypes";

if (RunService.IsServer()) {
    if (!ReplicatedStorage.FindFirstChild('@connections.directory')) {
        let d = new Instance('Folder');
        d.Name = '@connections.directory';
        d.Parent = ReplicatedStorage;
        let call = new Instance("RemoteEvent");
        call.Name = '#connections';
        call.Parent = d;
    }
}

let dir = ReplicatedStorage.WaitForChild('@connections.directory');
let remote = dir.WaitForChild('#connections') as RemoteEvent;

type cnct = (...args: never[]) => unknown;

export default function connection<T extends cnct>() {
    abstract class connection {
        static connections: sohkConnection[] = [];
        /**
         * don't forget to set this
         */
        static selfName: string = 'undefined';
        static main: RBXScriptConnection | undefined;
        static connect(callback: T) {
            if (!this.main) {
                this.main = remote.OnClientEvent.Connect((name: string, ...args: unknown[]) => {
                    if (name === this.selfName) {
                        this.activate(...args as Parameters<T>);
                    }
                })
            }
            let t: sohkConnection = {
                callback: callback,
                disconnect: () => {
                    let index = this.connections.indexOf(t);
                    if (index !== -1) {
                        this.connections.remove(index);
                    }
                }
            }
            this.connections.push(t);
            return t;
        }
        static activate(...args: Parameters<T>) {
            if (RunService.IsServer()) {
                remote.FireAllClients(this.selfName, ...args);
                this.connections.forEach((v) => {
                    coroutine.wrap(() => {
                        v.callback(...args);
                    })()
                })
            }
            else if (RunService.IsClient()) {
                this.connections.forEach((v) => {
                    coroutine.wrap(() => {
                        v.callback(...args);
                    })()
                })
            }
        }
        static activateForServerOnly(...args: Parameters<T>) {
            this.connections.forEach((v) => {
                coroutine.wrap(() => {
                    v.callback(...args);
                })()
            })
        }
        static activateForSingleClient(client: Player, ...args: Parameters<T>) {
            if (RunService.IsClient()) throw 'you can not use this method on the client';
            remote.FireClient(client, ...args);
        }
    }
    return connection;
}