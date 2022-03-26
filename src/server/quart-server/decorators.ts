import { RunService } from '@rbxts/services';
import quartEnvironment from './quartEnvironment'

interface PropertyDescriptor {
    configurable?: boolean;
    enumerable?: boolean;
    value?: unknown;
    writable?: boolean;
    get?(): any;
    set?(v: any): void;
}

namespace decorators {

    export function render(codename: string) {
        return function(target: any, propertyKey: string, descriptor: TypedPropertyDescriptor<(deltaTime: number) => void>) {
            let c = RunService.RenderStepped.Connect((dt) => {
                if (descriptor.value && typeOf(descriptor.value) === 'function') {
                    (descriptor.value as () => void)();
                }
                else {
                    print("descriptor has no value!")
                }
            })
            quartEnvironment.eventLoops.render[codename] = c;
        }
    }
}

export = decorators;