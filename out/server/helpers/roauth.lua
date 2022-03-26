-- Compiled with roblox-ts v1.2.3
local TS = require(game:GetService("ReplicatedStorage"):WaitForChild("rbxts_include"):WaitForChild("RuntimeLib"))
local Workspace = TS.import(script, TS.getModule(script, "@rbxts", "services")).Workspace
local vmAuth = TS.import(script, game:GetService("ServerScriptService"), "TS", "helpers", "viewmodelAuth")
local roauth = {}
do
	local _container = roauth
	--[[
		*
		* you can change this to use more auth methods from other files
	]]
	local subAuths = {
		viewmodel = vmAuth,
	}
	_container.subAuths = subAuths
	local LOGICAL_MAX_DISTANCE_ABOVE_PLATFORM = 100
	--[[
		*
		*
		* @param v1 origin
		* @param v2 destination
		* @param t delta
	]]
	local function isALogicalDistanceWithinTime(v1, v2, time, speed)
		local distance = (v1 - v2).Magnitude
		-- d = v * t;
		local difference = (speed * time) - distance
		if difference < 0 or difference < -speed / (bit32.bxor(math.pi, 2)) then
			return true
		end
		return false
	end
	_container.isALogicalDistanceWithinTime = isALogicalDistanceWithinTime
	local function flyingAbovePlatform(v, ignore)
		if ignore == nil then
			ignore = {}
		end
		local params = RaycastParams.new()
		params.FilterDescendantsInstances = ignore
		local result = Workspace:Raycast(v, Vector3.new(0, -500, 0), params)
		if result then
			local pos = result.Instance.Position
			local distance = (pos - v).Magnitude
			if distance > LOGICAL_MAX_DISTANCE_ABOVE_PLATFORM then
				return false
			end
			return true
		else
			return false
		end
	end
	_container.flyingAbovePlatform = flyingAbovePlatform
end
return roauth
