-- Compiled with roblox-ts v1.2.3
local TS = require(game:GetService("ReplicatedStorage"):WaitForChild("rbxts_include"):WaitForChild("RuntimeLib"))
local _services = TS.import(script, TS.getModule(script, "@rbxts", "services"))
local UserInputService = _services.UserInputService
local Workspace = _services.Workspace
local UISCONTROLLER
do
	UISCONTROLLER = setmetatable({}, {
		__tostring = function()
			return "UISCONTROLLER"
		end,
	})
	UISCONTROLLER.__index = UISCONTROLLER
	function UISCONTROLLER.new(...)
		local self = setmetatable({}, UISCONTROLLER)
		return self:constructor(...) or self
	end
	function UISCONTROLLER:constructor()
		self._uisevents = {}
		self._whenKeyLifted = {}
		self._whenKeyPressed = {}
		self._uisevents.inputBegan = UserInputService.InputBegan:Connect(function(input, gp)
			local __whenKeyPressed = self._whenKeyPressed
			local _keyCode = input.KeyCode
			local _condition = __whenKeyPressed[_keyCode] ~= nil
			if not _condition then
				local __whenKeyPressed_1 = self._whenKeyPressed
				local _userInputType = input.UserInputType
				_condition = __whenKeyPressed_1[_userInputType] ~= nil
			end
			if _condition then
				local __whenKeyPressed_1 = self._whenKeyPressed
				local _keyCode_1 = input.KeyCode
				local _condition_1 = __whenKeyPressed_1[_keyCode_1]
				if not _condition_1 then
					local __whenKeyPressed_2 = self._whenKeyPressed
					local _userInputType = input.UserInputType
					_condition_1 = __whenKeyPressed_2[_userInputType]
				end
				local events = _condition_1
				local _result = events
				if _result ~= nil then
					local _arg0 = function(v)
						if not v.alive then
							local _result_1 = events
							if _result_1 ~= nil then
								local _result_2 = events
								if _result_2 ~= nil then
									_result_2 = (table.find(_result_2, v) or 0) - 1
								end
								table.remove(_result_1, _result_2 + 1)
							end
							return nil
						end
						coroutine.wrap(v.callback)(gp, tick())
					end
					-- ▼ ReadonlyArray.forEach ▼
					for _k, _v in ipairs(_result) do
						_arg0(_v, _k - 1, _result)
					end
					-- ▲ ReadonlyArray.forEach ▲
				end
			end
		end)
		self._uisevents.inputEnded = UserInputService.InputEnded:Connect(function(input)
			local __whenKeyLifted = self._whenKeyLifted
			local _keyCode = input.KeyCode
			local _condition = __whenKeyLifted[_keyCode] ~= nil
			if not _condition then
				local __whenKeyLifted_1 = self._whenKeyLifted
				local _userInputType = input.UserInputType
				_condition = __whenKeyLifted_1[_userInputType] ~= nil
			end
			if _condition then
				local __whenKeyLifted_1 = self._whenKeyLifted
				local _keyCode_1 = input.KeyCode
				local _condition_1 = __whenKeyLifted_1[_keyCode_1]
				if not _condition_1 then
					local __whenKeyLifted_2 = self._whenKeyLifted
					local _userInputType = input.UserInputType
					_condition_1 = __whenKeyLifted_2[_userInputType]
				end
				local events = _condition_1
				local _result = events
				if _result ~= nil then
					local _arg0 = function(v)
						if not v.alive then
							local _result_1 = events
							if _result_1 ~= nil then
								local _result_2 = events
								if _result_2 ~= nil then
									_result_2 = (table.find(_result_2, v) or 0) - 1
								end
								table.remove(_result_1, _result_2 + 1)
							end
							return nil
						end
						coroutine.wrap(v.callback)(false, tick())
					end
					-- ▼ ReadonlyArray.forEach ▼
					for _k, _v in ipairs(_result) do
						_arg0(_v, _k - 1, _result)
					end
					-- ▲ ReadonlyArray.forEach ▲
				end
			end
		end)
	end
	function UISCONTROLLER:whenKeyPressed(input, callback)
		local c = {
			callback = callback,
			disconnect = function(self)
				self.alive = false
			end,
			alive = true,
		}
		local r = (self._whenKeyPressed[input] or {})
		local _r = r
		local _c = c
		-- ▼ Array.push ▼
		_r[#_r + 1] = _c
		-- ▲ Array.push ▲
		local __whenKeyPressed = self._whenKeyPressed
		local _r_1 = r
		-- ▼ Map.set ▼
		__whenKeyPressed[input] = _r_1
		-- ▲ Map.set ▲
	end
	function UISCONTROLLER:whenKeyLifted(input, callback)
		local c = {
			callback = callback,
			disconnect = function(self)
				self.alive = false
			end,
			alive = true,
		}
		local r = (self._whenKeyLifted[input] or {})
		local _r = r
		local _c = c
		-- ▼ Array.push ▼
		_r[#_r + 1] = _c
		-- ▲ Array.push ▲
		local __whenKeyLifted = self._whenKeyLifted
		local _r_1 = r
		-- ▼ Map.set ▼
		__whenKeyLifted[input] = _r_1
		-- ▲ Map.set ▲
	end
	function UISCONTROLLER:getCurrentMovementVector(humanoid)
		local camera = Workspace.CurrentCamera
		local direction = camera.CFrame:VectorToObjectSpace(humanoid.MoveDirection)
		local x = math.clamp(math.round(direction.X), -1, 1)
		local y = math.clamp(math.round(direction.Y), -1, 1)
		local z = math.clamp(math.round(direction.Z), -1, 1)
		direction = Vector3.new(x, y, z)
		return direction
	end
end
return {
	default = UISCONTROLLER,
}
