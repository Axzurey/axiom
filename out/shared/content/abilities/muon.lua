-- Compiled with roblox-ts v1.2.3
local TS = require(game:GetService("ReplicatedStorage"):WaitForChild("rbxts_include"):WaitForChild("RuntimeLib"))
local ability_core = TS.import(script, game:GetService("ReplicatedStorage"), "TS", "content", "abilitycore").default
local muon
do
	local super = ability_core
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
	function muon:constructor(ctx)
		super.constructor(self, ctx, "primaryAbility")
		self.name = "Muon Core"
		self.details = "eh"
	end
	function muon:trigger()
		self.remotes.trigger:FireServer()
		self.ctx:equip("extra1")
	end
end
-- Kiriya Hakushaku Ke no Roku Shimai
return {
	default = muon,
}
