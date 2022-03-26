-- Compiled with roblox-ts v1.2.3
local function verifyValues(typeArray)
	local retF = true
	for i, v in pairs(typeArray) do
		local _expected = v.expected
		local _value = v.value
		if (table.find(_expected, _value) or 0) - 1 == -1 then
			retF = false
		end
	end
	return retF
end
return {
	default = verifyValues,
}
