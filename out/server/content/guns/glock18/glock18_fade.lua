-- Compiled with roblox-ts v1.2.3
local TS = require(game:GetService("ReplicatedStorage"):WaitForChild("rbxts_include"):WaitForChild("RuntimeLib"))
local weaponCore = TS.import(script, game:GetService("ServerScriptService"), "TS", "content", "weaponCore").default
local minerva = TS.import(script, game:GetService("ReplicatedStorage"), "TS", "minerva")
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
	function glock18_fade:constructor(client, charclass)
		super.constructor(self, client, charclass)
		self.reloadLength = minerva.reloadLengths.glock18
		self.type = "secondary"
		self.firerate = 1000
		self.maxAmmo = 20
		self.ammo = 20
	end
end
return {
	default = glock18_fade,
}
