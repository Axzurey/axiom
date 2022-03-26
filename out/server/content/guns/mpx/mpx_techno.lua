-- Compiled with roblox-ts v1.2.3
local TS = require(game:GetService("ReplicatedStorage"):WaitForChild("rbxts_include"):WaitForChild("RuntimeLib"))
local minerva = TS.import(script, game:GetService("ReplicatedStorage"), "TS", "minerva")
local weaponCore = TS.import(script, game:GetService("ServerScriptService"), "TS", "content", "weaponCore").default
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
	function mpx_techno:constructor(client, charclass)
		super.constructor(self, client, charclass)
		self.reloadLength = minerva.reloadLengths.mpx
	end
end
return {
	default = mpx_techno,
}
