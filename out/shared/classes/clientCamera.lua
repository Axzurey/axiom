-- Compiled with roblox-ts v1.2.3
local TS = require(game:GetService("ReplicatedStorage"):WaitForChild("rbxts_include"):WaitForChild("RuntimeLib"))
local get_camera_controlling_protocol = TS.import(script, game:GetService("ReplicatedStorage"), "TS", "protocols", "get_camera_controlling_protocol")
local sohk = TS.import(script, game:GetService("ReplicatedStorage"), "TS", "sohk").default
local clientCamera = {}
do
	local _container = clientCamera
	local camera
	do
		local super = sohk.sohkComponent
		camera = setmetatable({}, {
			__tostring = function()
				return "camera"
			end,
			__index = super,
		})
		camera.__index = camera
		function camera.new(...)
			local self = setmetatable({}, camera)
			return self:constructor(...) or self
		end
		function camera:constructor(id, config)
			super.constructor(self)
			self.owner = nil
			self.controlling = nil
			self.cameraId = "unknown camera"
			self.currentlyUsing = false
			self.config = config
			self.owner = config.owner
			self.cameraId = id
			self.instance = config.instance
			self.originalOrientation = config.originalOrientation
			self.localCameraCFrame = self.instance.view.CFrame
			self.localOrientation = config.originalOrientation
		end
		function camera:joinCamera()
			self.instance.view.LocalTransparencyModifier = 1
			self.currentlyUsing = true
			self.replicationService.remotes.act:FireServer("joinCamera", self.cameraId)
		end
		function camera:leaveCamera()
			self.instance.view.LocalTransparencyModifier = 0
			self.currentlyUsing = false
			self.replicationService.remotes.act:FireServer("leaveCamera", self.cameraId)
		end
		function camera:getCFrame()
			coroutine.wrap(function()
				self.controlling = get_camera_controlling_protocol:queryServer(self.cameraId)
			end)()
			if true then
				local pos = self.localCameraCFrame.Position
				local orientation = self.localOrientation
				local _cFrame = CFrame.new(pos)
				local _arg0 = CFrame.Angles(0, math.rad(orientation.X), 0)
				local _arg0_1 = CFrame.Angles(math.rad(orientation.Y), 0, 0)
				return _cFrame * _arg0 * _arg0_1
			else
				return self.instance.view.CFrame
			end
		end
		function camera:getOrientation()
			if true then
				return self.localOrientation
			else
				return self.instance.view.Orientation
			end
		end
		function camera:setOrientation(orientationDelta)
			-- if (this.controlling !== Players.LocalPlayer) return;
			local _binding = { orientationDelta.X + self.localOrientation.X, orientationDelta.Y + self.localOrientation.Y }
			local rx = _binding[1]
			local ry = _binding[2]
			rx = math.clamp(rx, self.originalOrientation.X - self.config.maxDown, self.originalOrientation.X + self.config.maxUp)
			ry = math.clamp(ry, self.originalOrientation.Y - self.config.maxLeft, self.originalOrientation.Y + self.config.maxRight)
			self.localOrientation = Vector3.new(rx, ry, self.originalOrientation.Z)
			self.replicationService.remotes.act:FireServer("updateCameraOrientation", self.cameraId, self.localOrientation)
		end
	end
	_container.camera = camera
end
return clientCamera
