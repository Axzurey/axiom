-- Compiled with roblox-ts v1.2.3
local TS = require(game:GetService("ReplicatedStorage"):WaitForChild("rbxts_include"):WaitForChild("RuntimeLib"))
local connection = TS.import(script, game:GetService("ReplicatedStorage"), "TS", "connections", "sohkConnection").default
local clientService = {}
do
	local _container = clientService
	local createCamera
	do
		local super = connection()
		createCamera = setmetatable({}, {
			__tostring = function()
				return "createCamera"
			end,
			__index = super,
		})
		createCamera.__index = createCamera
		function createCamera.new(...)
			local self = setmetatable({}, createCamera)
			return self:constructor(...) or self
		end
		function createCamera:constructor(...)
			super.constructor(self, ...)
		end
		createCamera.selfName = "createCamera"
	end
	_container.createCamera = createCamera
	local cameraOrientationUpdated
	do
		local super = connection()
		cameraOrientationUpdated = setmetatable({}, {
			__tostring = function()
				return "cameraOrientationUpdated"
			end,
			__index = super,
		})
		cameraOrientationUpdated.__index = cameraOrientationUpdated
		function cameraOrientationUpdated.new(...)
			local self = setmetatable({}, cameraOrientationUpdated)
			return self:constructor(...) or self
		end
		function cameraOrientationUpdated:constructor(...)
			super.constructor(self, ...)
		end
		cameraOrientationUpdated.selfName = "cameraOrientationUpdated"
	end
	_container.cameraOrientationUpdated = cameraOrientationUpdated
	local cameraControllerUpdated
	do
		local super = connection()
		cameraControllerUpdated = setmetatable({}, {
			__tostring = function()
				return "cameraControllerUpdated"
			end,
			__index = super,
		})
		cameraControllerUpdated.__index = cameraControllerUpdated
		function cameraControllerUpdated.new(...)
			local self = setmetatable({}, cameraControllerUpdated)
			return self:constructor(...) or self
		end
		function cameraControllerUpdated:constructor(...)
			super.constructor(self, ...)
		end
		cameraControllerUpdated.selfName = "cameraControllerUpdated"
	end
	_container.cameraControllerUpdated = cameraControllerUpdated
end
return clientService
