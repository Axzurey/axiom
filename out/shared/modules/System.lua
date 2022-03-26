-- Compiled with roblox-ts v1.2.3
local TS = require(game:GetService("ReplicatedStorage"):WaitForChild("rbxts_include"):WaitForChild("RuntimeLib"))
local _services = TS.import(script, TS.getModule(script, "@rbxts", "services"))
local RunService = _services.RunService
local Workspace = _services.Workspace
local System = {}
do
	local _container = System
	local fpsclockstart = os.clock()
	local fpscounter = 0
	local process
	local rs1 = RunService.Heartbeat:Connect(function(deltatime)
		process.deltatime = deltatime
		fpscounter += 1
		if os.clock() - fpsclockstart >= 1 then
			process.framerate = math.floor(fpscounter / (os.clock() - fpsclockstart))
			fpsclockstart = os.clock()
			fpscounter = 0
		end
	end)
	process = {}
	do
		local _container_1 = process
		--[[
			*
			* deltatime from heartbeat
		]]
		_container_1.deltatime = 0
		_container_1.framerate = 0
		_container_1.ping = 0
		--[[
			*
			* sequentially runs all the functions passing the output from the current function into the next function
		]]
		local function pipe(...)
			local args = { ... }
			return function(...)
				local params = { ... }
				local n = nil
				local _arg0 = function(callback)
					local c
					if n ~= 0 and n == n and n ~= "" and n then
						local _n = n
						c = typeof(_n) == "table" and n or { n }
					else
						c = typeof(params) == "table" and params or { params }
					end
					n = callback(unpack(c))
				end
				-- ▼ ReadonlyArray.forEach ▼
				for _k, _v in ipairs(args) do
					_arg0(_v, _k - 1, args)
				end
				-- ▲ ReadonlyArray.forEach ▲
				return n
			end
		end
		_container_1.pipe = pipe
	end
	_container.process = process
	local Console = {}
	do
		local _container_1 = Console
		--[[
			*
			* A cooler print 😎
		]]
		local function WriteLine(...)
			local args = { ... }
			print(unpack(args))
		end
		_container_1.WriteLine = WriteLine
	end
	_container.Console = Console
	local recursiveThread
	do
		recursiveThread = setmetatable({}, {
			__tostring = function()
				return "recursiveThread"
			end,
		})
		recursiveThread.__index = recursiveThread
		function recursiveThread.new(...)
			local self = setmetatable({}, recursiveThread)
			return self:constructor(...) or self
		end
		function recursiveThread:constructor(callback, every)
			self.alive = false
			self.every = 1
			self.calldt = math.huge
			self.args = {}
			self.every = every
			self.callback = callback
			local calledAlive = false
			local t
			t = RunService.Stepped:Connect(function(st, dt)
				if self.alive then
					calledAlive = true
				end
				if not self.alive and calledAlive then
					t:Disconnect()
					return nil
				end
				self.calldt += 1 * dt
				if self.calldt > self.every then
					self.calldt = 0
					self.callback(self.args)
				end
			end)
		end
		function recursiveThread:terminate()
			self.alive = false
		end
		function recursiveThread:start(...)
			local args = { ... }
			self.alive = true
			self.args = args
		end
	end
	local thread
	do
		thread = setmetatable({}, {
			__tostring = function()
				return "thread"
			end,
		})
		thread.__index = thread
		function thread.new(...)
			local self = setmetatable({}, thread)
			return self:constructor(...) or self
		end
		function thread:constructor(callback)
			self.callback = coroutine.wrap(callback)
		end
		function thread:start(...)
			local args = { ... }
			self.callback(unpack(args))
		end
	end
	local Threading = {}
	do
		local _container_1 = Threading
		--[[
			*
			* Cooler threads
			* @param callback
			* @returns a new thread that can be invoked multiple times by calling the start method
		]]
		local function Thread(callback)
			return thread.new(callback)
		end
		_container_1.Thread = Thread
		local function Recursive(callback, every)
			return recursiveThread.new(callback, every)
		end
		_container_1.Recursive = Recursive
	end
	_container.Threading = Threading
	local timer
	do
		timer = setmetatable({}, {
			__tostring = function()
				return "timer"
			end,
		})
		timer.__index = timer
		function timer.new(...)
			local self = setmetatable({}, timer)
			return self:constructor(...) or self
		end
		function timer:constructor(callback)
			self.callback = callback
		end
		function timer:run()
			return TS.Promise.new(function(resolve, reject)
				TS.try(function()
					local n = os.clock()
					self.callback()
					resolve("completed test in " .. tostring(os.clock() - n) .. " seconds")
				end, function(e)
					reject(tostring(e))
				end)
			end)
		end
	end
	local Timer = {}
	do
		local _container_1 = Timer
		--[[
			*
			* Timers 😎
			* @param callback
			* @returns a new timer class that can be invoked multiple times by calling the run method
		]]
		local function benchmark(callback)
			return timer.new(callback)
		end
		_container_1.benchmark = benchmark
	end
	_container.Timer = Timer
	local Raylibclasses = {}
	do
		local _container_1 = Raylibclasses
		local geowedge = Instance.new("WedgePart")
		geowedge.Anchored = true
		geowedge.TopSurface = Enum.SurfaceType.Smooth
		geowedge.BottomSurface = Enum.SurfaceType.Smooth
		local triangle
		do
			triangle = setmetatable({}, {
				__tostring = function()
					return "triangle"
				end,
			})
			triangle.__index = triangle
			function triangle.new(...)
				local self = setmetatable({}, triangle)
				return self:constructor(...) or self
			end
			function triangle:constructor(a, b, c, width0, width1, properties)
				self.points = {
					a = Vector3.new(),
					b = Vector3.new(),
					c = Vector3.new(),
				}
				self.properties = {}
				self.w0 = geowedge:Clone()
				self.w1 = geowedge:Clone()
				self.width0 = 0
				self.width1 = 0
				self:setpoints(a, b, c)
				self.properties = properties or {}
				local _fn = self
				local _condition = width0
				if not (_condition ~= 0 and _condition == _condition and _condition) then
					_condition = 0
				end
				local _condition_1 = width1
				if not (_condition_1 ~= 0 and _condition_1 == _condition_1 and _condition_1) then
					_condition_1 = 0
				end
				_fn:setwidth(_condition, _condition_1)
			end
			function triangle:setpoints(a, b, c)
				self.points.a = a
				self.points.b = b
				self.points.c = c
			end
			function triangle:setwidth(width0, width1)
				self.width0 = width0
				self.width1 = width1
			end
			function triangle:draw(parent)
				local _properties = self.properties
				local _arg0 = function(val, key)
					self.w0[key] = val
					self.w1[key] = val
				end
				-- ▼ ReadonlyMap.forEach ▼
				for _k, _v in pairs(_properties) do
					_arg0(_v, _k, _properties)
				end
				-- ▲ ReadonlyMap.forEach ▲
				local _binding = { self.points.a, self.points.b, self.points.c }
				local a = _binding[1]
				local b = _binding[2]
				local c = _binding[3]
				local _b = b
				local _a = a
				local _exp = _b - _a
				local _c = c
				local _a_1 = a
				local _exp_1 = _c - _a_1
				local _c_1 = c
				local _b_1 = b
				local _binding_1 = { _exp, _exp_1, _c_1 - _b_1 }
				local ab = _binding_1[1]
				local ac = _binding_1[2]
				local bc = _binding_1[3]
				local _binding_2 = { ab:Dot(ab), ac:Dot(ac), bc:Dot(bc) }
				local abd = _binding_2[1]
				local acd = _binding_2[2]
				local bcd = _binding_2[3]
				if abd > acd and abd > bcd then
					local _binding_3 = { a, c }
					c = _binding_3[1]
					a = _binding_3[2]
				elseif acd > bcd and acd > abd then
					local _binding_3 = { b, a }
					a = _binding_3[1]
					b = _binding_3[2]
				end
				local _b_2 = b
				local _a_2 = a
				local _exp_2 = _b_2 - _a_2
				local _c_2 = c
				local _a_3 = a
				local _exp_3 = _c_2 - _a_3
				local _c_3 = c
				local _b_3 = b
				local _binding_3 = { _exp_2, _exp_3, _c_3 - _b_3 }
				ab = _binding_3[1]
				ac = _binding_3[2]
				bc = _binding_3[3]
				local right = ac:Cross(ab).Unit
				local up = bc:Cross(right).Unit
				local back = bc.Unit
				local height = math.abs(ab:Dot(up))
				self.w0.Size = Vector3.new(self.width0, height, math.abs(ab:Dot(back)))
				local _fn = CFrame
				local _a_4 = a
				local _b_4 = b
				self.w0.CFrame = _fn.fromMatrix((_a_4 + _b_4) / 2, right, up, back)
				self.w0.Parent = parent
				self.w1.Size = Vector3.new(self.width1, height, math.abs(ac:Dot(back)))
				local _fn_1 = CFrame
				local _a_5 = a
				local _c_4 = c
				self.w1.CFrame = _fn_1.fromMatrix((_a_5 + _c_4) / 2, right * (-1), up, back * (-1))
				self.w1.Parent = parent
			end
		end
		_container_1.triangle = triangle
		local linepart = Instance.new("Part")
		linepart.Anchored = true
		local line
		do
			line = setmetatable({}, {
				__tostring = function()
					return "line"
				end,
			})
			line.__index = line
			function line.new(...)
				local self = setmetatable({}, line)
				return self:constructor(...) or self
			end
			function line:constructor(a, b, width0, width1, properties)
				self.w0 = linepart:Clone()
				self.properties = properties or {}
				self.points = {
					a = a,
					b = b,
				}
				local _condition = width0
				if not (_condition ~= 0 and _condition == _condition and _condition) then
					_condition = .1
				end
				self.width0 = _condition
				local _condition_1 = width1
				if not (_condition_1 ~= 0 and _condition_1 == _condition_1 and _condition_1) then
					_condition_1 = .1
				end
				self.width1 = _condition_1
			end
			function line:setpoints(a, b, c)
				self.points.a = a
				self.points.b = b
			end
			function line:setwidth(width0, width1)
				self.width0 = width0
				self.width1 = width1
			end
			function line:draw(parent)
				local _properties = self.properties
				local _arg0 = function(val, key)
					self.w0[key] = val
				end
				-- ▼ ReadonlyMap.forEach ▼
				for _k, _v in pairs(_properties) do
					_arg0(_v, _k, _properties)
				end
				-- ▲ ReadonlyMap.forEach ▲
				local lookat = CFrame.lookAt(self.points.b, self.points.a)
				local _a = self.points.a
				local _b = self.points.b
				local length = (_a - _b).Magnitude
				local size = Vector3.new(self.width0, self.width1, length)
				local _lookat = lookat
				local _cFrame = CFrame.new(0, 0, -length / 2)
				self.w0.CFrame = _lookat * _cFrame
				self.w0.Size = size
				self.w0.Parent = parent
			end
		end
		_container_1.line = line
	end
	_container.Raylibclasses = Raylibclasses
	local Raylib = {}
	do
		local _container_1 = Raylib
		local function DrawTri(a, b, c, width0, width1, properties)
			return Raylibclasses.triangle.new(a, b, c, width0, width1, properties)
		end
		_container_1.DrawTri = DrawTri
		local function DrawLine(a, b, width0, width1, properties)
			return Raylibclasses.line.new(a, b, width0, width1, properties)
		end
		_container_1.DrawLine = DrawLine
	end
	_container.Raylib = Raylib
	local mathf = {}
	do
		local _container_1 = mathf
		-- local
		local randomGenerator = Random.new()
		local sin = math.sin
		local tan = math.tan
		local abs = math.abs
		local cos = math.cos
		local atan2 = math.atan2
		local asin = math.asin
		local acos = math.acos
		local rad = math.rad
		local deg = math.deg
		local pi = math.pi
		-- types
		-- constants
		local inf = math.huge
		_container_1.inf = inf
		local e = 2.718281
		_container_1.e = e
		local tau = pi * 2
		_container_1.tau = tau
		local phi = 2.618033
		_container_1.phi = phi
		local earthGravity = 9.807
		_container_1.earthGravity = earthGravity
		local lightSpeed = 299792458
		_container_1.lightSpeed = lightSpeed
		-- functions
		local function angleBetween(v1, v2)
			return acos(math.clamp(v1:Dot(v2), -1, 1))
		end
		_container_1.angleBetween = angleBetween
		local function vectorIsClose(v1, v2, limit)
			return (v1 - v2).Magnitude <= limit and true or false
		end
		_container_1.vectorIsClose = vectorIsClose
		local function vector2IsSimilar(v1, v2, limit)
			if math.abs(v1.X - v2.X) > limit then
				return false
			end
			if math.abs(v1.Y - v2.Y) > limit then
				return false
			end
			return true
		end
		_container_1.vector2IsSimilar = vector2IsSimilar
		local function random(min, max, count)
			if min == nil then
				min = 0
			end
			if max == nil then
				max = 1
			end
			if count == nil then
				count = 1
			end
			if count == 1 then
				return randomGenerator:NextNumber(min, max)
			else
				local numbers = {}
				do
					local i = 0
					local _shouldIncrement = false
					while true do
						if _shouldIncrement then
							i += 1
						else
							_shouldIncrement = true
						end
						if not (i < count) then
							break
						end
						local _numbers = numbers
						local _arg0 = randomGenerator:NextNumber(min, max)
						-- ▼ Array.push ▼
						_numbers[#_numbers + 1] = _arg0
						-- ▲ Array.push ▲
					end
				end
				return numbers
			end
		end
		_container_1.random = random
		local function pointsOnCircle(radius, points, center)
			local parray = {}
			local cpo = 360 / points
			do
				local i = 1
				local _shouldIncrement = false
				while true do
					if _shouldIncrement then
						i += 1
					else
						_shouldIncrement = true
					end
					if not (i <= points) then
						break
					end
					local theta = math.rad(cpo * i)
					local x = cos(theta) * radius
					local y = sin(theta) * radius
					local _parray = parray
					local _arg0 = center and Vector2.new(x, y) + center or Vector2.new(x, y)
					-- ▼ Array.push ▼
					_parray[#_parray + 1] = _arg0
					-- ▲ Array.push ▲
				end
			end
			return parray
		end
		_container_1.pointsOnCircle = pointsOnCircle
		local function translationRequired(a, b)
			return a:Inverse() * b
		end
		_container_1.translationRequired = translationRequired
		local function vector2FromAngle(angle, radius)
			local _exp = rad(angle)
			local _condition = radius
			if not (_condition ~= 0 and _condition == _condition and _condition) then
				_condition = 1
			end
			local _exp_1 = cos(_exp * _condition)
			local _exp_2 = sin(rad(angle))
			local _condition_1 = radius
			if not (_condition_1 ~= 0 and _condition_1 == _condition_1 and _condition_1) then
				_condition_1 = 1
			end
			return Vector2.new(_exp_1, _exp_2 * _condition_1)
		end
		_container_1.vector2FromAngle = vector2FromAngle
		local function angleFromVector2(v)
			return atan2(v.Y, v.X)
		end
		_container_1.angleFromVector2 = angleFromVector2
		local function normalize(min, max, value)
			if value > max then
				return max
			end
			if value < min then
				return min
			end
			return (value - min) / (max - min)
		end
		_container_1.normalize = normalize
		local function denormalize(min, max, value)
			return value * (max - min) + min
		end
		_container_1.denormalize = denormalize
		local function uExtendingSpiral(t)
			return Vector2.new(t * cos(t), t * sin(t))
		end
		_container_1.uExtendingSpiral = uExtendingSpiral
		--[[
			*
			*
			* @param x1 line 1 x1
			* @param x2 line 1 x2
			* @param y1 line 1 y1
			* @param y2 line 1 y2
			* @param x3 line 2 x1
			* @param x4 line 2 x2
			* @param y3 line 2 y1
			* @param y4 line 2 y2
			* [x, y], [x, y] --line1
			* [x, y], [x, y] --line2
			* @returns the x and y co-ordinates that the lines intersect at. If they do not intersect, it returns undefined.
		]]
		local function getConvergence(x1, x2, y1, y2, x3, x4, y3, y4)
			local den = (x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4)
			if den == 0 then
				return nil
			end
			local t = ((x1 - x3) * (y3 - y4) - (y1 - y3) * (x3 - x4)) / den
			local u = -((x1 - x2) * (y1 - y3) - (y1 - y2) * (x1 - x3)) / den
			return { u, t }
		end
		_container_1.getConvergence = getConvergence
		local function uSquare(rotation, radius)
			if rotation == nil then
				rotation = 0
			end
			local cx = 0
			local cy = 0
			local function rotate(v1)
				local tx = v1.X - cx
				local ty = v1.Y - cy
				local rotatedX = tx * cos(rotation) - ty * sin(rotation)
				local rotatedY = tx * sin(rotation) - ty * cos(rotation)
				return Vector2.new(rotatedX + cx, rotatedY + cy)
			end
			local x1 = Vector2.new(1, 1) * radius
			local x2 = Vector2.new(1, -1) * radius
			local x3 = Vector2.new(-1, -1) * radius
			local x4 = Vector2.new(-1, 1) * radius
			return { rotate(x1), rotate(x2), rotate(x3), rotate(x4) }
		end
		_container_1.uSquare = uSquare
		local function slope(v1, v2)
			return (v2.Y - v1.Y) / (v2.X - v1.X)
		end
		_container_1.slope = slope
		local function lerp(v0, v1, t)
			return v0 + (v1 - v0) * t
		end
		_container_1.lerp = lerp
		local function lerpV3(v0, v1, t)
			local _arg0 = (v1 - v0) * t
			return v0 + _arg0
		end
		_container_1.lerpV3 = lerpV3
		local function degToRad(args)
			local newargs = { -1, -1, -1 }
			local _arg0 = function(v, i)
				newargs[i + 1] = math.rad(v)
			end
			-- ▼ ReadonlyArray.forEach ▼
			for _k, _v in ipairs(args) do
				_arg0(_v, _k - 1, args)
			end
			-- ▲ ReadonlyArray.forEach ▲
			return newargs
		end
		_container_1.degToRad = degToRad
		local function computeDistanceFromLineSegment(a, b, c)
			local px = (a - b):Cross(c - b).Magnitude
			local py = (c - b).Magnitude
			return px / py
		end
		_container_1.computeDistanceFromLineSegment = computeDistanceFromLineSegment
		local function percentToDegrees(percent)
			return percent * 360 / 100
		end
		_container_1.percentToDegrees = percentToDegrees
		local function xToDegrees(x, clamp)
			return x * 360 / clamp
		end
		_container_1.xToDegrees = xToDegrees
		local function degreesToPercent(degrees)
			return degrees / 360 * 100
		end
		_container_1.degreesToPercent = degreesToPercent
		local function bezierQuadratic(t, p0, p1, p2)
			return bit32.bxor(bit32.bxor((1 - t), 2 * p0 + 2 * (1 - t) * t * p1 + t), 2 * p2)
		end
		_container_1.bezierQuadratic = bezierQuadratic
		local function bezierQuadraticV3(t, p0, p1, p2)
			local l1 = lerpV3(p0, p1, t)
			local l2 = lerpV3(p1, p2, t)
			local q = lerpV3(l1, l2, t)
			return q
		end
		_container_1.bezierQuadraticV3 = bezierQuadraticV3
		--[[
			*
			*
			* @param part the part to check for the point on
			* @param point the point to get the closest vector on the part to
			* @returns
		]]
		local function closestPointOnPart(part, point)
			local t = part.CFrame:PointToObjectSpace(point)
			local hs = part.Size / 2
			local _cFrame = part.CFrame
			local _vector3 = Vector3.new(math.clamp(t.X, -hs.X, hs.X), math.clamp(t.Y, -hs.Y, hs.Y), math.clamp(t.Z, -hs.Z, hs.Z))
			return _cFrame * _vector3
		end
		_container_1.closestPointOnPart = closestPointOnPart
		local function plotInWorld(v3, color)
			if color == nil then
				color = Color3.fromRGB(0, 255, 255)
			end
			local p = Instance.new("Part")
			p.Size = Vector3.new(.1, .1, .1)
			p.Color = color
			p.Anchored = true
			p.CanCollide = false
			p.CanQuery = false
			p.CanTouch = false
			p.Position = v3
			p.Shape = Enum.PartType.Ball
			p.Material = Enum.Material.Neon
			p.Parent = Workspace
		end
		_container_1.plotInWorld = plotInWorld
	end
	_container.mathf = mathf
	local stringf = {}
	do
		local _container_1 = stringf
		-- types
		-- constants
		local lowerCase = { "a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z" }
		_container_1.lowerCase = lowerCase
		local upperCase = { "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z" }
		_container_1.upperCase = upperCase
		local basenumbers = { 0, 1, 2, 3, 4, 5, 6, 7, 8, 9 }
		_container_1.basenumbers = basenumbers
		local specialCharsets1 = { "!", "@", "#", "$", "%", "^", "&", "`", "~", "'", '"', "/", ",", "\\", "?", "*", "+", "-", "," }
		_container_1.specialCharsets1 = specialCharsets1
		local specialCharsets2 = { "(", ")", "<", ">", "[", "]", "{", "}" }
		_container_1.specialCharsets2 = specialCharsets2
		local specialCharsets3 = { "_", "-", ":", ";", "." }
		_container_1.specialCharsets3 = specialCharsets3
		-- functions
		local function toHMS(seconds)
			return string.format("%02i:%02i:%02i", bit32.bxor(seconds / 60, 2), seconds / 60 % 60, seconds % 60)
		end
		_container_1.toHMS = toHMS
		local function toDHMSRAW(seconds)
			local d = math.floor(seconds / 86400)
			local h = math.floor((seconds % 86400) / 3600)
			local m = math.floor((seconds % 3600) / 60)
			local s = math.floor(seconds % 60)
			return { d, h, m, s }
		end
		_container_1.toDHMSRAW = toDHMSRAW
		local function toDHMS(seconds)
			local d = math.floor(seconds / 86400)
			local h = math.floor((seconds % 86400) / 3600)
			local m = math.floor((seconds % 3600) / 60)
			local s = math.floor(seconds % 60)
			return string.format("%02i:%02i:%02i:%02i", d, h, m, s)
		end
		_container_1.toDHMS = toDHMS
		--[[
			export function toDHMSRAW(seconds: number) {
			let d = math.floor(seconds / 86400);
			let rem = seconds & 86400;
			let h: string | number = math.floor(rem % 3600);
			rem = rem % 3600;
			let m: string | number = math.floor(rem / 60);
			rem = rem % 60;
			let s: string | number = rem;
			if (h < 10) {
			h = "0" + h;
			}
			if (m < 10) {
			m = "0" + m;
			}
			if (s < 10) {
			s = "0" + s
			}
			return [d, h, m, s];
			}
		]]
	end
	_container.stringf = stringf
end
return System
