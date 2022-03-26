-- Compiled with roblox-ts v1.2.3
local TS = require(game:GetService("ReplicatedStorage"):WaitForChild("rbxts_include"):WaitForChild("RuntimeLib"))
local weaponCore = TS.import(script, game:GetService("ServerScriptService"), "TS", "content", "weaponCore").default
local knife_saber
do
	local super = weaponCore
	knife_saber = setmetatable({}, {
		__tostring = function()
			return "knife_saber"
		end,
		__index = super,
	})
	knife_saber.__index = knife_saber
	function knife_saber.new(...)
		local self = setmetatable({}, knife_saber)
		return self:constructor(...) or self
	end
	function knife_saber:constructor(client, charclass)
		super.constructor(self, client, charclass)
		self.isAGun = false
		self.isAMelee = true
		self.maxAmmo = -1
	end
end
return {
	default = knife_saber,
}
