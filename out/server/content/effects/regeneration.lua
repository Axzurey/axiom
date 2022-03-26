-- Compiled with roblox-ts v1.2.3
local TS = require(game:GetService("ReplicatedStorage"):WaitForChild("rbxts_include"):WaitForChild("RuntimeLib"))
local effect = TS.import(script, game:GetService("ServerScriptService"), "TS", "content", "effectcore").default
local regeneration
do
	local super = effect
	regeneration = setmetatable({}, {
		__tostring = function()
			return "regeneration"
		end,
		__index = super,
	})
	regeneration.__index = regeneration
	function regeneration.new(...)
		local self = setmetatable({}, regeneration)
		return self:constructor(...) or self
	end
	function regeneration:constructor(ctx)
		super.constructor(self, ctx)
		self.healthPerKill = 50
		self.timeToHeal = 2.5
		self.healed = 0
	end
	function regeneration:everyFrame(dt)
		if self.healed > self.healthPerKill then
			self:destroy()
		end
		local h = (self.healthPerKill / self.timeToHeal) * dt
		self.healed += h
		self.ctx:healDamage(h)
	end
end
return {
	default = regeneration,
}
