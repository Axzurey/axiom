-- Compiled with roblox-ts v1.2.3
local TS = require(game:GetService("ReplicatedStorage"):WaitForChild("rbxts_include"):WaitForChild("RuntimeLib"))
local _services = TS.import(script, TS.getModule(script, "@rbxts", "services"))
local ReplicatedStorage = _services.ReplicatedStorage
local RunService = _services.RunService
local UserInputService = _services.UserInputService
local Workspace = _services.Workspace
local ability_core = TS.import(script, game:GetService("ReplicatedStorage"), "TS", "content", "abilitycore").default
local worldInteractor = TS.import(script, game:GetService("ReplicatedStorage"), "TS", "content", "worldInteractor").default
local laser_turret
do
	local super = ability_core
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
	function laser_turret:constructor(ctx)
		super.constructor(self, ctx, "secondaryAbility")
		self.obscuresActions = true
		self.cancelOnGunChange = true
		self.ctx = ctx
		local _result = ReplicatedStorage:FindFirstChild("abilities")
		if _result ~= nil then
			_result = _result:FindFirstChild("transparent_versions")
			if _result ~= nil then
				_result = _result:FindFirstChild("laser_turret")
				if _result ~= nil then
					_result = _result:Clone()
				end
			end
		end
		local model = _result
		self.fp = worldInteractor.new(self.ctx, model)
		self.model = model
	end
	function laser_turret:place()
		local cf = self.fp:getSurfaceCFrame()
		if cf and self.active and self.amount > 0 then
			--[[
				let model = ReplicatedStorage.FindFirstChild('abilities')?.FindFirstChild('laser_turret')?.Clone() as Model;
				model.SetPrimaryPartCFrame(cf);
				model.Parent = Workspace.FindFirstChild("world");
			]]
			self.remotes.trigger:FireServer(cf)
			self.amount -= 1
		end
		if self.amount < 1 then
			self:cancel()
		end
	end
	function laser_turret:trigger()
		if self.amount < 1 then
			return nil
		end
		self.placeconn = RunService.RenderStepped:Connect(function()
			local cf = self.fp:getSurfaceCFrame()
			if cf then
				local _cf, size = self.model:GetBoundingBox()
				local reg = Workspace:GetPartBoundsInBox(cf, size)
				local touching = false
				local _reg = reg
				local _arg0 = function(v)
					if v.Parent == Workspace:FindFirstChild("ignore") or v.Parent == self.model then
						return nil
					end
					touching = true
				end
				-- ▼ ReadonlyArray.forEach ▼
				for _k, _v in ipairs(_reg) do
					_arg0(_v, _k - 1, _reg)
				end
				-- ▲ ReadonlyArray.forEach ▲
				if touching then
					local _exp = self.model:GetChildren()
					local _arg0_1 = function(v)
						if v:IsA("BasePart") then
							v.Color = Color3.fromRGB(255, 0, 0)
						end
					end
					-- ▼ ReadonlyArray.forEach ▼
					for _k, _v in ipairs(_exp) do
						_arg0_1(_v, _k - 1, _exp)
					end
					-- ▲ ReadonlyArray.forEach ▲
				else
					local _exp = self.model:GetChildren()
					local _arg0_1 = function(v)
						if v:IsA("BasePart") then
							v.Color = Color3.fromRGB(0, 255, 255)
						end
					end
					-- ▼ ReadonlyArray.forEach ▼
					for _k, _v in ipairs(_exp) do
						_arg0_1(_v, _k - 1, _exp)
					end
					-- ▲ ReadonlyArray.forEach ▲
				end
				self.model:SetPrimaryPartCFrame(cf)
			end
			self.model.Parent = self.ctx.camera
		end)
		self.useconn = UserInputService.InputBegan:Connect(function(input, gp)
			if gp then
				return nil
			end
			if self.ctx:keyIs(input, "fire") then
				self:place()
			end
		end)
		self.ctx:unequip(true)
		print("triggered")
		self.active = true
	end
	function laser_turret:cancel()
		if self.placeconn then
			self.placeconn:Disconnect()
			self.model.Parent = nil
		end
		if self.useconn then
			self.useconn:Disconnect()
		end
		self.active = false
	end
end
return {
	default = laser_turret,
}
