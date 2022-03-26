-- Compiled with roblox-ts v1.2.3
local TS = require(game:GetService("ReplicatedStorage"):WaitForChild("rbxts_include"):WaitForChild("RuntimeLib"))
local sightcore = TS.import(script, game:GetService("ReplicatedStorage"), "TS", "content", "sightcore").default
local holographic_sight
do
	local super = sightcore
	holographic_sight = setmetatable({}, {
		__tostring = function()
			return "holographic_sight"
		end,
		__index = super,
	})
	holographic_sight.__index = holographic_sight
	function holographic_sight.new(...)
		local self = setmetatable({}, holographic_sight)
		return self:constructor(...) or self
	end
	function holographic_sight:constructor()
		super.constructor(self, "holographic::default")
		self.zoom = 1.2
	end
end
return {
	default = holographic_sight,
}
