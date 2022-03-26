-- Compiled with roblox-ts v1.2.3
local TS = require(game:GetService("ReplicatedStorage"):WaitForChild("rbxts_include"):WaitForChild("RuntimeLib"))
local _services = TS.import(script, TS.getModule(script, "@rbxts", "services"))
local Players = _services.Players
local RunService = _services.RunService
local Workspace = _services.Workspace
--[[
	*
	*
	* @param acceleration acceleration at the point of ***elapsedTime***
	* @param initialVelocity self explanitory
	* @param initialPosition self explanitory
	* @param elapsedTime time since motion started
	* @returns the vector that the projectile would be at for ***elapsedTime***
]]
local function motion(acceleration, initialVelocity, initialPosition, elapsedTime)
	local _exp = acceleration * .5
	local _arg0 = elapsedTime ^ 2
	local firstHalf = _exp * _arg0
	local secondHalf = initialVelocity * elapsedTime
	local _firstHalf = firstHalf
	local _secondHalf = secondHalf
	return _firstHalf + _secondHalf + initialPosition
end
local projectile
do
	projectile = setmetatable({}, {
		__tostring = function()
			return "projectile"
		end,
	})
	projectile.__index = projectile
	function projectile.new(...)
		local self = setmetatable({}, projectile)
		return self:constructor(...) or self
	end
	function projectile:constructor(config)
		self.alive = true
		if not config.instance.PrimaryPart then
			error("instance doesn't have a primary part set")
		end
		self.config = config
		local t = 0
		local instance = config.instance
		local rs
		rs = RunService.Heartbeat:Connect(function(dt)
			t += 1 * dt
			if not self.alive then
				rs:Disconnect()
				config.onTerminated()
			end
			if t > config.lifeTime then
				rs:Disconnect()
				config.onTerminated()
			end
			local acceleration = config.gravity
			local _direction = config.direction
			local _velocity = config.velocity
			local velocity = _direction * _velocity
			local initialPosition = config.origin
			local currentPosition = motion(acceleration, velocity, initialPosition, t)
			local nextPosition = motion(acceleration, velocity, initialPosition, t + 1 / 60)
			local direction = CFrame.lookAt(currentPosition, nextPosition).LookVector
			local _nextPosition = nextPosition
			local _currentPosition = currentPosition
			local distance = (_nextPosition - _currentPosition).Magnitude
			instance:SetPrimaryPartCFrame(CFrame.lookAt(currentPosition, nextPosition))
			local params = RaycastParams.new()
			local _ptr = {}
			local _length = #_ptr
			local _array = config.ignoreInstances
			local _Length = #_array
			table.move(_array, 1, _Length, _length + 1, _ptr)
			_length += _Length
			_ptr[_length + 1] = instance
			params.FilterDescendantsInstances = _ptr
			local result = nil
			local resultPass = false
			if not config.ignoreEverything then
				while not resultPass do
					local _fn = Workspace
					local _exp = currentPosition
					local _direction_1 = direction
					local _distance = distance
					local _direction_2 = direction
					local _arg0 = (config.instance.PrimaryPart).Size.Z / 2
					local r = _fn:Raycast(_exp, _direction_1 * _distance + (_direction_2 * _arg0), params)
					if r then
						local h = r.Instance
						local _condition = config.ignoreNames
						if _condition then
							local _ignoreNames = config.ignoreNames
							local _name = h.Name
							_condition = (table.find(_ignoreNames, _name) or 0) - 1 ~= -1
						end
						if _condition then
							continue
						end
						local c = h.Parent
						local p = Players:GetPlayerFromCharacter(c)
						local _condition_1 = p and config.ignorePlayers
						if _condition_1 then
							local _ignorePlayers = config.ignorePlayers
							local _p = p
							_condition_1 = (table.find(_ignorePlayers, _p) or 0) - 1 ~= -1
						end
						if _condition_1 then
							continue
						end
						result = r
						resultPass = true
					else
						resultPass = true
					end
				end
			end
			if result then
				local position = result.Position
				currentPosition = position
				instance:SetPrimaryPartCFrame(CFrame.lookAt(currentPosition, nextPosition))
				rs:Disconnect()
				config.onHit()
			else
				currentPosition = currentPosition
				instance:SetPrimaryPartCFrame(CFrame.lookAt(currentPosition, nextPosition))
			end
		end)
	end
	function projectile:terminate()
		self.alive = false
	end
end
return {
	default = projectile,
}
