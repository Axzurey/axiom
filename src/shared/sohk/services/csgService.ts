type nonMesh = Part | UnionOperation | NegateOperation

export default class csgService {
    static negateFromAsync(base: BasePart, negative: BasePart[], destroyBase: boolean = true) {
        return new Promise<UnionOperation | string>((resolve, reject) => {
            try {
                let p1 = base.SubtractAsync(negative);
                p1.Parent = base.Parent;
                if (destroyBase) base.Destroy();
                resolve(p1);
            } catch {
                reject('an unknown error occured');
            }
        })
    }
}