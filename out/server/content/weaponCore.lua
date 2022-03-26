-- Compiled with roblox-ts v1.2.3
local TS = require(game:GetService("ReplicatedStorage"):WaitForChild("rbxts_include"):WaitForChild("RuntimeLib"))
local _services = TS.import(script, TS.getModule(script, "@rbxts", "services"))
local Players = _services.Players
local ReplicatedStorage = _services.ReplicatedStorage
local Workspace = _services.Workspace
local when = TS.import(script, game:GetService("ServerScriptService"), "TS", "world")
local worldData = TS.import(script, game:GetService("ReplicatedStorage"), "TS", "worlddata")
local sohk = TS.import(script, game:GetService("ReplicatedStorage"), "TS", "sohk").default
local float = TS.import(script, game:GetService("ServerScriptService"), "TS", "float")
local minerva = TS.import(script, game:GetService("ReplicatedStorage"), "TS", "minerva")
local impactSoundMap = TS.import(script, game:GetService("ReplicatedStorage"), "TS", "content", "mapping", "impactSoundMap")
local env = TS.import(script, game:GetService("ServerScriptService"), "TS", "dumps", "env")
local verifyParam = TS.import(script, game:GetService("ReplicatedStorage"), "TS", "functions", "verifyParam").default
local bullet = TS.import(script, game:GetService("ReplicatedStorage"), "TS", "classes", "bullet").default
local t = TS.import(script, TS.getModule(script, "@rbxts", "t").lib.ts).t
local confirmation = TS.import(script, game:GetService("ServerScriptService"), "TS", "helpers", "confirmation")
local finisher_receive_protocol = TS.import(script, game:GetService("ReplicatedStorage"), "TS", "protocols", "finisher_receive_protocol")
local weaponCore
do
	local super = sohk.sohkComponent
	weaponCore = setmetatable({}, {
		__tostring = function()
			return "weaponCore"
		end,
		__index = super,
	})
	weaponCore.__index = weaponCore
	function weaponCore.new(...)
		local self = setmetatable({}, weaponCore)
		return self:constructor(...) or self
	end
	function weaponCore:constructor(client, charclass)
		super.constructor(self)
		self.equipped = false
		self.lastEquip = tick()
		self.ammo = 30
		self.maxAmmo = 30
		self.ammoOverload = 1
		self.reserve = 210
		self.boltsOnEmpty = true
		self.knifeDelay = .75
		self.stabDamage = 75
		self.backStabDamage = 200
		self.meleeRange = 7
		self.lastStab = tick()
		self.isAMelee = false
		self.isAGun = true
		self.weightMultiplier = 1.2
		self.penetration = 2
		self.lastfired = tick()
		self.firerate = 700
		self.lastReload = tick()
		self.reloadCooldown = .25
		self.fireModes = { "auto", "semi" }
		self.fireMode = 0
		self.reloading = false
		self.baseDamage = 30
		self.headDamage = 300
		self.limbDamage = 15
		self.remotesLoaded = false
		self.type = "primary"
		self.reloadLength = 1.5
		self.fullReloadLength = 2
		self.reloadCancelled = false
		self.client = client
		self.charclass = charclass
	end
	function weaponCore:equip()
		if self.equipped then
			return nil
		end
		if tick() - self.lastEquip < .25 then
			return nil
		end
		self.equipped = true
		self.lastEquip = tick()
		self.replicationService.remotes.toggleData:Fire("equip", self.client, self.type)
		coroutine.wrap(function()
			self.replicationService.remotes.requestPlayerAmmo:InvokeClient(self.client, self.ammo, self.maxAmmo + self.ammoOverload, self.reserve)
		end)()
	end
	function weaponCore:unequip()
		self.equipped = false
	end
	function weaponCore:fire(origin, look)
		if not self.equipped then
			return nil
		end
		if self.isAGun then
			if self.ammo <= 0 then
				return nil
			end
			if tick() - self.lastfired < 60 / self.firerate then
				return nil
			end
			self.lastfired = tick()
			self.ammo -= 1
			local canScan = true
			local last = origin
			local pens = 0
			local ignore = { self.client.Character }
			local ignore2 = { self.client.Character }
			coroutine.wrap(function()
				self.replicationService.remotes.requestPlayerAmmo:InvokeClient(self.client, self.ammo, self.maxAmmo + self.ammoOverload, self.reserve)
			end)()
			while canScan do
				local result = self.hitscanService:scanForHitAsync({
					position = last,
					direction = look,
					distance = 999,
					ignore = ignore,
				})
				if result then
					local canpen = 0
					for i, v in pairs(worldData.penetratableObjects) do
						local _value = (string.find(result.Instance.Name, i))
						if _value ~= 0 and _value == _value and _value then
							canpen = v
						end
					end
					local backr = self.hitscanService:scanForHitAsync({
						position = result.Position,
						direction = CFrame.lookAt(result.Position, origin).LookVector,
						distance = 999,
						ignore = ignore2,
					})
					if backr and pens > 0 and pens < self.penetration then
						local position = backr.Position
						local normal = backr.Normal
						minerva.createBulletHole(position, normal, backr.Material, 12, backr.Instance.Color)
					end
					if result.Instance.Name == "HumanoidRootPart" then
						local _ignore = ignore
						local _instance = result.Instance
						-- ▼ Array.push ▼
						_ignore[#_ignore + 1] = _instance
						-- ▲ Array.push ▲
						continue
					elseif canpen ~= 0 and canpen == canpen and canpen then
						pens += canpen
						if pens > self.penetration then
							canScan = false
							break
						end
					end
					local position = result.Position
					local normal = result.Normal
					local hit = result.Instance
					local char = hit.Parent
					local _result = char
					if _result ~= nil then
						_result = _result:FindFirstChildOfClass("Humanoid")
					end
					local hum = _result
					local player = Players:GetPlayerFromCharacter(char)
					if not hum then
						minerva.createBulletHole(position, normal, result.Material, 12, result.Instance.Color)
						local _condition = impactSoundMap[result.Material.Name]
						if not (_condition ~= "" and _condition) then
							_condition = impactSoundMap.Other
						end
						local t = _condition
						minerva.createSoundAt(position, hit, 4, t)
					end
					if not hum and not (canpen ~= 0 and canpen == canpen and canpen) then
						canScan = false
						break
					end
					if hum then
						if player then
							local charclass = env.characterClasses[player.UserId]
							if charclass then
								local info = float.processImpact(self.client, hit, player or {})
								local damage = info.impactLocation == float.playerContacts.body and self.baseDamage or (info.impactLocation == float.playerContacts.head and self.headDamage or self.limbDamage)
								charclass:inflictDamage(damage)
							end
						else
							print("hum")
							local _ignore = ignore
							local _parent = hit.Parent
							-- ▼ Array.push ▼
							_ignore[#_ignore + 1] = _parent
							-- ▲ Array.push ▲
							if hum.Health > 0 then
								local info = float.processImpact(self.client, hit, player or {})
								local damage = info.impactLocation == float.playerContacts.body and self.baseDamage or (info.impactLocation == float.playerContacts.head and self.headDamage or self.limbDamage)
								hum:TakeDamage(damage)
								if hum.Health <= 0 then
									print("bot killed")
								end
							end
						end
					else
						local _ignore = ignore
						local _hit = hit
						-- ▼ Array.push ▼
						_ignore[#_ignore + 1] = _hit
						-- ▲ Array.push ▲
					end
					last = result.Position
				else
					canScan = false
					break
				end
			end
		elseif self.isAMelee then
			if tick() - self.lastStab < self.knifeDelay then
				return nil
			end
			local result = nil
			local ignorelist = { self.client.Character }
			local iterations = 0
			local iterationUpperClamp = 5
			while not result do
				local ignore = RaycastParams.new()
				ignore.FilterDescendantsInstances = ignorelist
				local _fn = Workspace
				local _meleeRange = self.meleeRange
				local r = _fn:Raycast(origin, look * _meleeRange, ignore)
				if r and r.Instance.Name ~= "HumanoidRootPart" then
					result = r
					break
				end
				iterations += 1
				if iterationUpperClamp <= iterations then
					break
				end
			end
			if result then
				local hit = result.Instance
				local normal = result.Normal
				local position = result.Position
				local name = hit.Name
				local character = hit.Parent
				local _result = character
				if _result ~= nil then
					_result = _result:FindFirstChild("Humanoid")
				end
				local humanoid = _result
				local _result_1 = character
				if _result_1 ~= nil then
					_result_1 = _result_1:FindFirstChild("HumanoidRootPart")
				end
				local rootPart = _result_1
				local player = Players:GetPlayerFromCharacter(character)
				if player then
					print("it hit a player! ;)")
				else
					local _value = character and worldData.bots[character.Name]
					if _value ~= 0 and _value == _value and _value then
						print("it hit a bot c:")
						local rootPartCFrame = rootPart.CFrame
						local cameraCFrame = CFrame.lookAt(origin, look)
						local _position = cameraCFrame.Position
						local _position_1 = rootPartCFrame.Position
						local displacement = _position - _position_1
						local amf = rootPartCFrame.LookVector:Dot(displacement)
						print(amf)
						-- if amf < 0 then the killer is behind target;
						if amf < 0 and (hit.Name == "UpperTorso" or hit.Name == "LowerTorso") then
							local _result_2 = humanoid
							if _result_2 ~= nil then
								_result_2:TakeDamage(self.backStabDamage)
							end
							print("backstab")
						else
							local _result_2 = humanoid
							if _result_2 ~= nil then
								_result_2:TakeDamage(self.stabDamage)
							end
							print("stab")
						end
						local info = float.processImpact(self.client, hit, player or {})
						when.entityKilled:entityDied(self.client, nil, player and when.entityType.Player or when.entityType.Bot, info.impactLocation)
					else
						local objectImpactCFrame = CFrame.lookAt(position, normal * (-1))
						local _value_1 = worldData.explicitSolidGlass[name]
						if _value_1 ~= 0 and _value_1 == _value_1 and _value_1 then
						end
					end
				end
			end
		end
	end
	function weaponCore:reload()
		if not self.equipped then
			return nil
		end
		-- if (this.reloading) return;
		if self.ammo >= self.maxAmmo + self.ammoOverload then
			return nil
		end
		if tick() - self.lastReload < self.reloadCooldown then
			return nil
		end
		if self.reserve <= 0 then
			return nil
		end
		--[[
			let length = this.reloadLength;
			if (this.ammo <= 0) {
			length = this.fullReloadLength;
			};
		]]
		self.reloading = true
		if self.ammo >= self.maxAmmo + self.ammoOverload then
			return nil
		end
		if self.reserve <= 0 then
			return nil
		end
		local amountneeded = self.ammo <= 0 and self.maxAmmo - self.ammo or (self.maxAmmo + self.ammoOverload) - self.ammo
		if not self.reloadCancelled and self.reloading then
			if amountneeded > self.reserve then
				self.ammo = self.ammo + self.reserve
				self.reserve = 0
			elseif amountneeded < self.reserve then
				self.ammo += amountneeded
				self.reserve -= amountneeded
			end
		end
		self.reloadCancelled = false
		self.lastReload = tick()
		self.reloading = false
		coroutine.wrap(function()
			self.replicationService.remotes.requestPlayerAmmo:InvokeClient(self.client, self.ammo, self.maxAmmo + self.ammoOverload, self.reserve)
		end)()
	end
	function weaponCore:shoot(position, direction)
		if not self.equipped then
			return nil
		end
		if self.isAGun then
			if self.ammo <= 0 then
				return nil
			end
			if tick() - self.lastfired < 60 / self.firerate then
				return nil
			end
			self.lastfired = tick()
			self.ammo -= 1
			local terminated = false
			while not terminated do
				local Bullet = bullet.new({
					onHit = function(result)
						print("hit something")
						local position = result.position
						minerva.createBulletHole(position, result.normal, result.material, .5, Color3.new())
						local instance = result.hit
						local _binding = confirmation.isACharacterHitbox(instance)
						local isHitbox = _binding[1]
						local hitboxName = _binding[2]
						local hitboxInstance = _binding[3]
						if isHitbox and hitboxName ~= "player:" .. tostring(self.client.UserId) .. ":hitbox" then
							for i, v in pairs(env.characterClasses) do
								if v.hitbox == hitboxInstance then
									if v.alive then
										v:inflictDamage(25)
										if not v.alive then
											print("it died!")
											local _exp = Players:GetPlayers()
											local _arg0 = function(player)
												finisher_receive_protocol:fireClient(player, "mechanica", {
													character = v.character,
													impactColor = result.hit.Color,
													impactNormal = result.normal,
													impactPosition = result.position,
													impactMaterial = result.material,
												})
											end
											-- ▼ ReadonlyArray.forEach ▼
											for _k, _v in ipairs(_exp) do
												_arg0(_v, _k - 1, _exp)
											end
											-- ▲ ReadonlyArray.forEach ▲
										end
									else
										break
									end
								end
							end
							return 0
						elseif isHitbox then
							return 0
						else
							-- likely a basepart
							return 1
						end
					end,
					onTerminated = function()
						print("terminated")
						terminated = true
					end,
					maxPenetration = self.penetration,
					range = 999,
					origin = position,
					direction = direction,
					ignoreInstances = { self.client.Character },
					ignoreNames = {},
					ignorePlayers = {},
					ignoreHumanoidRootPart = true,
				})
			end
		end
	end
	function weaponCore:loadRemotes()
		if self.remotesLoaded then
			return nil
		end
		self.remotesLoaded = true
		local remotebin = ReplicatedStorage:WaitForChild("remotebin")
		if self.isAGun then
			local fire = Instance.new("RemoteEvent")
			fire.Parent = remotebin
			fire.OnServerEvent:Connect(function(_client, ...)
				local args = { ... }
				if self.client ~= _client then
					when.playerFiringRemoteThatIsntTheirs(self.client)
					return nil
				end
				self:fire(args[1], args[2])
			end)
			local reload = Instance.new("RemoteEvent")
			reload.Parent = remotebin
			reload.OnServerEvent:Connect(function(_client)
				if self.client ~= _client then
					when.playerFiringRemoteThatIsntTheirs(self.client)
					return nil
				end
				self:reload()
			end)
			local cancelReload = Instance.new("RemoteEvent")
			cancelReload.Parent = remotebin
			cancelReload.OnServerEvent:Connect(function(_client)
				if self.client ~= _client then
					when.playerFiringRemoteThatIsntTheirs(self.client)
					return nil
				end
				self.reloadCancelled = true
				self.reloading = false
				self.lastReload = 0
			end)
			local firemode = Instance.new("RemoteEvent")
			firemode.Parent = remotebin
			firemode.OnServerEvent:Connect(function(_client)
				if self.client ~= _client then
					when.playerFiringRemoteThatIsntTheirs(self.client)
					return nil
				end
				if self.fireMode >= #self.fireModes - 1 then
					self.fireMode = 0
				else
					self.fireMode += 1
				end
			end)
			local requestAmmo = Instance.new("RemoteFunction")
			requestAmmo.Parent = remotebin
			requestAmmo.OnServerInvoke = function(client)
				if client ~= self.client then
					when.playerFiringRemoteThatIsntTheirs(self.client)
					return nil
				end
				return { self.ammo, self.maxAmmo, self.ammoOverload, self.reserve }
			end
			local shoot = Instance.new("RemoteEvent")
			shoot.Parent = remotebin
			shoot.OnServerEvent:Connect(function(player, ...)
				local args = { ... }
				if player ~= self.client then
					when.playerFiringRemoteThatIsntTheirs(self.client)
					return nil
				end
				local origin = args[1]
				local direction = args[2]
				local verify = verifyParam({ t.Vector3, t.Vector3 }, { origin, direction })
				if verify then
					self:shoot(origin, direction)
				else
					error("a type doesn't conform to the check")
				end
			end)
			return {
				remotes = {
					fire = fire,
					reload = reload,
					cancelReload = cancelReload,
					firemode = firemode,
					shoot = shoot,
				},
				calls = {
					requestAmmo = requestAmmo,
				},
			}
		elseif self.isAMelee then
			local melee = Instance.new("RemoteEvent")
			melee.Parent = remotebin
			melee.OnServerEvent:Connect(function(_client, ...)
				local args = { ... }
				if self.client ~= _client then
					when.playerFiringRemoteThatIsntTheirs(self.client)
					return nil
				end
				self:fire(args[1], args[2])
			end)
			return {
				remotes = {
					melee = melee,
				},
				calls = {},
			}
		end
	end
end
return {
	default = weaponCore,
}
