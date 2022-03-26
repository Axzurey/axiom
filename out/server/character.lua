-- Compiled with roblox-ts v1.2.3
local TS = require(game:GetService("ReplicatedStorage"):WaitForChild("rbxts_include"):WaitForChild("RuntimeLib"))
local RunService = TS.import(script, TS.getModule(script, "@rbxts", "services")).RunService
local _matchservice = TS.import(script, game:GetService("ReplicatedStorage"), "TS", "services", "matchservice")
local teamRoles = _matchservice.teamRoles
local teams = _matchservice.teams
local sohk = TS.import(script, game:GetService("ReplicatedStorage"), "TS", "sohk").default
local regeneration = TS.import(script, game:GetService("ServerScriptService"), "TS", "content", "effects", "regeneration").default
local allEffects = {
	regeneration = regeneration,
}
local characterClass
do
	local super = sohk.sohkComponent
	characterClass = setmetatable({}, {
		__tostring = function()
			return "characterClass"
		end,
		__index = super,
	})
	characterClass.__index = characterClass
	function characterClass.new(...)
		local self = setmetatable({}, characterClass)
		return self:constructor(...) or self
	end
	function characterClass:constructor(client, hitbox, character)
		super.constructor(self)
		self.maxHealth = 100
		self.health = 75
		self.alive = false
		self.allowedOverheal = 75
		self.team = teams.alpha
		self.role = teamRoles.attack
		self.effects = {}
		self.lastOverheal = tick()
		self.overhealFloatTime = 5
		self.overhealDecrement = 5
		self.rappelling = false
		self.lastRappel = tick()
		self.RAPPEL_COOLDOWN = 1
		self.client = client
		local _result
		if client then
			_result = false
		else
			_result = true
		end
		self.isABot = _result
		self.alive = true
		self.character = character
		self.hitbox = hitbox
		local conn
		conn = RunService.Stepped:Connect(function(st, dt)
			if not self.client then
				conn:Disconnect()
				return nil
			end
			local _hum = self.client.Character
			if _hum ~= nil then
				_hum = _hum:FindFirstChildOfClass("Humanoid")
			end
			local hum = _hum
			if hum then
				hum.Health = self.health
				hum.MaxHealth = self.maxHealth
			end
			if tick() - self.lastOverheal > self.overhealFloatTime and self.health > self.maxHealth then
				self.health = math.clamp(math.floor(self.health - self.overhealDecrement * dt), self.maxHealth, self.maxHealth + self.allowedOverheal)
			end
		end)
	end
	function characterClass:hasEffect(effect)
		local pass = false
		local _effects = self.effects
		local _arg0 = function(v)
			if v.name == effect then
				pass = true
			end
		end
		-- ▼ ReadonlyArray.forEach ▼
		for _k, _v in ipairs(_effects) do
			_arg0(_v, _k - 1, _effects)
		end
		-- ▲ ReadonlyArray.forEach ▲
		return pass
	end
	function characterClass:revive(reviveHealth)
		self.health = reviveHealth
	end
	function characterClass:inflictEffect(effect, length)
		local eff = allEffects[effect].new(self)
		local c = {
			name = effect,
			effect = eff,
		}
		local _effects = self.effects
		local _c = c
		-- ▼ Array.push ▼
		_effects[#_effects + 1] = _c
		-- ▲ Array.push ▲
	end
	function characterClass:healDamage(health, ignoreDead)
		if ignoreDead == nil then
			ignoreDead = false
		end
		if not self.alive and not ignoreDead then
			return nil
		end
		health = math.ceil(health)
		self.health = math.clamp(self.health + health, 0, self.maxHealth + self.allowedOverheal)
		if self.health > self.maxHealth then
			self.lastOverheal = tick()
		end
		coroutine.wrap(function()
			if not self.client then
				return nil
			end
			self.replicationService.remotes.requestPlayerHealth:InvokeClient(self.client, self.health, self.maxHealth)
		end)()
	end
	function characterClass:inflictDamage(damage)
		self.health = math.clamp(self.health - damage, 0, self.maxHealth + self.allowedOverheal)
		if self.health <= 0 then
			self.alive = false
		else
			self.alive = true
		end
		coroutine.wrap(function()
			if not self.client then
				return nil
			end
			self.replicationService.remotes.requestPlayerHealth:InvokeClient(self.client, self.health, self.maxHealth)
		end)()
	end
end
return {
	default = characterClass,
}
