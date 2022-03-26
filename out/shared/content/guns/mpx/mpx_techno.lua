-- Compiled with roblox-ts v1.2.3
local TS = require(game:GetService("ReplicatedStorage"):WaitForChild("rbxts_include"):WaitForChild("RuntimeLib"))
local animationsMap = TS.import(script, game:GetService("ReplicatedStorage"), "TS", "content", "mapping", "animations")
local minerva = TS.import(script, game:GetService("ReplicatedStorage"), "TS", "minerva")
local weaponCore = TS.import(script, game:GetService("ReplicatedStorage"), "TS", "content", "weaponCore").default
local mpx_techno
do
	local super = weaponCore
	mpx_techno = setmetatable({}, {
		__tostring = function()
			return "mpx_techno"
		end,
		__index = super,
	})
	mpx_techno.__index = mpx_techno
	function mpx_techno.new(...)
		local self = setmetatable({}, mpx_techno)
		return self:constructor(...) or self
	end
	function mpx_techno:constructor(ctx, attachments)
		super.constructor(self, ctx, {
			name = "mpx",
			animationIds = {
				idle = animationsMap.mpx_idle,
				reload = animationsMap.mpx_reload,
			},
			slotType = "primary",
			skin = "techno",
			attachments = attachments,
		})
		self.reloadLength = minerva.reloadLengths.mpx
	end
end
return {
	default = mpx_techno,
}
