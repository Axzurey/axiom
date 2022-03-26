-- Compiled with roblox-ts v1.2.3
local TS = require(game:GetService("ReplicatedStorage"):WaitForChild("rbxts_include"):WaitForChild("RuntimeLib"))
local _services = TS.import(script, TS.getModule(script, "@rbxts", "services"))
local ReplicatedStorage = _services.ReplicatedStorage
local Workspace = _services.Workspace
local sohk = TS.import(script, game:GetService("ReplicatedStorage"), "TS", "sohk").default
local worldInteractor = TS.import(script, game:GetService("ReplicatedStorage"), "TS", "content", "worldInteractor").default
local bombClass
do
	local super = sohk.sohkComponent
	bombClass = setmetatable({}, {
		__tostring = function()
			return "bombClass"
		end,
		__index = super,
	})
	bombClass.__index = bombClass
	function bombClass.new(...)
		local self = setmetatable({}, bombClass)
		return self:constructor(...) or self
	end
	function bombClass:constructor(ctx)
		super.constructor(self)
		self.ctx = ctx
		local _result = ReplicatedStorage:FindFirstChild("gameModels")
		if _result ~= nil then
			_result = _result:FindFirstChild("bomb")
			if _result ~= nil then
				_result = _result:Clone()
			end
		end
		local model = _result
		local _result_1 = ReplicatedStorage:FindFirstChild("viewmodel")
		if _result_1 ~= nil then
			_result_1 = _result_1:Clone()
		end
		local vm = _result_1
		self.viewmodel = vm
		self.interactor = worldInteractor.new(ctx, model)
		local _exp = model:GetChildren()
		local _arg0 = function(v)
			v.Parent = self.viewmodel
		end
		-- ▼ ReadonlyArray.forEach ▼
		for _k, _v in ipairs(_exp) do
			_arg0(_v, _k - 1, _exp)
		end
		-- ▲ ReadonlyArray.forEach ▲
		self.viewmodel.PrimaryPart = self.viewmodel.main
		self.viewmodel.Name = "_VOID"
		self.viewmodel:SetPrimaryPartCFrame(CFrame.new(0, -10000, 0))
		self.viewmodel.Parent = Workspace.CurrentCamera
	end
	function bombClass:originPlantPosition()
		local cf = self.interactor:getSurfaceRightInfront(4, 10)
		return cf
	end
end
return {
	default = bombClass,
}
