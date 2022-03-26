-- Compiled with roblox-ts v1.2.3
local TS = require(game:GetService("ReplicatedStorage"):WaitForChild("rbxts_include"):WaitForChild("RuntimeLib"))
local worldData = TS.import(script, game:GetService("ReplicatedStorage"), "TS", "worlddata")
local function check(check, instance)
	local vs = worldData[check]
	for i, v in pairs(vs) do
		local _value = (string.find(instance.Name, i))
		if _value ~= 0 and _value == _value and _value then
			return true
		end
	end
	return false
end
return {
	default = check,
}
