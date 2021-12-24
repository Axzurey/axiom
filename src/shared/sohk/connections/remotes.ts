
const remotes = { //RemoteEvent | RemoteFunction
    renderFunction: new Instance('RemoteEvent'),
    updatePlayerAction: new Instance("RemoteEvent"),
    replicateCharacter: new Instance("RemoteEvent"),
    requestRemote: new Instance("RemoteFunction"),
    requestPlayerHealth: new Instance("RemoteFunction"),
    requestPlayerAmmo: new Instance("RemoteFunction"),
    requestPlayerEffects: new Instance("RemoteFunction"),
    requestPlayerAbilityCooldown: new Instance("RemoteFunction"),
    requestPlayerAbilityActive: new Instance("RemoteFunction"),
    requestPlayerAbilityAmount: new Instance("RemoteFunction"),
    requestPlayerAbilityTimeLeft: new Instance("RemoteFunction"),
    toggleData: new Instance("BindableEvent"),
    equipItem: new Instance('RemoteEvent'),
    performAction: new Instance('RemoteEvent'),
}

for (const [index, remote] of pairs(remotes)) {
    remote.Name = index;
}

export = remotes;