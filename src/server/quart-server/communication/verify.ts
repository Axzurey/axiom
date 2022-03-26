import {t} from '@rbxts/t';

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