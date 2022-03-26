-- Compiled with roblox-ts v1.2.3
local TS = require(game:GetService("ReplicatedStorage"):WaitForChild("rbxts_include"):WaitForChild("RuntimeLib"))
local _services = TS.import(script, TS.getModule(script, "@rbxts", "services"))
local Players = _services.Players
local Workspace = _services.Workspace
local bullet
do
	bullet = setmetatable({}, {
		__tostring = function()
			return "bullet"
		end,
	})
	bullet.__index = bullet
	function bullet.new(...)
		local self = setmetatable({}, bullet)
		return self:constructor(...) or self
	end
	function bullet:constructor(params)
		local pens = 0
		local lastImpact = nil
		local lastIM = nil
		local terminated = false
		local ignorePlayers = params.ignorePlayers or {}
		local ignoreCharacters = {}
		local _ignorePlayers = ignorePlayers
		local _arg0 = function(v)
			if v.Character then
				local _ignoreCharacters = ignoreCharacters
				local _character = v.Character
				-- ▼ Array.push ▼
				_ignoreCharacters[#_ignoreCharacters + 1] = _character
				-- ▲ Array.push ▲
			end
		end
		-- ▼ ReadonlyArray.forEach ▼
		for _k, _v in ipairs(_ignorePlayers) do
			_arg0(_v, _k - 1, _ignorePlayers)
		end
		-- ▲ ReadonlyArray.forEach ▲
		local ignoreInstances = params.ignoreInstances or {}
		local impacted = {}
		while not terminated do
			local ignoreParams = RaycastParams.new()
			local _ptr = {}
			local _length = #_ptr
			local _ignoreInstancesLength = #ignoreInstances
			table.move(ignoreInstances, 1, _ignoreInstancesLength, _length + 1, _ptr)
			_length += _ignoreInstancesLength
			local _ignoreCharactersLength = #ignoreCharacters
			table.move(ignoreCharacters, 1, _ignoreCharactersLength, _length + 1, _ptr)
			_length += _ignoreCharactersLength
			table.move(impacted, 1, #impacted, _length + 1, _ptr)
			ignoreParams.FilterDescendantsInstances = _ptr
			local _fn = Workspace
			local _exp = params.origin
			local _direction = params.direction
			local _range = params.range
			local result = _fn:Raycast(_exp, _direction * _range, ignoreParams)
			if result then
				lastImpact = result
				local hit = result.Instance
				local _impacted = impacted
				local _instance = result.Instance
				-- ▼ Array.push ▼
				_impacted[#_impacted + 1] = _instance
				-- ▲ Array.push ▲
				local _condition = (hit.Name == "HumanoidRootPart" and params.ignoreHumanoidRootPart)
				if not _condition then
					local _condition_1 = params.ignoreNames
					if _condition_1 then
						local _ignoreNames = params.ignoreNames
						local _name = hit.Name
						_condition_1 = (table.find(_ignoreNames, _name) or 0) - 1 ~= -1
					end
					_condition = _condition_1
				end
				if _condition then
					continue
				end
				local parent = hit.Parent
				local humanoid = hit:FindFirstChild("Humanoid")
				local rootPart = hit:FindFirstChild("HumanoidRootPart")
				local player = Players:GetPlayerFromCharacter(parent)
				if params.onHit then
					lastIM = {
						hit = hit,
						position = result.Position,
						normal = result.Normal,
						material = result.Material,
						player = player,
						character = (humanoid and rootPart) and parent or nil,
						lastImpact = lastIM,
					}
					local increment = params.onHit(lastIM)
					pens += increment
					if pens >= params.maxPenetration then
						terminated = true
						break
					end
				else
					error("params.onhit not implemented!")
				end
			else
				terminated = true
				break
			end
		end
		if params.onTerminated then
			params.onTerminated()
		end
	end
end
return {
	default = bullet,
}
