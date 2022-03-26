-- Compiled with roblox-ts v1.2.3
local earth = {}
do
	local _container = earth
	local normals = {
		up = Vector3.new(0, 1, 0),
		down = Vector3.new(0, -1, 0),
		right = Vector3.new(1, 0, 0),
		left = Vector3.new(-1, 0, 0),
		front = Vector3.new(0, 0, 1),
		back = Vector3.new(0, 0, -1),
	}
	_container.normals = normals
	local function getHighestNormal(part)
		local worldup = Vector3.new(0, 1, 0)
		local nrmls = { part.CFrame.LookVector, part.CFrame.UpVector, part.CFrame.RightVector, part.CFrame.LookVector * (-1), part.CFrame.UpVector * (-1), part.CFrame.RightVector * (-1) }
		local lowestnormal = Vector3.new()
		local lowestdot = math.huge
		local _nrmls = nrmls
		local _arg0 = function(n)
			local dot = n:Dot(worldup)
			if dot < lowestdot then
				lowestdot = dot
				lowestnormal = n
			end
		end
		-- ▼ ReadonlyArray.forEach ▼
		for _k, _v in ipairs(_nrmls) do
			_arg0(_v, _k - 1, _nrmls)
		end
		-- ▲ ReadonlyArray.forEach ▲
		return lowestnormal
	end
	_container.getHighestNormal = getHighestNormal
end
return earth
