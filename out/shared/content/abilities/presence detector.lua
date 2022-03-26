-- Compiled with roblox-ts v1.2.3
local TS = require(game:GetService("ReplicatedStorage"):WaitForChild("rbxts_include"):WaitForChild("RuntimeLib"))
local ability_core = TS.import(script, game:GetService("ReplicatedStorage"), "TS", "content", "abilitycore").default
local presenceDetector
do
	local super = ability_core
	presenceDetector = setmetatable({}, {
		__tostring = function()
			return "presenceDetector"
		end,
		__index = super,
	})
	presenceDetector.__index = presenceDetector
	function presenceDetector.new(...)
		local self = setmetatable({}, presenceDetector)
		return self:constructor(...) or self
	end
	function presenceDetector:constructor(ctx)
		super.constructor(self, ctx, "secondaryAbility")
	end
	function presenceDetector:trigger()
		self.ctx:unequip()
	end
end
return {
	presenceDetector = presenceDetector,
}
