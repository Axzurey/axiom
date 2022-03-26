import {t} from '@rbxts/t';
import {ReplicatedStorage} from '@rbxts/services';

namespace verify {

    export type indexFilterMap = t.check<any>[]

    export class filter<C extends any[], M extends indexFilterMap> {
        constructor(
            private map: M
        ){}
        /**
         * 
         * @param args, what was sent
         * @returns [true, undefined] if all checks pass
         */
        check(args: C) {
            let t: [boolean, (keyof CheckableTypes)?] = [true, undefined];
            args.forEach((v, i) => {
                if (i > this.map.size() - 1) throw `check is out of range. please examine this class instance constructor`
                let index = this.map[i]
                if (index(v)) {
                    return;
                }
                else {
                    t = [false, typeOf(v)]
                }
            });
            return t;
        }
    }
}

namespace converse {

	type valueOf<T> = T[keyof T]

	function toKV<T extends Record<any, any>>(dict: T) {
		let l: [keyof T, valueOf<T>][] = [];
		for (const [i, v] of pairs(dict)) {
			l.push([i, v as valueOf<T>])
		}
		return l
	}
	function toMap<T extends Record<any, any>>(dictionary: T) {
		return new Map<keyof T, valueOf<T>>([
			...toKV(dictionary)
		])
	}
}

namespace Forest {
	export interface basicProperties {
		Name: string
		Type: keyof CreatableInstances
		Extra?: keyof WritableProperties<BasePart> //not working
		Children?: basicProperties[]
	}

	let x: basicProperties = {
		Name: 'hello',
		Type: 'Folder',
		Children: [],
		Extra: 'Color'
	}

	export abstract class Dryad {
		static basicInstanceDef<T extends basicProperties>(props: basicProperties) {
			function makeChildren(props: basicProperties) {
				/**
				 * TODO
				 */
				let instance = new Instance(props.Type);
				instance.Name = props.Name;

				if (props.Children) {
					props.Children.forEach((v) => {
						let made = makeChildren(v);
						made.Parent = instance;
					})
				}
				return instance;
			}
			return makeChildren;
		}
	}

	export namespace Spirit {
		export function Folder(props: Omit<basicProperties, 'Type'>): basicProperties {
			return {
				Name: props.Name,
				Type: 'Folder',
				Children: props.Children,
			};
		}
		export function RemoteEvent(props: Omit<basicProperties, 'Type'>): basicProperties {
			return {
				Name: props.Name,
				Type: 'RemoteEvent',
				Children: props.Children,
			};
		}
	}
}

Forest.Spirit.Folder({
	Name: 'Blaze:Global',
	Children: [
		Forest.Spirit.Folder({
			Name: 'Remotes',
			Children: [
				Forest.Spirit.RemoteEvent({
					Name: 'connect!',
				})
			],
		})
	]
})

/**
 * global!
 */
namespace BlazeEnvironment {
	export class env {
		static loaded: Folder | undefined = undefined
		static getEnvInstance() {
			if (this.loaded) {
				return this.loaded;
			}
			else {
				let l = new Instance('Folder');
				l.Name = 'Blaze:Global';
				l.Parent = ReplicatedStorage;
				this.loaded = l;
			}
		}
	}
}

class BlazeRemote {
	public instance: RemoteEvent;
	constructor(
		private identifier: string,
	) {
		this.instance = new Instance('RemoteEvent')
		this.instance.Name = this.identifier
	}
}

namespace BlazeServer {
	
}