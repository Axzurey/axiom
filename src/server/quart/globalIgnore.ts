export interface globalIgnoreObject {
    value: Instance | string,
    ignoreType: 'name' | 'descendant' | 'instance' | 'partialName'
}

export interface globalIgnoreParams {
    ignores: Record<string, globalIgnoreObject>
}

export default class globalIgnore {
    ignores: Record<string, globalIgnoreObject>
    constructor(params: globalIgnoreParams) {
        this.ignores = params.ignores;
    }
    addIgnore(key: string, config: globalIgnoreObject) {
        if ((config.ignoreType === 'name' || config.ignoreType === 'partialName') && typeOf(config.value) !== 'string') throw `if ignoreType is name, then value must be a string`;
        if ((config.ignoreType === 'descendant' || config.ignoreType === 'instance') && typeOf(config.value) !== 'Instance') throw `if ignoreType is descendant or instance, then value must be an instance`
        this.ignores[key] = config;
    }
    removeIgnore(key: string) {
        delete this.ignores[key]
    }
    isIgnored(instance: BasePart) {
        for (const [i, v] of pairs(this.ignores)) {
            if (v.ignoreType === 'instance') {
                if (instance === v.value) {
                    return true;
                }
            }
            else if (v.ignoreType === 'descendant') {
                if (instance.IsDescendantOf(v.value as Instance)) {
                    return true;
                }
            }
            else if(v.ignoreType === 'name') {
                if (instance.Name === v.value) {
                    return true;
                }
            }
            else if (v.ignoreType === 'partialName') {
                if (instance.Name.find(v.value as string)[0]) {
                    return true
                }
            }
        }
        return false
    }
}