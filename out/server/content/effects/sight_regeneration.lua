-- Compiled with roblox-ts v1.2.3
local TS = require(game:GetService("ReplicatedStorage"):WaitForChild("rbxts_include"):WaitForChild("RuntimeLib"))
local effect = TS.import(script, game:GetService("ServerScriptService"), "TS", "content", "effectcore").default
local sight_regeneration
do
	local super = effect
	sight_regeneration = setmetatable({}, {
		__tostring = function()
			return "sight_regeneration"
		end,
		__index = super,
	})
	sight_regeneration.__index = sight_regeneration
	function sight_regeneration.new(...)
		local self = setmetatable({}, sight_regeneration)
		return self:constructor(...) or self
	end
	function sight_regeneration:constructor(ctx)
		super.constructor(self, ctx)
		self.healthPerKill = 50
		self.timeToHeal = 2.5
		self.healed = 0
	end
	function sight_regeneration:everyFrame(dt)
		if self.healed > self.healthPerKill then
			self:destroy()
		end
		local h = (self.healthPerKill / self.timeToHeal) * dt
		self.healed += h
		self.ctx:healDamage(h)
	end
end
return {
	default = sight_regeneration,
}
