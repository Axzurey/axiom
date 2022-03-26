-- Compiled with roblox-ts v1.2.3
local world = {}
do
	local _container = world
	local entityType
	do
		local _inverse = {}
		entityType = setmetatable({}, {
			__index = _inverse,
		})
		entityType.Player = 0
		_inverse[0] = "Player"
		entityType.Bot = 1
		_inverse[1] = "Bot"
	end
	_container.entityType = entityType
	local team
	do
		local _inverse = {}
		team = setmetatable({}, {
			__index = _inverse,
		})
		team.red = 0
		_inverse[0] = "red"
		team.blue = 1
		_inverse[1] = "blue"
	end
	_container.team = team
	local teamType
	do
		local _inverse = {}
		teamType = setmetatable({}, {
			__index = _inverse,
		})
		teamType.defenders = 0
		_inverse[0] = "defenders"
		teamType.attackers = 1
		_inverse[1] = "attackers"
	end
	_container.teamType = teamType
	local function playerFiringRemoteThatIsntTheirs(client)
		print(client.Name .. " is doing illegal things")
	end
	_container.playerFiringRemoteThatIsntTheirs = playerFiringRemoteThatIsntTheirs
	local function playerPositionDiffTooHigh(client)
		print(client.Name .. " is movin too fast!")
	end
	_container.playerPositionDiffTooHigh = playerPositionDiffTooHigh
	local function playerPositionDeltaTooHigh(client)
		print(client.Name .. " has a high position delta(maybe they're lagging?)")
	end
	_container.playerPositionDeltaTooHigh = playerPositionDeltaTooHigh
	local entityKillConnections = {}
	local entityKilled
	do
		entityKilled = {}
		function entityKilled:constructor()
		end
		function entityKilled:connect(callback)
			local t
			t = {
				disconnect = function()
					local _entityKillConnections = entityKillConnections
					local _t = t
					local i = (table.find(_entityKillConnections, _t) or 0) - 1
					if i ~= -1 then
						local _entityKillConnections_1 = entityKillConnections
						local _i = i
						table.remove(_entityKillConnections_1, _i + 1)
					end
				end,
				callback = callback,
			}
			local _entityKillConnections = entityKillConnections
			local _t = t
			-- ▼ Array.push ▼
			_entityKillConnections[#_entityKillConnections + 1] = _t
			-- ▲ Array.push ▲
			return t
		end
		function entityKilled:entityDied(killer, killed, entityType, hitLocation)
			local _entityKillConnections = entityKillConnections
			local _arg0 = function(v)
				coroutine.wrap(function()
					v.callback(killer, killed, entityType, hitLocation)
				end)()
			end
			-- ▼ ReadonlyArray.forEach ▼
			for _k, _v in ipairs(_entityKillConnections) do
				_arg0(_v, _k - 1, _entityKillConnections)
			end
			-- ▲ ReadonlyArray.forEach ▲
		end
	end
	_container.entityKilled = entityKilled
	local roundEnded
	do
		roundEnded = {}
		function roundEnded:constructor()
		end
	end
	_container.roundEnded = roundEnded
end
return world
