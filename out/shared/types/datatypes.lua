-- Compiled with roblox-ts v1.2.3
local datatypes = {}
do
	local _container = datatypes
	local movementState
	do
		local _inverse = {}
		movementState = setmetatable({}, {
			__index = _inverse,
		})
		movementState.walking = 0
		_inverse[0] = "walking"
		movementState.sprinting = 1
		_inverse[1] = "sprinting"
		movementState.idle = 2
		_inverse[2] = "idle"
		movementState.falling = 3
		_inverse[3] = "falling"
	end
	_container.movementState = movementState
end
return datatypes
