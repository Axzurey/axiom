-- Compiled with roblox-ts v1.2.3
local TS = require(game:GetService("ReplicatedStorage"):WaitForChild("rbxts_include"):WaitForChild("RuntimeLib"))
local animationsMap = TS.import(script, game:GetService("ReplicatedStorage"), "TS", "content", "mapping", "animations")
local minerva = TS.import(script, game:GetService("ReplicatedStorage"), "TS", "minerva")
local weaponCore = TS.import(script, game:GetService("ReplicatedStorage"), "TS", "content", "weaponCore").default
local mpx_default
do
	local super = weaponCore
	mpx_default = setmetatable({}, {
		__tostring = function()
			return "mpx_default"
		end,
		__index = super,
	})
	mpx_default.__index = mpx_default
	function mpx_default.new(...)
		local self = setmetatable({}, mpx_default)
		return self:constructor(...) or self
	end
	function mpx_default:constructor(ctx, attachments)
		super.constructor(self, ctx, {
			name = "mpx",
			animationIds = {
				idle = animationsMap.mpx_idle,
				reload = animationsMap.mpx_reload,
				equip = animationsMap.mpx_equip,
			},
			slotType = "primary",
			skin = "default",
			attachments = attachments,
		})
		self.reloadLength = minerva.reloadLengths.mpx
	end
end
return {
	default = mpx_default,
}
