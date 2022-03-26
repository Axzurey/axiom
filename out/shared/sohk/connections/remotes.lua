-- Compiled with roblox-ts v1.2.3
local remotes = {
	renderFunction = Instance.new("RemoteEvent"),
	updatePlayerAction = Instance.new("RemoteEvent"),
	requestRemote = Instance.new("RemoteFunction"),
	requestPlayerHealth = Instance.new("RemoteFunction"),
	requestPlayerAmmo = Instance.new("RemoteFunction"),
	requestPlayerEffects = Instance.new("RemoteFunction"),
	requestPlayerAbilityCooldown = Instance.new("RemoteFunction"),
	requestPlayerAbilityActive = Instance.new("RemoteFunction"),
	requestPlayerAbilityAmount = Instance.new("RemoteFunction"),
	requestPlayerAbilityTimeLeft = Instance.new("RemoteFunction"),
	toggleData = Instance.new("BindableEvent"),
	equipItem = Instance.new("RemoteEvent"),
	performAction = Instance.new("RemoteEvent"),
	act = Instance.new("RemoteEvent"),
}
for index, remote in pairs(remotes) do
	remote.Name = index
end
return remotes
