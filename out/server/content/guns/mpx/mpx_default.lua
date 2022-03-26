-- Compiled with roblox-ts v1.2.3
local TS = require(game:GetService("ReplicatedStorage"):WaitForChild("rbxts_include"):WaitForChild("RuntimeLib"))
local weaponCore = TS.import(script, game:GetService("ServerScriptService"), "TS", "content", "weaponCore").default
local minerva = TS.import(script, game:GetService("ReplicatedStorage"), "TS", "minerva")
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
	function mpx_default:constructor(client, charclass)
		super.constructor(self, client, charclass)
		self.reloadLength = minerva.reloadLengths.mpx
	end
end
return {
	default = mpx_default,
}
