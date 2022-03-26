-- Compiled with roblox-ts v1.2.3
local function verifyParam(expected, got)
	local pass = true
	local _arg0 = function(v, i)
		local index = got[i + 1]
		if index ~= 0 and index == index and index ~= "" and index then
			if v(index) then
				return nil
			else
				pass = false
			end
		else
			pass = false
		end
	end
	-- ▼ ReadonlyArray.forEach ▼
	for _k, _v in ipairs(expected) do
		_arg0(_v, _k - 1, expected)
	end
	-- ▲ ReadonlyArray.forEach ▲
	return pass
end
return {
	default = verifyParam,
}
