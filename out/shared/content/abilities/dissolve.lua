-- Compiled with roblox-ts v1.2.3
local TS = require(game:GetService("ReplicatedStorage"):WaitForChild("rbxts_include"):WaitForChild("RuntimeLib"))
local ability_core = TS.import(script, game:GetService("ReplicatedStorage"), "TS", "content", "abilitycore").default
local dissolve
do
	local super = ability_core
	dissolve = setmetatable({}, {
		__tostring = function()
			return "dissolve"
		end,
		__index = super,
	})
	dissolve.__index = dissolve
	function dissolve.new(...)
		local self = setmetatable({}, dissolve)
		return self:constructor(...) or self
	end
	function dissolve:constructor(ctx)
		super.constructor(self, ctx, "primaryAbility")
		-- this.ctx.loadout.blank.module.setUpExtraAnimation('hello');
		self.name = "Dissolve"
		self.details = "Throw a punch that applies [corrosion] to affected surfaces & damages any enemies it may hit."
	end
	function dissolve:trigger()
		self.remotes.trigger:FireServer()
		-- this.ctx.equip('blank');
	end
end
-- Kiriya Hakushaku Ke no Roku Shimai
return {
	dissolve = dissolve,
}
