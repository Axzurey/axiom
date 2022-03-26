-- Compiled with roblox-ts v1.2.3
local TS = require(game:GetService("ReplicatedStorage"):WaitForChild("rbxts_include"):WaitForChild("RuntimeLib"))
local connection = TS.import(script, game:GetService("ReplicatedStorage"), "TS", "connections", "sohkConnection").default
local matchService = {}
do
	local _container = matchService
	local damagableWeapons
	do
		local _inverse = {}
		damagableWeapons = setmetatable({}, {
			__index = _inverse,
		})
		damagableWeapons.mpx = 0
		_inverse[0] = "mpx"
		damagableWeapons.knife = 1
		_inverse[1] = "knife"
		damagableWeapons.greekfire = 2
		_inverse[2] = "greekfire"
	end
	_container.damagableWeapons = damagableWeapons
	local naturalDamage
	do
		local _inverse = {}
		naturalDamage = setmetatable({}, {
			__index = _inverse,
		})
		naturalDamage.height = 0
		_inverse[0] = "height"
	end
	_container.naturalDamage = naturalDamage
	local teams
	do
		local _inverse = {}
		teams = setmetatable({}, {
			__index = _inverse,
		})
		teams.alpha = 0
		_inverse[0] = "alpha"
		teams.beta = 1
		_inverse[1] = "beta"
		teams.bot = 2
		_inverse[2] = "bot"
	end
	_container.teams = teams
	local teamRoles
	do
		local _inverse = {}
		teamRoles = setmetatable({}, {
			__index = _inverse,
		})
		teamRoles.defend = 0
		_inverse[0] = "defend"
		teamRoles.attack = 1
		_inverse[1] = "attack"
		teamRoles.void = 2
		_inverse[2] = "void"
	end
	_container.teamRoles = teamRoles
	local damageType
	do
		local _inverse = {}
		damageType = setmetatable({}, {
			__index = _inverse,
		})
		damageType.penetration = 0
		_inverse[0] = "penetration"
		damageType.explosion = 1
		_inverse[1] = "explosion"
		damageType.fire = 2
		_inverse[2] = "fire"
		damageType.falling = 3
		_inverse[3] = "falling"
	end
	_container.damageType = damageType
	local roundStateConversions = {
		action = "Action Phase",
		planted = "Bomb Planted",
		prep = "Preperation Phase",
		roundEnding = "Round Ended",
		selection = "Selection Phase",
	}
	_container.roundStateConversions = roundStateConversions
	local roundStates = { "selection", "prep", "action", "planted", "roundEnding" }
	_container.roundStates = roundStates
	local stateLengths = {
		selection = 10,
		prep = 10,
		action = 10,
		planted = 10,
		roundEnding = 5,
	}
	_container.stateLengths = stateLengths
	--[[
		*
		* time planted would be in unix time using tick()
	]]
	local timerUpdated
	do
		local super = connection()
		timerUpdated = setmetatable({}, {
			__tostring = function()
				return "timerUpdated"
			end,
			__index = super,
		})
		timerUpdated.__index = timerUpdated
		function timerUpdated.new(...)
			local self = setmetatable({}, timerUpdated)
			return self:constructor(...) or self
		end
		function timerUpdated:constructor(...)
			super.constructor(self, ...)
		end
		timerUpdated.selfName = "timerUpdate"
	end
	_container.timerUpdated = timerUpdated
	local roundStateUpdated
	do
		local super = connection()
		roundStateUpdated = setmetatable({}, {
			__tostring = function()
				return "roundStateUpdated"
			end,
			__index = super,
		})
		roundStateUpdated.__index = roundStateUpdated
		function roundStateUpdated.new(...)
			local self = setmetatable({}, roundStateUpdated)
			return self:constructor(...) or self
		end
		function roundStateUpdated:constructor(...)
			super.constructor(self, ...)
		end
		roundStateUpdated.selfName = "roundState"
	end
	_container.roundStateUpdated = roundStateUpdated
	local playerFinishesDefusingBomb
	do
		local super = connection()
		playerFinishesDefusingBomb = setmetatable({}, {
			__tostring = function()
				return "playerFinishesDefusingBomb"
			end,
			__index = super,
		})
		playerFinishesDefusingBomb.__index = playerFinishesDefusingBomb
		function playerFinishesDefusingBomb.new(...)
			local self = setmetatable({}, playerFinishesDefusingBomb)
			return self:constructor(...) or self
		end
		function playerFinishesDefusingBomb:constructor(...)
			super.constructor(self, ...)
		end
		playerFinishesDefusingBomb.selfName = "playerFinishesDefusingBomb"
	end
	_container.playerFinishesDefusingBomb = playerFinishesDefusingBomb
	local playerStartsDefusingBomb
	do
		local super = connection()
		playerStartsDefusingBomb = setmetatable({}, {
			__tostring = function()
				return "playerStartsDefusingBomb"
			end,
			__index = super,
		})
		playerStartsDefusingBomb.__index = playerStartsDefusingBomb
		function playerStartsDefusingBomb.new(...)
			local self = setmetatable({}, playerStartsDefusingBomb)
			return self:constructor(...) or self
		end
		function playerStartsDefusingBomb:constructor(...)
			super.constructor(self, ...)
		end
		playerStartsDefusingBomb.selfName = "playerStartsDefusingBomb"
	end
	_container.playerStartsDefusingBomb = playerStartsDefusingBomb
	local playerCancelsDefusingBomb
	do
		local super = connection()
		playerCancelsDefusingBomb = setmetatable({}, {
			__tostring = function()
				return "playerCancelsDefusingBomb"
			end,
			__index = super,
		})
		playerCancelsDefusingBomb.__index = playerCancelsDefusingBomb
		function playerCancelsDefusingBomb.new(...)
			local self = setmetatable({}, playerCancelsDefusingBomb)
			return self:constructor(...) or self
		end
		function playerCancelsDefusingBomb:constructor(...)
			super.constructor(self, ...)
		end
		playerCancelsDefusingBomb.selfName = "playerCancelsDefusingBomb"
	end
	_container.playerCancelsDefusingBomb = playerCancelsDefusingBomb
	local playerFinishesPlantingBomb
	do
		local super = connection()
		playerFinishesPlantingBomb = setmetatable({}, {
			__tostring = function()
				return "playerFinishesPlantingBomb"
			end,
			__index = super,
		})
		playerFinishesPlantingBomb.__index = playerFinishesPlantingBomb
		function playerFinishesPlantingBomb.new(...)
			local self = setmetatable({}, playerFinishesPlantingBomb)
			return self:constructor(...) or self
		end
		function playerFinishesPlantingBomb:constructor(...)
			super.constructor(self, ...)
		end
		playerFinishesPlantingBomb.selfName = "playerFinishesPlantingBomb"
	end
	_container.playerFinishesPlantingBomb = playerFinishesPlantingBomb
	local playerStartsPlantingBomb
	do
		local super = connection()
		playerStartsPlantingBomb = setmetatable({}, {
			__tostring = function()
				return "playerStartsPlantingBomb"
			end,
			__index = super,
		})
		playerStartsPlantingBomb.__index = playerStartsPlantingBomb
		function playerStartsPlantingBomb.new(...)
			local self = setmetatable({}, playerStartsPlantingBomb)
			return self:constructor(...) or self
		end
		function playerStartsPlantingBomb:constructor(...)
			super.constructor(self, ...)
		end
		playerStartsPlantingBomb.selfName = "playerStartsPlantingBomb"
	end
	_container.playerStartsPlantingBomb = playerStartsPlantingBomb
	local playerCancelsPlantingBomb
	do
		local super = connection()
		playerCancelsPlantingBomb = setmetatable({}, {
			__tostring = function()
				return "playerCancelsPlantingBomb"
			end,
			__index = super,
		})
		playerCancelsPlantingBomb.__index = playerCancelsPlantingBomb
		function playerCancelsPlantingBomb.new(...)
			local self = setmetatable({}, playerCancelsPlantingBomb)
			return self:constructor(...) or self
		end
		function playerCancelsPlantingBomb:constructor(...)
			super.constructor(self, ...)
		end
		playerCancelsPlantingBomb.selfName = "playerCancelsPlantingBomb"
	end
	_container.playerCancelsPlantingBomb = playerCancelsPlantingBomb
	local playerSendsChatMessage
	do
		local super = connection()
		playerSendsChatMessage = setmetatable({}, {
			__tostring = function()
				return "playerSendsChatMessage"
			end,
			__index = super,
		})
		playerSendsChatMessage.__index = playerSendsChatMessage
		function playerSendsChatMessage.new(...)
			local self = setmetatable({}, playerSendsChatMessage)
			return self:constructor(...) or self
		end
		function playerSendsChatMessage:constructor(...)
			super.constructor(self, ...)
		end
		playerSendsChatMessage.selfName = "playerSendsChatMessage"
	end
	_container.playerSendsChatMessage = playerSendsChatMessage
	local playerDies
	do
		local super = connection()
		playerDies = setmetatable({}, {
			__tostring = function()
				return "playerDies"
			end,
			__index = super,
		})
		playerDies.__index = playerDies
		function playerDies.new(...)
			local self = setmetatable({}, playerDies)
			return self:constructor(...) or self
		end
		function playerDies:constructor(...)
			super.constructor(self, ...)
		end
		playerDies.selfName = "playerGetsKill"
	end
	_container.playerDies = playerDies
	local roundEnded
	do
		local super = connection()
		roundEnded = setmetatable({}, {
			__tostring = function()
				return "roundEnded"
			end,
			__index = super,
		})
		roundEnded.__index = roundEnded
		function roundEnded.new(...)
			local self = setmetatable({}, roundEnded)
			return self:constructor(...) or self
		end
		function roundEnded:constructor(...)
			super.constructor(self, ...)
		end
		roundEnded.selfName = "teamGetsPoint"
	end
	_container.roundEnded = roundEnded
	local playerStatsUpdated
	do
		local super = connection()
		playerStatsUpdated = setmetatable({}, {
			__tostring = function()
				return "playerStatsUpdated"
			end,
			__index = super,
		})
		playerStatsUpdated.__index = playerStatsUpdated
		function playerStatsUpdated.new(...)
			local self = setmetatable({}, playerStatsUpdated)
			return self:constructor(...) or self
		end
		function playerStatsUpdated:constructor(...)
			super.constructor(self, ...)
		end
		playerStatsUpdated.selfName = "playerStatsUpdated"
	end
	_container.playerStatsUpdated = playerStatsUpdated
	local playerDropsBomb
	do
		local super = connection()
		playerDropsBomb = setmetatable({}, {
			__tostring = function()
				return "playerDropsBomb"
			end,
			__index = super,
		})
		playerDropsBomb.__index = playerDropsBomb
		function playerDropsBomb.new(...)
			local self = setmetatable({}, playerDropsBomb)
			return self:constructor(...) or self
		end
		function playerDropsBomb:constructor(...)
			super.constructor(self, ...)
		end
		playerDropsBomb.selfName = "playerDropsBomb"
	end
	_container.playerDropsBomb = playerDropsBomb
	local playerPicksUpBomb
	do
		local super = connection()
		playerPicksUpBomb = setmetatable({}, {
			__tostring = function()
				return "playerPicksUpBomb"
			end,
			__index = super,
		})
		playerPicksUpBomb.__index = playerPicksUpBomb
		function playerPicksUpBomb.new(...)
			local self = setmetatable({}, playerPicksUpBomb)
			return self:constructor(...) or self
		end
		function playerPicksUpBomb:constructor(...)
			super.constructor(self, ...)
		end
		playerPicksUpBomb.selfName = "playerPicksUpBomb"
	end
	_container.playerPicksUpBomb = playerPicksUpBomb
end
return matchService
