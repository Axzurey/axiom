-- Compiled with roblox-ts v1.2.3
local TS = require(game:GetService("ReplicatedStorage"):WaitForChild("rbxts_include"):WaitForChild("RuntimeLib"))
local ContextActionService = TS.import(script, TS.getModule(script, "@rbxts", "services")).ContextActionService
local cameraConfig
do
	local _inverse = {}
	cameraConfig = setmetatable({}, {
		__index = _inverse,
	})
	local _value = math.huge
	cameraConfig.unlimited = _value
	_inverse[_value] = "unlimited"
end
local cameraController
do
	cameraController = setmetatable({}, {
		__tostring = function()
			return "cameraController"
		end,
	})
	cameraController.__index = cameraController
	function cameraController.new(...)
		local self = setmetatable({}, cameraController)
		return self:constructor(...) or self
	end
	function cameraController:constructor(cam, follow)
		self.locked = false
		self.headHeightOffset = 1
		self.cameraAngleX = 0
		self.cameraAngleY = 0
		self.maxAngleY = 80
		self.minAngleY = -80
		self.maxAngleX = cameraConfig.unlimited
		self.minAngleX = -cameraConfig.unlimited
		self.angularMultiplier = {
			x = 0,
			y = 0,
		}
		self.sensitivityMultiplierX = .75
		self.sensitivityMultiplierY = .75
		self.adornee = cam
		self.follow = follow
		self.currentCFrame = follow.CFrame
		self.lastCFrame = follow.CFrame
		local inputAction = ContextActionService:BindAction("cameraInput", function(actionName, state, input)
			if self.locked then
				return nil
			end
			if state == Enum.UserInputState.Change then
				self.cameraAngleX = math.clamp(self.cameraAngleX - input.Delta.X * self.sensitivityMultiplierX, self.minAngleX, self.maxAngleX)
				self.cameraAngleY = math.clamp(self.cameraAngleY - input.Delta.Y * .4 * self.sensitivityMultiplierY, self.minAngleY, self.maxAngleY)
			end
		end, false, Enum.UserInputType.MouseMovement)
	end
	function cameraController:getLast()
		return self.lastCFrame
	end
	function cameraController:setCFrame(cf)
		self.currentCFrame = cf
		self.adornee.CFrame = cf
	end
	function cameraController:render(beforeAngleDelta, afterAngleDelta)
		--[[
			this.adornee.CameraType = Enum.CameraType.Scriptable;
			this.lastCFrame = this.adornee.CFrame;
			UserInputService.MouseBehavior = Enum.MouseBehavior.LockCenter;
			let [followX, followY, followZ] = [this.follow.Position.X, this.follow.Position.Y, this.follow.Position.Z];
			let base = new CFrame(followX, followY + this.headHeightOffset, followZ);
			let final = base
			if (beforeAngleDelta) {
			beforeAngleDelta.forEach((v) => {
			final = final.mul(v);
			})
			}
			final = final
			.mul(CFrame.Angles(0, math.rad(this.cameraAngleX), 0))
			.mul(CFrame.Angles(math.rad(this.cameraAngleY), 0, 0))
			if (afterAngleDelta) {
			afterAngleDelta.forEach((v) => {
			final = final.mul(v);
			})
			}
			let [rx, ry, rz] = final.ToOrientation();
			final = new CFrame(final.Position).mul(CFrame.fromOrientation(rx, ry, rz));
			this.adornee.CFrame = final;
			this.currentCFrame = final;
			return [base.mul(CFrame.Angles(0, math.rad(this.cameraAngleX), 0))
			.mul(CFrame.Angles(math.rad(this.cameraAngleY), 0, 0)), final];
		]]
		local rx, ry, rz = self.adornee.CFrame:ToOrientation()
		rx = math.rad(math.clamp(math.deg(rx), self.minAngleX, self.maxAngleX))
		ry = math.rad(math.clamp(math.deg(ry), self.minAngleY, self.maxAngleY))
		local _cFrame = CFrame.new(self.adornee.CFrame.Position)
		local _arg0 = CFrame.fromOrientation(rx, ry, rz)
		self.adornee.CFrame = _cFrame * _arg0
	end
end
return {
	cameraConfig = cameraConfig,
	default = cameraController,
}
