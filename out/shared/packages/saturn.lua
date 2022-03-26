-- Compiled with roblox-ts v1.2.3
local TS = require(game:GetService("ReplicatedStorage"):WaitForChild("rbxts_include"):WaitForChild("RuntimeLib"))
local _services = TS.import(script, TS.getModule(script, "@rbxts", "services"))
local RunService = _services.RunService
local Workspace = _services.Workspace
local System = TS.import(script, game:GetService("ReplicatedStorage"), "TS", "modules", "System")
-- //// next do some graphing stuff, bar graphs specifically.
-- particle base
local function __createDefaultParticle()
	local particleModel = Instance.new("Part")
	particleModel.Transparency = 1
	particleModel.CanCollide = false
	particleModel.Anchored = true
	particleModel.CanTouch = false
	particleModel.CanQuery = false
	particleModel.Size = Vector3.new(0, 0, 0)
	particleModel.CastShadow = false
	particleModel.Name = "particle"
	particleModel.Shape = Enum.PartType.Ball
	local a1 = Instance.new("Attachment")
	local a2 = Instance.new("Attachment")
	a1.Parent = particleModel
	a2.Parent = particleModel
	a1.Name = "a1"
	a2.Name = "a2"
	a1.Position = Vector3.new(.5, 0, 0)
	a2.Position = Vector3.new(-.5, 0, 0)
	local glow = Instance.new("PointLight")
	glow.Name = "glow"
	glow.Parent = particleModel
	glow.Brightness = 2
	glow.Range = 3
	local glow2 = Instance.new("SpotLight")
	glow2.Name = "spot"
	glow2.Parent = particleModel
	local trail = Instance.new("Trail")
	trail.Name = "trail"
	trail.Attachment0 = a1
	trail.Attachment1 = a2
	trail.Lifetime = .2
	trail.MinLength = .1
	trail.Parent = particleModel
	local force = Instance.new("BodyForce")
	force.Name = "force"
	force.Parent = particleModel
	local effect = Instance.new("ParticleEmitter")
	effect.Enabled = false
	effect.Name = "effect"
	effect.Parent = particleModel
	effect.Rate = 0
	effect.Drag = math.huge
	effect.LockedToPart = true
	effect.Lifetime = NumberRange.new(math.huge)
	effect.SpreadAngle = Vector2.new(0, 0)
	local fire = Instance.new("Fire")
	fire.Enabled = false
	fire.Name = "fire"
	fire.Parent = particleModel
	local smoke = Instance.new("Smoke")
	smoke.Enabled = false
	smoke.Name = "smoke"
	smoke.Parent = particleModel
	return particleModel
end
local particleModel = __createDefaultParticle()
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
local particle2DModel = __createDefaultParticle2D()
local function getParticle()
	return particleModel:Clone()
