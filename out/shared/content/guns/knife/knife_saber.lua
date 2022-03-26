-- Compiled with roblox-ts v1.2.3
local TS = require(game:GetService("ReplicatedStorage"):WaitForChild("rbxts_include"):WaitForChild("RuntimeLib"))
local weaponCore = TS.import(script, game:GetService("ReplicatedStorage"), "TS", "content", "weaponCore").default
local animationsMap = TS.import(script, game:GetService("ReplicatedStorage"), "TS", "content", "mapping", "animations")
local knife_saber
do
	local super = weaponCore
	knife_saber = setmetatable({}, {
		__tostring = function()
			return "knife_saber"
		end,
		__index = super,
	})
	knife_saber.__index = knife_saber
	function knife_saber.new(...)
		local self = setmetatable({}, knife_saber)
		return self:constructor(...) or self
	end
	function knife_saber:constructor(ctx)
		super.constructor(self, ctx, {
			name = "knife",
			animationIds = {
				idle = animationsMap.knife_saber_idle,
				swing = animationsMap.knife_saber_swing,
			},
			skin = "saber",
			slotType = "melee",
		})
		self.isAGun = false
		self.isAMelee = true
		self.canAim = false
		self.canLean = false
		self.inverseMovementTilt = false
		self.bobIntensityModifier = 1
		self.bobSpeedModifier = 1
	end
end
return {
	default = knife_saber,
}
