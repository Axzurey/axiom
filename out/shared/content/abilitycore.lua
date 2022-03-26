-- Compiled with roblox-ts v1.2.3
local TS = require(game:GetService("ReplicatedStorage"):WaitForChild("rbxts_include"):WaitForChild("RuntimeLib"))
local sohk = TS.import(script, game:GetService("ReplicatedStorage"), "TS", "sohk").default
local ability_core
do
	local super = sohk.sohkComponent
	ability_core = setmetatable({}, {
		__tostring = function()
			return "ability_core"
		end,
		__index = super,
	})
	ability_core.__index = ability_core
	function ability_core:constructor(ctx, slot)
		super.constructor(self)
		self.active = false
		self.amount = 1
		self.useDelay = 1
		self.cancelOnGunChange = false
		self.equipped = false
		self.forcesUnequip = false
		self.name = "unknown ability"
		self.viewmodel = nil
		self.canLeanWhileActive = true
		self.canSprintWhileActive = true
		self.canReloadWhileActive = true
		self.canAimWhileActive = true
		self.canRappelWhileActive = true
		self.canVaultWhileActive = true
		self.canInspectWhileActive = true
		self.obscuresActions = false
		self.ctx = ctx
		self.remotes = self.replicationService.remotes.requestRemote:InvokeServer(slot)
	end
	function ability_core:update()
	end
	function ability_core:trigger()
		self.remotes.trigger:FireServer()
	end
	function ability_core:cancel()
	end
end
return {
	default = ability_core,
}
