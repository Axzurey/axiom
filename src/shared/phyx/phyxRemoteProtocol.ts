import { RunService } from "@rbxts/services";
import phyxConfig from "./phyxConfig";

type remoteProtocol = (...args: never[]) => void;

/**
 * S is args server sends, C is args client sends
 */

export default class phyxRemoteProtocol<C extends remoteProtocol, S extends remoteProtocol> {
    identifier: string;
    remote: RemoteEvent | RemoteFunction;
    connections: {
        disconnect: () => void,
        callback: ((...args: Parameters<C>) => void) | ((...args: Parameters<S>) => void),
    }[] = [];
    constructor(uniqueIdentifier: string, kind: 'Event' | 'Function') {
        this.identifier = uniqueIdentifier;
        if (RunService.IsServer()) {
            let remote = new Instance(`Remote${kind}`);
            remote.Name = uniqueIdentifier;
            remote.Parent = phyxConfig.remotes;
            this.remote = remote;
        }
        else {
            let remote = phyxConfig.remotes.WaitForChild(uniqueIdentifier) as RemoteEvent;
            this.remote = remote;
        }

        if (this.remote.IsA('RemoteEvent')) {
            if (RunService.IsServer()) {
                this.remote.OnServerEvent.Connect((player: Player, ...args: unknown[]) => {
                    let p: Parameters<C> = [player, ...args] as Parameters<C>;
                    this.connections.forEach((v) => {
                        coroutine.wrap(() => {
                            v.callback(...p)
                        })()
                    })
                })
            }
            else {
                this.remote.OnClientEvent.Connect((...args: unknown[]) => {
                    let p: Parameters<S> = [...args] as Parameters<S>;
                    this.connections.forEach((v) => {
                        coroutine.wrap(() => {
                            v.callback(...p)
                        })()
                    })
                })
            }
        }
        else {
            if (RunService.IsServer()) {
                this.remote.OnServerInvoke = (player: Player, ...args: unknown[]) => {
                    let p: Parameters<C> = [player, ...args] as Parameters<C>;
                    if (this.connections[0]) {
                        return this.connections[0].callback(...p)
                    }
                }
            }
            else {
                this.remote.OnClientInvoke = (...args: unknown[]) => {
                    let p: Parameters<S> = [...args] as Parameters<S>;
                    if (this.connections[0]) {
                        return this.connections[0].callback(...p)
                    }
                }
            }
        }
    }
    connectServer(callback: (...args: Parameters<C>) => ReturnType<S>) {
        interface remoteConnection {
            disconnect: () => void,
            callback: (...args: Parameters<C>) => ReturnType<S>,
        }
        let r: remoteConnection = {
            disconnect: () => {
                let index = this.connections.indexOf(r);
                if (index !== -1) {
                    this.connections.remove(index);
                }
            },
            callback: callback
        }
        this.connections.push(r);
        return r;
    }
    connectClient(callback: (...args: Parameters<S>) => ReturnType<C>) {
        interface remoteConnection {
            disconnect: () => void,
            callback: (...args: Parameters<S>) => ReturnType<C>,
        }
        let r: remoteConnection = {
            disconnect: () => {
                let index = this.connections.indexOf(r);
                if (index !== -1) {
                    this.connections.remove(index);
                }
            },
            callback: callback
        }
        this.connections.push(r);
        return r;
    }
    fireClient(client: Player, ...args: Parameters<S>) {
        if (RunService.IsClient()) {
            throw `fireClient can only be called on the server!`
        }
        if (this.remote.IsA('RemoteEvent')) {
            this.remote.FireClient(client, ...args);
        }
        else {
            throw `a remotefunction can not call fireclient`
        }
    }
    /**
     * DO NOT TAKE THE RETURN TYPE FOR GRANTED!
     * ALWAYS VERIFY WHAT COMES BACK FROM THIS
     */
    queryClient(client: Player, ...args: Parameters<S>): ReturnType<C> {
        if (RunService.IsClient()) {
            throw `fireClient can only be called on the server!`
        }
        if (this.remote.IsA('RemoteFunction')) {
            return this.remote.InvokeClient(client, ...args) as ReturnType<C>;
        }
        else {
            throw `a remoteevent can not call queryClient`
        }
    }
    fireServer(...args: Parameters<C>) {
        if (RunService.IsServer()) {
            throw `fireServer can not be called on the client!`;
        }
        if (this.remote.IsA('RemoteEvent')) {
            this.remote.FireServer(...args);
        }
        else {
            throw `a remotefunction can not call queryfire`
        }
    }
    queryServer(...args: Parameters<C>): ReturnType<S> {
        if (RunService.IsServer()) {
            throw `queryServer can not be called on the client!`;
        }
        if (this.remote.IsA('RemoteFunction')) {
            return this.remote.InvokeServer(...args);
        }
        else {
            throw `a remoteevent can not call queryserver`
        }
    }
}

let p = new phyxRemoteProtocol<(l: number) => void, (s: string) => void>('hello', 'Function');
p.connectServer(() => {

})