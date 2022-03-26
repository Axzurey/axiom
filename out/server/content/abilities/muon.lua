-- Compiled with roblox-ts v1.2.3
local TS = require(game:GetService("ReplicatedStorage"):WaitForChild("rbxts_include"):WaitForChild("RuntimeLib"))
local ability_Core = TS.import(script, game:GetService("ServerScriptService"), "TS", "content", "abilitycore").default
local muon
do
	local super = ability_Core
	muon = setmetatable({}, {
		__tostring = function()
			return "muon"
		end,
		__index = super,
	})
	muon.__index = muon
	function muon.new(...)
		local self = setmetatable({}, muon)
		return self:constructor(...) or self
	end
	function muon:constructor(client, charclass)
		super.constructor(self, client, charclass)
		self.amount = 2
		self.maxAmount = 2
		self:init()
		coroutine.wrap(function()
			self:superStartCooldown()
		end)()
	end
	function muon:activate()
		if self.active or self.amount <= 0 then
			return nil
		end
		if self.currentCooldown > 0 then
			return nil
		end
		print("activated muon core")
	end
end
return {
	default = muon,
}
