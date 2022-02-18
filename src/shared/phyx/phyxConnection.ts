interface modix {
    callback: ((...args: never[]) => void) | undefined
    disconnect: () => void
    once: boolean
}

export default class phyxConnection<T extends (...args: never[]) => void> {
    connections: modix[] = [];
    constructor(passed: ((args: never[]) => void)[]) {
        passed[0] = (args: never[]) => {
            this.connections.forEach((v, index) => {
                coroutine.wrap(() => {
                    if (v.once) {
                        this.connections.remove(index)
                    }
                    if (v.callback) {
                        v.callback(...args)
                    }
                })()
            })
        }
    }
    connect(callback: T, once: boolean = false) {
        let m: modix = {
            callback: callback,
            disconnect: () => {
                let index = this.connections.indexOf(m);
                if (index !== -1) {
                    this.connections.remove(index)
                }
            },
            once: once
        }
        return m;
    }
    wait() {
        let m: modix = {
            callback: undefined,
            disconnect: () => {
                let index = this.connections.indexOf(m);
                if (index !== -1) {
                    this.connections.remove(index)
                }
            },
            once: true,
        }
        return m;
    }
}