-- Compiled with roblox-ts v1.2.3
local TS = require(game:GetService("ReplicatedStorage"):WaitForChild("rbxts_include"):WaitForChild("RuntimeLib"))
local weaponCore = TS.import(script, game:GetService("ReplicatedStorage"), "TS", "content", "weaponCore").default
local UserInputService = TS.import(script, TS.getModule(script, "@rbxts", "services")).UserInputService
local animationsMap = TS.import(script, game:GetService("ReplicatedStorage"), "TS", "content", "mapping", "animations")
local muon_item
do
	local super = weaponCore
	muon_item = setmetatable({}, {
		__tostring = function()
			return "muon_item"
		end,
		__index = super,
	})
	muon_item.__index = muon_item
	function muon_item.new(...)
		local self = setmetatable({}, muon_item)
		return self:constructor(...) or self
	end
	function muon_item:constructor(ctx)
		super.constructor(self, ctx, {
			name = "muon",
			animationIds = {
				idle = animationsMap.muon_idle,
				fire = animationsMap.muon_throw,
			},
			slotType = "extra1",
			skin = "blank",
		})
		self.isAGun = false
		self.isAMelee = false
		self.isBlank = true
		self.term = 0
		self.lastthrow = tick()
		self.throwcooldown = 2
		local inputX = UserInputService.InputBegan:Connect(function(input, gp)
			if self.ctx:keyIs(input, "fire") and not gp and self.equipped then
				self:fire()
			end
		end)
	end
	function muon_item:fire()
		if tick() - self.lastthrow < self.throwcooldown then
			return nil
		end
		self.term += 1
		if self.animations.fire then
			self.animations.fire:Play()
			task.wait(self.animations.fire.Length)
		end
		local origin = self.ctx.camera.CFrame
		local direction = origin.LookVector
		local position = self.viewmodel:GetPrimaryPartCFrame().Position
		local names = { "casing", "ore", "ore_damp" }
		self.remotes.fire:FireServer(position, direction)
		self.ctx.proj_handler:newProjectile("$client_projectile:muon:" .. tostring(self.term), "ReplicatedStorage//guns//muon//muon_blank", position, direction, Vector3.new(0, -50, 0), 100, 50)
		local _exp = self.viewmodel:GetChildren()
		local _arg0 = function(v)
			local _names = names
			local _name = v.Name
			local _condition = (table.find(_names, _name) or 0) - 1 ~= -1
			if _condition then
				_condition = v:IsA("BasePart")
			end
			if _condition then
				coroutine.wrap(function()
					local last = v.Transparency
					v.Transparency = 1
					v.Anchored = true
					task.wait(.6)
					v.Transparency = last
				end)()
			end
		end
		-- ▼ ReadonlyArray.forEach ▼
		for _k, _v in ipairs(_exp) do
			_arg0(_v, _k - 1, _exp)
		end
		-- ▲ ReadonlyArray.forEach ▲
		task.wait(.5)
		self.ctx:equip("primary")
	end
	function muon_item:update()
		if self.animations.idle and not self.animations.idle.IsPlaying then
			self.animations.idle:Play()
		end
	end
end
return {
	default = muon_item,
}
