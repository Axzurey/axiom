-- Compiled with roblox-ts v1.2.3
local TS = require(game:GetService("ReplicatedStorage"):WaitForChild("rbxts_include"):WaitForChild("RuntimeLib"))
local _services = TS.import(script, TS.getModule(script, "@rbxts", "services"))
local RunService = _services.RunService
local TweenService = _services.TweenService
local spring = TS.import(script, game:GetService("ReplicatedStorage"), "TS", "modules", "spring")
local crosshair
do
	crosshair = setmetatable({}, {
		__tostring = function()
			return "crosshair"
		end,
	})
	crosshair.__index = crosshair
	function crosshair.new(...)
		local self = setmetatable({}, crosshair)
		return self:constructor(...) or self
	end
	function crosshair:constructor(direction, originOffset, size, parent)
		self.spring = spring:create(15, 30, 10, 15)
		self.anchor = Instance.new("NumberValue")
		self.alive = true
		local frame = Instance.new("Frame")
		frame.Size = UDim2.fromOffset(size.X, size.Y)
		frame.Position = UDim2.fromOffset(direction.X * originOffset, direction.Y * originOffset)
		frame.BackgroundColor3 = Color3.fromRGB(140, 251, 143)
		frame.Parent = parent
		self.instance = frame
		self.direction = direction
		self.originOffset = originOffset
		local connection
		connection = RunService.RenderStepped:Connect(function(dt)
			if not self.alive then
				connection:Disconnect()
				return nil
			end
			local update = self.spring:update(dt)
			local _direction = self.direction
			local _arg0 = update.X + self.originOffset
			local newvector = _direction * _arg0
			self.instance.Position = UDim2.fromOffset(newvector.X, newvector.Y)
		end)
	end
	function crosshair:set(offset, time)
		TweenService:Create(self.anchor, TweenInfo.new(time), {
			Value = offset,
		})
	end
	function crosshair:shove(offset)
		self.spring:shove(Vector3.new(offset))
	end
	function crosshair:destroy()
		self.alive = false
	end
end
return {
	default = crosshair,
}
