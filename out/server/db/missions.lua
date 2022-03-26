-- Compiled with roblox-ts v1.2.3
local TS = require(game:GetService("ReplicatedStorage"):WaitForChild("rbxts_include"):WaitForChild("RuntimeLib"))
local playerContacts = TS.import(script, game:GetService("ServerScriptService"), "TS", "float").playerContacts
local _world = TS.import(script, game:GetService("ServerScriptService"), "TS", "world")
local entityKilled = _world.entityKilled
local entityType = _world.entityType
local missions = {}
do
	local _container = missions
	local missions = { {
		name = "Sharp Shooter",
		goal = "get 10 headshot kills on players",
		startValue = 0,
		goalValue = 10,
		rewardAmount = 1000,
		rewardType = missionRewards.experience,
		listener = function(increment)
			local conn = entityKilled:connect(function(killer, killed, entity, hitLocation)
				if hitLocation == playerContacts.head and entity == entityType.Player then
					increment(1)
				end
			end)
			return {
				disconnect = function()
					conn.disconnect()
				end,
			}
		end,
	}, {
		name = "Trainee",
		goal = "kill 50 bots",
		startValue = 0,
		goalValue = 50,
		rewardAmount = 250,
		rewardType = missionRewards.credits,
		listener = function(increment)
			local conn = entityKilled:connect(function(killer, killed, entity, hitLocation)
				if entity == entityType.Bot then
					increment(1)
				end
			end)
			return {
				disconnect = function()
					conn.disconnect()
				end,
			}
		end,
	} }
	_container.missions = missions
end
return missions
