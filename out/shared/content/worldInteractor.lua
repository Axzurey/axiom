-- Compiled with roblox-ts v1.2.3
local TS = require(game:GetService("ReplicatedStorage"):WaitForChild("rbxts_include"):WaitForChild("RuntimeLib"))
local Workspace = TS.import(script, TS.getModule(script, "@rbxts", "services")).Workspace
local earth = TS.import(script, game:GetService("ReplicatedStorage"), "TS", "packages", "earth")
local sohk = TS.import(script, game:GetService("ReplicatedStorage"), "TS", "sohk").default
local worldInteractor
do
	local super = sohk.sohkComponent
	worldInteractor = setmetatable({}, {
		__tostring = function()
			return "worldInteractor"
		end,
		__index = super,
	})
	worldInteractor.__index = worldInteractor
	function worldInteractor.new(...)
		local self = setmetatable({}, worldInteractor)
		return self:constructor(...) or self
	end
	function worldInteractor:constructor(ctx, object)
		super.constructor(self)
		self.placementRange = 15
		self.ctx = ctx
		self.object = object
		local _exp = self.object:GetDescendants()
		local _arg0 = function(v)
			if v:IsA("BasePart") then
				v.CanCollide = false
				v.CanTouch = false
				v.CanQuery = false
				v.Anchored = true
			end
		end
		-- ▼ ReadonlyArray.forEach ▼
		for _k, _v in ipairs(_exp) do
			_arg0(_v, _k - 1, _exp)
		end
		-- ▲ ReadonlyArray.forEach ▲
		self.object.Parent = ctx.camera
	end
	function worldInteractor:placeInCameraWall()
		local ignore = RaycastParams.new()
		ignore.FilterDescendantsInstances = { self.ctx.character, self.ctx.camera, Workspace:FindFirstChild("ignore") }
		local cameracf = self.ctx.camera.CFrame
		local _fn = Workspace
		local _exp = cameracf.Position
		local _lookVector = cameracf.LookVector
		local _placementRange = self.placementRange
		local result = _fn:Raycast(_exp, _lookVector * _placementRange, ignore)
		if result then
			local normal = result.Normal
			local position = result.Position
			local hit = result.Instance
			local _cframe, size = self.object:GetBoundingBox()
			if not hit:IsA("Part") then
				return nil
			end
			if normal == earth.normals.up or normal == earth.normals.down then
				return nil
			end
			local clampX = math.clamp(position.X, (hit.Position.X - hit.Size.X / 2) + size.X / 2, (hit.Position.X + hit.Size.X / 2) - size.X / 2)
			local clampZ = math.clamp(position.Z, (hit.Position.Z - hit.Size.Z / 2) + size.X / 2, (hit.Position.Z + hit.Size.Z / 2) - size.X / 2)
			local _normal = normal
			local _arg0 = size / 2
			local wallOffset = _normal * _arg0
			local _fn_1 = self.object
			local _fn_2 = CFrame
			local _vector3 = Vector3.new(clampX, position.Y, clampZ)
			local _wallOffset = wallOffset
			_fn_1:SetPrimaryPartCFrame(_fn_2.lookAt(_vector3 + _wallOffset, Vector3.new(cameracf.LookVector.X, position.Y, cameracf.LookVector.Z)))
		end
	end
	function worldInteractor:getSurfaceCFrame()
		local ignore = RaycastParams.new()
		ignore.FilterDescendantsInstances = { self.ctx.character, self.ctx.camera, Workspace:FindFirstChild("ignore") }
		local cameracf = self.ctx.camera.CFrame
		local _fn = Workspace
		local _exp = cameracf.Position
		local _lookVector = cameracf.LookVector
		local _placementRange = self.placementRange
		local result = _fn:Raycast(_exp, _lookVector * _placementRange, ignore)
		if result then
			local normal = result.Normal
			local position = result.Position
			local hit = result.Instance
			local _result = self.object.PrimaryPart
			if _result ~= nil then
				_result = _result.Size
			end
			local size = _result
			if not hit:IsA("Part") then
				return false
			end
			if normal == earth.normals.up then
				-- something to make sure the position doesn't overflow off the edge.
				local clampX = math.clamp(position.X, (hit.Position.X - hit.Size.X / 2) + size.X / 2, (hit.Position.X + hit.Size.X / 2) - size.X / 2)
				local clampZ = math.clamp(position.Z, (hit.Position.Z - hit.Size.Z / 2) + size.X / 2, (hit.Position.Z + hit.Size.Z / 2) - size.X / 2)
				-- if you wanna prohibit, check if clampX is not position.X and same for y
				local _fn_1 = CFrame
				local _vector3 = Vector3.new(clampX, position.Y, clampZ)
				local _vector3_1 = Vector3.new(0, size.Y / 2, 0)
				return _fn_1.lookAt(_vector3 + _vector3_1, Vector3.new(cameracf.LookVector.X, position.Y, cameracf.LookVector.Z))
			else
				-- remember to clamp the following
				if hit.Position.Y < position.Y then
					local posRemY = Vector3.new(position.X, 0, position.Z)
					local topSurface = hit.Position.Y + (hit.Size.Y / 2)
					local _posRemY = posRemY
					local _vector3 = Vector3.new(0, topSurface, 0)
					local finalPositionSurface = _posRemY + _vector3
					local _fn_1 = CFrame
					local _finalPositionSurface = finalPositionSurface
					local _exp_1 = normal * (-1)
					local _arg0 = size / 2
					local _vector3_1 = Vector3.new(0, size.Y / 2, 0)
					return _fn_1.lookAt(_finalPositionSurface + (_exp_1 * _arg0 + _vector3_1), Vector3.new(cameracf.LookVector.X, position.Y, cameracf.LookVector.Z))
				else
					local camdownsub = self.ctx.camera.CFrame.Position.Y - self.placementRange
					local t = ignore.FilterDescendantsInstances
					local _t = t
					local _hit = hit
					-- ▼ Array.push ▼
					_t[#_t + 1] = _hit
					-- ▲ Array.push ▲
					ignore.FilterDescendantsInstances = t
					local result2 = Workspace:Raycast(position, Vector3.new(0, camdownsub, 0), ignore)
					if result2 then
						local refixedTargetPosition = result2.Position
						local _fn_1 = CFrame
						local _refixedTargetPosition = refixedTargetPosition
						local _normal = normal
						local _arg0 = size / 2
						local _vector3 = Vector3.new(0, size.Y / 2, 0)
						return _fn_1.lookAt(_refixedTargetPosition + ((_normal * _arg0)) + _vector3, Vector3.new(cameracf.LookVector.X, position.Y, cameracf.LookVector.Z))
					else
						return false
					end
				end
			end
		else
			return false
		end
	end
	function worldInteractor:getSurfaceRightInfront(pushForward, checkDown)
		local ignore = RaycastParams.new()
		ignore.FilterDescendantsInstances = { self.ctx.character, self.ctx.camera, Workspace:FindFirstChild("ignore") }
		local _fn = Workspace
		local _position = self.ctx.character:GetPrimaryPartCFrame().Position
		local _vector3 = Vector3.new(pushForward)
		local result = _fn:Raycast(_position + _vector3, Vector3.new(0, checkDown, 0), ignore)
		local size = (self.object:FindFirstChild("base")).Size
		if result then
			local _position_1 = result.Position
			local _vector3_1 = Vector3.new(0, size.Y / 2, 0)
			local uph = _position_1 + _vector3_1
			local cf = self.ctx.camera.CFrame
			local look = Vector3.new(cf.LookVector.X, uph.Y, cf.LookVector.Z)
			local cfx = CFrame.lookAt(uph, look)
			return cfx
		end
	end
	function worldInteractor:destroy()
		self.object:Destroy()
	end
end
return {
	default = worldInteractor,
}
