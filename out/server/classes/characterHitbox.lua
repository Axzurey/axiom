-- Compiled with roblox-ts v1.2.3
local TS = require(game:GetService("ReplicatedStorage"):WaitForChild("rbxts_include"):WaitForChild("RuntimeLib"))
local _services = TS.import(script, TS.getModule(script, "@rbxts", "services"))
local ReplicatedStorage = _services.ReplicatedStorage
local TweenService = _services.TweenService
local Workspace = _services.Workspace
local replicatedWeapons = TS.import(script, game:GetService("ReplicatedStorage"), "TS", "config", "replication", "replicatedWeapons")
local animationsMap = TS.import(script, game:GetService("ReplicatedStorage"), "TS", "content", "mapping", "animations")
local leanCache = nil
local characterHitbox
do
	characterHitbox = setmetatable({}, {
		__tostring = function()
			return "characterHitbox"
		end,
	})
	characterHitbox.__index = characterHitbox
	function characterHitbox.new(...)
		local self = setmetatable({}, characterHitbox)
		return self:constructor(...) or self
	end
	function characterHitbox:constructor(character)
		self.animations = {}
		self.character = character
		if self.character:FindFirstChildOfClass("Humanoid") then
			local _result = self.character:FindFirstChildOfClass("Humanoid")
			if _result ~= nil then
				_result:Destroy()
			end
		end
		local function config(v)
			if v:IsA("BasePart") then
				v.Transparency = 1
				v.CanCollide = false
				v.CanTouch = false
				v.Color = Color3.fromRGB(0, 255, 255)
				if v.Name == "HumanoidRootPart" then
					v.Transparency = 1
				end
			end
		end
		local deccon = self.character.DescendantAdded:Connect(config)
		local _exp = self.character:GetDescendants()
		local _arg0 = function(v)
			config(v)
		end
		-- ▼ ReadonlyArray.forEach ▼
		for _k, _v in ipairs(_exp) do
			_arg0(_v, _k - 1, _exp)
		end
		-- ▲ ReadonlyArray.forEach ▲
		self.character.HumanoidRootPart.Anchored = true
		self.character.Parent = Workspace:FindFirstChild("hitboxes")
	end
	function characterHitbox:setCFrame(cf)
		self.character:SetPrimaryPartCFrame(cf)
	end
	function characterHitbox:unequip()
		local character = self.character
		local weapon = character:FindFirstChild("weapon")
		local handle = character:FindFirstChild("handle")
		local map = self.animations
		if map ~= 0 and map == map and map ~= "" and map then
			for i, v in pairs(map) do
				local f = { string.find(i, "idle") }
				local _value = f[1]
				if _value ~= 0 and _value == _value and _value then
					v:Stop()
				end
			end
		end
		if weapon then
			weapon:Destroy()
		end
		if handle then
			handle:Destroy()
		end
	end
	function characterHitbox:equip(weaponName, weaponSkin)
		self:unequip()
		local character = self.character
		local _result = ReplicatedStorage:FindFirstChild("guns")
		if _result ~= nil then
			_result = _result:FindFirstChild(weaponName)
			if _result ~= nil then
				_result = _result:FindFirstChild(weaponName .. "_" .. weaponSkin)
			end
		end
		local weapon = _result
		if not weapon then
			error("weapon of name " .. weaponName .. " and skin " .. weaponSkin .. " can not be found")
		end
		weapon = weapon:Clone()
		local handle = Instance.new("Motor6D")
		handle.Part0 = character:FindFirstChild("UpperTorso")
		handle.Part1 = weapon:FindFirstChild("aimpart")
		handle.Parent = character
		weapon.Name = "weapon"
		weapon.Parent = character
		local initialAnimationIndex = replicatedWeapons[weaponName]
		local secondAnimationIndex = initialAnimationIndex[weaponSkin]
		local animations = secondAnimationIndex.animations
		local idle_anim_id = animations.idle
		local map = self.animations
		if not map["idle:" .. weaponName .. ":" .. weaponSkin] then
			local animator = character:WaitForChild("Humanoid"):WaitForChild("Animator")
			local ainstance = Instance.new("Animation")
			ainstance.Parent = character
			ainstance.AnimationId = idle_anim_id
			local anim = animator:LoadAnimation(ainstance)
			ainstance:Destroy()
			self:addAnimations({
				["idle:" .. weaponName .. ":" .. weaponSkin] = anim,
			})
			anim:Play()
		else
			map["idle:" .. weaponName .. ":" .. weaponSkin]:Play()
		end
	end
	function characterHitbox:addAnimations(animations)
		for i, v in pairs(animations) do
			self.animations[i] = v
		end
	end
	function characterHitbox:changeStance(form)
	end
	function characterHitbox:lean(direction)
		local c = leanCache
		if not c then
			c = Instance.new("NumberValue")
			leanCache = c
		end
		local t = TweenService:Create(c, TweenInfo.new(.25), {
			Value = direction,
		})
		t:Play()
	end
	function characterHitbox:headTo(direction)
		local _result = self.character:FindFirstChild("Head")
		if _result ~= nil then
			_result = _result:FindFirstChild("Neck")
		end
		local neck = _result
		local info = leanCache
		local y = neck.C0.Y
		local _cFrame = CFrame.new(0, y, 0)
		local _arg0 = CFrame.Angles(0, -math.asin(direction.X), 0)
		local _arg0_1 = CFrame.Angles(math.asin(direction.Y), 0, 0)
		local set = _cFrame * _arg0 * _arg0_1
		neck.C0 = set
		local _result_1 = self.character:FindFirstChild("UpperTorso")
		if _result_1 ~= nil then
			_result_1 = _result_1:FindFirstChild("Waist")
		end
		local torso = _result_1
		local y2 = torso.C0.Y
		local _cFrame_1 = CFrame.new(0, y2, 0)
		local _arg0_2 = CFrame.Angles(0, 0, math.rad(-20) * (info and info.Value or 0))
		local _arg0_3 = CFrame.Angles(math.clamp(math.asin(direction.Y), math.rad(-45), math.rad(45)), 0, 0)
		local set2 = _cFrame_1 * _arg0_2 * _arg0_3
		torso.C0 = torso.C0:Lerp(set2, .2)
	end
	function characterHitbox:loadAnimations(animations)
		local animator = self.character.Humanoid.Animator
		for i, v in pairs(animations) do
			local id = animationsMap[v]
			local anim = Instance.new("Animation")
			anim.Parent = Workspace
			anim.AnimationId = id
			local track = animator:LoadAnimation(anim)
			self.animations[i] = track
			anim:Destroy()
		end
	end
	function characterHitbox:playAnimation(animation)
		if not self.animations[animation] then
			error("animation " .. animation .. " could not be found!")
		end
		self.animations[animation]:Play()
	end
end
return {
	default = characterHitbox,
}
