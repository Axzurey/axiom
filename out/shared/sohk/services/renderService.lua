-- Compiled with roblox-ts v1.2.3
local TS = require(game:GetService("ReplicatedStorage"):WaitForChild("rbxts_include"):WaitForChild("RuntimeLib"))
local Workspace = TS.import(script, TS.getModule(script, "@rbxts", "services")).Workspace
local renderService = {}
do
	local _container = renderService
	local function flux(freq, amp)
		return math.sin(tick() * freq) * amp
	end
	_container.flux = flux
	local function getPointsOnCircle(points, radius)
		local arr = {}
		local dsts = 360 / points
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
				print(i)
				local theta = math.rad(dsts * i)
				local x = math.cos(theta) * radius
				local y = math.sin(theta) * radius
				local _arr = arr
				local _arg0 = {
					x = x,
					y = y,
				}
				-- ▼ Array.push ▼
				_arr[#_arr + 1] = _arg0
				-- ▲ Array.push ▲
			end
		end
		return arr
	end
	_container.getPointsOnCircle = getPointsOnCircle
	local triangle
	local function drawHexagon(center, faceNormal)
		local outerpoints = getPointsOnCircle(6, 10)
		local triangles = {}
		local _outerpoints = outerpoints
		local _arg0 = function(now, after)
			local nextIndex = outerpoints[after + 1 + 1] or outerpoints[1]
			local first = Vector3.new(now.x, now.y, 0) + center
			local second = Vector3.new(nextIndex.x, nextIndex.y, 0) + center
			local tri = triangle.new(first, second, center, 1, 1, {
				Color = Color3.new(0, 0, 1),
				Material = Enum.Material.Neon,
			})
			tri:draw(Workspace)
			-- ▼ Array.push ▼
			triangles[#triangles + 1] = tri
			-- ▲ Array.push ▲
		end
		-- ▼ ReadonlyArray.forEach ▼
		for _k, _v in ipairs(_outerpoints) do
			_arg0(_v, _k - 1, _outerpoints)
		end
		-- ▲ ReadonlyArray.forEach ▲
	end
	_container.drawHexagon = drawHexagon
	-- triangle class stuff
	local geowedge = Instance.new("WedgePart")
	geowedge.Anchored = true
	geowedge.TopSurface = Enum.SurfaceType.Smooth
	geowedge.BottomSurface = Enum.SurfaceType.Smooth
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
			for key, val in pairs(self.properties) do
				self.w0[key] = val
				self.w1[key] = val
			end
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
	_container.triangle = triangle
end
return renderService
