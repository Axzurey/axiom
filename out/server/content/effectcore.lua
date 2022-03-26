-- Compiled with roblox-ts v1.2.3
local TS = require(game:GetService("ReplicatedStorage"):WaitForChild("rbxts_include"):WaitForChild("RuntimeLib"))
local RunService = TS.import(script, TS.getModule(script, "@rbxts", "services")).RunService
local effect
do
	effect = setmetatable({}, {
		__tostring = function()
			return "effect"
		end,
	})
	effect.__index = effect
	function effect.new(...)
		local self = setmetatable({}, effect)
		return self:constructor(...) or self
	end
	function effect:constructor(ctx)
		self.alive = false
		self.ctx = ctx
		self.alive = true
		local conn
		conn = RunService.Heartbeat:Connect(function(dt)
			if not self.alive then
				conn:Disconnect()
				return nil
			end
			self:everyFrame(dt)
		end)
	end
	function effect:everyFrame(dt)
	end
	function effect:destroy()
		self.alive = false
	end
end
return {
	default = effect,
}
