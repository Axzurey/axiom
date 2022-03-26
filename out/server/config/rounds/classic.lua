-- Compiled with roblox-ts v1.2.3
local TS = require(game:GetService("ReplicatedStorage"):WaitForChild("rbxts_include"):WaitForChild("RuntimeLib"))
local _services = TS.import(script, TS.getModule(script, "@rbxts", "services"))
local Workspace = _services.Workspace
local ReplicatedStorage = _services.ReplicatedStorage
local RunService = _services.RunService
local minerva = TS.import(script, game:GetService("ReplicatedStorage"), "TS", "minerva")
local _matchservice = TS.import(script, game:GetService("ReplicatedStorage"), "TS", "services", "matchservice")
local matchService = _matchservice
local roundStates = _matchservice.roundStates
local teams = _matchservice.teams
local stateLengths = _matchservice.stateLengths
local classicRound
do
	classicRound = setmetatable({}, {
		__tostring = function()
			return "classicRound"
		end,
	})
	classicRound.__index = classicRound
	function classicRound.new(...)
		local self = setmetatable({}, classicRound)
		return self:constructor(...) or self
	end
	function classicRound:constructor(parent)
		self.timer = 0
		self.roundEnded = false
		self.playerWithBomb = nil
		self.bombPlanted = false
		self.bombDefused = false
		self.bombBeingPlanted = false
		self.bombBeingDefused = false
		self.timeBombStartedBeingPlanted = 0
		self.timeBombStartedBeingDefused = 0
		self.timeBombWasPlanted = 0
		self.timeBombWasDefused = 0
		self.playerThatPlantedBomb = nil
		self.playerThatDefusedBomb = nil
		self.playerPlantingBomb = nil
		self.playerDefusingBomb = nil
		self.bombCanBePickedUp = false
		self.roundState = "selection"
		self.parent = parent
		self:nextState("selection")
		local c = RunService.Heartbeat:Connect(function(dt)
			self.timer = math.clamp(self.timer - 1 * dt, 0, self.timer)
			matchService.timerUpdated:activate(self.timer)
			for i, v in pairs(self.parent.teamMembers) do
				if i == teams.bot then
					continue
				end
				local alivePlayers = 0
				local _v = v
				local _arg0 = function(x)
					local userdata = self.parent.clientData[x.UserId]
					if userdata.charClass.alive then
						alivePlayers += 1
					end
				end
				-- ▼ ReadonlyArray.forEach ▼
				for _k, _v_1 in ipairs(_v) do
					_arg0(_v_1, _k - 1, _v)
				end
				-- ▲ ReadonlyArray.forEach ▲
				if alivePlayers < 1 then
				end
			end
			if self.timer <= 0 then
				if self.roundState == "action" and self.bombBeingPlanted then
					return nil
				end
				self:nextState()
			end
		end)
	end
	function classicRound:nextState(override)
		local _roundState = self.roundState
		local index = (table.find(roundStates, _roundState) or 0) - 1
		local nextIndex = index + 1
		if roundStates[nextIndex + 1] == "planted" then
			nextIndex += 1
		end
		if index == #roundStates - 1 then
			nextIndex = 0
		end
		if override then
			self.roundState = override
		else
			self.roundState = roundStates[nextIndex + 1]
		end
		if self.roundState == "selection" then
		elseif self.roundState == "roundEnding" then
		end
		matchService.roundStateUpdated:activate(self.roundState)
		self.timer = stateLengths[self.roundState]
	end
	function classicRound:startBombPlant(player)
		if self.bombPlanted then
			return nil
		end
		if not player.Character then
			return nil
		end
		local p = Workspace:GetPartBoundsInBox(player.Character:GetPrimaryPartCFrame(), Vector3.new(.1, .1, .1))
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
		-- check if the part is the part selected to be the bomb
		if self.bombBeingPlanted then
			error("player " .. (self.playerPlantingBomb and self.playerPlantingBomb.Name or "[can not find name]") .. " is already planting the bomb")
		end
		if self.bombPlanted then
			error("bomb has already been planted")
		end
		if foundSite then
			self.playerPlantingBomb = player
			self.bombBeingPlanted = true
			self.timeBombStartedBeingPlanted = tick()
			matchService.playerStartsPlantingBomb:activate(player.Name, self.timeBombWasPlanted)
		else
			error("player is not inside the bomb site bounds")
		end
	end
	function classicRound:cancelBombPlant(player, overwrite)
		if overwrite == nil then
			overwrite = false
		end
		if self.bombBeingPlanted then
			if (player and self.playerPlantingBomb == player) or overwrite then
				self.playerPlantingBomb = nil
				self.bombBeingPlanted = false
				self.timeBombStartedBeingPlanted = 0
				matchService.playerCancelsPlantingBomb:activate(player and player.Name or minerva.serverName, self.timeBombStartedBeingPlanted)
			else
				error("you are not the player planting the bomb")
			end
		else
			error("no player is planting the bomb")
		end
	end
	function classicRound:completeBombPlant(player)
		if player ~= self.playerPlantingBomb then
			error("player cant finish a plant they didnt start")
		end
		local timeDifference = tick() - self.timeBombStartedBeingPlanted
		local dfs = 0.75
		if timeDifference < minerva.bombPlantTime - dfs then
			error("player is taking too short a time to plant the bomb[" .. tostring(timeDifference) .. "]")
		else
			if self.playerPlantingBomb then
				self.timeBombWasPlanted = tick()
				self.playerPlantingBomb = nil
				self.bombBeingPlanted = false
				self.bombPlanted = true
				if not player.Character then
					return nil
				end
				local ignore = RaycastParams.new()
				ignore.FilterDescendantsInstances = { Workspace:FindFirstChild("ignore"), player.Character }
				local _fn = Workspace
				local _result = player.Character
				if _result ~= nil then
					_result = _result:GetPrimaryPartCFrame().Position
				end
				local result = _fn:Raycast(_result, Vector3.new(0, -10, 0), ignore)
				if not result then
					error("no result for bomb plant completion")
				end
				-- FINISH THIS;
				local position = result.Position
				matchService.playerFinishesPlantingBomb:activate(player.Name, self.timeBombWasPlanted)
				local _result_1 = ReplicatedStorage:FindFirstChild("gameModels")
				if _result_1 ~= nil then
					_result_1 = _result_1:FindFirstChild("bomb_active")
				end
				local bomb = _result_1
				minerva.bombActivationSequence(bomb)
				bomb:SetPrimaryPartCFrame(CFrame.new(position))
				bomb.Parent = Workspace
				self.playerThatPlantedBomb = player
				self:nextState("planted")
			else
				error("no player is planting the bomb")
			end
		end
	end
	function classicRound:startBombDefuse(player)
		local char = player.Character
		if not char then
			return nil
		end
		local box = Workspace:GetPartBoundsInBox(char:GetPrimaryPartCFrame(), Vector3.new(minerva.defuseRange, minerva.defuseRange, minerva.defuseRange))
		local bombFound = false
		local _box = box
		local _arg0 = function(v)
			if v.Name == minerva.bombName then
				bombFound = true
			end
		end
		-- ▼ ReadonlyArray.forEach ▼
		for _k, _v in ipairs(_box) do
			_arg0(_v, _k - 1, _box)
		end
		-- ▲ ReadonlyArray.forEach ▲
		if bombFound then
			-- check if player is on the right team
			if self.playerDefusingBomb then
				error("player [" .. player.Name .. "] is already defusing the bomb")
			elseif self.bombBeingDefused then
				error("[unknown] is already defusing the bomb")
			else
				if self.bombDefused then
					error("Bomb has already been defused")
				else
					self.playerDefusingBomb = player
					self.timeBombStartedBeingDefused = tick()
					self.bombBeingDefused = true
					matchService.playerStartsDefusingBomb:activate(player.Name, self.timeBombStartedBeingDefused)
				end
			end
		else
			error("bomb can not be found around the player")
		end
	end
	function classicRound:cancelBombDefuse(player, overwrite)
		if overwrite == nil then
			overwrite = false
		end
		if self.bombBeingDefused then
			if (player and self.playerDefusingBomb == player) or overwrite then
				self.playerDefusingBomb = nil
				self.bombBeingDefused = false
				self.timeBombStartedBeingDefused = 0
				matchService.playerCancelsDefusingBomb:activate(player and player.Name or minerva.serverName, self.timeBombStartedBeingDefused)
			else
				error("you are not the player defusing the bomb")
			end
		else
			error("no player is defusing the bomb")
		end
	end
	function classicRound:completeBombDefuse(player)
		if player ~= self.playerDefusingBomb then
			error("player cant finish a defuse they didnt start")
		end
		local tdiff = tick() - self.timeBombStartedBeingDefused
		local dsf = .75
		if tdiff < minerva.bombDefuseTime - dsf then
			error("player is taking too short a time to defuse the bomb[" .. tostring(tdiff) .. "]")
		else
			if self.playerDefusingBomb then
				self.timeBombWasDefused = tick()
				self.playerDefusingBomb = nil
				self.bombDefused = true
				matchService.playerFinishesDefusingBomb:activate(player.Name, self.timeBombWasDefused)
				self.playerThatDefusedBomb = player
			else
				error("no player is defusing the bomb")
			end
		end
	end
	function classicRound:endRound()
		self.roundEnded = true
	end
end
return {
	default = classicRound,
}
