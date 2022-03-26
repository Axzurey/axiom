-- Compiled with roblox-ts v1.2.3
local TS = require(game:GetService("ReplicatedStorage"):WaitForChild("rbxts_include"):WaitForChild("RuntimeLib"))
local animationsMap = TS.import(script, game:GetService("ReplicatedStorage"), "TS", "content", "mapping", "animations")
local minerva = TS.import(script, game:GetService("ReplicatedStorage"), "TS", "minerva")
local weaponCore = TS.import(script, game:GetService("ReplicatedStorage"), "TS", "content", "weaponCore").default
local glock18_fade
do
	local super = weaponCore
	glock18_fade = setmetatable({}, {
		__tostring = function()
			return "glock18_fade"
		end,
		__index = super,
	})
	glock18_fade.__index = glock18_fade
	function glock18_fade.new(...)
		local self = setmetatable({}, glock18_fade)
		return self:constructor(...) or self
	end
	function glock18_fade:constructor(ctx, attachments)
		super.constructor(self, ctx, {
			name = "glock18",
			animationIds = {
				idle = animationsMap.glock18_idle,
				reload = animationsMap.glock18_reload,
				equip = animationsMap.glock18_equip,
				empty = animationsMap.glock18_empty,
				fire = animationsMap.glock18_fire,
			},
			slotType = "secondary",
			skin = "fade",
			attachments = attachments,
		})
		self.firerate = 860
		self.reloadLength = minerva.reloadLengths.glock18
	end
end
return {
	default = glock18_fade,
}
