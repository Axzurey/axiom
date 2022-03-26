-- Compiled with roblox-ts v1.2.3
local TS = require(game:GetService("ReplicatedStorage"):WaitForChild("rbxts_include"):WaitForChild("RuntimeLib"))
local _services = TS.import(script, TS.getModule(script, "@rbxts", "services"))
local RunService = _services.RunService
local UserInputService = _services.UserInputService
local phyxConnection = TS.import(script, game:GetService("ReplicatedStorage"), "TS", "phyx", "phyxConnection").default
local keys = 0
local keyHold
do
	keyHold = setmetatable({}, {
		__tostring = function()
			return "keyHold"
		end,
	})
	keyHold.__index = keyHold
	function keyHold.new(...)
		local self = setmetatable({}, keyHold)
		return self:constructor(...) or self
	end
	function keyHold:constructor(key, terminationTime)
		self.call = {}
		self.keyRaised = phyxConnection.new(self.call)
		keys += 1
		self.key = key
		local start = tick()
		local s, conn
		s = RunService.RenderStepped:Connect(function()
			if tick() - start >= terminationTime then
				s:Disconnect()
				conn:Disconnect()
				self.call[1](terminationTime)
			end
		end)
		conn = UserInputService.InputEnded:Connect(function(input, gp)
			if gp then
				return nil
			end
			if input.KeyCode == key or input.UserInputType == key then
				print("stopped holding")
				conn:Disconnect()
				s:Disconnect()
				self.call[1](tick() - start)
			end
		end)
	end
end
return {
	default = keyHold,
}