end
local saturn = {}
do
	local _container = saturn
	local defaultParams = {
		impulseFromLookVector = false,
		amount = 1,
		color = ColorSequence.new(Color3.fromRGB(127, 0, 255)),
		collisions = false,
		static = true,
		anchored = false,
		rate = 0,
		origin = CFrame.new(0, 10, 0),
		velocity = Vector3.new(),
		impulse = nil,
		fire = false,
		fireColor = Color3.new(1, 0, 0),
		fireColor2 = Color3.fromRGB(252, 153, 128),
		fireRise = 0,
		fireSize = 1,
		smoke = false,
		smokeColor = Color3.new(1, 1, 1),
		smokeOpacity = 1,
		smokeRise = 0,
		smokeSize = .1,
		glow = true,
		glowColor = Color3.new(1, 1, 0),
		glowRange = 10,
		glowCastsShadows = true,
		glowBrightness = 2,
		glowType = "aura",
		glowAngle = 45,
		glowDirection = Enum.NormalId.Front,
		trail = true,
		trailColor = ColorSequence.new(Color3.new(0, 1, 1)),
		trailFacesCamera = true,
		trailLightEmission = 1,
		trailLightInfluence = 1,
		trailTexture = "",
		trailTextureLength = 1,
		trailTextureMode = Enum.TextureMode.Static,
		trailTransparency = NumberSequence.new(.5),
		trailLifetime = 2,
		trailMaxLength = 0,
		trailMinlength = .1,
		trailWidthScale = NumberSequence.new(1),
		texture = "rbxasset://textures/particles/sparkles_main.dds",
		spreadAngle = Vector2.new(0, 0),
		transparency = NumberSequence.new(0),
		zOffset = 0,
		lightEmission = 1,
		drag = math.huge,
		lightInfluence = 1,
		size = 1,
		emissiondirection = Enum.ParticleOrientation.FacingCamera,
	}
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
						instance = particle2DModel:Clone(),
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
	local sprite
	do
		sprite = setmetatable({}, {
			__tostring = function()
				return "sprite"
			end,
		})
		sprite.__index = sprite
		function sprite.new(...)
			local self = setmetatable({}, sprite)
			return self:constructor(...) or self
		end
		function sprite:constructor()
			self.position = Vector2.new()
			self.rotation = 0
			self.acceleration = Vector2.new()
			self.velocity = Vector2.new()
		end
		function sprite:transformPosition(position)
		end
		function sprite:applyImpulse(force)
		end
		function sprite:setPosition(position)
		end
		function sprite:getPosition()
			return Vector2.new()
		end
		function sprite:update(dt)
		end
		function sprite:render()
		end
	end
	_container.sprite = sprite
	local function drawSphere(position, size, additionalProperties)
		local s = Instance.new("Part")
		s.Shape = Enum.PartType.Ball
		s.Size = Vector3.new(size, size, size)
		s.Position = position
		s.BottomSurface = Enum.SurfaceType.SmoothNoOutlines
		s.TopSurface = Enum.SurfaceType.SmoothNoOutlines
		s.RightSurface = Enum.SurfaceType.SmoothNoOutlines
		s.LeftSurface = Enum.SurfaceType.SmoothNoOutlines
		s.FrontSurface = Enum.SurfaceType.SmoothNoOutlines
		s.BackSurface = Enum.SurfaceType.SmoothNoOutlines
		s.Anchored = true
		if additionalProperties then
			local _arg0 = function(value, index)
				s[index] = value
			end
			-- ▼ ReadonlyMap.forEach ▼
			for _k, _v in pairs(additionalProperties) do
				_arg0(_v, _k, additionalProperties)
			end
			-- ▲ ReadonlyMap.forEach ▲
		end
		return s
	end
	_container.drawSphere = drawSphere
	local Entity
	do
		Entity = setmetatable({}, {
			__tostring = function()
				return "Entity"
			end,
		})
		Entity.__index = Entity
		function Entity.new(...)
			local self = setmetatable({}, Entity)
			return self:constructor(...) or self
		end
		function Entity:constructor(instancename)
			self.shape = Enum.PartType.Block
			self.instance = Instance.new(instancename)
		end
		function Entity:reshape(shape)
			repeat
				if shape == ("block") then
					self.shape = Enum.PartType.Block
					break
				end
				if shape == ("sphere") then
					self.shape = Enum.PartType.Ball
					break
				end
				if shape == ("cylinder") then
					self.shape = Enum.PartType.Cylinder
					break
				end
				break
			until true
		end
		function Entity:colorBy(color)
			local base = self.instance.Color
			self.instance.Color = Color3.new(color.R + base.R, color.G + base.G, color.B + base.B)
			return self
		end
		function Entity:colorTo(color)
			self.instance.Color = color
			return self
		end
		function Entity:getIntersecting()
			local parts = Workspace:GetPartsInPart(self.instance)
			return parts
		end
		function Entity:setProps(properties)
			for index, value in pairs(properties) do
				self.instance[index] = value
			end
			return self
		end
		function Entity:rotateBy(rotation)
			if typeof(rotation) == "CFrame" then
				local cf = self.instance.CFrame
				local p = cf.Position
				local rx, ry, rz = cf:ToOrientation()
				local _cFrame = CFrame.new(p)
				local _cFrame_1 = CFrame.new(Vector3.new(rx, ry, rz))
				self.instance.CFrame = _cFrame * _cFrame_1 * rotation
			elseif typeof(rotation) == "Vector3" then
				self.instance.Orientation = self.instance.Orientation + rotation
			end
			return self
		end
		function Entity:rotateTo(rotation)
			if typeof(rotation) == "CFrame" then
				self.instance.CFrame = CFrame.new(self.instance.CFrame.Position) * rotation
			elseif typeof(rotation) == "Vector3" then
				self.instance.Orientation = rotation
			end
			return self
		end
		function Entity:translateBy(position)
			self.instance.Position = self.instance.Position + position
			return self
		end
		function Entity:translateTo(position)
			self.instance.Position = position
			return self
		end
	end
	_container.Entity = Entity
	local particle
	do
		particle = setmetatable({}, {
			__tostring = function()
				return "particle"
			end,
		})
		particle.__index = particle
		function particle.new(...)
			local self = setmetatable({}, particle)
			return self:constructor(...) or self
		end
		function particle:constructor(params)
			self.active = true
			self.particles = {}
			local _ptr = {}
			for _k, _v in pairs(defaultParams) do
				_ptr[_k] = _v
			end
			for _k, _v in pairs(params) do
				_ptr[_k] = _v
			end
			self.config = _ptr
			local conn
			conn = RunService.Heartbeat:Connect(function()
				if not self.active then
					conn:Disconnect()
					return nil
				end
				self:onupdate()
			end)
		end
		function particle:cleanUp()
			local _particles = self.particles
			local _arg0 = function(v)
				v.alive = false
			end
			-- ▼ ReadonlyArray.forEach ▼
			for _k, _v in ipairs(_particles) do
				_arg0(_v, _k - 1, _particles)
			end
			-- ▲ ReadonlyArray.forEach ▲
		end
		function particle:destroy()
			self.active = false
			self:cleanUp()
		end
		function particle:createParticles(params)
			local _ptr = {}
			for _k, _v in pairs(self.config) do
				_ptr[_k] = _v
			end
			if type(params) == "table" then
				for _k, _v in pairs(params) do
					_ptr[_k] = _v
				end
			end
			local config = _ptr
			local pars = params and config or self.config
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
					if not (i < pars.amount) then
						break
					end
					local p = getParticle()
					p.Anchored = pars.anchored
					p.Parent = Workspace.Terrain
					local c = {
						instance = p,
						customparams = pars,
						alive = true,
					}
					local _particles = self.particles
					local _c = c
					-- ▼ Array.push ▼
					_particles[#_particles + 1] = _c
					-- ▲ Array.push ▲
					local emt = p:FindFirstChild("effect")
					emt.Rate = pars.rate
					emt.Drag = pars.drag
					emt.SpreadAngle = pars.spreadAngle
					emt:Clear()
					emt:Emit(1)
					p.CFrame = pars.origin
					local _localparticles = localparticles
					local _c_1 = c
					-- ▼ Array.push ▼
					_localparticles[#_localparticles + 1] = _c_1
					-- ▲ Array.push ▲
					local _value = pars.impulse
					if _value ~= 0 and _value == _value and _value then
						if pars.impulseFromLookVector then
							local _impulse = pars.impulse
							local _arg0 = typeof(_impulse) == "number"
							assert(_arg0, "impulse must be a number when the impulseFromLookvector is enabled")
							local _fn = p
							local _lookVector = p.CFrame.LookVector
							local _arg0_1 = (pars.impulse) / 100
							_fn:ApplyImpulse(_lookVector * _arg0_1)
						else
							local _impulse = pars.impulse
							local _arg0 = typeof(_impulse) == "Vector3"
							assert(_arg0, "impulse must be a vector3 if you are not using the impulseFromLookVector property")
							p:ApplyImpulse((pars.impulse) / 1000)
						end
					end
				end
			end
			return {
				change = function(params)
					local _localparticles = localparticles
					local _arg0 = function(v)
						local _ptr_1 = {}
						for _k, _v in pairs(v.customparams) do
							_ptr_1[_k] = _v
						end
						if type(params) == "table" then
							for _k, _v in pairs(params) do
								_ptr_1[_k] = _v
							end
						end
						local configr = _ptr_1
						v.customparams = configr
						print(v.customparams)
						print(self.particles[(table.find(self.particles, v) or 0) - 1 + 1])
					end
					-- ▼ ReadonlyArray.forEach ▼
					for _k, _v in ipairs(_localparticles) do
						_arg0(_v, _k - 1, _localparticles)
					end
					-- ▲ ReadonlyArray.forEach ▲
				end,
				resetLinearVelocity = function()
					local _localparticles = localparticles
					local _arg0 = function(v)
						local l = v.instance.Anchored
						v.instance.Anchored = true
						while not v.instance.AssemblyLinearVelocity:FuzzyEq(Vector3.new(), .001) do
							v.instance.AssemblyLinearVelocity = Vector3.new()
							task.wait(1 / 60 * 2)
						end
						v.instance.Anchored = l
					end
					-- ▼ ReadonlyArray.forEach ▼
					for _k, _v in ipairs(_localparticles) do
						_arg0(_v, _k - 1, _localparticles)
					end
					-- ▲ ReadonlyArray.forEach ▲
				end,
				destroyThese = function()
					local _localparticles = localparticles
					local _arg0 = function(v)
						v.alive = false
					end
					-- ▼ ReadonlyArray.forEach ▼
					for _k, _v in ipairs(_localparticles) do
						_arg0(_v, _k - 1, _localparticles)
					end
					-- ▲ ReadonlyArray.forEach ▲
				end,
			}
		end
		function particle:onupdate()
			local _particles = self.particles
			local _arg0 = function(md, i)
				local v = md.instance
				local config = md.customparams
				coroutine.wrap(function()
					if not md.alive then
						md.instance:Destroy()
						table.remove(self.particles, i + 1)
						return nil
					end
					if not config then
						return nil
					end
					v.CanCollide = config.collisions
					v.Anchored = config.anchored
					local trail = v:FindFirstChild("trail")
					local fire = v:FindFirstChild("fire")
					local smoke = v:FindFirstChild("smoke")
					local glow = v:FindFirstChild("glow")
					local spot = v:FindFirstChild("spot")
					local force = v:FindFirstChild("force")
					local effect = v:FindFirstChild("effect")
					trail.Color = config.trailColor
					trail.FaceCamera = config.trailFacesCamera
					trail.Enabled = config.trail
					trail.Lifetime = config.trailLifetime
					trail.LightEmission = config.trailLightEmission
					trail.LightInfluence = config.trailLightInfluence
					trail.MaxLength = config.trailMaxLength
					trail.MinLength = config.trailMinlength
					trail.Texture = config.trailTexture
					trail.TextureLength = config.trailTextureLength
					trail.TextureMode = config.trailTextureMode
					trail.Transparency = config.trailTransparency
					trail.WidthScale = config.trailWidthScale
					glow.Brightness = config.glowBrightness
					glow.Color = config.glowColor
					glow.Range = config.glowRange
					glow.Shadows = config.glowCastsShadows
					spot.Brightness = config.glowBrightness
					spot.Color = config.glowColor
					spot.Angle = config.glowAngle
					spot.Face = config.glowDirection
					spot.Range = config.glowRange
					spot.Shadows = config.glowCastsShadows
					smoke.Size = config.smokeSize
					smoke.Color = config.smokeColor
					smoke.Enabled = config.smoke
					smoke.RiseVelocity = config.smokeRise
					smoke.Opacity = config.smokeOpacity
					fire.Color = config.fireColor
					fire.Enabled = config.fire
					fire.Heat = config.fireRise
					fire.Size = config.fireSize
					fire.SecondaryColor = config.fireColor2
					effect.Rate = config.static and 0 or config.rate
					effect.Color = config.color
					effect.SpreadAngle = config.spreadAngle
					effect.Transparency = config.transparency
					effect.Texture = config.texture
					effect.Enabled = true
					effect.Drag = config.drag
					force.Force = config.velocity
					if config.glow then
						local _exp = config.glowType
						repeat
							if _exp == ("aura") then
								glow.Enabled = true
								spot.Enabled = false
								break
							end
							if _exp == ("targetted") then
								glow.Enabled = false
								spot.Enabled = true
								break
							end
							error("unknown glowType")
							break
						until true
					else
						glow.Enabled = false
						spot.Enabled = false
					end
				end)()
			end
			-- ▼ ReadonlyArray.forEach ▼
			for _k, _v in ipairs(_particles) do
				_arg0(_v, _k - 1, _particles)
			end
			-- ▲ ReadonlyArray.forEach ▲
		end
	end
	_container.particle = particle
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
	local function edgesFromObject(object)
		local _binding = { object.AbsolutePosition, object.AbsoluteSize, object.Rotation }
		local position = _binding[1]
		local size = _binding[2]
		local rotation = _binding[3]
		local _binding_1 = { position.X + (size.X / 2), position.Y + (size.Y / 2) }
		local midx = _binding_1[1]
		local midy = _binding_1[2]
		local corners = { { midx + (size.X / 2), midy + (size.Y / 2) }, { midx - (size.X / 2), midy + (size.Y / 2) }, { midx - (size.X / 2), midy - (size.Y / 2) }, { midx + (size.X / 2), midy - (size.Y / 2) } }
		local edges = {
			topright = corners[1],
			topleft = corners[2],
			bottomleft = corners[3],
			bottomright = corners[4],
		}
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
	_container.edgesFromObject = edgesFromObject
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
end
return saturn
