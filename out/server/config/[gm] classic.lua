-- Compiled with roblox-ts v1.2.3
local TS = require(game:GetService("ReplicatedStorage"):WaitForChild("rbxts_include"):WaitForChild("RuntimeLib"))
local _matchservice = TS.import(script, game:GetService("ReplicatedStorage"), "TS", "services", "matchservice")
local teamRoles = _matchservice.teamRoles
local teams = _matchservice.teams
local classicRound = TS.import(script, game:GetService("ServerScriptService"), "TS", "config", "rounds", "classic").default
local classicRoundLoop
do
	classicRoundLoop = setmetatable({}, {
		__tostring = function()
			return "classicRoundLoop"
		end,
	})
	classicRoundLoop.__index = classicRoundLoop
	function classicRoundLoop.new(...)
		local self = setmetatable({}, classicRoundLoop)
		return self:constructor(...) or self
	end
	function classicRoundLoop:constructor(clientData)
		self.currentRound = 1
		self.pointsToWin = 3
		self.rounds = {}
		self.teamPoints = {
			[teams.alpha] = 0,
			[teams.beta] = 0,
			[teams.bot] = 0,
		}
		self.teamRoles = {
			[teams.alpha] = teamRoles.attack,
			[teams.beta] = teamRoles.defend,
			[teams.bot] = teamRoles.void,
		}
		self.teamMembers = {
			[teams.alpha] = {},
			[teams.beta] = {},
			[teams.bot] = {},
		}
		self.clientData = clientData
		local teamHasReachedGoal = false
		coroutine.wrap(function()
			while not teamHasReachedGoal do
				local round = self:newRound()
				while not round.roundEnded do
					task.wait()
				end
			end
		end)()
	end
	function classicRoundLoop:newRound()
		local round = classicRound.new(self)
		local _rounds = self.rounds
		local _round = round
		-- ▼ Array.push ▼
		_rounds[#_rounds + 1] = _round
		-- ▲ Array.push ▲
		self.currentRound += 1
		return round
	end
	function classicRoundLoop:getRound()
		return self.rounds[self.currentRound - 2 + 1]
	end
	function classicRoundLoop:setPlayerWithBomb(player, skipAll)
		if skipAll == nil then
			skipAll = false
		end
		local round = self:getRound()
		if not skipAll then
			if not round.bombCanBePickedUp then
				return nil
			end
		end
		round.playerWithBomb = player
	end
	function classicRoundLoop:dropBomb(player, skipAll)
		if skipAll == nil then
			skipAll = false
		end
		local round = self:getRound()
		if not skipAll then
			round.playerWithBomb = nil
		elseif round.playerWithBomb == player then
			round.playerWithBomb = nil
		end
	end
	function classicRoundLoop:isPlayerAlive(player)
		local round = self:getRound()
	end
end
return {
	default = classicRoundLoop,
}
