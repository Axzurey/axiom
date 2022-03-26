-- Compiled with roblox-ts v1.2.3
local TS = require(game:GetService("ReplicatedStorage"):WaitForChild("rbxts_include"):WaitForChild("RuntimeLib"))
local Workspace = TS.import(script, TS.getModule(script, "@rbxts", "services")).Workspace
local breach
do
	breach = setmetatable({}, {
		__tostring = function()
			return "breach"
		end,
	})
	breach.__index = breach
	function breach.new(...)
		local self = setmetatable({}, breach)
		return self:constructor(...) or self
	end
	function breach:constructor(config)
		local shape = config.breachShape
		local bType = config.breachType
		local position = config.position
		local range = config.breachRange
		local lookAt = config.lookAt
		local b = Instance.new("Part")
		b.Anchored = true
		b.CanCollide = false
		b.CanQuery = false
		b.CanTouch = false
		local _shape = shape
		local _range = range
		b.Size = _shape * _range
		b.Shape = bType
		b.Material = Enum.Material.Neon
		b.Color = Color3.new(1, 1, 1)
		b.CFrame = CFrame.lookAt(position, lookAt)
		b.Parent = Workspace:FindFirstChild("ignore")
		local op = OverlapParams.new()
		local results = Workspace:GetPartsInPart(b, op)
		local _results = results
		local _arg0 = function(v)
			local _allowedNames = config.allowedNames
			local _name = v.Name
			return (table.find(_allowedNames, _name) or 0) - 1 ~= -1
		end
		-- ▼ ReadonlyArray.filter ▼
		local _newValue = {}
		local _length = 0
		for _k, _v in ipairs(_results) do
			if _arg0(_v, _k - 1, _results) == true then
				_length += 1
				_newValue[_length] = _v
			end
		end
		-- ▲ ReadonlyArray.filter ▲
		local _results_1 = results
		local _arg0_1 = function(v)
			coroutine.wrap(function()
				local newPart = v:SubtractAsync({ b })
				local _exp = v:GetChildren()
				local _arg0_2 = function(n)
					n.Parent = newPart
				end
				-- ▼ ReadonlyArray.forEach ▼
				for _k, _v in ipairs(_exp) do
					_arg0_2(_v, _k - 1, _exp)
				end
				-- ▲ ReadonlyArray.forEach ▲
				newPart.Parent = v.Parent
				v:Destroy()
			end)()
		end
		-- ▼ ReadonlyArray.forEach ▼
		for _k, _v in ipairs(_results_1) do
			_arg0_1(_v, _k - 1, _results_1)
		end
		-- ▲ ReadonlyArray.forEach ▲
		b:Destroy()
	end
end
return {
	default = breach,
}
