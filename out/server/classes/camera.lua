-- Compiled with roblox-ts v1.2.3
local camera
do
	camera = setmetatable({}, {
		__tostring = function()
			return "camera"
		end,
	})
	camera.__index = camera
	function camera.new(...)
		local self = setmetatable({}, camera)
		return self:constructor(...) or self
	end
	function camera:constructor(id, config)
		self.playersOnCamera = {}
		self.owner = nil
		self.controlling = nil
		self.cameraId = "unknown camera"
		self.config = config
		self.owner = config.owner
		self.instance = config.instance
		self.cameraId = id
		self.originalOrientation = config.originalOrientation
		self.instance.view.Orientation = config.originalOrientation
	end
	function camera:playerAttemptsToControlCamera(player, orientation)
		if self.controlling == player then
			local rx = math.clamp(orientation.X, self.originalOrientation.X - self.config.maxDown, self.originalOrientation.X + self.config.maxUp)
			local ry = math.clamp(orientation.Y, self.originalOrientation.Y - self.config.maxLeft, self.originalOrientation.Y + self.config.maxRight)
			self.instance.view.Orientation = Vector3.new(rx, ry, self.originalOrientation.Z)
		end
	end
	function camera:playerStartsViewingCamera(player)
		print("player started controlling!")
		local _playersOnCamera = self.playersOnCamera
		-- ▼ Array.push ▼
		_playersOnCamera[#_playersOnCamera + 1] = player
		-- ▲ Array.push ▲
		if player == self.owner then
			self.controlling = player
			print("& owner")
		else
			local _condition = (table.find(self.playersOnCamera, player) or 0) - 1 == 0
			if _condition then
				local _condition_1 = not self.owner
				if not _condition_1 then
					local _playersOnCamera_1 = self.playersOnCamera
					local _owner = self.owner
					_condition_1 = (table.find(_playersOnCamera_1, _owner) or 0) - 1 == -1
				end
				_condition = _condition_1
			end
			if _condition then
				self.controlling = player
				print("& not owner")
			end
		end
		self.instance.view.Transparency = 0
	end
	function camera:playerStopsViewingCamera(player)
		print("player leaves")
		local index = (table.find(self.playersOnCamera, player) or 0) - 1
		if index ~= -1 then
			local _playersOnCamera = self.playersOnCamera
			local _index = index
			table.remove(_playersOnCamera, _index + 1)
		end
		if player == self.controlling then
			local zero = self.playersOnCamera[1]
			if zero then
				self.controlling = zero
			else
				self.controlling = nil
			end
		end
		if #self.playersOnCamera == 0 then
			self.instance.view.Transparency = 1
		end
	end
end
return {
	camera = camera,
}
