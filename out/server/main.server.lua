-- Compiled with roblox-ts v1.2.3
local TS = require(game:GetService("ReplicatedStorage"):WaitForChild("rbxts_include"):WaitForChild("RuntimeLib"))
local _services = TS.import(script, TS.getModule(script, "@rbxts", "services"))
local Players = _services.Players
local ReplicatedStorage = _services.ReplicatedStorage
local RunService = _services.RunService
local Workspace = _services.Workspace
local sohk = TS.import(script, game:GetService("ReplicatedStorage"), "TS", "sohk").default
local characterReplicator = TS.import(script, game:GetService("ServerScriptService"), "TS", "characterReplicator").default
local illusoryDream = TS.import(script, game:GetService("ServerScriptService"), "TS", "content", "abilities", "illustoryDream").default
local characterClass = TS.import(script, game:GetService("ServerScriptService"), "TS", "character").default
local float = TS.import(script, game:GetService("ServerScriptService"), "TS", "float")
local laser_turret = TS.import(script, game:GetService("ServerScriptService"), "TS", "content", "abilities", "laser_turret").default
local _matchservice = TS.import(script, game:GetService("ReplicatedStorage"), "TS", "services", "matchservice")
local matchService = _matchservice
local roundStates = _matchservice.roundStates
local stateLengths = _matchservice.stateLengths
local teamRoles = _matchservice.teamRoles
local teams = _matchservice.teams
local classicRoundLoop = TS.import(script, game:GetService("ServerScriptService"), "TS", "config", "[gm] classic").default
local serverReplication = TS.import(script, game:GetService("ServerScriptService"), "TS", "helpers", "serverReplication")
local glock18_fade = TS.import(script, game:GetService("ServerScriptService"), "TS", "content", "guns", "glock18", "glock18_fade").default
local knife_saber = TS.import(script, game:GetService("ServerScriptService"), "TS", "content", "guns", "knife", "knife_saber").default
local camera = TS.import(script, game:GetService("ServerScriptService"), "TS", "classes", "camera").camera
local muon_item = TS.import(script, game:GetService("ServerScriptService"), "TS", "content", "abilities", "muon_item").default
local env = TS.import(script, game:GetService("ServerScriptService"), "TS", "dumps", "env")
local hk416_default = TS.import(script, game:GetService("ServerScriptService"), "TS", "content", "guns", "hk416", "hk416_default").default
local characterHitbox = TS.import(script, game:GetService("ServerScriptService"), "TS", "classes", "characterHitbox").default
local camera_request_protocol = TS.import(script, game:GetService("ReplicatedStorage"), "TS", "protocols", "camera_request_protocol")
local get_camera_controlling_protocol = TS.import(script, game:GetService("ReplicatedStorage"), "TS", "protocols", "get_camera_controlling_protocol")
local bot = TS.import(script, game:GetService("ServerScriptService"), "TS", "logicCircuit", "bot").bot
local hostileEntityModel = TS.import(script, game:GetService("ServerScriptService"), "TS", "quart", "aiModels", "hostileEntityModel").default
local quartUtils = TS.import(script, game:GetService("ServerScriptService"), "TS", "quart", "quartUtils")
local sk = sohk.new()
local main
do
	local super = sohk.sohkComponent
	main = setmetatable({}, {
		__tostring = function()
			return "main"
		end,
		__index = super,
	})
	main.__index = main
	function main.new(...)
		local self = setmetatable({}, main)
		return self:constructor(...) or self
	end
	function main:constructor()
		super.constructor(self)
		self.replChar = characterReplicator.new()
		self.cameras = {}
		self.cameraIdValue = 0
		local remotes = ReplicatedStorage:FindFirstChild("remotes")
		local clientdata = {}
		self.clientdata = clientdata
		self:initCams()
		self:initProtocols()
		coroutine.wrap(function()
			do
				local i = 0
				local _shouldIncrement = false
				while true do
					if _shouldIncrement then
						i += 1
					else
						_shouldIncrement = true
					end
					if not (i < 1) then
						break
					end
					local model = ReplicatedStorage:WaitForChild("bot"):Clone()
					local _fn = model
					local _position = model:GetPrimaryPartCFrame().Position
					local _vector3 = Vector3.new(math.random(-10, 10), 0, math.random(-10, 10))
					_fn:SetPrimaryPartCFrame(CFrame.new(_position + _vector3))
					model.Parent = Workspace:WaitForChild("bots")
					local clone = model:Clone()
					local _fn_1 = clone
					local _exp = model:GetPrimaryPartCFrame()
					local _cFrame = CFrame.new(0, 0, 5)
					_fn_1:SetPrimaryPartCFrame(_exp * _cFrame)
					local hitbox = characterHitbox.new(clone)
					local amodel = hostileEntityModel.new({
						physicalModel = model,
						seeksTarget = true,
					})
					local b = Workspace:WaitForChild("roaming"):GetChildren()
					amodel.predefineddLocations = quartUtils.partToPosition(b)
					local botx = bot.new({
						baseHealth = 100,
						maxHealth = 100,
						model = model,
						hitbox = hitbox,
						baseSpeed = 10,
						stationary = false,
						invincible = true,
						aiModel = amodel,
					})
				end
			end
		end)()
		local function t()
			local character = Workspace:WaitForChild("fae")
			local clone = character:Clone()
			local _fn = clone
			local _exp = character:GetPrimaryPartCFrame()
			local _cFrame = CFrame.new(0, 0, 5)
			_fn:SetPrimaryPartCFrame(_exp * _cFrame)
			local hitbox = characterHitbox.new(clone)
			env.characterHitboxes["bot:1:hitbox"] = hitbox
			local cls = characterClass.new(nil, hitbox, character)
			env.characterClasses[132] = cls
		end
		t()
		Players.PlayerAdded:Connect(function(client)
			local character = client.Character or (client.CharacterAdded:Wait())
			character.Archivable = true
			local clone = character:Clone()
			clone.Archivable = true
			clone.Name = "hitbox"
			local hitbox = characterHitbox.new(clone)
			env.characterHitboxes["player:" .. tostring(client.UserId) .. ":hitbox"] = hitbox
			local cls = characterClass.new(client, hitbox, character)
			env.characterClasses[client.UserId] = cls
			self.replChar:newPlayer(client)
			-- load animations for hitbox
			float.playerCharacterClasses[client.UserId] = cls
			clientdata[client.UserId] = {
				charClass = cls,
				loadout = {
					primary = {
						name = "hk416",
						skin = "default",
						module = hk416_default.new(client, cls),
					},
					secondary = {
						name = "glock18",
						skin = "fade",
						module = glock18_fade.new(client, cls),
					},
					melee = {
						name = "knife",
						skin = "saber",
						module = knife_saber.new(client, cls),
					},
					primaryAbility = {
						name = "Illusory Dream",
						module = illusoryDream.new(client, cls),
					},
					secondaryAbility = {
						name = "Laser Turret",
						module = laser_turret.new(client, cls),
					},
					extra1 = {
						name = "Muon Core",
						skin = "blank",
						module = muon_item.new(client, cls),
					},
				},
			}
		end)
		local _result = remotes
		if _result ~= nil then
			_result = _result:FindFirstChild("requestLoad")
		end
		local loadreq = _result
		loadreq.OnServerInvoke = function(client, ...)
			local args = { ... }
			local pos = args[1]
			if not clientdata[client.UserId].loadout[pos] then
				return nil
			end
			return clientdata[client.UserId].loadout[pos].module:loadRemotes()
		end
		self.replicationService.remotes.requestRemote.OnServerInvoke = function(client, ...)
			local args = { ... }
			local pos = args[1]
			if pos ~= "melee" and pos ~= "secondary" and pos ~= "primary" and pos ~= "primaryAbility" and pos ~= "secondaryAbility" then
				return nil
			end
			return clientdata[client.UserId].loadout[pos].module:loadRemotes()
		end
		local gameModeController = classicRoundLoop.new(clientdata)
		local isPlayerPlantingBomb = false
		local isBombPlanted = false
		local playerPlantingBomb = nil
		local bombStartedPlantingTime = 0
		local bombPlantedTime = 0
		local isPlayerDefusingBomb = false
		local playerDefusingBomb = nil
		local defusingStartedTime = 0
		local bombDefusedTime = 0
		local isBombDefused = false
		local playerWithBomb = nil
		local playerCanPickUpBomb = false
		local roundNumber = 1
		local timer = 0
		local roundState = "selection"
		local currentTeamRoles = {
			[teams.alpha] = teamRoles.attack,
			[teams.beta] = teamRoles.defend,
			[teams.bot] = teamRoles.void,
		}
		local teamPoints = {
			[teams.alpha] = 0,
			[teams.beta] = 0,
			[teams.bot] = 0,
		}
		local teamMembers = {
			[teams.alpha] = {},
			[teams.beta] = {},
			[teams.bot] = {},
		}
		local function checkForWinner()
			local winner = teams.alpha
			if isBombDefused then
				for i, v in pairs(currentTeamRoles) do
					if v == teamRoles.defend then
						winner = i
					end
				end
			elseif isBombPlanted then
				for i, v in pairs(currentTeamRoles) do
					if v == teamRoles.attack then
						winner = i
					end
				end
			else
				for i, v in pairs(currentTeamRoles) do
					if v == teamRoles.defend then
						winner = i
					end
				end
			end
			return winner
		end
		local function nextState(override)
			local _roundState = roundState
			local index = (table.find(roundStates, _roundState) or 0) - 1
			local nextIndex = index + 1
			if index == #roundStates - 1 then
				nextIndex = 0
			end
			roundState = roundStates[nextIndex + 1]
			if override then
				roundState = override
			end
			if roundState == "selection" then
				roundNumber += 1
			end
			if roundState == "roundEnding" then
				local winner = checkForWinner()
				matchService.roundEnded:activate(winner, teamPoints[winner], roundNumber)
			end
			matchService.roundStateUpdated:activate(roundState)
			timer = stateLengths[roundState]
		end
		local matchStep = RunService.Stepped:Connect(function(_t, dt)
			timer = math.clamp(timer - 1 * dt, 0, timer)
			matchService.timerUpdated:activate(timer)
			for i, v in pairs(teamMembers) do
				if i == teams.bot then
					continue
				end
				local alivePlayers = 0
				local _v = v
				local _arg0 = function(x)
					local userdata = clientdata[x]
					if userdata.charClass.alive then
						alivePlayers += 1
					end
				end
				-- ▼ ReadonlyArray.forEach ▼
				for _k, _v_1 in ipairs(_v) do
					_arg0(_v_1, _k - 1, _v)
				end
				-- ▲ ReadonlyArray.forEach ▲
				if alivePlayers < 1 then
				end
			end
			if timer >= stateLengths[roundState] then
				if roundState == "action" and isPlayerPlantingBomb then
					return nil
				end
				nextState()
			end
		end)
		self.replicationService.remotes.performAction.OnServerEvent:Connect(function(player, action, ...)
			local args = { ... }
			local ignoreDead = false
			local dir = clientdata[player.UserId]
			--[[
				if ((action as performableAction) === 'hola') {
				ignoreDead = true;
				}
			]]
			if not ignoreDead and not dir.charClass.alive then
				return nil
			end
			repeat
				if action == ("dropBomb") then
					gameModeController:dropBomb(player, true)
					break
				end
				if action == ("startBombPlant") then
					gameModeController:getRound():startBombPlant(player)
					break
				end
				if action == ("cancelBombPlant") then
					gameModeController:getRound():cancelBombPlant(player)
					break
				end
				if action == ("finishBombPlant") then
					-- if (roundState !== 'action') return;
					gameModeController:getRound():completeBombPlant(player)
					break
				end
				if action == ("startBombDefuse") then
					gameModeController:getRound():startBombDefuse(player)
					break
				end
				if action == ("cancelBombDefuse") then
					gameModeController:getRound():cancelBombDefuse(player)
					break
				end
				if action == ("finishBombDefuse") then
					gameModeController:getRound():completeBombDefuse(player)
					break
				end
				error("action [" .. tostring(action) .. "] is not a performable action")
				break
			until true
		end)
		self.replicationService.remotes.act.OnServerEvent:Connect(function(client, ...)
			local args = { ... }
			local dir = serverReplication.serverReplicationFunctions
			local f = dir[args[1]]
			local t = table.remove(args, 1)
			f(self, client, t, unpack(args))
		end)
		self.replicationService.remotes.requestPlayerHealth.OnServerInvoke = function(client)
			local cl = clientdata[client.UserId].charClass
			return { cl.health, cl.maxHealth }
		end
		self.replicationService.remotes.requestPlayerAmmo.OnServerInvoke = function(client)
			for i, v in pairs(clientdata[client.UserId].loadout) do
				if (v.module).equipped then
					return { (v.module).ammo, (v.module).maxAmmo + (v.module).ammoOverload, (v.module).reserve }
				end
			end
			return { 0, 0 }
		end
		self.replicationService.remotes.requestPlayerAbilityAmount.OnServerInvoke = function(client, ...)
			local args = { ... }
			local ability = args[1]
			if ability ~= "primary" and ability ~= "secondary" then
				return nil
			end
			local astf = clientdata[client.UserId].loadout
			for i, t in pairs(astf) do
				if i ~= "primaryAbility" and i ~= "secondaryAbility" then
					continue
				end
				return { i, (t.module).amount }
			end
		end
		self.replicationService.remotes.requestPlayerAbilityActive.OnServerInvoke = function(client, ...)
			local args = { ... }
			local ability = args[1]
			if ability ~= "primary" and ability ~= "secondary" then
				return nil
			end
			local astf = clientdata[client.UserId].loadout
			for i, t in pairs(astf) do
				if i ~= "primaryAbility" and i ~= "secondaryAbility" then
					continue
				end
				return { i, (t.module).active }
			end
		end
		self.replicationService.remotes.requestPlayerAbilityTimeLeft.OnServerInvoke = function(client, ...)
			local args = { ... }
			local ability = args[1]
			if ability ~= "primary" and ability ~= "secondary" then
				return nil
			end
			local astf = clientdata[client.UserId].loadout
			for i, t in pairs(astf) do
				if i ~= "primaryAbility" and i ~= "secondaryAbility" then
					continue
				end
				local op = (t.module).activationSequence and 1 or 0
				return { i, bit32.bxor((t.module).timeLeft, op), bit32.bxor((t.module).activationLength, op), (t.module).activationSequence }
			end
		end
		self.replicationService.remotes.requestPlayerAbilityCooldown.OnServerInvoke = function(client, ...)
			local args = { ... }
			local ability = args[1]
			if ability ~= "primary" and ability ~= "secondary" then
				return nil
			end
			local astf = clientdata[client.UserId].loadout
			for i, t in pairs(astf) do
				if i ~= "primaryAbility" and i ~= "secondaryAbility" then
					continue
				end
				return { i, (t.module).currentCooldown, (t.module).cooldown }
			end
		end
		self.replicationService.remotes.equipItem.OnServerEvent:Connect(function(client, ...)
			local args = { ... }
			local weapon = args[1]
			for i, v in pairs(clientdata[client.UserId].loadout) do
				if i == "primaryAbility" or i == "secondaryAbility" then
					continue
				end
				if v.name == weapon then
					(v.module):equip()
					local dir = serverReplication.serverReplicationFunctions
					local f = dir.equip
					f(self, client, "equip", v.name, v.skin)
					break
				else
					(v.module):unequip()
				end
			end
		end)
		self.replicationService.remotes.toggleData.Event:Connect(function(m, ...)
			local args = { ... }
			repeat
				if m == ("equip") then
					local player = args[1]
					local slot = args[2]
					for index, value in pairs(clientdata[player.UserId].loadout) do
						if index ~= "primary" and index ~= "melee" and index ~= "secondary" then
							return nil
						end
						if (value.module).type == slot then
							continue
						else
							(value.module):unequip()
						end
					end
					break
				end
				error("invalid case: " .. tostring(type))
				break
			until true
		end)
	end
	function main:initCams()
		coroutine.wrap(function()
			print("cameras being initialized!!!")
			local cambin = Workspace:FindFirstChild("cameras")
			local _exp = cambin:GetChildren()
			local _arg0 = function(cameraModel)
				local x, y, z = CFrame.lookAt(Vector3.new(0, 1, 0), Vector3.new(0, 0, 0)):ToOrientation()
				local cameraClass = camera.new(tostring(self.cameraIdValue), {
					instance = cameraModel,
					maxUp = 45,
					maxDown = 90,
					maxRight = 45,
					maxLeft = 90,
					originalOrientation = Vector3.new(x, y, z),
				})
				self.cameraIdValue += 1
				local _cameras = self.cameras
				local _cameraClass = cameraClass
				-- ▼ Array.push ▼
				_cameras[#_cameras + 1] = _cameraClass
				-- ▲ Array.push ▲
			end
			-- ▼ ReadonlyArray.forEach ▼
			for _k, _v in ipairs(_exp) do
				_arg0(_v, _k - 1, _exp)
			end
			-- ▲ ReadonlyArray.forEach ▲
		end)()
	end
	function main:initProtocols()
		camera_request_protocol:connectServer(function()
			local cameras = {}
			local _cameras = self.cameras
			local _arg0 = function(cam)
				cameras[cam.cameraId] = cam.config
			end
			-- ▼ ReadonlyArray.forEach ▼
			for _k, _v in ipairs(_cameras) do
				_arg0(_v, _k - 1, _cameras)
			end
			-- ▲ ReadonlyArray.forEach ▲
			return cameras
		end)
		get_camera_controlling_protocol:connectServer(function(cameraid)
			local _cameras = self.cameras
			local _arg0 = function(v)
				if v.cameraId == cameraid then
					return v.controlling
				end
			end
			-- ▼ ReadonlyArray.forEach ▼
			for _k, _v in ipairs(_cameras) do
				_arg0(_v, _k - 1, _cameras)
			end
			-- ▲ ReadonlyArray.forEach ▲
			return nil
		end)
	end
end
main.new()
return {
	main = main,
}
