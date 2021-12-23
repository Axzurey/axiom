import { DataStoreService } from "@rbxts/services";
import { neptuneInventoryStructure, neptuneMailboxStructure } from "./neptuneStructures";

const serF = {
    'cframe': (cf: CFrame) => ['cframe', ...cf.GetComponents()],
    'vector3': (v3: Vector3) => ['vector3', v3.X, v3.Y, v3.Z],
    'vector2': (v2: Vector2) => ['vector2', v2.X, v2.Y],
    'color3': (c3: Color3) => ['color3', c3.R, c3.G, c3.B],
    'brickcolor': (bc: BrickColor) => ['brickcolor', bc.Name],
    'udim2': (u2: UDim2) => ['udim2', u2.X.Scale, u2.X.Offset, u2.Y.Scale, u2.Y.Offset],
    'udim': (u: UDim) => ['udim', u.Scale, u.Offset],
    'enum': () => [],
}

interface neptuneDataStructure {
    inventory: neptuneInventoryStructure,
    mailbox: neptuneMailboxStructure,
}

namespace neptune {
    export class database {
        datastore: GlobalDataStore;
        constructor(key: string) {
            this.datastore = DataStoreService.GetDataStore(key);
        }
        updateDataAsync(key: string, transform: (old: unknown) => unknown) {
            return new Promise<[boolean, string?]>((resolve, reject) => {
                try {
                    this.datastore.UpdateAsync(key, transform);
                    resolve([true]);
                }
                catch(e) {
                    reject([false, tostring(e)]);
                }
            })
        }
        setDataAsync(key: string, data: unknown) {
            return new Promise<[boolean, string?]>((resolve, reject) => {
                try {
                    this.datastore.SetAsync(key, data);
                    resolve([true]);
                }
                catch(e) {
                    reject([false, tostring(e)]);
                }
            })
        }
        getDataAsync(key: string) {
            return new Promise<[unknown, string?]>((resolve, reject) => {
                try {
                    resolve([this.datastore.GetAsync(key)]);
                }
                catch(e) {
                    reject([false, tostring(e)]);
                }
            })
        }
        deleteDataAsync(key: string) {
            return new Promise<[boolean, string?]>((resolve, reject) => {
                try {
                    this.datastore.SetAsync(key, undefined);
                    resolve([true]);
                }
                catch(e) {
                    reject([false, tostring(e)]);
                }
            })
        }
    }
}

export = neptune;