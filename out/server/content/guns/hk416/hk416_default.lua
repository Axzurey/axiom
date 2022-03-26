-- Compiled with roblox-ts v1.2.3
local TS = require(game:GetService("ReplicatedStorage"):WaitForChild("rbxts_include"):WaitForChild("RuntimeLib"))
local weaponCore = TS.import(script, game:GetService("ServerScriptService"), "TS", "content", "weaponCore").default
local minerva = TS.import(script, game:GetService("ReplicatedStorage"), "TS", "minerva")
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
	function hk416_default:constructor(client, charclass)
		super.constructor(self, client, charclass)
		self.reloadLength = minerva.reloadLengths.mpx
	end
end
return {
	default = hk416_default,
}
