-- Compiled with roblox-ts v1.2.3
local TS = require(game:GetService("ReplicatedStorage"):WaitForChild("rbxts_include"):WaitForChild("RuntimeLib"))
local weaponCore = TS.import(script, game:GetService("ServerScriptService"), "TS", "content", "weaponCore").default
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
	function knife_default:constructor(client, charclass)
		super.constructor(self, client, charclass)
		self.isAGun = false
		self.isAMelee = true
		self.maxAmmo = -1
	end
end
return {
	default = knife_default,
}
