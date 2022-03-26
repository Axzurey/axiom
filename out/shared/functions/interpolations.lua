-- Compiled with roblox-ts v1.2.3
-- elapsed time, begin, change(ending - beginning), duration
local interpolations = {
	linear = function(t, b, c, d)
		return c * t / d + b
	end,
	quadIn = function(t, b, c, d)
		t = t / d
		return c * math.pow(t, 2) + b
	end,
	quadOut = function(t, b, c, d)
		t = t / d
		return -c * t * (t - 2) + b
	end,
	quadInOut = function(t, b, c, d)
		t = t / d * 2
		if t < 1 then
			return c / 2 * math.pow(t, 2) + b
		else
			return -c / 2 * ((t - 1) * (t - 3) - 1) + b
		end
	end,
	elasticIn = function(t, b, c, d)
		if t == 0 then
			return b
		end
		t = t / d
		if t == 1 then
			return b + c
		end
		local p = d * .3
		local a = c
		local s = p / 4
		t -= 1
		return -(a * math.pow(2, 10 * t) * math.sin((t * d - s) * (2 * math.pi) / p)) + b
	end,
}
local function interpolate(t, n0, n1, style)
	local begin = n0
	local _end = n1
	local change = _end - begin
	local duration = 1
	local fx = interpolations[style]
	return fx(t, begin, change, duration)
end
local function interpolateV3(t, v0, v1, style)
	local x = interpolate(t, v0.X, v1.X, style)
	local y = interpolate(t, v0.Y, v1.Y, style)
	local z = interpolate(t, v0.Z, v1.Z, style)
	return Vector3.new(x, y, z)
end
local function interpolateV2(t, v0, v1, style)
	local x = interpolate(t, v0.X, v1.X, style)
	local y = interpolate(t, v0.Y, v1.Y, style)
	return Vector2.new(x, y)
end
return {
	interpolate = interpolate,
	interpolateV3 = interpolateV3,
	interpolateV2 = interpolateV2,
}
