-- Compiled with roblox-ts v1.2.3
local cameraService = {}
do
	local _container = cameraService
	local function bob(speed, intensity)
		return math.sin(tick() * speed) * intensity
	end
	_container.bob = bob
	local function bobLemnBern(speed, intensity)
		local t = tick() * speed
		local scale = 2 / (3 - math.cos(2 * t))
		return { scale * math.cos(t) * intensity, scale * math.sin(2 * t) / 2 * intensity }
	end
	_container.bobLemnBern = bobLemnBern
end
return cameraService
