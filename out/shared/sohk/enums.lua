-- Compiled with roblox-ts v1.2.3
local sohkEnums = {}
do
	local _container = sohkEnums
	local interaction
	do
		local _inverse = {}
		interaction = setmetatable({}, {
			__index = _inverse,
		})
		interaction.input = 0
		_inverse[0] = "input"
		interaction.contact = 1
		_inverse[1] = "contact"
	end
	_container.interaction = interaction
end
return sohkEnums
