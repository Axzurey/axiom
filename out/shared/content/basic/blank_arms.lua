-- Compiled with roblox-ts v1.2.3
local TS = require(game:GetService("ReplicatedStorage"):WaitForChild("rbxts_include"):WaitForChild("RuntimeLib"))
local weaponCore = TS.import(script, game:GetService("ReplicatedStorage"), "TS", "content", "weaponCore").default
local blank_arms
do
	local super = weaponCore
	blank_arms = setmetatable({}, {
		__tostring = function()
			return "blank_arms"
		end,
		__index = super,
	})
	blank_arms.__index = blank_arms
	function blank_arms.new(...)
		local self = setmetatable({}, blank_arms)
		return self:constructor(...) or self
	end
	function blank_arms:constructor(ctx)
		super.constructor(self, ctx, {
			name = "viewmodel",
			animationIds = {},
			slotType = "special",
			skin = "blank",
		})
		self.isAGun = false
		self.isAMelee = false
		self.isBlank = true
	end
	function blank_arms:setUpExtraAnimation(name, animationObject)
		local vm = self.viewmodel
		local animator = vm.controller.animator
		local anim = animator:LoadAnimation(animationObject)
		self.extraAnimations[name] = anim
	end
	function blank_arms:playExtraAnimation(name)
		if self.extraAnimations[name] then
			self.extraAnimations[name]:Play()
		end
	end
end
return {
	default = blank_arms,
}
