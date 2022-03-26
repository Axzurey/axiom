-- Compiled with roblox-ts v1.2.3
local TS = require(game:GetService("ReplicatedStorage"):WaitForChild("rbxts_include"):WaitForChild("RuntimeLib"))
local renderfunctions = TS.import(script, game:GetService("ReplicatedStorage"), "TS", "sohk", "functions", "render")
local replicateStateController
do
	replicateStateController = setmetatable({}, {
		__tostring = function()
			return "replicateStateController"
		end,
	})
	replicateStateController.__index = replicateStateController
	function replicateStateController.new(...)
		local self = setmetatable({}, replicateStateController)
		return self:constructor(...) or self
	end
	function replicateStateController:constructor(main)
		self.remotelisteners = {
			renderFunction = main.remotes.renderFunction,
		}
		self.remotelisteners.renderFunction.OnClientEvent:Connect(function(...)
			local args = { ... }
			local _functionname = args[1]
			table.remove(args, 1)
			renderfunctions[_functionname](renderfunctions, unpack(args))
		end)
	end
end
return {
	default = replicateStateController,
}
