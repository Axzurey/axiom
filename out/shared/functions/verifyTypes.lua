-- Compiled with roblox-ts v1.2.3
local function verifyTypes(typeArray)
	local retF = true
	for i, v in pairs(typeArray) do
		local _value = v.value
		if typeof(_value) ~= v.expected then
			retF = false
		end
	end
	return retF
end
return {
	default = verifyTypes,
}
