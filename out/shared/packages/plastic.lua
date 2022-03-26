-- Compiled with roblox-ts v1.2.3
local TS = require(game:GetService("ReplicatedStorage"):WaitForChild("rbxts_include"):WaitForChild("RuntimeLib"))
local RunService = TS.import(script, TS.getModule(script, "@rbxts", "services")).RunService
local System = TS.import(script, game:GetService("ReplicatedStorage"), "TS", "modules", "System")
local function __createDefaultParticle2D()
	local frame = Instance.new("Frame")
	frame.Name = "particle"
	frame.AnchorPoint = Vector2.new(.5, .5)
	local imagelabel = Instance.new("ImageLabel")
	imagelabel.Name = "imagelabel"
	imagelabel.Parent = frame
	imagelabel.Size = UDim2.fromScale(1, 1)
	local round = Instance.new("UICorner")
	round.Name = "corner"
	round.Parent = frame
	local imageround = Instance.new("UICorner")
	imageround.Name = "corner"
	imageround.Parent = imagelabel
	return frame
end
local _particle2DModel = __createDefaultParticle2D()
local function edgesFromObject(object)
	local _binding = { object.AbsolutePosition, object.AbsoluteSize, object.Rotation }
	local position = _binding[1]
	local size = _binding[2]
	local rotation = _binding[3]
	local _binding_1 = { position.X + (size.X / 2), position.Y + (size.Y / 2) }
	local midx = _binding_1[1]
	local midy = _binding_1[2]
	local corners = { { midx + (size.X / 2), midy + (size.Y / 2) }, { midx - (size.X / 2), midy + (size.Y / 2) }, { midx - (size.X / 2), midy - (size.Y / 2) }, { midx + (size.X / 2), midy - (size.Y / 2) } }
	local points = {}
	local function calculate(cornerx, cornery)
		local _binding_2 = { cornerx - midx, cornery - midy }
		local orx = _binding_2[1]
		local ory = _binding_2[2]
		local rx = (orx * math.cos(math.rad(rotation))) - (ory * math.sin(math.rad(rotation)))
		local ry = (orx * math.sin(math.rad(rotation))) + (ory * math.cos(math.rad(rotation)))
		local _binding_3 = { rx + midx, ry + midy }
		local p1 = _binding_3[1]
		local p2 = _binding_3[2]
		return { p1, p2 }
	end
	local _arg0 = function(l)
		local _binding_2 = calculate(l[1], l[2])
		local p1 = _binding_2[1]
		local p2 = _binding_2[2]
		local _points = points
		local _vector2 = Vector2.new(p1, p2)
		-- ▼ Array.push ▼
		_points[#_points + 1] = _vector2
		-- ▲ Array.push ▲
	end
	-- ▼ ReadonlyArray.forEach ▼
	for _k, _v in ipairs(corners) do
		_arg0(_v, _k - 1, corners)
	end
	-- ▲ ReadonlyArray.forEach ▲
	return points
end
local plastic = {}
do
	local _container = plastic
	local raycast2dparams
	do
		raycast2dparams = setmetatable({}, {
			__tostring = function()
				return "raycast2dparams"
			end,
		})
		raycast2dparams.__index = raycast2dparams
		function raycast2dparams.new(...)
			local self = setmetatable({}, raycast2dparams)
			return self:constructor(...) or self
		end
		function raycast2dparams:constructor()
			self.instances = {}
		end
	end
	_container.raycast2dparams = raycast2dparams
	local raycast2dresult
	do
		raycast2dresult = setmetatable({}, {
			__tostring = function()
				return "raycast2dresult"
			end,
		})
		raycast2dresult.__index = raycast2dresult
		function raycast2dresult.new(...)
			local self = setmetatable({}, raycast2dresult)
			return self:constructor(...) or self
		end
		function raycast2dresult:constructor(vector, instance)
			self.position = vector
			self.instance = instance
		end
	end
	local function raycast2d(origin, destination, params, back)
		local closest = math.huge
		local closestpoint = Vector2.new()
		local closestinstance
		local _instances = params.instances
		local _arg0 = function(object)
			local points = edgesFromObject(object)
			local _arg0_1 = function(point, i)
				local f = Instance.new("Frame")
				f.Position = UDim2.fromOffset(point.X, point.Y)
				f.Size = UDim2.fromOffset(10, 10)
				f.AnchorPoint = Vector2.new(.5, .5)
				f.Name = tostring(i)
				f.BackgroundColor3 = Color3.fromRGB(0, 153, 255)
				f.Parent = back
				local n = points[i + 1 + 1] or points[1]
				local _binding = { point.X, point.Y }
				local x1 = _binding[1]
				local y1 = _binding[2]
				local _binding_1 = { n.X, n.Y }
				local x2 = _binding_1[1]
				local y2 = _binding_1[2]
				local _binding_2 = { origin.X, origin.Y }
				local x3 = _binding_2[1]
				local y3 = _binding_2[2]
				local _binding_3 = { destination.X, destination.Y }
				local x4 = _binding_3[1]
				local y4 = _binding_3[2]
				local x = System.mathf.getConvergence(x1, x2, y1, y2, x3, x4, y3, y4)
				if x then
					local _binding_4 = { x[1], x[2] }
					local u = _binding_4[1]
					local t = _binding_4[2]
					local _condition = t
					if _condition ~= 0 and _condition == _condition and _condition then
						_condition = u
						if _condition ~= 0 and _condition == _condition and _condition then
							_condition = t > 0 and t < 1 and u > 0
						end
					end
					if _condition ~= 0 and _condition == _condition and _condition then
						local point = Vector2.new(x1 + t * (x2 - x1), y1 + t * (y2 - y1))
						local _point = point
						local m = (origin - _point).Magnitude
						if m < closest then
							closest = m
							closestpoint = point
							closestinstance = object
						end
					end
				end
			end
			-- ▼ ReadonlyArray.forEach ▼
			for _k, _v in ipairs(points) do
				_arg0_1(_v, _k - 1, points)
			end
			-- ▲ ReadonlyArray.forEach ▲
		end
		-- ▼ ReadonlyArray.forEach ▼
		for _k, _v in ipairs(_instances) do
			_arg0(_v, _k - 1, _instances)
		end
		-- ▲ ReadonlyArray.forEach ▲
		local f = Instance.new("Frame")
		f.Position = UDim2.fromOffset(closestpoint.X, closestpoint.Y)
		f.Size = UDim2.fromOffset(10, 10)
		f.Name = "div"
		f.AnchorPoint = Vector2.new(.5, .5)
		f.BackgroundColor3 = Color3.fromRGB(10, 255, 0)
		f.Parent = back
		return closestinstance and raycast2dresult.new(closestpoint, closestinstance) or nil
	end
	_container.raycast2d = raycast2d
	local default2dparams = {
		gravity = Vector2.new(),
		size = 30,
		transparency = 0,
		image = nil,
		origin = Vector2.new(500, 500),
		velocity = Vector2.new(),
		amount = 1,
		acceleration = Vector2.new(),
		mass = 1,
		rounding = 1,
		color = Color3.new(1, 0, 0),
		borderColor = Color3.new(0, 0, 0),
	}
	local particle2D
	do
		particle2D = setmetatable({}, {
			__tostring = function()
				return "particle2D"
			end,
		})
		particle2D.__index = particle2D
		function particle2D.new(...)
			local self = setmetatable({}, particle2D)
			return self:constructor(...) or self
		end
		function particle2D:constructor(params)
			self.active = true
			self.particles = {}
			local _ptr = {}
			for _k, _v in pairs(default2dparams) do
				_ptr[_k] = _v
			end
			for _k, _v in pairs(params) do
				_ptr[_k] = _v
			end
			self.config = _ptr
			local conn
			conn = RunService.Heartbeat:Connect(function(delta)
				if not self.active then
					conn:Disconnect()
					return nil
				end
				self:onupdate(delta)
			end)
		end
		function particle2D:createParticles(params)
			local _ptr = {}
			for _k, _v in pairs(self.config) do
				_ptr[_k] = _v
			end
			for _k, _v in pairs(params) do
				_ptr[_k] = _v
			end
			local config = _ptr
			local localparticles = {}
			do
				local i = 0
				local _shouldIncrement = false
				while true do
					if _shouldIncrement then
						i += 1
					else
						_shouldIncrement = true
					end
					if not (i < config.amount) then
						break
					end
					local n = {
						instance = _particle2DModel:Clone(),
						alive = true,
						customParams = config,
					}
					local _localparticles = localparticles
					local _n = n
					-- ▼ Array.push ▼
					_localparticles[#_localparticles + 1] = _n
					-- ▲ Array.push ▲
					local _particles = self.particles
					local _n_1 = n
					-- ▼ Array.push ▼
					_particles[#_particles + 1] = _n_1
					-- ▲ Array.push ▲
					n.instance.Position = UDim2.fromOffset(config.origin.X, config.origin.Y)
					n.instance.AnchorPoint = Vector2.new()
					local _size = config.size
					n.instance.Size = typeof(_size) == "number" and UDim2.fromOffset(config.size, config.size) or UDim2.fromOffset((config.size).X, (config.size).Y)
					-- let gforce = n.customParams.gravity.mul(n.customParams.mass)
					-- n.customParams.acceleration = n.customParams.acceleration.add(gforce.div(n.customParams.mass));
					n.instance.Parent = config.parent
				end
			end
			return {
				applyImpulse = function(self, force)
					local _localparticles = localparticles
					local _arg0 = function(v)
						local _acceleration = v.customParams.acceleration
						local _mass = v.customParams.mass
						local _arg0_1 = force / _mass
						v.customParams.acceleration = _acceleration + _arg0_1
					end
					-- ▼ ReadonlyArray.forEach ▼
					for _k, _v in ipairs(_localparticles) do
						_arg0(_v, _k - 1, _localparticles)
					end
					-- ▲ ReadonlyArray.forEach ▲
				end,
				destroyThese = function(self)
					local _localparticles = localparticles
					local _arg0 = function(v)
						v.alive = false
						v.instance:Destroy()
					end
					-- ▼ ReadonlyArray.forEach ▼
					for _k, _v in ipairs(_localparticles) do
						_arg0(_v, _k - 1, _localparticles)
					end
					-- ▲ ReadonlyArray.forEach ▲
					-- ▼ Array.clear ▼
					table.clear(localparticles)
					-- ▲ Array.clear ▲
				end,
			}
		end
		function particle2D:cleanUp()
			local _particles = self.particles
			local _arg0 = function(v)
				v.alive = false
				v.instance:Destroy()
			end
			-- ▼ ReadonlyArray.forEach ▼
			for _k, _v in ipairs(_particles) do
				_arg0(_v, _k - 1, _particles)
			end
			-- ▲ ReadonlyArray.forEach ▲
			-- ▼ Array.clear ▼
			table.clear(self.particles)
			-- ▲ Array.clear ▲
		end
		function particle2D:onupdate(deltaTime)
			local _particles = self.particles
			local _arg0 = function(v)
				if not v.alive then
					if v.instance then
						v.instance:Destroy()
					end
					return nil
				end
				coroutine.wrap(function()
					local instance = v.instance
					local _velocity = v.customParams.velocity
					local _exp = v.customParams.gravity / 60
					local _arg0_1 = deltaTime * 60
					v.customParams.velocity = _velocity + (_exp * _arg0_1)
					local _velocity_1 = v.customParams.velocity
					local _acceleration = v.customParams.acceleration
					v.customParams.velocity = _velocity_1 + _acceleration
					local abs = instance.AbsolutePosition
					local _abs = abs
					local _velocity_2 = v.customParams.velocity
					local _arg0_2 = deltaTime * 60
					local ra = _abs + (_velocity_2 * _arg0_2)
					instance.Position = UDim2.fromOffset(ra.X, ra.Y)
					v.customParams.acceleration = v.customParams.acceleration * 0
					v.instance.BackgroundColor3 = v.customParams.color
					local label = v.instance:FindFirstChild("imagelabel")
					label.ImageColor3 = v.customParams.color
					label.BackgroundTransparency = 1
					instance.Transparency = v.customParams.transparency;
					(v.instance:FindFirstChild("corner")).CornerRadius = UDim.new(v.customParams.rounding, 0);
					((v.instance:FindFirstChild("imagelabel")):FindFirstChild("corner")).CornerRadius = UDim.new(v.customParams.rounding, 0)
				end)()
			end
			-- ▼ ReadonlyArray.forEach ▼
			for _k, _v in ipairs(_particles) do
				_arg0(_v, _k - 1, _particles)
			end
			-- ▲ ReadonlyArray.forEach ▲
		end
	end
	_container.particle2D = particle2D
end
return plastic
