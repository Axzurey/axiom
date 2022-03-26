-- Compiled with roblox-ts v1.2.3
local TS = require(game:GetService("ReplicatedStorage"):WaitForChild("rbxts_include"):WaitForChild("RuntimeLib"))
local _services = TS.import(script, TS.getModule(script, "@rbxts", "services"))
local ReplicatedStorage = _services.ReplicatedStorage
local RunService = _services.RunService
local remotes = TS.import(script, game:GetService("ReplicatedStorage"), "TS", "sohk", "connections", "remotes")
if RunService:IsClient() then
	for index, value in pairs(remotes) do
		remotes[index] = ReplicatedStorage:WaitForChild("sohk"):WaitForChild("remotes"):WaitForChild(index)
		value:Destroy()
	end
end
local replicationService
do
	replicationService = setmetatable({}, {
		__tostring = function()
			return "replicationService"
		end,
	})
	replicationService.__index = replicationService
	function replicationService.new(...)
		local self = setmetatable({}, replicationService)
		return self:constructor(...) or self
	end
	function replicationService:constructor()
	end
	replicationService.remotes = remotes
end
return {
	default = replicationService,
}
