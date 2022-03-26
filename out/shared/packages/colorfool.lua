-- Compiled with roblox-ts v1.2.3
local TS = require(game:GetService("ReplicatedStorage"):WaitForChild("rbxts_include"):WaitForChild("RuntimeLib"))
local _services = TS.import(script, TS.getModule(script, "@rbxts", "services"))
local RunService = _services.RunService
local Workspace = _services.Workspace
local mathf = TS.import(script, game:GetService("ReplicatedStorage"), "TS", "modules", "System").mathf
local colorfool = {}
do
	local _container = colorfool
	local types = {}
	do
		local _container_1 = types
		local cloneColorType
		do
			local _inverse = {}
			cloneColorType = setmetatable({}, {
				__index = _inverse,
			})
			cloneColorType.keep = 0
			_inverse[0] = "keep"
		end
		_container_1.cloneColorType = cloneColorType
		local flags
		do
			local _inverse = {}
			flags = setmetatable({}, {
				__index = _inverse,
			})
			flags.lookToNextPoint = 0
			_inverse[0] = "lookToNextPoint"
			flags.lookToPreviousPoint = 1
			_inverse[1] = "lookToPreviousPoint"
			flags.lookToDefinedNormal = 2
			_inverse[2] = "lookToDefinedNormal"
		end
		_container_1.flags = flags
	end
	_container.types = types
	local utilityClasses = {}
	do
		local _container_1 = utilityClasses
		local reference
		do
			reference = setmetatable({}, {
				__tostring = function()
					return "reference"
				end,
			})
			reference.__index = reference
			function reference.new(...)
				local self = setmetatable({}, reference)
				return self:constructor(...) or self
			end
			function reference:constructor(initialValue)
				self.value = initialValue
			end
			function reference:getValue()
				return self.value
			end
			function reference:setValue(value)
				self.value = value
			end
		end
		_container_1.reference = reference
	end
	local utility = {}
	do
		local _container_1 = utility
		local function createReference(initialValue)
			return utilityClasses.reference.new(initialValue)
		end
		_container_1.createReference = createReference
	end
	_container.utility = utility
	local effectors = {}
	do
		local _container_1 = effectors
		local orbitCircular
		do
			orbitCircular = setmetatable({}, {
				__tostring = function()
					return "orbitCircular"
				end,
			})
			orbitCircular.__index = orbitCircular
			function orbitCircular.new(...)
				local self = setmetatable({}, orbitCircular)
				return self:constructor(...) or self
			end
			function orbitCircular:constructor(anchor)
				self.active = true
				self.flags = {}
				self.detail = 360
				self.anchor = anchor
			end
			function orbitCircular:render(orbitalPoint, orbitRadius)
				local connection = RunService.Stepped:Connect(function(_t, dt)
					local point = Vector3.new()
					if typeof(orbitalPoint) == "Vector3" then
						point = orbitalPoint
					else
						point = orbitalPoint:getValue()
					end
					local radius = 0
					if typeof(orbitRadius) == "number" then
						radius = orbitRadius
					else
						radius = orbitRadius:getValue()
					end
					local orbitPath = mathf.pointsOnCircle(radius, 360)
				end)
			end
			function orbitCircular:destroy()
			end
		end
		_container_1.orbitCircular = orbitCircular
		local gyration
		do
			gyration = setmetatable({}, {
				__tostring = function()
					return "gyration"
				end,
			})
			gyration.__index = gyration
			function gyration.new(...)
				local self = setmetatable({}, gyration)
				return self:constructor(...) or self
			end
			function gyration:constructor(anchor)
				self.active = true
				self.rotationAxis = Vector3.new(1, 0, 0)
				self.rotationSpeed = 360 / 100
				self.anchor = anchor
			end
			function gyration:render()
				local conn
				conn = RunService.Stepped:Connect(function(_t, dt)
					if not self.active then
						conn:Disconnect()
					end
					local _rotation = self.anchor.Rotation
					local _rotationAxis = self.rotationAxis
					local _rotationSpeed = self.rotationSpeed
					local _dt = dt
					self.anchor.Rotation = _rotation + (_rotationAxis * _rotationSpeed * _dt)
				end)
			end
			function gyration:destroy()
				self.active = false
			end
		end
		_container_1.gyration = gyration
		local pulse
		do
			pulse = setmetatable({}, {
				__tostring = function()
					return "pulse"
				end,
			})
			pulse.__index = pulse
			function pulse.new(...)
				local self = setmetatable({}, pulse)
				return self:constructor(...) or self
			end
			function pulse:constructor(anchor)
				self.active = true
				self.activeFloaters = {}
				self.delay = .25
				self.growVector = Vector3.new(1, 1, 1)
				self.cloneMaterial = Enum.Material.Neon
				self.cloneColor = Color3.fromRGB(69, 0, 255)
				self.targetSize = 15
				self.growRate = .1
				self.transparencyRate = .01
				self.parent = Workspace
				self.anchor = anchor
			end
			function pulse:render()
				coroutine.wrap(function()
					while true do
						if not self.active then
							break
						end
						local originalSize = self.anchor.Size
						task.wait(self.delay)
						local floater = self.anchor:Clone()
						floater.Material = self.cloneMaterial
						floater.Name = self.anchor.Name .. ":floater:" .. tostring(#self.activeFloaters)
						floater.Parent = self.parent
						local _cloneColor = self.cloneColor
						if typeof(_cloneColor) == "Color3" then
							floater.Color = self.cloneColor
						end
						local _activeFloaters = self.activeFloaters
						local _floater = floater
						-- ▼ Array.push ▼
						_activeFloaters[#_activeFloaters + 1] = _floater
						-- ▲ Array.push ▲
						local t = 0
						local run
						run = RunService.Heartbeat:Connect(function(dt)
							if t >= self.targetSize then
								run:Disconnect()
								local _activeFloaters_1 = self.activeFloaters
								local _floater_1 = floater
								local t = (table.find(_activeFloaters_1, _floater_1) or 0) - 1
								if t ~= -1 then
									local _activeFloaters_2 = self.activeFloaters
									local _t = t
									table.remove(_activeFloaters_2, _t + 1)
								end
								floater:Destroy()
								return nil
							end
							t += self.growRate * dt * 60
							local _originalSize = originalSize
							local _growVector = self.growVector
							local _t = t
							floater.Size = _originalSize + (_growVector * _t)
							floater.CFrame = self.anchor.CFrame
							floater.Transparency += self.transparencyRate * dt * 60
						end)
					end
				end)()
			end
			function pulse:destroy()
				self.active = false
				local _activeFloaters = self.activeFloaters
				local _arg0 = function(v)
					v:Destroy()
				end
				-- ▼ ReadonlyArray.forEach ▼
				for _k, _v in ipairs(_activeFloaters) do
					_arg0(_v, _k - 1, _activeFloaters)
				end
				-- ▲ ReadonlyArray.forEach ▲
			end
		end
		_container_1.pulse = pulse
	end
	_container.effectors = effectors
	local operations = {}
	do
		local _container_1 = operations
		local mirror
		do
			mirror = setmetatable({}, {
				__tostring = function()
					return "mirror"
				end,
			})
			mirror.__index = mirror
			function mirror.new(...)
				local self = setmetatable({}, mirror)
				return self:constructor(...) or self
			end
			function mirror:constructor(anchor)
				self.active = true
				self.point = Vector3.new()
				self.axis = Vector3.new(1, 1, 1)
				self.parent = Workspace
				self.mobjects = {}
				self.anchor = anchor
			end
			function mirror:render()
				local clone = self.anchor:Clone()
				local _mobjects = self.mobjects
				local _clone = clone
				-- ▼ Array.push ▼
				_mobjects[#_mobjects + 1] = _clone
				-- ▲ Array.push ▲
				local conn
				conn = RunService.Heartbeat:Connect(function()
					if not self.active then
						conn:Disconnect()
						return nil
					end
					local _position = self.anchor.Position
					local _arg0 = self.axis * (-1)
					clone.Position = _position * _arg0
					if clone.Parent ~= self.parent then
						clone.Parent = self.parent
					end
				end)
			end
			function mirror:destroy()
				self.active = false
				local _mobjects = self.mobjects
				local _arg0 = function(v)
					v:Destroy()
				end
				-- ▼ ReadonlyArray.forEach ▼
				for _k, _v in ipairs(_mobjects) do
					_arg0(_v, _k - 1, _mobjects)
				end
				-- ▲ ReadonlyArray.forEach ▲
			end
		end
		_container_1.mirror = mirror
		local array
		do
			array = setmetatable({}, {
				__tostring = function()
					return "array"
				end,
			})
			array.__index = array
			function array.new(...)
				local self = setmetatable({}, array)
				return self:constructor(...) or self
			end
			function array:constructor(anchor)
				self.active = true
				self.iterations = 2
				self.factor = Vector3.new(0, 20, 0)
				self.factorOffsetsAnchorSize = false
				self.objects = {}
				self.parent = Workspace
				self.anchor = anchor
			end
			function array:render()
				local conn
				conn = RunService.Heartbeat:Connect(function()
					if not self.active then
						conn:Disconnect()
						return nil
					end
					local diff = self.iterations - #self.objects
					if diff > 0 then
						do
							local iteration = 0
							local _shouldIncrement = false
							while true do
								if _shouldIncrement then
									iteration += 1
								else
									_shouldIncrement = true
								end
								if not (iteration < diff) then
									break
								end
								local offset = self.factorOffsetsAnchorSize and self.anchor.Size or Vector3.new()
								local _position = self.anchor.Position
								local _offset = offset
								local _factor = self.factor
								local _arg0 = iteration + 1
								local newvector = _position + _offset + (_factor * _arg0)
								local c = self.anchor:Clone()
								c.Position = newvector
								c.Parent = self.parent
								local _objects = self.objects
								local _c = c
								-- ▼ Array.push ▼
								_objects[#_objects + 1] = _c
								-- ▲ Array.push ▲
							end
						end
					end
					local _objects = self.objects
					local _arg0 = function(v, iteration)
						local offset = self.factorOffsetsAnchorSize and self.anchor.Size or Vector3.new()
						local _position = self.anchor.Position
						local _offset = offset
						local _factor = self.factor
						local _arg0_1 = iteration + 1
						v.Position = _position + _offset + (_factor * _arg0_1)
					end
					-- ▼ ReadonlyArray.forEach ▼
					for _k, _v in ipairs(_objects) do
						_arg0(_v, _k - 1, _objects)
					end
					-- ▲ ReadonlyArray.forEach ▲
				end)
			end
			function array:destroy()
				self.active = false
				local _objects = self.objects
				local _arg0 = function(v)
					v:Destroy()
				end
				-- ▼ ReadonlyArray.forEach ▼
				for _k, _v in ipairs(_objects) do
					_arg0(_v, _k - 1, _objects)
				end
				-- ▲ ReadonlyArray.forEach ▲
			end
		end
		_container_1.array = array
	end
	_container.operations = operations
end
return colorfool
