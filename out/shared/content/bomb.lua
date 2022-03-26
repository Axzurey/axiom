-- Compiled with roblox-ts v1.2.3
local TS = require(game:GetService("ReplicatedStorage"):WaitForChild("rbxts_include"):WaitForChild("RuntimeLib"))
local animationsMap = TS.import(script, game:GetService("ReplicatedStorage"), "TS", "content", "mapping", "animations")
local weaponCore = TS.import(script, game:GetService("ReplicatedStorage"), "TS", "content", "weaponCore").default
local bomb
do
	local super = weaponCore
	bomb = setmetatable({}, {
		__tostring = function()
			return "bomb"
		end,
		__index = super,
	})
	bomb.__index = bomb
	function bomb.new(...)
		local self = setmetatable({}, bomb)
		return self:constructor(...) or self
	end
	function bomb:constructor(ctx)
		super.constructor(self, ctx, {
			slotType = "bomb",
			animationIds = {
				equip = animationsMap.bomb_plant,
			},
			skin = "default",
			name = "bomb",
		})
		self.isAGun = false
		self.isAMelee = false
		self.canAim = false
		self.canLean = false
	end
	function bomb:animate()
		local floor = self.ctx.bombClass:originPlantPosition()
		if not floor then
			error("could not find a suitable floor")
		end
		local camCF = self.ctx.camera.CFrame
		local look = CFrame.lookAt(camCF.Position, floor.Position)
	end
end
return {
	default = bomb,
}
