-- Compiled with roblox-ts v1.2.3
local TS = require(game:GetService("ReplicatedStorage"):WaitForChild("rbxts_include"):WaitForChild("RuntimeLib"))
local _services = TS.import(script, TS.getModule(script, "@rbxts", "services"))
local Debris = _services.Debris
local ReplicatedStorage = _services.ReplicatedStorage
local TweenService = _services.TweenService
local UserInputService = _services.UserInputService
local Workspace = _services.Workspace
local sohk = TS.import(script, game:GetService("ReplicatedStorage"), "TS", "sohk").default
local Threading = TS.import(script, game:GetService("ReplicatedStorage"), "TS", "modules", "System").Threading
local sightsMapping = TS.import(script, game:GetService("ReplicatedStorage"), "TS", "content", "mapping", "sights")
local tracer = TS.import(script, game:GetService("ReplicatedStorage"), "TS", "classes", "tracer").default
local reloadExhaust = .55
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
	function weaponCore:constructor(ctx, data)
		super.constructor(self)
		self.void = false
		self.name = "unknown gun"
		self.animations = {}
		self.extraAnimations = {}
		self.mousedown = false
		self.equipped = false
		self.firerate = 600
		self.burstFireRate = 200
		self.burstBulletRate = 800
		self.reloadLength = 1.5
		self.penetration = 3
		self.spreadHipfirePenalty = 2
		self.spreadMovementHipfirePenalty = 2
		self.spreadUpPerShot = 2
		self.spreadBin = {}
		self.viewModelRecoil = {
			x = 0,
			y = 0,
			z = .4,
			rUp = 0,
		}
		self.equipping = false
		self.knifeDelay = .75
		self.stabDamage = 75
		self.backStabDamage = 200
		self.meleeRange = 7
		self.inspectAnimation = nil
		self.bobSpeedModifier = 1
		self.bobIntensityModifier = 1
		self.canLean = true
		self.canAim = true
		self.canSprint = true
		self.lastStab = tick()
		self.inspecting = false
		self.isAMelee = false
		self.isAGun = true
		self.isBlank = false
		self.weightMultiplier = 1.2
		self.inverseMovementTilt = false
		self.lastshot = tick()
		self.remotes = {}
		self.calls = {}
		self.fireModes = { "auto", "semi", "burst 3" }
		self.fireMode = 0
		self.lastFireModeSwitch = tick()
		self.fireModeSwitchCooldown = .75
		self.recoilPattern = { {
			x = 5,
			y = 9,
		}, {
			x = -3,
			y = 9,
		}, {
			x = 5,
			y = 9,
		}, {
			x = -5,
			y = 10,
		}, {
			x = -8,
			y = 12,
		}, {
			x = 8,
			y = 12,
		}, {
			x = 11,
			y = 14,
		}, {
			x = -10,
			y = 16,
		}, {
			x = 12,
			y = 14,
		} }
		self.recoilIndex = 0
		self.lastRecoil = tick()
		self.recoilRegroupTime = 1
		self.sight = nil
		self.lastReload = tick()
		self.vmOffset = Instance.new("CFrameValue")
		self.ammo = 0
		self.maxAmmo = 0
		self.ammoOverload = 0
		self.reserve = 0
		self.name = data.name
		self.ctx = ctx
		self.skin = data.skin
		self.slotType = data.slotType
		local _result = ReplicatedStorage:FindFirstChild("viewmodel")
		if _result ~= nil then
			_result = _result:Clone()
		end
		local vm = _result
		local _gun = ReplicatedStorage:FindFirstChild("guns")
		if _gun ~= nil then
			_gun = _gun:FindFirstChild(self.name)
			if _gun ~= nil then
				_gun = _gun:FindFirstChild(self.name .. "_" .. self.skin)
				if _gun ~= nil then
					_gun = _gun:Clone()
				end
			end
		end
		local gun = _gun
		if data.slotType == "bomb" then
			local _result_1 = ReplicatedStorage:FindFirstChild("gameModels")
			if _result_1 ~= nil then
				_result_1 = _result_1:FindFirstChild("bomb")
				if _result_1 ~= nil then
					_result_1 = _result_1:Clone()
				end
			end
			gun = _result_1
		end
		local sightSelection = nil
		if data.attachments then
			local _value = data.attachments.sight
			if _value ~= "" and _value then
				sightSelection = sightsMapping[data.attachments.sight].new()
			end
		end
		if not gun then
			error("gun " .. data.name .. " can not be found")
		end
		local _result_1 = gun
		if _result_1 ~= nil then
			local _exp = _result_1:GetChildren()
			local _arg0 = function(v)
				if v:IsA("BasePart") then
					v.CanCollide = false
					v.Anchored = false
				end
				if v.Name == "iron_front" or v.Name == "iron_back" then
					v:Destroy()
					return nil
				end
				v.Parent = vm
			end
			-- ▼ ReadonlyArray.forEach ▼
			for _k, _v in ipairs(_exp) do
				_arg0(_v, _k - 1, _exp)
			end
			-- ▲ ReadonlyArray.forEach ▲
		end
		self.viewmodel = vm
		local ap = vm:FindFirstChild("aimpart")
		if ap then
			if sightSelection then
				self:mountSight(sightSelection)
			else
				warn("no sight")
			end
			local m0 = Instance.new("Motor6D")
			m0.Part0 = ap
			m0.Name = "rightMotor"
			m0.Part1 = vm.rightArm
			m0.Parent = vm
			local m1 = Instance.new("Motor6D")
			m1.Part0 = ap
			m1.Part1 = vm.leftArm
			m1.Name = "leftMotor"
			m1.Parent = vm
			local m2 = Instance.new("Motor6D")
			m2.Part0 = vm.rootpart
			m2.Name = "apMotor"
			m2.Part1 = ap
			m2.Parent = vm
			vm.PrimaryPart = ap
		else
			error("no aimpart found in gun " .. self.name)
		end
		local p = data.slotType
		if self.slotType ~= "bomb" then
			local _result_2 = ReplicatedStorage:FindFirstChild("remotes")
			if _result_2 ~= nil then
				_result_2 = _result_2:FindFirstChild("requestLoad")
			end
			local r = _result_2:InvokeServer(p)
			if r then
				self.remotes = r.remotes
				self.calls = r.calls
			end
		end
		self.viewmodel:SetPrimaryPartCFrame(CFrame.new(0, -10000, 0))
		self.viewmodel.Parent = Workspace.CurrentCamera
		local temp = Instance.new("Folder")
		temp.Name = tostring(os.clock()) .. ":temp:animation"
		temp.Parent = Workspace
		for i, v in pairs(data.animationIds) do
			local a = Instance.new("Animation")
			a.AnimationId = v
			a.Parent = temp
			self.animations[i] = self.viewmodel.controller.animator:LoadAnimation(a)
		end
		local conn = UserInputService.InputBegan:Connect(function(input, gp)
			if self.ctx:keyIs(input, "fire") and self.equipped then
				self.mousedown = true
			end
		end)
		local conn2 = UserInputService.InputEnded:Connect(function(input)
			if self.ctx:keyIs(input, "fire") and self.equipped then
				self.mousedown = false
			end
		end)
		if sightSelection then
			sightSelection:mountFinisher(self.viewmodel)
		end
		self.viewmodel.Parent = nil
		temp:Destroy()
		coroutine.wrap(function()
			task.wait(1)
			if self.isAGun then
				local ammoThread = Threading.Recursive(function()
					local _binding = self.calls.requestAmmo:InvokeServer()
					local ammo = _binding[1]
					local maxAmmo = _binding[2]
					local ammoOverload = _binding[3]
					local reserve = _binding[4]
					self.ammo = ammo
					self.maxAmmo = maxAmmo
					self.ammoOverload = ammoOverload
					self.reserve = reserve
				end, .25)
				ammoThread:start()
			end
		end)()
	end
	function weaponCore:mountSight(sight)
		self.sight = sight
		sight:mount(self.viewmodel)
	end
	function weaponCore:equip()
		if self.void then
			return nil
		end
		self.equipped = true
		self.viewmodel.Parent = self.ctx.camera
		self.equipping = true
		coroutine.wrap(function()
			local _cFrame = CFrame.new(0, -5, 0)
			local _arg0 = CFrame.Angles(math.rad(90), 0, 0)
			self.vmOffset.Value = _cFrame * _arg0
			local t = TweenService:Create(self.vmOffset, TweenInfo.new(.2), {
				Value = CFrame.new(),
			})
			t:Play()
			task.wait(.1)
			if self.animations.equip then
				self.animations.equip:Play()
				if self.isAGun then
					local c2 = self.animations.equip:GetMarkerReachedSignal("bolt_out"):Connect(function()
						self.viewmodel.audio.boltback:Play()
					end)
					local c1 = self.animations.equip:GetMarkerReachedSignal("bolt_in"):Connect(function()
						self.viewmodel.audio.boltforward:Play()
					end)
					task.wait(self.animations.equip.Length)
					c1:Disconnect()
					c2:Disconnect()
				else
					task.wait(self.animations.equip.Length)
				end
			end
			self.equipping = false
		end)()
	end
	function weaponCore:unequip()
		self.equipped = false
		self.viewmodel.Parent = nil
	end
	function weaponCore:toggleInspect(t)
		if self.void then
			return nil
		end
		if self.isBlank then
			return nil
		end
		self.inspecting = t
		if self.slotType == "bomb" then
			return nil
		end
		if t then
			if self.inspectAnimation then
				self.inspectAnimation:Play(.25)
			end
		else
			if self.inspectAnimation then
				self.inspectAnimation:Stop()
			end
		end
	end
	function weaponCore:switchFireMode()
		if self.void then
			return nil
		end
		if self.isBlank then
			return nil
		end
		if self.slotType == "bomb" then
			return nil
		end
		if tick() - self.lastFireModeSwitch < self.fireModeSwitchCooldown then
			return nil
		end
		if self.fireMode >= #self.fireModes - 1 then
			self.fireMode = 0
		else
			self.fireMode += 1
		end
		self.remotes.firemode:FireServer()
	end
	function weaponCore:reload()
		if self.void then
			return nil
		end
		if self.isBlank then
			return nil
		end
		if self.slotType == "bomb" then
			return nil
		end
		if self.reserve == 0 then
			return nil
		end
		if self.equipping then
			return nil
		end
		if tick() - self.lastReload < reloadExhaust then
			return nil
		end
		if self.ammo >= self.maxAmmo + self.ammoOverload then
			return nil
		end
		self.ctx.reloading = true
		if self.animations.reload then
			self.animations.reload:Play()
			local c1 = self.animations.reload:GetMarkerReachedSignal("magout"):Connect(function()
				self.viewmodel.audio.magout:Play()
			end)
			local c2 = self.animations.reload:GetMarkerReachedSignal("magin"):Connect(function()
				self.viewmodel.audio.magin:Play()
			end)
			local c3 = self.animations.reload:GetMarkerReachedSignal("magdrop"):Connect(function()
				local clone = self.viewmodel.mag:Clone()
				clone.Anchored = false
				clone.CanCollide = true
				clone.Parent = Workspace:FindFirstChild("ignore")
			end)
			self.animations.reload.Stopped:Connect(function()
				c1:Disconnect()
				c2:Disconnect()
				c3:Disconnect()
			end)
		end
		task.wait(self.reloadLength)
		if not self.ctx.reloading then
			return nil
		end
		self.remotes.reload:FireServer()
		self.lastReload = tick()
		self.ctx.reloading = false
	end
	function weaponCore:cancelReload()
		if self.void then
			return nil
		end
		if self.isBlank then
			return nil
		end
		if self.slotType == "bomb" then
			return nil
		end
		if self.remotes.cancelReload then
			self.remotes.cancelReload:FireServer()
		end
		self.ctx.reloading = false
		if self.animations.reload and self.animations.reload.IsPlaying then
			self.animations.reload:Stop(.25)
		end
	end
	function weaponCore:recoilVM()
		if self.animations.fire then
			self.animations.fire:Play()
		end
		self.ctx.springs.viewModelRecoil:shove(Vector3.new(self.viewModelRecoil.x, self.viewModelRecoil.y, self.viewModelRecoil.z))
		local f1 = self.viewmodel.barrel:WaitForChild("muzzle"):WaitForChild("f1")
		local f2 = self.viewmodel.barrel:WaitForChild("muzzle"):WaitForChild("f2")
		local f = self.viewmodel.barrel:WaitForChild("muzzle"):WaitForChild("flash")
		f:Emit(1)
		f1:Emit(3)
		f2:Emit(1)
		if tick() - self.lastRecoil >= self.recoilRegroupTime then
			self.recoilIndex = 0
		else
			self.recoilIndex += 1
		end
		self.lastRecoil = tick()
		local recoilValue = self.recoilPattern[self.recoilIndex + 1] or self.recoilPattern[#self.recoilPattern - 1 + 1]
		self.ctx.springs.recoil:shove(Vector3.new(-recoilValue.x / 25, recoilValue.y / 25, 0))
		self.ctx.crosshair:pushRecoil(2, self.recoilRegroupTime)
	end
	function weaponCore:fireScan()
		local mult = #self.spreadBin + 1
		local calculated = self.spreadUpPerShot * mult * (self.ctx.aiming and 0 or self.spreadHipfirePenalty) * (self.ctx.humanoid.MoveDirection.Magnitude == -0 and 1 or self.spreadMovementHipfirePenalty)
		calculated = math.clamp(calculated, -5, 5)
		local random = Random.new()
		local finalX = random:NextNumber(-calculated, calculated)
		local finalY = random:NextNumber(-calculated, calculated)
		local origin = self.ctx.camera.CFrame
		-- let direction = origin.mul(spread).LookVector;
		local direction = self.ctx.crosshair:getSpreadDirection(self.ctx.camera)
		local effectorigin = self.viewmodel.barrel.Position
		local trace = tracer.new(effectorigin, direction, 1.5, Color3.new(0, 1, 1))
		self.remotes.shoot:FireServer(origin.Position, direction)
		local _spreadBin = self.spreadBin
		-- ▼ Array.push ▼
		_spreadBin[#_spreadBin + 1] = 0
		-- ▲ Array.push ▲
		coroutine.wrap(function()
			task.wait(1)
			local _exp = self.spreadBin
			-- ▼ Array.pop ▼
			_exp[#_exp] = nil
			-- ▲ Array.pop ▲
		end)()
	end
	function weaponCore:fire()
		if self.void then
			return nil
		end
		if self.isBlank then
			return nil
		end
		if self.equipping then
			return nil
		end
		if self.slotType == "bomb" then
			return nil
		end
		if self.ctx.reloading then
			return nil
		end
		if self.isAGun then
			if self.ammo <= 0 then
				if self.reserve > 0 then
					self:reload()
					return nil
				else
					return nil
				end
			end
			if self.fireMode == (table.find(self.fireModes, "burst 2") or 0) - 1 or self.fireMode == (table.find(self.fireModes, "burst 3") or 0) - 1 then
				if tick() - self.lastshot < (60 / self.burstFireRate) then
					return nil
				end
			else
				if tick() - self.lastshot < (60 / self.firerate) then
					return nil
				end
			end
			if self.fireMode == (table.find(self.fireModes, "semi") or 0) - 1 then
				self.mousedown = false
			end
			if self.fireMode == (table.find(self.fireModes, "burst 3") or 0) - 1 then
				local ca = self.ammo
				do
					local i = 0
					local _shouldIncrement = false
					while true do
						if _shouldIncrement then
							i += 1
						else
							_shouldIncrement = true
						end
						if not (i <= 2) then
							break
						end
						if not self.mousedown then
							break
						end
						if i >= ca then
							break
						end
						self:recoilVM()
						self.lastshot = tick()
						self.viewmodel.audio.fire:Play()
						local effectorigin = self.viewmodel.barrel.Position
						local direction = self.ctx.camera.CFrame.LookVector
						local _result = ReplicatedStorage:FindFirstChild("bullet_trail")
						if _result ~= nil then
							_result = _result:Clone()
						end
						local model = _result
						model.Parent = Workspace
						model.Position = effectorigin
						local trail = model:FindFirstChild("trail")
						model.CanCollide = false
						model.CanTouch = false
						model.Anchored = false
						model:ApplyImpulse(direction * 1000)
						Debris:AddItem(model, 3)
						self.remotes.fire:FireServer(self.ctx.camera.CFrame.Position, self.ctx.camera.CFrame.LookVector)
						task.wait(60 / self.burstBulletRate)
					end
				end
				return nil
			end
			if self.fireMode == (table.find(self.fireModes, "burst 2") or 0) - 1 then
				local ca = self.ammo
				do
					local i = 0
					local _shouldIncrement = false
					while true do
						if _shouldIncrement then
							i += 1
						else
							_shouldIncrement = true
						end
						if not (i <= 1) then
							break
						end
						if i >= ca then
							break
						end
						self:recoilVM()
						self.lastshot = tick()
						self.viewmodel.audio.fire:Play()
						local effectorigin = self.viewmodel.barrel.Position
						local direction = self.ctx.camera.CFrame.LookVector
						local _result = ReplicatedStorage:FindFirstChild("bullet_trail")
						if _result ~= nil then
							_result = _result:Clone()
						end
						local model = _result
						model.Parent = Workspace
						model.Position = effectorigin
						local trail = model:FindFirstChild("trail")
						model.CanCollide = false
						model.CanTouch = false
						model.Anchored = false
						model:ApplyImpulse(direction * 1000)
						Debris:AddItem(model, 3)
						self.remotes.fire:FireServer(self.ctx.camera.CFrame.Position, self.ctx.camera.CFrame.LookVector)
						task.wait(60 / self.burstBulletRate)
					end
				end
				return nil
			end
			if self.fireMode == (table.find(self.fireModes, "auto") or 0) - 1 then
				self:recoilVM()
				self.lastshot = tick()
				self.viewmodel.audio.fire:Play()
				self:fireScan()
				print("FIREEEEEEEEEEEE")
				--[[
					let model = ReplicatedStorage.FindFirstChild('bullet_trail')?.Clone() as BasePart;
					model.Parent = Workspace;
					model.Position = effectorigin;
					let trail = model.FindFirstChild('trail') as Trail;
					model.CanCollide = false;
					model.CanTouch = false;
					model.Anchored = false;
					model.ApplyImpulse(direction.mul(1000));
					Debris.AddItem(model, 3);
					this.remotes.fire.FireServer(this.ctx.camera.CFrame.Position, this.ctx.camera.CFrame.LookVector);
				]]
			end
		elseif self.isAMelee then
			if tick() - self.lastStab < self.knifeDelay then
				return nil
			end
			self.lastStab = tick()
			-- this.viewmodel.audio.fire.Play();
			local cf = self.ctx.camera.CFrame
			if self.animations.swing then
				self.animations.swing:Play()
			else
				print("no swing animation")
			end
			self.remotes.melee:FireServer(cf.Position, cf.LookVector)
		end
	end
	function weaponCore:update()
		if self.void then
			return nil
		end
		if self.isBlank then
			return nil
		end
		if self.ammo == 0 and self.animations.empty then
			if self.animations.idle then
				self.animations.idle:Stop()
			end
			if not self.animations.empty.IsPlaying then
				self.animations.empty:Play()
			end
		elseif self.animations.idle and not self.animations.idle.IsPlaying then
			if self.animations.empty then
				self.animations.empty:Stop()
			end
			self.animations.idle:Play()
		end
		if self.mousedown and self.equipped and not self.equipping then
			self:fire()
		end
	end
	function weaponCore:destroy()
		self.void = true
	end
end
return {
	default = weaponCore,
}
