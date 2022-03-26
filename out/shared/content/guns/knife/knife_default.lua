-- Compiled with roblox-ts v1.2.3
local TS = require(game:GetService("ReplicatedStorage"):WaitForChild("rbxts_include"):WaitForChild("RuntimeLib"))
local weaponCore = TS.import(script, game:GetService("ReplicatedStorage"), "TS", "content", "weaponCore").default
local knife_default
do
	local super = weaponCore
	knife_default = setmetatable({}, {
		__tostring = function()
			return "knife_default"
		end,
		__index = super,
	})
	knife_default.__index = knife_default
	function knife_default.new(...)
		local self = setmetatable({}, knife_default)
		return self:constructor(...) or self
	end
	function knife_default:constructor(ctx)
		super.constructor(self, ctx, {
			name = "knife",
			animationIds = {
				idle = "rbxassetid://7816808516",
				swing = "rbxassetid://7817133381",
			},
			skin = "default",
			slotType = "melee",
		})
		-- this.isAGun = false;
		-- this.isAMelee = true;
		-- this.canAim = false;
		-- this.canLean = false;
		self.isAGun = false
		self.isAMelee = true
		self.canAim = false
		self.canLean = false
		self.inverseMovementTilt = true
		self.bobIntensityModifier = 1
		self.bobSpeedModifier = 1
	end
end
return {
	default = knife_default,
}
