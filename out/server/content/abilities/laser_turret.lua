-- Compiled with roblox-ts v1.2.3
local TS = require(game:GetService("ReplicatedStorage"):WaitForChild("rbxts_include"):WaitForChild("RuntimeLib"))
local _services = TS.import(script, TS.getModule(script, "@rbxts", "services"))
local Players = _services.Players
local ReplicatedStorage = _services.ReplicatedStorage
local RunService = _services.RunService
local Workspace = _services.Workspace
local ability_Core = TS.import(script, game:GetService("ServerScriptService"), "TS", "content", "abilitycore").default
local laser_turret
do
	local super = ability_Core
	laser_turret = setmetatable({}, {
		__tostring = function()
			return "laser_turret"
		end,
		__index = super,
	})
	laser_turret.__index = laser_turret
	function laser_turret.new(...)
		local self = setmetatable({}, laser_turret)
		return self:constructor(...) or self
	end
	function laser_turret:constructor(client, charclass)
		super.constructor(self, client, charclass)
		self.amount = 2
		self.slot = "secondary"
		self.targetPosition = Vector3.new()
		self.target = false
		self.lookVector = Vector3.new()
		self.fov = 75
		self.range = 50
		self.activationSequence = false
		self:init()
	end
	function laser_turret:searchForTarget(pos)
		self.target = false
		local _exp = Players:GetPlayers()
		local _arg0 = function(v)
			if v.Character then
				local char = v.Character
				local _exp_1 = v.Character:GetChildren()
				local _arg0_1 = function(v)
					if v:IsA("BasePart") then
						local unit = (v.Position - pos).Unit
						local dot = self.lookVector:Dot(unit)
						local deg = math.acos(math.clamp(dot, -1, 1))
						if math.abs(deg) <= math.rad(self.fov) / 2 then
							local distance = (v.Position - pos).Magnitude
							if distance > self.range then
								return nil
							end
							local ignore = RaycastParams.new()
							ignore.FilterDescendantsInstances = { Workspace:FindFirstChild("ignore") }
							local _fn = Workspace
							local _unit = unit
							local _range = self.range
							local result = _fn:Raycast(pos, _unit * _range, ignore)
							if result and result.Instance.Parent ~= char then
								return nil
							end
							self.target = true
							self.targetPosition = v.Position
						end
					end
				end
				-- ▼ ReadonlyArray.forEach ▼
				for _k, _v in ipairs(_exp_1) do
					_arg0_1(_v, _k - 1, _exp_1)
				end
				-- ▲ ReadonlyArray.forEach ▲
			end
		end
		-- ▼ ReadonlyArray.forEach ▼
		for _k, _v in ipairs(_exp) do
			_arg0(_v, _k - 1, _exp)
		end
		-- ▲ ReadonlyArray.forEach ▲
	end
	function laser_turret:activate(args)
		if self.amount < 1 then
			return nil
		end
		local cf = args[1]
		if not cf then
			return nil
		end
		self.lookVector = cf.LookVector
		local _result = ReplicatedStorage:FindFirstChild("abilities")
		if _result ~= nil then
			_result = _result:FindFirstChild("laser_turret")
			if _result ~= nil then
				_result = _result:Clone()
			end
		end
		local model = _result
		model:SetPrimaryPartCFrame(cf)
		model.Parent = Workspace:FindFirstChild("world")
		self:superStartActivation()
		self:superToggleActive(true)
		self:superDeductAmount()
		local _cf, size = model:GetBoundingBox()
		local reg = Workspace:GetPartBoundsInBox(cf, size)
		local touching = false
		local _reg = reg
		local _arg0 = function(v)
			if v.Parent == Workspace:FindFirstChild("ignore") or v.Parent == model then
				return nil
			end
			touching = true
		end
		-- ▼ ReadonlyArray.forEach ▼
		for _k, _v in ipairs(_reg) do
			_arg0(_v, _k - 1, _reg)
		end
		-- ▲ ReadonlyArray.forEach ▲
		-- if (touching) return;
		local conn
		conn = RunService.Heartbeat:Connect(function(dt)
			if not self.alive then
				conn:Disconnect()
				return nil
			end
			if self.target then
			else
				self:searchForTarget(model:GetPrimaryPartCFrame().Position)
			end
		end)
		-- when destroyed, super start cooldown, super toggle active false;
	end
end
return {
	default = laser_turret,
}
