-- Compiled with roblox-ts v1.2.3
local TS = require(game:GetService("ReplicatedStorage"):WaitForChild("rbxts_include"):WaitForChild("RuntimeLib"))
local Players = TS.import(script, TS.getModule(script, "@rbxts", "services")).Players
local paths = TS.import(script, game:GetService("ReplicatedStorage"), "TS", "config", "paths").paths
local mathf = TS.import(script, game:GetService("ReplicatedStorage"), "TS", "modules", "System").mathf
local path = TS.import(script, game:GetService("ReplicatedStorage"), "TS", "phyx", "path").default
local client = Players.LocalPlayer
local playergui = client:WaitForChild("PlayerGui")
local actionPrompt
do
	actionPrompt = setmetatable({}, {
		__tostring = function()
			return "actionPrompt"
		end,
	})
	actionPrompt.__index = actionPrompt
	function actionPrompt.new(...)
		local self = setmetatable({}, actionPrompt)
		return self:constructor(...) or self
	end
	function actionPrompt:constructor(prefix, suffix, key)
		self.active = true
		local instancePath = paths.actionPrompt
		local instance = path:pathToInstance(instancePath):Clone()
		self.instance = instance
		local pr = playergui:WaitForChild("prompts")
		local holder = pr:WaitForChild("holder")
		self.holder = holder
		self.instance.prefix.Text = prefix
		self.instance.suffix.Text = suffix
		self.instance.progress.centerText.Text = string.upper(key.Name)
		self:updatePercentageDelta(0)
	end
	function actionPrompt:updatePercentageDelta(normalizedPercentage)
		local denormal = mathf.denormalize(0, 360, normalizedPercentage)
		print(denormal)
		self.instance.progress.right.cycle.UIStroke.UIGradient.Rotation = math.clamp(denormal, 0, 180)
		if denormal > 180 then
			denormal = denormal - 180
		end
		self.instance.progress.left.cycle.UIStroke.UIGradient.Rotation = -180 - math.clamp(denormal, -180, 0)
	end
	function actionPrompt:changeKey(key)
		if not self.active then
			error("this instance has already been destroyed")
		end
		self.instance.progress.centerText.Text = string.upper(key.Name)
	end
	function actionPrompt:show()
		if not self.active then
			error("this instance has already been destroyed")
		end
		self.instance.Parent = self.holder
	end
	function actionPrompt:hide()
		if not self.active then
			error("this instance has already been destroyed")
		end
		self.instance.Parent = nil
	end
	function actionPrompt:destroy()
		if not self.active then
			error("this instance has already been destroyed")
		end
		self.instance:Destroy()
		self.active = false
	end
end
return {
	default = actionPrompt,
}
