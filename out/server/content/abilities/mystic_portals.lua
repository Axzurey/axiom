-- Compiled with roblox-ts v1.2.3
local TS = require(game:GetService("ReplicatedStorage"):WaitForChild("rbxts_include"):WaitForChild("RuntimeLib"))
local RunService = TS.import(script, TS.getModule(script, "@rbxts", "services")).RunService
local when = TS.import(script, game:GetService("ServerScriptService"), "TS", "world")
local ability_Core = TS.import(script, game:GetService("ServerScriptService"), "TS", "content", "abilitycore").default
local mysticPortals
do
	local super = ability_Core
	mysticPortals = setmetatable({}, {
		__tostring = function()
			return "mysticPortals"
		end,
		__index = super,
	})
	mysticPortals.__index = mysticPortals
	function mysticPortals.new(...)
		local self = setmetatable({}, mysticPortals)
		return self:constructor(...) or self
	end
	function mysticPortals:constructor(client, charclass)
		super.constructor(self, client, charclass)
		self.amount = 2
		self.maxAmount = 2
		self:init()
		coroutine.wrap(function()
			self:superStartCooldown()
		end)()
	end
	function mysticPortals:activate()
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
	default = mysticPortals,
}
