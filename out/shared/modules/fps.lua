-- Compiled with roblox-ts v1.2.3
local TS = require(game:GetService("ReplicatedStorage"):WaitForChild("rbxts_include"):WaitForChild("RuntimeLib"))
local _services = TS.import(script, TS.getModule(script, "@rbxts", "services"))
local Players = _services.Players
local RunService = _services.RunService
local TweenService = _services.TweenService
local UserInputService = _services.UserInputService
local Workspace = _services.Workspace
local sohk = TS.import(script, game:GetService("ReplicatedStorage"), "TS", "sohk").default
local datatypes = TS.import(script, game:GetService("ReplicatedStorage"), "TS", "types", "datatypes")
local worldData = TS.import(script, game:GetService("ReplicatedStorage"), "TS", "worlddata")
local spring = TS.import(script, game:GetService("ReplicatedStorage"), "TS", "modules", "spring")
local mathf = TS.import(script, game:GetService("ReplicatedStorage"), "TS", "modules", "System").mathf
local localConfig = TS.import(script, game:GetService("ReplicatedStorage"), "TS", "config", "localConfig")
local crosshairController = TS.import(script, game:GetService("ReplicatedStorage"), "TS", "content", "crosshairController").default
local laser_turret = TS.import(script, game:GetService("ReplicatedStorage"), "TS", "content", "abilities", "laser turret").default
local minerva = TS.import(script, game:GetService("ReplicatedStorage"), "TS", "minerva")
local _matchservice = TS.import(script, game:GetService("ReplicatedStorage"), "TS", "services", "matchservice")
local matchService = _matchservice
local teamRoles = _matchservice.teamRoles
local teams = _matchservice.teams
local bombClass = TS.import(script, game:GetService("ReplicatedStorage"), "TS", "content", "bombClass").default
local bomb = TS.import(script, game:GetService("ReplicatedStorage"), "TS", "content", "bomb").default
local match_hud = TS.import(script, game:GetService("ReplicatedStorage"), "TS", "modules", "match_hud").default
local replication = TS.import(script, game:GetService("ReplicatedStorage"), "TS", "config", "replication", "replication")
local glock18_fade = TS.import(script, game:GetService("ReplicatedStorage"), "TS", "content", "guns", "glock18", "glock18_fade").default
local knife_saber = TS.import(script, game:GetService("ReplicatedStorage"), "TS", "content", "guns", "knife", "knife_saber").default
local clientService = TS.import(script, game:GetService("ReplicatedStorage"), "TS", "services", "clientService")
local clientCamera = TS.import(script, game:GetService("ReplicatedStorage"), "TS", "classes", "clientCamera")
local interpolations = TS.import(script, game:GetService("ReplicatedStorage"), "TS", "functions", "interpolations")
local _cameraController = TS.import(script, game:GetService("ReplicatedStorage"), "TS", "modules", "cameraController")
local cameraController = _cameraController.default
local cameraConfig = _cameraController.cameraConfig
local blank_arms = TS.import(script, game:GetService("ReplicatedStorage"), "TS", "content", "basic", "blank_arms").default
local muon_item = TS.import(script, game:GetService("ReplicatedStorage"), "TS", "content", "abilities", "muon_item").default
local muon = TS.import(script, game:GetService("ReplicatedStorage"), "TS", "content", "abilities", "muon").default
local projectile_handler = TS.import(script, game:GetService("ReplicatedStorage"), "TS", "passive", "projectile_handler").default
local hk416_default = TS.import(script, game:GetService("ReplicatedStorage"), "TS", "content", "guns", "hk416", "hk416").default
local actionPrompt = TS.import(script, game:GetService("ReplicatedStorage"), "TS", "interface", "actionPrompt").default
local keyHold = TS.import(script, game:GetService("ReplicatedStorage"), "TS", "classes", "keyHold").default
local gameConfig = TS.import(script, game:GetService("ReplicatedStorage"), "TS", "config", "gameConfig").gameConfig
local finisher_receive_protocol = TS.import(script, game:GetService("ReplicatedStorage"), "TS", "protocols", "finisher_receive_protocol")
local finishers = TS.import(script, game:GetService("ReplicatedStorage"), "TS", "content", "mapping", "finishers").finishers
local camera_request_protocol = TS.import(script, game:GetService("ReplicatedStorage"), "TS", "protocols", "camera_request_protocol")
local fps_framework
do
	local super = sohk.sohkComponent
	fps_framework = setmetatable({}, {
		__tostring = function()
			return "fps_framework"
		end,
		__index = super,
	})
	fps_framework.__index = fps_framework
	function fps_framework.new(...)
		local self = setmetatable({}, fps_framework)
		return self:constructor(...) or self
	end
	function fps_framework:constructor()
		super.constructor(self)
		self.camera = Workspace.CurrentCamera
		self.client = Players.LocalPlayer
		self.character = self.client.Character or ((self.client.CharacterAdded:Wait()))
		self.humanoid = self.character:WaitForChild("Humanoid")
		self.cameraController = cameraController.new(self.camera, self.character:WaitForChild("HumanoidRootPart"))
		self.reloading = false
		self.aiming = false
		self.toAim = false
		self.pronePlaying = false
		self.sneaking = false
		self.sprinting = false
		self.inspectingWeapon = false
		self.leandirection = 0
		self.lastlean = 0
		self.stance = 1
		self.speed = 12
		self.wantsToSprint = false
		self.defusingBomb = false
		self.bombDefusingTime = 0
		self.plantingBomb = false
		self.bombPlantingTime = 0
		self.rappelling = false
		self.rappelWall = nil
		self.exitingRappel = false
		self.enteringRappel = false
		self.vaulting = false
		self.bombClass = bombClass.new(self)
		self.matchHud = match_hud.new()
		self.offsets = {
			aimPercent = Instance.new("NumberValue"),
			sprintPercent = Instance.new("NumberValue"),
			movementTilt = CFrame.new(),
			cameraMovementTilt = CFrame.new(),
			movementOscillation = CFrame.new(),
			cameraLean = Instance.new("CFrameValue"),
			gunLean = Instance.new("CFrameValue"),
			stance = Instance.new("CFrameValue"),
			aimOscillation = CFrame.new(),
			zoomFovMultiplier = Instance.new("NumberValue"),
			aimSensitivityMultiplier = Instance.new("NumberValue"),
		}
		self.springs = {
			recoil = spring:create(5, 75, 3, 4),
			viewModelRecoil = spring:create(5, 85, 3, 10),
		}
		self.team = teams.alpha
		self.teamRole = teamRoles.attack
		self.iHaveBomb = false
		self.keybinds = {
			primary = Enum.KeyCode.One,
			secondary = Enum.KeyCode.Two,
			melee = Enum.KeyCode.Three,
			fire = Enum.UserInputType.MouseButton1,
			reload = Enum.KeyCode.R,
			aim = Enum.UserInputType.MouseButton2,
			leanLeft = Enum.KeyCode.Q,
			leanRight = Enum.KeyCode.E,
			prone = Enum.KeyCode.LeftControl,
			crouch = Enum.KeyCode.C,
			sprint = Enum.KeyCode.LeftShift,
			sneak = Enum.KeyCode.LeftAlt,
			vault = Enum.KeyCode.Space,
			rappel = Enum.KeyCode.Space,
			fireMode = Enum.KeyCode.V,
			primaryAbility = Enum.KeyCode.G,
			inspect = Enum.KeyCode.Y,
			secondaryAbility = Enum.KeyCode.H,
			["plant/defuse"] = Enum.KeyCode.F,
			dropBomb = Enum.KeyCode.Four,
			toggleCamera = Enum.KeyCode.B,
			nextCamera = Enum.KeyCode.Right,
			previousCamera = Enum.KeyCode.Left,
		}
		self.loadout = {
			primary = {
				module = hk416_default.new(self, {
					sight = "holographic",
				}),
				equipped = false,
				sight = {
					name = "holographic",
				},
			},
			secondary = {
				module = glock18_fade.new(self, {
					sight = nil,
				}),
				equipped = false,
			},
			melee = {
				module = knife_saber.new(self),
				equipped = false,
			},
			bomb = {
				module = bomb.new(self),
				equipped = false,
			},
			blank = {
				module = blank_arms.new(self),
				equipped = false,
			},
			extra1 = {
				module = muon_item.new(self),
				equipped = false,
			},
		}
		self.Abilities = {
			primaryAbility = {
				module = muon.new(self),
				equipped = false,
			},
			secondaryAbility = {
				module = laser_turret.new(self),
				equipped = false,
			},
		}
		self.lastMovementState = datatypes.movementState.idle
		self.crosshair = crosshairController.new()
		self.cameras = {}
		self.onCamera = false
		self.selectedCamera = 0
		self.proj_handler = projectile_handler.new()
		self.crosshairOffsets = {
			hipfireMultiplier = Instance.new("NumberValue"),
			movementMultiplier = Instance.new("NumberValue"),
		}
		self.prompts = {
			vaultPrompt = actionPrompt.new("PRESS", "TO VAULT", self.keybinds.vault),
			rappelPrompt = actionPrompt.new("HOLD", "TO RAPPEL", self.keybinds.rappel),
			rappelExitPrompt = actionPrompt.new("PRESS", "TO EXIT RAPPEL", self.keybinds.rappel),
		}
		local mval = self.crosshair:addMultiplierValue(self.crosshairOffsets.movementMultiplier)
		self:initProtocols()
		RunService:BindToRenderStep("cameraLock", Enum.RenderPriority.Camera.Value + 200, function(dt)
			if self.rappelling and self.rappelWall then
				self.cameraController.maxAngleX = 110
				self.cameraController.minAngleX = -110
			else
				self.cameraController.maxAngleX = cameraConfig.unlimited
				self.cameraController.minAngleX = -cameraConfig.unlimited
			end
			if self.stance == -1 then
				self.cameraController.minAngleY = -60
			else
				self.cameraController.minAngleY = -80
			end
		end)
		local promptRenderer = RunService.RenderStepped:Connect(function()
			self:updatePrompts()
		end)
		local gameplayrender = RunService.RenderStepped:Connect(function(dt)
			self:update(dt)
		end)
		local inputhandler = UserInputService.InputBegan:Connect(function(input, gp)
			if gp then
				return nil
			end
			if self:keyIs(input, "primary") then
				self:equip("primary")
			end
			if self:keyIs(input, "secondary") then
				self:equip("secondary")
			end
			if self:keyIs(input, "melee") then
				self:equip("melee")
			end
			if self:keyIs(input, "aim") then
				self:toggleAim(true)
			end
			if self:keyIs(input, "leanLeft") then
				self:toggleLean(-1)
			end
			if self:keyIs(input, "leanRight") then
				self:toggleLean(1)
			end
			if self:keyIs(input, "prone") then
				self:toggleStance(-1)
			end
			if self:keyIs(input, "inspect") then
				self:inspect()
			end
			if self:keyIs(input, "crouch") then
				self:toggleStance(0)
			end
			if self:keyIs(input, "sprint") then
				self:toggleSprint(true)
			end
			if self:keyIs(input, "sneak") then
				self:toggleSneak(true)
			end
			if self:keyIs(input, "vault") then
				coroutine.wrap(function()
					self:attemptVault()
				end)()
			end
			if self:keyIs(input, "dropBomb") then
				if self.teamRole == teamRoles.attack then
					self:dropBomb()
				end
			end
			if self:keyIs(input, "plant/defuse") then
				if self.teamRole == teamRoles.attack then
					self:initiatePlant()
				else
					self:initiateDefuse()
				end
			end
			if self:keyIs(input, "rappel") then
				local hold = keyHold.new(self.keybinds.rappel, gameConfig.rappelEnterHoldTime)
				local _binding = hold.keyRaised:wait()
				local timeHeld = _binding[1]
				if timeHeld >= gameConfig.rappelEnterHoldTime then
					self:attemptRappel()
				end
			end
			if self:keyIs(input, "primaryAbility") then
				self.Abilities.primaryAbility.module:trigger()
			end
			if self:keyIs(input, "secondaryAbility") then
				print("abouta trigger")
				self.Abilities.secondaryAbility.module:trigger()
			end
			if self:keyIs(input, "reload") then
				self:reload()
			end
			if self:keyIs(input, "fireMode") then
				local eq = self:getEquipped()
				if eq and eq.module.isAGun then
					eq.module:switchFireMode()
				end
			end
			if self:keyIs(input, "toggleCamera") then
				self.onCamera = not self.onCamera
			end
			if self:keyIs(input, "nextCamera") then
				self.selectedCamera += 1
			end
			if self:keyIs(input, "previousCamera") then
				self.selectedCamera -= 1
			end
		end)
		local inputhandler2 = UserInputService.InputEnded:Connect(function(input)
			if self:keyIs(input, "aim") then
				self:toggleAim(false)
			end
			if self:keyIs(input, "sprint") then
				self:toggleSprint(false)
			end
			if self:keyIs(input, "sneak") then
				self:toggleSneak(false)
			end
		end)
	end
	function fps_framework:initProtocols()
		local cameras = camera_request_protocol:queryServer()
		for cameraid, config in pairs(cameras) do
			print("accepted camera " .. cameraid)
			local cam = clientCamera.camera.new(cameraid, config)
			local _cameras = self.cameras
			local _cam = cam
			-- ▼ Array.push ▼
			_cameras[#_cameras + 1] = _cam
			-- ▲ Array.push ▲
		end
		clientService.createCamera:connect(function(cameraid, config)
			print("accepted new camera " .. cameraid)
			local cam = clientCamera.camera.new(cameraid, config)
			local _cameras = self.cameras
			local _cam = cam
			-- ▼ Array.push ▼
			_cameras[#_cameras + 1] = _cam
			-- ▲ Array.push ▲
		end)
		matchService.playerPicksUpBomb:connect(function(playerName)
			if self.client.Name == playerName then
				self.iHaveBomb = true
			end
		end)
		finisher_receive_protocol:connectClient(function(finisher, params)
			local call = finishers[finisher]
			if call then
				call(params)
			else
				error("finisher " .. finisher .. " has not been implemented")
			end
		end)
		matchService.playerDropsBomb:connect(function()
			self.iHaveBomb = false
		end)
		self.replicationService.remotes.act.OnClientEvent:Connect(function(action, ...)
			local args = { ... }
			replication.handleReplicate(action, unpack(args))
		end)
	end
	function fps_framework:keyIs(input, str)
		if self.keybinds[str] == input.KeyCode or self.keybinds[str] == input.UserInputType then
			return true
		end
		return false
	end
	function fps_framework:getAllActiveAbilities()
		local t = {}
		for i, v in pairs(self.Abilities) do
			if v.module.active then
				-- ▼ Array.push ▼
				t[#t + 1] = v
				-- ▲ Array.push ▲
			end
		end
		return t
	end
	function fps_framework:isKeyCode(e)
		if e.EnumType == Enum.KeyCode then
			return true
		end
		return false
	end
	function fps_framework:unequip(noPass)
		if noPass == nil then
			noPass = false
		end
		local _exp = self:getAllActiveAbilities()
		local _arg0 = function(v)
			if v.module.cancelOnGunChange and v.module.active then
				v.module:cancel()
			end
		end
		-- ▼ ReadonlyArray.forEach ▼
		for _k, _v in ipairs(_exp) do
			_arg0(_v, _k - 1, _exp)
		end
		-- ▲ ReadonlyArray.forEach ▲
		local equipped = self:getEquipped()
		if equipped then
			equipped.module:cancelReload()
			equipped.module:unequip()
			equipped.module:toggleInspect(false)
			equipped.equipped = false
		end
		if noPass then
			self.replicationService.remotes.equipItem:FireServer(nil)
		end
	end
	function fps_framework:toggleLean(t)
		if self.reloading then
			return nil
		end
		if self.sprinting then
			return nil
		end
		local forceReturn = false
		local _exp = self:getAllActiveAbilities()
		local _arg0 = function(v)
			if v.module.obscuresActions or not v.module.canLeanWhileActive then
				forceReturn = true
			end
		end
		-- ▼ ReadonlyArray.forEach ▼
		for _k, _v in ipairs(_exp) do
			_arg0(_v, _k - 1, _exp)
		end
		-- ▲ ReadonlyArray.forEach ▲
		if forceReturn then
			return nil
		end
		local equipped = self:getEquipped()
		if not equipped or (not equipped.module.canLean and t ~= 0) then
			return nil
		end
		equipped.module:toggleInspect(false)
		local info = TweenInfo.new(.25)
		self.lastlean = self.leandirection
		if t == self.leandirection then
			t = 0
		end
		self.leandirection = t
		if t == 1 then
			local _fn = TweenService
			local _exp_1 = self.offsets.cameraLean
			local _exp_2 = info
			local _ptr = {}
			local _left = "Value"
			local _cFrame = CFrame.new(1, 0, 0)
			local _arg0_1 = CFrame.Angles(0, 0, math.rad(-5))
			_ptr[_left] = _cFrame * _arg0_1
			_fn:Create(_exp_1, _exp_2, _ptr):Play()
			local _fn_1 = TweenService
			local _exp_3 = self.offsets.gunLean
			local _exp_4 = info
			local _ptr_1 = {}
			local _left_1 = "Value"
			local _cFrame_1 = CFrame.new()
			local _arg0_2 = CFrame.fromEulerAnglesYXZ(0, 0, math.rad(-16))
			_ptr_1[_left_1] = _cFrame_1 * _arg0_2
			_fn_1:Create(_exp_3, _exp_4, _ptr_1):Play()
		elseif t == -1 then
			local _fn = TweenService
			local _exp_1 = self.offsets.cameraLean
			local _exp_2 = info
			local _ptr = {}
			local _left = "Value"
			local _cFrame = CFrame.new(-1, 0, 0)
			local _arg0_1 = CFrame.Angles(0, 0, math.rad(5))
			_ptr[_left] = _cFrame * _arg0_1
			_fn:Create(_exp_1, _exp_2, _ptr):Play()
			local _fn_1 = TweenService
			local _exp_3 = self.offsets.gunLean
			local _exp_4 = info
			local _ptr_1 = {}
			local _left_1 = "Value"
			local _cFrame_1 = CFrame.new()
			local _arg0_2 = CFrame.fromEulerAnglesYXZ(0, 0, math.rad(16))
			_ptr_1[_left_1] = _cFrame_1 * _arg0_2
			_fn_1:Create(_exp_3, _exp_4, _ptr_1):Play()
		else
			TweenService:Create(self.offsets.cameraLean, info, {
				Value = CFrame.new(0, 0, 0),
			}):Play()
			local _fn = TweenService
			local _exp_1 = self.offsets.gunLean
			local _exp_2 = info
			local _ptr = {}
			local _left = "Value"
			local _cFrame = CFrame.new()
			local _arg0_1 = CFrame.fromEulerAnglesYXZ(0, 0, 0)
			_ptr[_left] = _cFrame * _arg0_1
			_fn:Create(_exp_1, _exp_2, _ptr):Play()
		end
		self.replicationService.remotes.act:FireServer("toggleLean", self.leandirection)
	end
	function fps_framework:dropBomb()
		-- check if they have the bomb;
		self.replicationService.remotes.performAction:FireServer("dropBomb")
	end
	function fps_framework:initiateDefuse()
		if not minerva.isBombPlanted then
			return nil
		end
		local p = Workspace:GetPartBoundsInBox(self.character:GetPrimaryPartCFrame(), Vector3.new(minerva.defuseRange, minerva.defuseRange, minerva.defuseRange))
		local bombFound = false
		local _p = p
		local _arg0 = function(v)
			if v.Name == minerva.bombName then
				bombFound = true
			end
		end
		-- ▼ ReadonlyArray.forEach ▼
		for _k, _v in ipairs(_p) do
			_arg0(_v, _k - 1, _p)
		end
		-- ▲ ReadonlyArray.forEach ▲
		if bombFound then
			self.replicationService.remotes.performAction:FireServer("startBombDefuse")
			self.defusingBomb = true
			local r
			r = RunService.RenderStepped:Connect(function(dt)
				local isDown = false
				if self:isKeyCode(self.keybinds["plant/defuse"]) then
					if UserInputService:IsKeyDown(self.keybinds["plant/defuse"]) then
						isDown = true
					end
				else
					if UserInputService:IsMouseButtonPressed(self.keybinds["plant/defuse"]) then
						isDown = true
					end
				end
				if isDown then
					self.bombPlantingTime = math.clamp(self.bombDefusingTime + 1 * dt, 0, minerva.bombDefuseTime)
					if self.bombDefusingTime >= minerva.bombDefuseTime then
						self.replicationService.remotes.performAction:FireServer("finishBombDefuse")
						r:Disconnect()
						self.defusingBomb = false
						self.bombDefusingTime = 0
					end
				else
					r:Disconnect()
					self.replicationService.remotes.performAction:FireServer("cancelBombDefuse")
					self.defusingBomb = false
					self.bombDefusingTime = 0
				end
			end)
		end
	end
	function fps_framework:initiatePlant()
		if minerva.isBombPlanted then
			return nil
		end
		local p = Workspace:GetPartBoundsInBox(self.character:GetPrimaryPartCFrame(), Vector3.new(.1, .1, .1))
		local foundSite = nil
		local _p = p
		local _arg0 = function(v)
			local f = { string.find(v.Name, "bombSite") }
			local _value = f[1]
			if _value ~= 0 and _value == _value and _value then
				print(v.Name, "$<found>")
				foundSite = v.Name
			end
		end
		-- ▼ ReadonlyArray.forEach ▼
		for _k, _v in ipairs(_p) do
			_arg0(_v, _k - 1, _p)
		end
		-- ▲ ReadonlyArray.forEach ▲
		if not foundSite then
			return nil
		end
		self:equip("bomb")
		self.replicationService.remotes.performAction:FireServer("startBombPlant", foundSite)
		self:toggleStance(0, true)
		self.plantingBomb = true
		local r
		r = RunService.RenderStepped:Connect(function(dt)
			local isDown = false
			if self:isKeyCode(self.keybinds["plant/defuse"]) then
				if UserInputService:IsKeyDown(self.keybinds["plant/defuse"]) then
					isDown = true
				end
			else
				if UserInputService:IsMouseButtonPressed(self.keybinds["plant/defuse"]) then
					isDown = true
				end
			end
			if isDown then
				self.bombPlantingTime = math.clamp(self.bombPlantingTime + 1 * dt, 0, minerva.bombPlantTime)
				if self.bombPlantingTime >= minerva.bombPlantTime then
					self.replicationService.remotes.performAction:FireServer("finishBombPlant")
					r:Disconnect()
					self.plantingBomb = false
					self.bombPlantingTime = 0
					self:equip("primary")
				end
			else
				r:Disconnect()
				self.replicationService.remotes.performAction:FireServer("cancelBombPlant")
				self.plantingBomb = false
				self.bombPlantingTime = 0
				self:equip("primary")
			end
		end)
	end
	function fps_framework:toggleSprint(t)
		if self.rappelling then
			return nil
		end
		if self.reloading then
			return nil
		end
		local forceReturn = false
		local _exp = self:getAllActiveAbilities()
		local _arg0 = function(v)
			if v.module.obscuresActions or not v.module.canSprintWhileActive then
				forceReturn = true
			end
		end
		-- ▼ ReadonlyArray.forEach ▼
		for _k, _v in ipairs(_exp) do
			_arg0(_v, _k - 1, _exp)
		end
		-- ▲ ReadonlyArray.forEach ▲
		if forceReturn then
			return nil
		end
		local equipped = self:getEquipped()
		if not equipped or not equipped.module.canSprint then
			return nil
		end
		self.wantsToSprint = t
		if t then
			equipped.module:toggleInspect(false)
			self:toggleStance(1)
			self:toggleAim(false)
			self:toggleSneak(false)
			self:toggleLean(0)
		end
	end
	function fps_framework:toggleSneak(t)
		if self.sprinting then
			return nil
		end
		if self.stance ~= 1 then
			return nil
		end
		self.sneaking = t
	end
	function fps_framework:toggleStance(t, force)
		if self.rappelling then
			return nil
		end
		if self.pronePlaying then
			return nil
		end
		if self.sprinting then
			return nil
		end
		if self.plantingBomb or self.defusingBomb then
			return nil
		end
		self:toggleSneak(false)
		local info1 = TweenInfo.new(.35, Enum.EasingStyle.Quad, Enum.EasingDirection.InOut)
		local info2 = TweenInfo.new(.6, Enum.EasingStyle.Quad, Enum.EasingDirection.InOut)
		local info = (self.stance == -1 or t == -1) and info2 or info1
		if t == self.stance and t == 0 and not force then
			t = 1
		end
		if t == self.stance then
			return nil
		end
		self.pronePlaying = (self.stance == -1 or t == -1) and true or false
		coroutine.wrap(function()
			if self.pronePlaying then
				task.wait(info.Time)
				self.pronePlaying = false
			end
		end)()
		self.stance = t
		if t == 1 then
			TweenService:Create(self.offsets.stance, info, {
				Value = CFrame.new(),
			}):Play()
		elseif t == 0 then
			TweenService:Create(self.offsets.stance, info, {
				Value = CFrame.new(0, -1.5, 0),
			}):Play()
		elseif t == -1 then
			TweenService:Create(self.offsets.stance, info, {
				Value = CFrame.new(0, -2.5, 0),
			}):Play()
		end
	end
	function fps_framework:toggleAim(t)
		local equipped = self:getEquipped()
		if not equipped or not equipped.module.canAim then
			return nil
		end
		local forceReturn = false
		local _exp = self:getAllActiveAbilities()
		local _arg0 = function(v)
			if v.module.obscuresActions or not v.module.canAimWhileActive then
				forceReturn = true
			end
		end
		-- ▼ ReadonlyArray.forEach ▼
		for _k, _v in ipairs(_exp) do
			_arg0(_v, _k - 1, _exp)
		end
		-- ▲ ReadonlyArray.forEach ▲
		if forceReturn then
			return nil
		end
		equipped.module:toggleInspect(false)
		local ti = TweenInfo.new(.5, Enum.EasingStyle.Quart, Enum.EasingDirection.Out)
		if t then
			if self.reloading then
				return nil
			end
			if self.sprinting then
				self.toAim = true
				local s
				s = RunService.RenderStepped:Connect(function()
					if not self.sprinting then
						s:Disconnect()
						self.toAim = false
					end
					self.crosshair:toggleVisible(true, .5)
					TweenService:Create(self.offsets.aimPercent, ti, {
						Value = 1,
					}):Play()
					TweenService:Create(self.offsets.zoomFovMultiplier, ti, {
						Value = 1,
					}):Play()
					TweenService:Create(self.offsets.aimSensitivityMultiplier, ti, {
						Value = 1,
					}):Play()
					self.aiming = true
				end)
			else
				self.aiming = true
				self.crosshair:toggleVisible(true, .5)
				TweenService:Create(self.offsets.aimPercent, ti, {
					Value = 1,
				}):Play()
				TweenService:Create(self.offsets.zoomFovMultiplier, ti, {
					Value = 1,
				}):Play()
				TweenService:Create(self.offsets.aimSensitivityMultiplier, ti, {
					Value = 1,
				}):Play()
			end
		else
			self.toAim = false
			self.aiming = false
			self.crosshair:toggleVisible(false, .5)
			TweenService:Create(self.offsets.aimPercent, ti, {
				Value = 0,
			}):Play()
			TweenService:Create(self.offsets.zoomFovMultiplier, ti, {
				Value = 0,
			}):Play()
			TweenService:Create(self.offsets.aimSensitivityMultiplier, ti, {
				Value = 0,
			}):Play()
		end
	end
	function fps_framework:getPenalty()
		local speed = self.humanoid.MoveDirection.Magnitude
		return {}
	end
	function fps_framework:equip(item)
		if self:getEquipped() == self.loadout[item] then
			return nil
		end
		self:toggleAim(false)
		self:unequip()
		local iteminfo = self.loadout[item]
		iteminfo.module:equip()
		iteminfo.equipped = true
		self.replicationService.remotes.equipItem:FireServer(iteminfo.module.name)
		if not iteminfo.module.canLean then
			self:toggleLean(0)
		end
		local function isKeyCode(e)
			if e.EnumType == Enum.KeyCode then
				return true
			end
			return false
		end
		local passAim = false
		if isKeyCode(self.keybinds.aim) then
			if UserInputService:IsKeyDown(self.keybinds.aim) then
				passAim = true
			end
		else
			if UserInputService:IsMouseButtonPressed(self.keybinds.aim) then
				passAim = true
			end
		end
		if passAim and iteminfo.module.canAim then
			self:toggleAim(true)
		end
	end
	function fps_framework:getEquipped()
		for index, ind in pairs(self.loadout) do
			if ind.equipped then
				return ind
			end
		end
	end
	function fps_framework:reload()
		if self.reloading then
			return nil
		end
		local forceReturn = false
		local _exp = self:getAllActiveAbilities()
		local _arg0 = function(v)
			if v.module.obscuresActions or not v.module.canReloadWhileActive then
				forceReturn = true
			end
		end
		-- ▼ ReadonlyArray.forEach ▼
		for _k, _v in ipairs(_exp) do
			_arg0(_v, _k - 1, _exp)
		end
		-- ▲ ReadonlyArray.forEach ▲
		if forceReturn then
			return nil
		end
		self:toggleSprint(false)
		self:toggleAim(false)
		self:toggleLean(0)
		local eq = self:getEquipped()
		if not eq then
			return nil
		end
		if eq.module.isAGun then
			eq.module:toggleInspect(false);
			(eq.module):reload()
			local function isKeyCode(e)
				if e.EnumType == Enum.KeyCode then
					return true
				end
				return false
			end
			local passAim = false
			if isKeyCode(self.keybinds.aim) then
				if UserInputService:IsKeyDown(self.keybinds.aim) then
					passAim = true
				end
			else
				if UserInputService:IsMouseButtonPressed(self.keybinds.aim) then
					passAim = true
				end
			end
			if passAim then
				self:toggleAim(true)
			end
		end
	end
	function fps_framework:attemptRappel(check)
		if check == nil then
			check = false
		end
		if self.rappelling or self.exitingRappel then
			self.prompts.rappelPrompt:hide()
			return nil
		end
		if not self.rappelling and check then
			self.prompts.rappelExitPrompt:hide()
		end
		local forceReturn = false
		local _exp = self:getAllActiveAbilities()
		local _arg0 = function(v)
			if v.module.obscuresActions or not v.module.canRappelWhileActive then
				forceReturn = true
			end
		end
		-- ▼ ReadonlyArray.forEach ▼
		for _k, _v in ipairs(_exp) do
			_arg0(_v, _k - 1, _exp)
		end
		-- ▲ ReadonlyArray.forEach ▲
		if forceReturn then
			return nil
		end
		local eq = self:getEquipped()
		if not eq then
			return nil
		end
		eq.module:toggleInspect(false)
		local p = Workspace:GetPartsInPart(self.character:FindFirstChild("HumanoidRootPart"))
		local selected = nil
		local _p = p
		local _arg0_1 = function(v)
			local _value = worldData.rappelGates[v.Name]
			if _value ~= 0 and _value == _value and _value then
				selected = v
			end
		end
		-- ▼ ReadonlyArray.forEach ▼
		for _k, _v in ipairs(_p) do
			_arg0_1(_v, _k - 1, _p)
		end
		-- ▲ ReadonlyArray.forEach ▲
		if selected then
			self.prompts.rappelPrompt:show()
			if check then
				return nil
			end
			self.rappelWall = selected
			self.enteringRappel = true
			local rappelExiting = false
			local started = tick()
			local p1 = Instance.new("Part")
			p1.Size = Vector3.new()
			p1.Anchored = true
			p1.Transparency = 1
			p1.CanCollide = false
			p1.Parent = Workspace:FindFirstChild("ignore")
			local a1 = Instance.new("Attachment")
			a1.Parent = p1
			local a2 = Instance.new("Attachment")
			a2.Parent = p1
			local rope = Instance.new("RopeConstraint")
			rope.Length = 0
			rope.Visible = true
			rope.Attachment0 = a1
			rope.Attachment1 = a2
			rope.Parent = Workspace:FindFirstChild("ignore")
			-- let v = mathf.bezierQuadraticV3(t, p, mid, endgoal)
			local _exp_1 = self.character:GetPrimaryPartCFrame()
			local _vector3 = Vector3.new(0, (self.character.PrimaryPart).Size.Y / 2, 0)
			local origin = _exp_1 - _vector3
			local originPosition = origin.Position
			local target = self.rappelWall:FindFirstChild("exit")
			local targetPosition = mathf.closestPointOnPart(target, originPosition)
			local _exp_2 = mathf.lerpV3(originPosition, targetPosition, .95)
			local _vector3_1 = Vector3.new(0, 10, 0)
			local mid = _exp_2 + _vector3_1
			local t = 0
			local c
			c = RunService.RenderStepped:Connect(function(dt)
				t += 1 * dt
				a1.WorldPosition = originPosition
				a2.WorldPosition = mathf.bezierQuadraticV3(t, originPosition, mid, targetPosition)
				self.replicationService.remotes.act:FireServer("updateRappelRope", a2.WorldPosition)
				if t > 1 then
					c:Disconnect()
					self.enteringRappel = false
				end
			end)
			task.wait(1)
			self.rappelling = true
			self.replicationService.remotes.act:FireServer("toggleRappelling", true)
			local conn
			conn = RunService.RenderStepped:Connect(function()
				if not self.rappelling or not self.rappelWall then
					conn:Disconnect()
					return nil
				end
				local cf = self.character:GetPrimaryPartCFrame()
				local targetPosition = mathf.closestPointOnPart(target, cf.Position)
				local _position = cf.Position
				local _vector3_2 = Vector3.new(0, (self.character.PrimaryPart).Size.Y / 2, 0)
				a1.WorldPosition = _position - _vector3_2
				a2.WorldPosition = targetPosition
				self.replicationService.remotes.act:FireServer("updateRappelRope", a2.WorldPosition)
				local dropLenience = 4
				local human = self.character:FindFirstChild("HumanoidRootPart")
				local requiredY = self.rappelWall.Position.Y + self.rappelWall.Size.Y / 2
				local dequiredY = self.rappelWall.Position.Y - self.rappelWall.Size.Y / 2 + dropLenience
				local humanY = human.Position.Y
				local function cpop(part, point)
					local t = part.CFrame:PointToObjectSpace(point)
					local hs = part.Size / 2
					local _cFrame = part.CFrame
					local _vector3_3 = Vector3.new(math.clamp(t.X, -hs.X, hs.X), math.clamp(t.Y, -hs.Y, hs.Y), math.clamp(t.Z, -hs.Z, hs.Z))
					return _cFrame * _vector3_3
				end
				local origin = self.character:GetPrimaryPartCFrame()
				local searchSize = Vector3.new(.1, .1, 10)
				local searchBox = Workspace:GetPartBoundsInBox(origin, searchSize)
				local _target = nil
				local _searchBox = searchBox
				local _arg0_2 = function(v)
					if v.Name == "window" then
						_target = v
					end
				end
				-- ▼ ReadonlyArray.forEach ▼
				for _k, _v in ipairs(_searchBox) do
					_arg0_2(_v, _k - 1, _searchBox)
				end
				-- ▲ ReadonlyArray.forEach ▲
				if tick() - started > 1 then
					if _target or humanY >= requiredY or humanY <= dequiredY and not self.exitingRappel then
						self.prompts.rappelExitPrompt:show()
					else
						self.prompts.rappelExitPrompt:hide()
					end
				end
				if UserInputService:IsKeyDown(self.keybinds.rappel or Enum.UserInputType) and not rappelExiting then
					if tick() - started < 1 then
						return nil
					end
					if _target then
						local target = _target
						local _position_1 = target.Position
						local _arg0_3 = target.CFrame.LookVector * 5
						local endPosition = _position_1 + _arg0_3
						local _position_2 = target.Position
						local _vector3_3 = Vector3.new(0, target.Size.Y / 2)
						local mid = _position_2 - _vector3_3
						local _position_3 = target.Position
						local _arg0_4 = target.CFrame.LookVector * 8
						local firstP = _position_3 - _arg0_4
						self.exitingRappel = true
						rappelExiting = true
						mathf.plotInWorld(origin.Position, Color3.fromRGB(255, 250, 0))
						mathf.plotInWorld(origin.Position, Color3.new(1, 0, 0))
						mathf.plotInWorld(mid, Color3.fromRGB(61, 255, 0))
						mathf.plotInWorld(endPosition, Color3.fromRGB(173, 0, 255))
						local ctal = {}
						local _exp_3 = self.character:GetChildren()
						local _arg0_5 = function(v)
							if not v:IsA("BasePart") then
								return nil
							end
							local _ctal = ctal
							local _v = v
							local _canCollide = v.CanCollide
							-- ▼ Map.set ▼
							_ctal[_v] = _canCollide
							-- ▲ Map.set ▲
							v.CanCollide = false
						end
						-- ▼ ReadonlyArray.forEach ▼
						for _k, _v in ipairs(_exp_3) do
							_arg0_5(_v, _k - 1, _exp_3)
						end
						-- ▲ ReadonlyArray.forEach ▲
						self.rappelling = false
						local t = 0
						local t01 = 0
						local firstdone = false
						local setFirst = false
						-- test again
						-- teleporting back to original origin
						local c
						c = RunService.RenderStepped:Connect(function(dt)
							t += 1 / 2 * dt
							if t >= 1 then
								c:Disconnect()
								local _ctal = ctal
								local _arg0_6 = function(v, i)
									i.CanCollide = v
								end
								-- ▼ ReadonlyMap.forEach ▼
								for _k, _v in pairs(_ctal) do
									_arg0_6(_v, _k, _ctal)
								end
								-- ▲ ReadonlyMap.forEach ▲
								self.exitingRappel = false
								rope:Destroy()
								p1:Destroy()
								self.replicationService.remotes.act:FireServer("toggleRappelling", false)
								return nil
							end
							local cald = interpolations.interpolate(t, 0, 1, "quadIn")
							local cald2 = interpolations.interpolate(t, 0, 1, "quadOut")
							local bezier01 = mathf.lerpV3(origin.Position, firstP, math.clamp(cald2, 0, 1))
							local bezier = mathf.bezierQuadraticV3(cald, bezier01, mid, endPosition)
							mathf.plotInWorld(bezier)
							local _fn = self.character
							local _fn_1 = CFrame
							local _exp_4 = bezier
							local _position_4 = target.Position
							local _arg0_6 = target.CFrame.LookVector * 20
							_fn:SetPrimaryPartCFrame(_fn_1.lookAt(_exp_4, _position_4 + _arg0_6))
						end)
					elseif humanY >= requiredY then
						rappelExiting = true
						self.exitingRappel = true
						local target = self.rappelWall:FindFirstChild("exit")
						local p = self.character:GetPrimaryPartCFrame().Position
						local closest = cpop(target, p)
						local direction = CFrame.lookAt(p, closest).LookVector
						local _p_1 = p
						local _vector3_3 = Vector3.new(direction.X * 5, math.abs(closest.Y - p.Y) + 7, direction.Z * 5)
						local endgoal = _p_1 + _vector3_3
						local t = 0
						local _exp_3 = mathf.lerpV3(p, endgoal, .25)
						local _vector3_4 = Vector3.new(0, 5, 0)
						local mid = _exp_3 + _vector3_4
						local tz = { p, mid, endgoal }
						local _tz = tz
						local _arg0_3 = function(v, i)
							local _result = Workspace:FindFirstChild("zz")
							if _result ~= nil then
								_result = _result:Clone()
							end
							local zz1 = _result
							zz1.Parent = Workspace:FindFirstChild("ignore")
							zz1.Position = v
							zz1.Color = Color3.new(1, 0, 0)
							zz1.Name = tostring("v" .. tostring(i + 1))
						end
						-- ▼ ReadonlyArray.forEach ▼
						for _k, _v in ipairs(_tz) do
							_arg0_3(_v, _k - 1, _tz)
						end
						-- ▲ ReadonlyArray.forEach ▲
						local ctal = {}
						local _exp_4 = self.character:GetChildren()
						local _arg0_4 = function(v)
							if not v:IsA("BasePart") then
								return nil
							end
							local _ctal = ctal
							local _v = v
							local _canCollide = v.CanCollide
							-- ▼ Map.set ▼
							_ctal[_v] = _canCollide
							-- ▲ Map.set ▲
							v.CanCollide = false
						end
						-- ▼ ReadonlyArray.forEach ▼
						for _k, _v in ipairs(_exp_4) do
							_arg0_4(_v, _k - 1, _exp_4)
						end
						-- ▲ ReadonlyArray.forEach ▲
						self.rappelling = false
						local c
						c = RunService.RenderStepped:Connect(function(dt)
							t += 1 * dt
							local v = mathf.bezierQuadraticV3(t, p, mid, endgoal)
							local rx, ry, rz = self.character:GetPrimaryPartCFrame():ToOrientation()
							local _fn = self.character
							local _cFrame = CFrame.new(v)
							local _arg0_5 = CFrame.Angles(rx, ry, rz)
							_fn:SetPrimaryPartCFrame(_cFrame * _arg0_5)
							if t > 1 then
								c:Disconnect()
								local _ctal = ctal
								local _arg0_6 = function(value, key)
									key.CanCollide = value
								end
								-- ▼ ReadonlyMap.forEach ▼
								for _k, _v in pairs(_ctal) do
									_arg0_6(_v, _k, _ctal)
								end
								-- ▲ ReadonlyMap.forEach ▲
								self.exitingRappel = false
								rope:Destroy()
								p1:Destroy()
								self.replicationService.remotes.act:FireServer("toggleRappelling", false)
							end
						end)
					elseif humanY <= dequiredY then
						rappelExiting = true
						self.exitingRappel = true
						local p = self.character:GetPrimaryPartCFrame().Position
						local ignore = RaycastParams.new()
						ignore.FilterDescendantsInstances = { self.camera, self.character, Workspace:FindFirstChild("ignore"), self.rappelWall }
						local result = Workspace:Raycast(p, Vector3.new(0, -15, 0), ignore)
						self.rappelling = false
						if result then
							local pos = result.Position
							local diff = Vector3.new(0, math.abs(pos.Y - p.Y), 0)
							local ofinz = self.rappelWall.CFrame.LookVector * (-1) * 2
							local _pos = pos
							local _diff = diff
							local _ofinz = ofinz
							local target = _pos + _diff + _ofinz
							local t = 0
							local c
							c = RunService.RenderStepped:Connect(function(dt)
								t += 1 * dt
								local rx, ry, rz = self.character:GetPrimaryPartCFrame():ToOrientation()
								local v = mathf.lerpV3(p, target, t)
								local _fn = self.character
								local _cFrame = CFrame.new(v)
								local _arg0_3 = CFrame.Angles(rx, ry, rz)
								_fn:SetPrimaryPartCFrame(_cFrame * _arg0_3)
								if t > 1 then
									c:Disconnect()
									self.exitingRappel = false
									rope:Destroy()
									p1:Destroy()
									self.replicationService.remotes.act:FireServer("toggleRappelling", false)
								end
							end)
						end
					end
				end
			end)
		else
			self.prompts.rappelPrompt:hide()
		end
	end
	function fps_framework:attemptVault(check)
		if check == nil then
			check = false
		end
		if self.vaulting or self.rappelling or self.exitingRappel then
			self.prompts.vaultPrompt:hide()
			return nil
		end
		local forceReturn = false
		local _exp = self:getAllActiveAbilities()
		local _arg0 = function(v)
			if v.module.obscuresActions or not v.module.canVaultWhileActive then
				forceReturn = true
			end
		end
		-- ▼ ReadonlyArray.forEach ▼
		for _k, _v in ipairs(_exp) do
			_arg0(_v, _k - 1, _exp)
		end
		-- ▲ ReadonlyArray.forEach ▲
		if forceReturn then
			return nil
		end
		local vaultdistance = 8
		local ignore = RaycastParams.new()
		ignore.FilterDescendantsInstances = { self.camera, self.character, Workspace:FindFirstChild("ignore"), Workspace:FindFirstChild("hitboxes") }
		local result = Workspace:Raycast(self.camera.CFrame.Position, self.camera.CFrame.LookVector * vaultdistance, ignore)
		if result then
			local inset = self.camera.CFrame.LookVector * 2
			local instance = result.Instance
			local normal = result.Normal
			local position = result.Position
			local _fn = mathf
			local _exp_1 = instance
			local _position = position
			local _vector3 = Vector3.new(0, 10000, 0)
			local topSurface = _fn.closestPointOnPart(_exp_1, _position + _vector3)
			local maxCharacterYDifference = 4
			local characterCFrame, boundingSize = self.character:GetBoundingBox()
			if math.abs(topSurface.Y - characterCFrame.Position.Y) > maxCharacterYDifference or topSurface.Y < characterCFrame.Position.Y - 1 then
				-- print('too high to vault')
				self.prompts.vaultPrompt:hide()
				return nil
			end
			local blockoff = 1
			-- mathf.plotInWorld(topSurface.add(inset), new Color3(0, 1, .5))
			local _fn_1 = Workspace
			local _topSurface = topSurface
			local _inset = inset
			local topOccupied = _fn_1:Raycast(_topSurface + _inset, Vector3.new(0, boundingSize.Y + blockoff, 0), ignore)
			if topOccupied then
				-- print("above the result is blocked");
				self.prompts.vaultPrompt:hide()
			else
				-- print("should be vaultable");
				self.prompts.vaultPrompt:show()
				if check then
					return nil
				end
				self:toggleLean(0)
				self:toggleStance(0)
				task.wait(.1)
				local _topSurface_1 = topSurface
				local _inset_1 = inset
				local _vector3_1 = Vector3.new(0, boundingSize.Y / 2, 0)
				local targetPosition = _topSurface_1 + _inset_1 + _vector3_1
				local origin = characterCFrame
				local _exp_2 = mathf.lerpV3(origin.Position, targetPosition, .75)
				local _vector3_2 = Vector3.new(0, 2, 0)
				local mid = _exp_2 + _vector3_2
				local targetdown = Workspace:Raycast(targetPosition, Vector3.new(0, -10, 0), ignore)
				if not targetdown then
					local _topSurface_2 = topSurface
					local _arg0_1 = inset * 5
					local _vector3_3 = Vector3.new(0, boundingSize.Y / 2, 0)
					targetPosition = _topSurface_2 + _arg0_1 + _vector3_3
					local _exp_3 = mathf.lerpV3(origin.Position, targetPosition, .5)
					local _vector3_4 = Vector3.new(0, 5, 0)
					mid = _exp_3 + _vector3_4
				end
				local ctal = {}
				local _exp_3 = self.character:GetChildren()
				local _arg0_1 = function(v)
					if not v:IsA("BasePart") then
						return nil
					end
					local _ctal = ctal
					local _canCollide = v.CanCollide
					-- ▼ Map.set ▼
					_ctal[v] = _canCollide
					-- ▲ Map.set ▲
					v.CanCollide = false
				end
				-- ▼ ReadonlyArray.forEach ▼
				for _k, _v in ipairs(_exp_3) do
					_arg0_1(_v, _k - 1, _exp_3)
				end
				-- ▲ ReadonlyArray.forEach ▲
				local t = 0
				local equipped = self:getEquipped()
				if equipped then
					local _topSurface_2 = topSurface
					local _arg0_2 = self.camera.CFrame.RightVector * (-4)
					local closest = _topSurface_2 + _arg0_2
					-- mathf.plotInWorld(closest, new Color3(1, 1, 0));
					-- arms.smoothArmLookAt(this.camera, equipped.module.viewmodel, 'left', closest);
				end
				self.vaulting = true
				local c
				c = RunService.RenderStepped:Connect(function(dt)
					t += 2 * dt
					t = math.clamp(t, 0, 1)
					if t >= 1 then
						c:Disconnect()
						local _ctal = ctal
						local _arg0_2 = function(v, i)
							i.CanCollide = v
						end
						-- ▼ ReadonlyMap.forEach ▼
						for _k, _v in pairs(_ctal) do
							_arg0_2(_v, _k, _ctal)
						end
						-- ▲ ReadonlyMap.forEach ▲
						if not targetdown then
							self.vaulting = false
							self:toggleStance(1)
							return nil
						else
							task.wait(.05)
							self.vaulting = false
							self:toggleStance(1)
							return nil
						end
					end
					local l = interpolations.interpolate(t, 0, 1, "quadInOut")
					local bez = mathf.bezierQuadraticV3(l, origin.Position, mid, targetPosition)
					self.character:SetPrimaryPartCFrame(CFrame.lookAt(bez, Vector3.new()))
				end)
			end
		else
			-- print('cant vault');
			self.prompts.vaultPrompt:hide()
		end
	end
	function fps_framework:inspect()
		local forceReturn = false
		local _exp = self:getAllActiveAbilities()
		local _arg0 = function(v)
			if v.module.obscuresActions or not v.module.canInspectWhileActive then
				forceReturn = true
			end
		end
		-- ▼ ReadonlyArray.forEach ▼
		for _k, _v in ipairs(_exp) do
			_arg0(_v, _k - 1, _exp)
		end
		-- ▲ ReadonlyArray.forEach ▲
		if forceReturn then
			return nil
		end
		local eq = self:getEquipped()
		if not eq then
			return nil
		end
		eq.module:toggleInspect(true)
	end
	function fps_framework:NRMLDistanceFromWall()
		local current = self.camera.CFrame
		local ignore = RaycastParams.new()
		ignore.FilterDescendantsInstances = { self.camera, self.character }
		local leanto = self.leandirection == 1 and 1 or -1
		if self.leandirection == 0 then
			leanto = self.lastlean
		end
		local _fn = Workspace
		local _exp = current.Position
		local _exp_1 = current.RightVector * 3
		local _leanto = leanto
		local result = _fn:Raycast(_exp, _exp_1 * _leanto, ignore)
		if result then
			if { string.find(result.Instance.Name, "hitbox") } then
				return 1
			end
			local _position = current.Position
			local _position_1 = result.Position
			local dst = (_position - _position_1).Magnitude
			local nrm = mathf.normalize(0, 1, dst - 1.2)
			return nrm
		else
			return 1
		end
	end
	function fps_framework:updatePrompts()
		self:attemptVault(true)
		self:attemptRappel(true)
	end
	function fps_framework:update(dt)
		local equipped = self:getEquipped()
		local _exp = self.character:GetDescendants()
		local _arg0 = function(v)
			if v:IsA("BasePart") then
				v.Transparency = 1
			end
		end
		-- ▼ ReadonlyArray.forEach ▼
		for _k, _v in ipairs(_exp) do
			_arg0(_v, _k - 1, _exp)
		end
		-- ▲ ReadonlyArray.forEach ▲
		local rootpart = self.character:FindFirstChild("HumanoidRootPart")
		replication.replicate(self, "setCamera", rootpart.CFrame:ToObjectSpace(self.camera.CFrame).LookVector)
		if self.onCamera then
			local eq = self:getEquipped()
			if eq then
				eq.module:unequip()
			end
			local index = self.selectedCamera
			if index >= #self.cameras then
				index = 0
				self.selectedCamera = index
			end
			if index < 0 then
				index = #self.cameras - 1
				self.selectedCamera = index
			end
			local delta = UserInputService:GetMouseDelta()
			UserInputService.MouseBehavior = Enum.MouseBehavior.LockCenter
			self.humanoid.WalkSpeed = 0
			local _cameras = self.cameras
			local _arg0_1 = function(v, i)
				if i == index then
					if not v.currentlyUsing then
						v:joinCamera()
					end
					self.camera.CameraType = Enum.CameraType.Scriptable
					v:setOrientation(Vector3.new(-delta.X, -delta.Y, 0))
					self.camera.CFrame = v:getCFrame()
				else
					if v.currentlyUsing then
						v:leaveCamera()
					end
				end
			end
			-- ▼ ReadonlyArray.forEach ▼
			for _k, _v in ipairs(_cameras) do
				_arg0_1(_v, _k - 1, _cameras)
			end
			-- ▲ ReadonlyArray.forEach ▲
		elseif equipped and equipped.module.viewmodel then
			self.camera.CameraType = Enum.CameraType.Fixed
			local vm = equipped.module.viewmodel
			local env = equipped.module
			local cf = vm.offsets.idle.Value
			cf = cf:Lerp(vm.offsets.idle.Value, 1)
			cf = cf:Lerp(CFrame.new(0, 0, -.2), self.offsets.aimPercent.Value)
			local moveDirection = self.uisController:getCurrentMovementVector(self.humanoid)
			local cmTiltMOD = equipped.module.inverseMovementTilt and -1 or 1
			local _moveDirection = moveDirection
			local _cmTiltMOD = cmTiltMOD
			moveDirection = _moveDirection * _cmTiltMOD
			self.offsets.movementTilt = self.offsets.movementTilt:Lerp(CFrame.Angles(0, 0, (moveDirection.X == 1 or moveDirection.X == -1) and (0 - moveDirection.X) * .15 or .05), .1)
			local currentMovementState = datatypes.movementState.idle
			local md = self.humanoid.MoveDirection
			if md.X ~= 0 or md.Z ~= 0 then
				if self.sprinting then
					currentMovementState = datatypes.movementState.sprinting
				else
					currentMovementState = datatypes.movementState.walking
				end
			elseif md.Y ~= 0 then
				currentMovementState = datatypes.movementState.falling
			end
			self.replicationService.remotes.act:FireServer("updateMovementState", currentMovementState)
			local oscMVMT = self.cameraService.bobLemnBern(self.rappelling and 3 or self.humanoid.WalkSpeed / 2.5 * env.bobSpeedModifier, self.rappelling and .15 or self.humanoid.WalkSpeed / 30 * env.bobIntensityModifier)
			local _fn = self.offsets.movementOscillation
			local _result
			if moveDirection.Magnitude == 0 then
				_result = CFrame.new()
			else
				local _vector3 = Vector3.new(oscMVMT[2], oscMVMT[1], 0)
				local _arg0_1 = self.aiming and 0.1 or 1
				_result = CFrame.new(_vector3 * _arg0_1)
			end
			self.offsets.movementOscillation = _fn:Lerp(_result, .1)
			local _fn_1 = self.offsets.cameraMovementTilt
			local _result_1
			if self.aiming then
				_result_1 = CFrame.new()
			else
				local _cFrame = CFrame.new(0, math.sin(tick()) * .01, math.sin(tick()) * .01)
				local _cFrame_1 = CFrame.new(moveDirection.X * .04, 0, moveDirection.Z * .04)
				_result_1 = _cFrame * _cFrame_1
			end
			self.offsets.cameraMovementTilt = _fn_1:Lerp(_result_1, .1)
			local recoil = self.springs.recoil:update(dt)
			local l1 = Vector3.new():Lerp(self.offsets.cameraLean.Value.Position, self:NRMLDistanceFromWall())
			local _cFrame = CFrame.new(l1)
			local _arg0_1 = CFrame.Angles(unpack(mathf.degToRad({ self.offsets.cameraLean.Value:ToOrientation() })))
			local l = _cFrame * _arg0_1
			local recoilvmVector = self.springs.viewModelRecoil:update(dt)
			if self.rappelling and self.rappelWall then
				local mvDT = Vector3.new()
				if UserInputService:IsKeyDown("W") then
					local _mvDT = mvDT
					local _vector3 = Vector3.new(0, 1, 0)
					mvDT = _mvDT + _vector3
				end
				if UserInputService:IsKeyDown("A") then
					local _mvDT = mvDT
					local _vector3 = Vector3.new(-1, 0, 0)
					mvDT = _mvDT + _vector3
				end
				if UserInputService:IsKeyDown("S") then
					local _mvDT = mvDT
					local _vector3 = Vector3.new(0, -1, 0)
					mvDT = _mvDT + _vector3
				end
				if UserInputService:IsKeyDown("D") then
					local _mvDT = mvDT
					local _vector3 = Vector3.new(1, 0, 0)
					mvDT = _mvDT + _vector3
				end
				local rappelvel = 10
				local org = self.character:GetPrimaryPartCFrame()
				local ignore = RaycastParams.new()
				ignore.FilterDescendantsInstances = { self.camera, self.character }
				local rayup = Workspace:Raycast(org.Position, Vector3.new(0, 2, 0), ignore)
				local raydown = Workspace:Raycast(org.Position, Vector3.new(0, -2, 0), ignore)
				if raydown then
					local _mvDT = mvDT
					local _vector3 = Vector3.new(0, 1, 0)
					mvDT = _mvDT + _vector3
				end
				if rayup then
					local _mvDT = mvDT
					local _vector3 = Vector3.new(0, 1, 0)
					mvDT = _mvDT - _vector3
				end
				mvDT = mvDT * .5
				local _mvDT = mvDT
				local _arg0_2 = self.sneaking and .35 or 1
				mvDT = _mvDT * _arg0_2
				local pos = self.rappelWall.CFrame.Position
				local size = self.rappelWall.Size
				local ry = self.rappelWall.CFrame:VectorToObjectSpace(mvDT)
				local tochar = self.character:GetPrimaryPartCFrame():VectorToObjectSpace(ry)
				local _exp_1 = self.character:GetPrimaryPartCFrame()
				local _tochar = tochar
				local _arg0_3 = rappelvel * dt
				local _cFrame_1 = CFrame.new(_tochar * _arg0_3)
				local targetCFrame = _exp_1 * _cFrame_1
				local clx = math.clamp(targetCFrame.X, pos.X - size.X / 2, pos.X + size.X / 2)
				local cly = math.clamp(targetCFrame.Y, pos.Y - size.Y / 2, pos.Y + size.Y / 2)
				local clz = math.clamp(targetCFrame.Z, pos.Z - size.Z / 2, pos.Z + size.Z / 2)
				local ox, oy, oz = targetCFrame:ToOrientation()
				local v3 = Vector3.new(clx, cly, clz)
				local _cFrame_2 = CFrame.new(v3)
				local _arg0_4 = CFrame.fromOrientation(ox, oy, oz)
				targetCFrame = _cFrame_2 * _arg0_4
				self.character:SetPrimaryPartCFrame(targetCFrame)
				rootpart.Anchored = true
			elseif self.exitingRappel then
				rootpart.Anchored = true
			else
				rootpart.Anchored = false
			end
			if self.vaulting then
				rootpart.Anchored = true
			elseif not self.rappelling and not self.exitingRappel and not self.enteringRappel then
				rootpart.Anchored = false
			end
			local rx, ry, rz = self.camera.CFrame:ToOrientation()
			-- setting things to cam causes lag;
			local _fn_2 = vm
			local _cFrame_1 = CFrame.new(self.camera.CFrame.Position)
			local _value = env.vmOffset.Value
			local _value_1 = self.offsets.stance.Value
			local _arg0_2 = CFrame.fromOrientation(rx, ry, rz)
			local _cf = cf
			local _cFrame_2 = CFrame.new(recoilvmVector)
			local _l = l
			local _movementTilt = self.offsets.movementTilt
			local _movementOscillation = self.offsets.movementOscillation
			local _value_2 = self.offsets.gunLean.Value
			local _cameraMovementTilt = self.offsets.cameraMovementTilt
			_fn_2:SetPrimaryPartCFrame(_cFrame_1 * _value * _value_1 * _arg0_2 * _cf * _cFrame_2 * _l * _movementTilt * _movementOscillation * _value_2 * _cameraMovementTilt)
			UserInputService.MouseIconEnabled = false
			local _cFrame_3 = CFrame.new(self.camera.CFrame.Position)
			local _value_3 = self.offsets.stance.Value
			local _arg0_3 = CFrame.fromOrientation(rx, ry, rz)
			local _l_1 = l
			local _arg0_4 = CFrame.Angles(math.rad(recoil.Y), math.rad(recoil.X), 0)
			local _movementOscillation_1 = self.offsets.movementOscillation
			self.camera.CFrame = _cFrame_3 * _value_3 * _arg0_3 * _l_1 * _arg0_4 * _movementOscillation_1
			local mod1 = self.pronePlaying and 0 or 1
			local mod2 = self.stance == 0 and .5 or 1
			local mod3 = self.stance == -1 and .2 or 1
			local mod4 = self.sneaking and .4 or 1
			local mod5 = self.sprinting and 1.45 or 1
			local mod6 = self.rappelling and 0 or 1
			local mod7 = self.aiming and .85 or 1
			local mod8 = self.plantingBomb and 0 or 1
			local mod9 = self.exitingRappel and 0 or 1
			local mod10 = self.enteringRappel and 0 or 1
			self.sprinting = (self.wantsToSprint)
			self.humanoid.WalkSpeed = self.speed * mod1 * mod2 * mod3 * mod4 * mod5 * mod6 * mod7 * mod8 * mod9 * mod10 * equipped.module.weightMultiplier
			local _result_2 = equipped.module.sight
			if _result_2 ~= nil then
				_result_2 = _result_2.zoom
			end
			local _condition = _result_2
			if not (_condition ~= 0 and _condition == _condition and _condition) then
				_condition = 1
			end
			local zoom = _condition
			self.camera.FieldOfView = mathf.lerp(localConfig.fov, localConfig.fov / zoom, self.offsets.zoomFovMultiplier.Value)
			equipped.module:update()
		end
		local charcf = self.character:GetPrimaryPartCFrame()
		local _rx1, ry1, _rz1 = self.camera.CFrame:ToOrientation()
		local rx2, ry2, rz2 = charcf:ToOrientation()
		if self.onCamera then
			ry1 = ry2
		end
		local _cFrame = CFrame.new(charcf.Position)
		local _arg0_1 = CFrame.fromOrientation(rx2, ry1, rz2)
		charcf = _cFrame * _arg0_1
		replication.replicate(self, "setCFrame", charcf)
		self.crosshairOffsets.movementMultiplier.Value = mathf.lerp(self.crosshairOffsets.movementMultiplier.Value, self.humanoid.MoveDirection.Magnitude == 0 and 1 or 2, .1)
		local sensX = mathf.lerp(localConfig.sensitivityX, localConfig.sensitivityX * localConfig.aimSensitivityMultiplier, self.offsets.aimSensitivityMultiplier.Value)
		local sensY = mathf.lerp(localConfig.sensitivityY, localConfig.sensitivityY * localConfig.aimSensitivityMultiplier, self.offsets.aimSensitivityMultiplier.Value)
		self.cameraController.sensitivityMultiplierX = sensX
		self.cameraController.sensitivityMultiplierY = sensY
		self.humanoid.JumpPower = 0
		self.humanoid.UseJumpPower = true
	end
end
return {
	default = fps_framework,
}
