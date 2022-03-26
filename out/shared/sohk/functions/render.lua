-- Compiled with roblox-ts v1.2.3
local TS = require(game:GetService("ReplicatedStorage"):WaitForChild("rbxts_include"):WaitForChild("RuntimeLib"))
local Workspace = TS.import(script, TS.getModule(script, "@rbxts", "services")).Workspace
local renderfunctions = {
	drawPart = function(self, position, size)
		local p = Instance.new("Part")
		p.Size = size
		p.Position = position
		p.Parent = Workspace
	end,
}
return renderfunctions
