-- Compiled with roblox-ts v1.2.3
local TS = require(game:GetService("ReplicatedStorage"):WaitForChild("rbxts_include"):WaitForChild("RuntimeLib"))
local _services = TS.import(script, TS.getModule(script, "@rbxts", "services"))
local RunService = _services.RunService
local TweenService = _services.TweenService
local Players = _services.Players
local Workspace = _services.Workspace
local elastic = TS.import(script, game:GetService("ReplicatedStorage"), "TS", "modules", "elastic")
local mathf = TS.import(script, game:GetService("ReplicatedStorage"), "TS", "modules", "System").mathf
local client = Players.LocalPlayer
local c = Workspace.CurrentCamera
local rotations = {
	top = 0,
	bottom = 180,
	right = 90,
	left = 270,
}
local crosshairController
do
	crosshairController = setmetatable({}, {
		__tostring = function()
			return "crosshairController"
		end,
	})
	crosshairController.__index = crosshairController
	function crosshairController.new(...)
		local self = setmetatable({}, crosshairController)
		return self:constructor(...) or self
	end
	function crosshairController:constructor()
		self.hairs = {
			top = {
				instance = Instance.new("ImageLabel"),
				basePosition = Vector2.new(0, -20),
			},
			bottom = {
				instance = Instance.new("ImageLabel"),
				basePosition = Vector2.new(0, 20),
			},
			left = {
				instance = Instance.new("ImageLabel"),
				basePosition = Vector2.new(-20, 0),
			},
			right = {
				instance = Instance.new("ImageLabel"),
				basePosition = Vector2.new(20, 0),
			},
		}
		self.visible = false
		self.upperClamp = 10
		self.coil = Instance.new("NumberValue")
		self.spring = Instance.new("NumberValue")
		self.elastic = elastic.new(0)
		self.multiplierCallbacks = {}
		self.lastshove = tick()
		local backdrop = Instance.new("ScreenGui")
		backdrop.Name = "crosshair:backdrop"
		backdrop.IgnoreGuiInset = true
		backdrop.Parent = client:WaitForChild("PlayerGui")
		for i, v in pairs(self.hairs) do
			v.instance.Name = i
			v.instance.AnchorPoint = Vector2.new(.5, .5)
			v.instance.Selectable = false
			v.instance.Size = UDim2.fromOffset(10, 10)
			v.instance.Image = "rbxassetid://8097026573"
			v.instance.BackgroundTransparency = 1
			v.instance.Rotation = rotations[i]
			v.instance.Parent = backdrop
		end
		self.backdrop = backdrop
		RunService.RenderStepped:Connect(function(dt)
			self:onRender(dt)
		end)
	end
	function crosshairController:toggleVisible(t, length)
		TweenService:Create(self.coil, TweenInfo.new(length), {
			Value = t and 1 or 0,
		}):Play()
	end
	function crosshairController:onRender(dt)
		local offset = self:calculateOffset()
		for index, value in pairs(self.hairs) do
			value.instance.ImageTransparency = self.coil.Value
			local _basePosition = value.basePosition
			local _offset = offset
			local position = _basePosition * _offset
			local bsp = c.ViewportSize / 2
			value.instance.Position = UDim2.fromOffset(position.X + bsp.X, position.Y + bsp.Y)
		end
	end
	function crosshairController:addMultiplierValue(value)
		local t
		t = {
			value = value,
			disconnect = function()
				local _multiplierCallbacks = self.multiplierCallbacks
				local _t = t
				local index = (table.find(_multiplierCallbacks, _t) or 0) - 1
				if index ~= -1 then
					local _multiplierCallbacks_1 = self.multiplierCallbacks
					local _index = index
					table.remove(_multiplierCallbacks_1, _index + 1)
				end
			end,
		}
		return t
	end
	function crosshairController:calculateOffset()
		local offset = (math.clamp(self.elastic.p, 0, self.upperClamp)) + 1
		offset = mathf.lerp(0, offset, 1 - self.coil.Value)
		local multiplier = 1
		local _multiplierCallbacks = self.multiplierCallbacks
		local _arg0 = function(v)
			multiplier += v.value.Value
		end
		-- ▼ ReadonlyArray.forEach ▼
		for _k, _v in ipairs(_multiplierCallbacks) do
			_arg0(_v, _k - 1, _multiplierCallbacks)
		end
		-- ▲ ReadonlyArray.forEach ▲
		offset *= multiplier
		return offset
	end
	function crosshairController:getSpreadDirection(camera)
		local _viewportSize = camera.ViewportSize
		local _vector2 = Vector2.new(0, 36 * 2)
		local screenSizeMid = (_viewportSize - _vector2) / 2
		local random = Random.new()
		local offset = self:calculateOffset()
		local sens = 10
		local up = random:NextNumber(-offset * sens, offset * sens)
		local right = random:NextNumber(-offset * sens, offset * sens)
		local ray = camera:ScreenPointToRay(screenSizeMid.X + right, screenSizeMid.Y + up)
		return ray.Direction
	end
	function crosshairController:pushRecoil(force, length, incremental)
		if incremental == nil then
			incremental = true
		end
		--[[
			let info = new TweenInfo(.1, Enum.EasingStyle.Quad, Enum.EasingDirection.InOut);
			let infoClose = new TweenInfo(.2, Enum.EasingStyle.Quad, Enum.EasingDirection.InOut);
			coroutine.wrap(() => {
			TweenService.Create(this.spring, info, {
			Value: force / 2 + (incremental? this.spring.Value: 0)
			}).Play();
			this.lastshove = tick();
			task.wait(length);
			if (tick() - this.lastshove >= 1) {
			TweenService.Create(this.spring, infoClose, {
			Value: 0
			}).Play();
			}
			})()
		]]
		self.elastic.s = 10
		self.elastic.d = 1
		self.elastic:Accelerate(force * 10)
		self.lastshove = tick()
		coroutine.wrap(function()
			task.wait(length)
			if tick() - self.lastshove > .25 then
			end
		end)()
		-- examine some recoil scripts
		-- this.recoil.shove(new Vector3(force, 0, 0));
	end
end
return {
	default = crosshairController,
}
