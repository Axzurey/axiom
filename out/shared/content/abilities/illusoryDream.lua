-- Compiled with roblox-ts v1.2.3
local TS = require(game:GetService("ReplicatedStorage"):WaitForChild("rbxts_include"):WaitForChild("RuntimeLib"))
local RunService = TS.import(script, TS.getModule(script, "@rbxts", "services")).RunService
local ability_core = TS.import(script, game:GetService("ReplicatedStorage"), "TS", "content", "abilitycore").default
local illusoryDream
do
	local super = ability_core
	illusoryDream = setmetatable({}, {
		__tostring = function()
			return "illusoryDream"
		end,
		__index = super,
	})
	illusoryDream.__index = illusoryDream
	function illusoryDream.new(...)
		local self = setmetatable({}, illusoryDream)
		return self:constructor(...) or self
	end
	function illusoryDream:constructor(ctx)
		super.constructor(self, ctx, "primaryAbility")
		self.name = "Illusory Dream"
		self.details = "When a kill is gained, apply [regeneration] to self."
	end
	function illusoryDream:trigger()
		local conn
		conn = RunService.RenderStepped:Connect(function(dt)
			if not self.active then
				conn:Disconnect()
				return nil
			end
		end)
		self.remotes.trigger:FireServer()
	end
end
-- Kiriya Hakushaku Ke no Roku Shimai
return {
	illusoryDream = illusoryDream,
}
