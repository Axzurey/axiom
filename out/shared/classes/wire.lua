-- Compiled with roblox-ts v1.2.3
local TS = require(game:GetService("ReplicatedStorage"):WaitForChild("rbxts_include"):WaitForChild("RuntimeLib"))
local _services = TS.import(script, TS.getModule(script, "@rbxts", "services"))
local RunService = _services.RunService
local Workspace = _services.Workspace
local wire
do
	wire = setmetatable({}, {
		__tostring = function()
			return "wire"
		end,
	})
	wire.__index = wire
	function wire.new(...)
		local self = setmetatable({}, wire)
		return self:constructor(...) or self
	end
	function wire:constructor(config)
		self.enabled = true
		self.disconnected = false
		local check
		check = RunService.Stepped:Connect(function()
			if not self.enabled then
				return nil
			end
			if self.disconnected then
				check:Disconnect()
				return nil
			end
			local p1 = config.point1()
			local p2 = config.point2()
			local _p1 = p1
			local _p2 = p2
			local mag = (_p1 - _p2).Magnitude
			local _p2_1 = p2
			local _p1_1 = p1
			local direction = (_p2_1 - _p1_1).Unit
			local ignore = RaycastParams.new()
			ignore.FilterDescendantsInstances = config.whitelist
			ignore.FilterType = Enum.RaycastFilterType.Whitelist
			local _fn = Workspace
			local _exp = p1
			local _direction = direction
			local _mag = mag
			local result = _fn:Raycast(_exp, _direction * _mag, ignore)
			if result then
				config.onHit({
					hit = result.Instance,
					position = result.Position,
					normal = result.Normal,
				})
			end
		end)
	end
	function wire:enable()
		self.enabled = true
	end
	function wire:disable()
		self.enabled = false
	end
	function wire:disconnect()
		self.disconnected = true
	end
end
return {
	default = wire,
}
