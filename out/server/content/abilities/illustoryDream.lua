-- Compiled with roblox-ts v1.2.3
local TS = require(game:GetService("ReplicatedStorage"):WaitForChild("rbxts_include"):WaitForChild("RuntimeLib"))
local RunService = TS.import(script, TS.getModule(script, "@rbxts", "services")).RunService
local when = TS.import(script, game:GetService("ServerScriptService"), "TS", "world")
local ability_Core = TS.import(script, game:GetService("ServerScriptService"), "TS", "content", "abilitycore").default
local illusoryDream
do
	local super = ability_Core
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
	function illusoryDream:constructor(client, charclass)
		super.constructor(self, client, charclass)
		self.amount = 2
		self.maxAmount = 2
		self:init()
		coroutine.wrap(function()
			self:superStartCooldown()
		end)()
	end
	function illusoryDream:activate()
		if self.active or self.amount <= 0 then
			return nil
		end
		if self.currentCooldown > 0 then
			return nil
		end
		print("activated i guess?")
		local char = self.client.Character
		if true then
			self:superToggleActive(true)
			self:superDeductAmount()
			local conn = when.entityKilled:connect(function(killer, killed, entityType)
				repeat
					if entityType == (when.entityType.Bot) then
						self.charclass:inflictEffect("regeneration", 10)
						print("bot killed by " .. killer.Name)
						break
					end
					print("nothing killed")
					break
				until true
			end)
			local c
			c = RunService.Heartbeat:Connect(function()
				if not self.alive then
					conn.disconnect()
					c:Disconnect()
				end
			end)
			self:superStartActivation()
			task.wait(self.activationLength)
			conn.disconnect()
			self:superToggleActive(false)
			self:superStartCooldown()
		end
	end
end
return {
	default = illusoryDream,
}
