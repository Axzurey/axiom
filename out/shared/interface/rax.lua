-- Compiled with roblox-ts v1.2.3
local TS = require(game:GetService("ReplicatedStorage"):WaitForChild("rbxts_include"):WaitForChild("RuntimeLib"))
local _services = TS.import(script, TS.getModule(script, "@rbxts", "services"))
local RunService = _services.RunService
local Workspace = _services.Workspace
local udimType
do
	local _inverse = {}
	udimType = setmetatable({}, {
		__index = _inverse,
	})
	udimType.offset = 0
	_inverse[0] = "offset"
	udimType.scale = 1
	_inverse[1] = "scale"
end
--[[
	*
	* temporarily until i have access to my system.mathf lib
]]
local function interpolate(v0, v1, t)
	return (1 - t) * v0 + t * v1
end
--[[
	*
	* time will be constrained within 0 and 1
]]
local directions = {
	right = Vector2.new(1, 0),
	left = Vector2.new(-1, 0),
	up = Vector2.new(0, 1),
	down = Vector2.new(0, -1),
}
local pageTransitions = {
	slideIn = function(self, current, to)
		local transitionLength = 1
		local screenSize = (Workspace.CurrentCamera).ViewportSize
		local _absolutePosition = current.gui.AbsolutePosition
		local _left = directions.left
		local _x = screenSize.X
		local target = _absolutePosition + (_left * _x)
		local start = current.gui.AbsolutePosition
		local conn = RunService.RenderStepped:Connect(function(dt) end)
		task.wait(transitionLength)
	end,
}
local page
do
	page = {}
	function page:constructor(gui)
		self.transitionInLength = 1
		self.gui = gui
	end
	function page:transition(nextPage)
		pageTransitions:slideIn(self, nextPage)
	end
end
return {
	udimType = udimType,
	default = page,
}
