-- Compiled with roblox-ts v1.2.3
local vmAuth = {}
do
	local _container = vmAuth
	local BARREL_MAX_DISTANCE_FROM_CAMERA_ORIGIN = 10
	local CAMERA_MAX_DISTANCE_FROM_CHARACTER_ORIGIN = 10
	local function barrelIsWithinLogicalDistanceFromCamera(camera, barrel)
		return (camera - barrel).Magnitude <= BARREL_MAX_DISTANCE_FROM_CAMERA_ORIGIN
	end
	_container.barrelIsWithinLogicalDistanceFromCamera = barrelIsWithinLogicalDistanceFromCamera
	local function cameraIsWithinLogicalDistanceFromCharacter(camera, character)
		return (camera - character).Magnitude <= CAMERA_MAX_DISTANCE_FROM_CHARACTER_ORIGIN
	end
	_container.cameraIsWithinLogicalDistanceFromCharacter = cameraIsWithinLogicalDistanceFromCharacter
end
return vmAuth
