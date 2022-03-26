-- Compiled with roblox-ts v1.2.3
local TS = require(game:GetService("ReplicatedStorage"):WaitForChild("rbxts_include"):WaitForChild("RuntimeLib"))
local animationsMap = TS.import(script, game:GetService("ReplicatedStorage"), "TS", "content", "mapping", "animations")
local minerva = TS.import(script, game:GetService("ReplicatedStorage"), "TS", "minerva")
local weaponCore = TS.import(script, game:GetService("ReplicatedStorage"), "TS", "content", "weaponCore").default
local hk416_default
do
	local super = weaponCore
	hk416_default = setmetatable({}, {
		__tostring = function()
			return "hk416_default"
		end,
		__index = super,
	})
	hk416_default.__index = hk416_default
	function hk416_default.new(...)
		local self = setmetatable({}, hk416_default)
		return self:constructor(...) or self
	end
	function hk416_default:constructor(ctx, attachments)
		super.constructor(self, ctx, {
			name = "hk416",
			animationIds = {
				idle = animationsMap.hk416_idle,
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
	default = hk416_default,
}
