-- Compiled with roblox-ts v1.2.3
local TS = require(game:GetService("ReplicatedStorage"):WaitForChild("rbxts_include"):WaitForChild("RuntimeLib"))
local RunService = TS.import(script, TS.getModule(script, "@rbxts", "services")).RunService
local sohk = TS.import(script, game:GetService("ReplicatedStorage"), "TS", "sohk").default
local ability_Core
do
	local super = sohk.sohkComponent
	ability_Core = setmetatable({}, {
		__tostring = function()
			return "ability_Core"
		end,
		__index = super,
	})
	ability_Core.__index = ability_Core
	function ability_Core:constructor(client, charclass)
		super.constructor(self)
		self.alive = true
		self.amount = 0
		self.maxAmount = 1
		self.active = false
		self.timeTillNextIncrease = false
		self.amountPerIncrease = 1
		self.increasesWithKills = false
		self.chachedKillCount = 0
		self.charge = 0
		self.cooldown = 30
		self.currentCooldown = 0
		self.timeLeft = 10
		self.activationLength = 10
		self.activationSequence = true
		self.remotesRequested = false
		self.slot = "primary"
		self.client = client
		self.charclass = charclass
	end
	function ability_Core:superDeductAmount(x)
		if x == nil then
			x = 1
		end
		self.amount = math.clamp(self.amount - x, 0, self.maxAmount)
		self.replicationService.remotes.requestPlayerAbilityAmount:InvokeClient(self.client, self.slot, self.amount)
	end
	function ability_Core:superToggleActive(a)
		self.active = a
		self.replicationService.remotes.requestPlayerAbilityActive:InvokeClient(self.client, self.slot, self.active)
	end
	function ability_Core:superStartCooldown()
		self.currentCooldown = self.cooldown
		local pass = false
		local conn
		conn = RunService.Heartbeat:Connect(function(dt)
			self.currentCooldown = math.clamp(self.currentCooldown - 1 * dt, 0, self.currentCooldown)
			if self.currentCooldown <= 0 or not self.alive then
				conn:Disconnect()
				pass = true
			end
			self.replicationService.remotes.requestPlayerAbilityCooldown:InvokeClient(self.client, self.slot, self.currentCooldown, self.cooldown)
		end)
		while not pass do
			task.wait()
		end
	end
	function ability_Core:superStartActivation()
		if not self.activationSequence then
			self.replicationService.remotes.requestPlayerAbilityTimeLeft:InvokeClient(self.client, self.slot, 1, 1, false)
			return nil
		end
		self.timeLeft = self.activationLength
		local conn
		conn = RunService.Heartbeat:Connect(function(dt)
			self.timeLeft = math.clamp(self.timeLeft - 1 * dt, 0, self.timeLeft)
			if self.timeLeft <= 0 or not self.alive then
				conn:Disconnect()
			end
			self.replicationService.remotes.requestPlayerAbilityTimeLeft:InvokeClient(self.client, self.slot, self.timeLeft, self.activationLength, self.activationSequence)
		end)
	end
	function ability_Core:init()
		coroutine.wrap(function()
			self.replicationService.remotes.requestPlayerAbilityAmount:InvokeClient(self.client, self.slot, self.amount)
		end)()
	end
	function ability_Core:activate(args)
	end
	function ability_Core:destroy()
		self.alive = false
	end
	function ability_Core:loadRemotes()
		if self.remotesRequested then
			return nil
		end
		self.remotesRequested = true
		local use = Instance.new("RemoteEvent")
		use.OnServerEvent:Connect(function(player, ...)
			local args = { ... }
			if player ~= self.client then
				return nil
			end
			self:activate(args)
		end)
		use.Parent = self.dump
		return {
			trigger = use,
		}
	end
end
return {
	default = ability_Core,
}
