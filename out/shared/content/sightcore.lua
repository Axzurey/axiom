-- Compiled with roblox-ts v1.2.3
local TS = require(game:GetService("ReplicatedStorage"):WaitForChild("rbxts_include"):WaitForChild("RuntimeLib"))
local _services = TS.import(script, TS.getModule(script, "@rbxts", "services"))
local ReplicatedStorage = _services.ReplicatedStorage
local RunService = _services.RunService
local sohk = TS.import(script, game:GetService("ReplicatedStorage"), "TS", "sohk").default
local sightcore
do
	local super = sohk.sohkComponent
	sightcore = setmetatable({}, {
		__tostring = function()
			return "sightcore"
		end,
		__index = super,
	})
	sightcore.__index = sightcore
	function sightcore:constructor(modelId)
		super.constructor(self)
		self.active = true
		self.orientationAddon = Vector3.new()
		self.zoom = 1.2
		local _binding = string.split(modelId, "::")
		local prefix = _binding[1]
		local skin = _binding[2]
		local _result = ReplicatedStorage:FindFirstChild("sights")
		if _result ~= nil then
			_result = _result:FindFirstChild(prefix)
			if _result ~= nil then
				_result = _result:FindFirstChild(prefix .. "_" .. skin)
				if _result ~= nil then
					_result = _result:Clone()
				end
			end
		end
		self.model = _result
		local conn
		conn = RunService.RenderStepped:Connect(function(dt)
			if not self.active then
				conn:Disconnect()
				return nil
			end
			self:preRender(dt)
		end)
	end
	function sightcore:preRender(dt)
	end
	function sightcore:mount(vm)
		self.model.Parent = vm
		self.model:SetPrimaryPartCFrame(vm.sightNode.CFrame)
		local md = Instance.new("Motor6D")
		md.Part0 = vm.sightNode
		md.Part1 = self.model.PrimaryPart
		md.Parent = self.model.PrimaryPart
		task.wait(1)
	end
	function sightcore:mountFinisher(vm)
		vm.aimpart.Position = self.model.focus.Position
	end
	function sightcore:destroy()
		self.active = false
	end
end
return {
	default = sightcore,
}
