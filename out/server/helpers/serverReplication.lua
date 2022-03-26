-- Compiled with roblox-ts v1.2.3
local TS = require(game:GetService("ReplicatedStorage"):WaitForChild("rbxts_include"):WaitForChild("RuntimeLib"))
local Players = TS.import(script, TS.getModule(script, "@rbxts", "services")).Players
local env = TS.import(script, game:GetService("ServerScriptService"), "TS", "dumps", "env")
local verifyTypes = TS.import(script, game:GetService("ReplicatedStorage"), "TS", "functions", "verifyTypes").default
local datatypes = TS.import(script, game:GetService("ReplicatedStorage"), "TS", "types", "datatypes")
local serverReplication = {}
do
	local _container = serverReplication
	local serverReplicationFunctions = {
		toggleLean = function(me, player, action, direction)
			if direction ~= 1 and direction ~= 0 and direction ~= -1 then
				return nil
			end
			local characterbox = env.characterHitboxes["player:" .. tostring(player.UserId) .. ":hitbox"]
			characterbox:lean(direction)
			me.replicationService.remotes.act:FireAllClients(action, player.Character, direction)
		end,
		updateCameraOrientation = function(me, player, action, cameraid, orientation)
			local c1 = verifyTypes({ {
				expected = "string",
				value = cameraid,
			}, {
				expected = "Vector3",
				value = orientation,
			} })
			if not c1 then
				return nil
			end
			local _cameras = me.cameras
			local _arg0 = function(v)
				if v.cameraId == cameraid then
					v:playerAttemptsToControlCamera(player, orientation)
				end
			end
			-- ▼ ReadonlyArray.forEach ▼
			for _k, _v in ipairs(_cameras) do
				_arg0(_v, _k - 1, _cameras)
			end
			-- ▲ ReadonlyArray.forEach ▲
		end,
		joinCamera = function(me, player, action, cameraid)
			local c1 = verifyTypes({ {
				expected = "string",
				value = cameraid,
			} })
			if not c1 then
				return nil
			end
			local _cameras = me.cameras
			local _arg0 = function(v)
				if v.cameraId == cameraid then
					v:playerStartsViewingCamera(player)
				else
					v:playerStopsViewingCamera(player)
				end
			end
			-- ▼ ReadonlyArray.forEach ▼
			for _k, _v in ipairs(_cameras) do
				_arg0(_v, _k - 1, _cameras)
			end
			-- ▲ ReadonlyArray.forEach ▲
		end,
		leaveCamera = function(me, player, action, cameraid)
			local c1 = verifyTypes({ {
				expected = "string",
				value = cameraid,
			} })
			if not c1 then
				return nil
			end
			local _cameras = me.cameras
			local _arg0 = function(v)
				if v.cameraId == cameraid then
					v:playerStopsViewingCamera(player)
				end
			end
			-- ▼ ReadonlyArray.forEach ▼
			for _k, _v in ipairs(_cameras) do
				_arg0(_v, _k - 1, _cameras)
			end
			-- ▲ ReadonlyArray.forEach ▲
		end,
		toggleRappelling = function(me, player, action, rappel)
			local c1 = verifyTypes({ {
				expected = "boolean",
				value = rappel,
			} })
			if not c1 then
				return nil
			end
			local charclass = me.clientdata[player.UserId].charClass
			if charclass.alive and tick() - charclass.lastRappel >= charclass.RAPPEL_COOLDOWN then
				charclass.rappelling = rappel
			end
		end,
		updateRappelRope = function(me, player, action, position)
			local c1 = verifyTypes({ {
				expected = "Vector3",
				value = position,
			} })
			if not c1 then
				return nil
			end
			me.replicationService.remotes.act:FireAllClients(action, player.Character, position)
		end,
		updateMovementState = function(me, player, action, state)
			local _value = datatypes.movementState[state]
			if not (_value ~= "" and _value) then
				error(tostring(state) .. " is not a valid movementState")
			end
			me.replicationService.remotes.act:FireAllClients(action, player.Character, state)
		end,
		setCFrame = function(me, player, action, cf)
			local c1 = verifyTypes({ {
				expected = "CFrame",
				value = cf,
			} })
			if not c1 then
				return nil
			end
			local valid = me.replChar:validateCFrame(player, cf)
			if valid then
				me.replChar:setCFrame(player, cf)
				local characterbox = env.characterHitboxes["player:" .. tostring(player.UserId) .. ":hitbox"]
				characterbox:setCFrame(cf)
				local _exp = Players:GetPlayers()
				local _arg0 = function(v)
					if v == player then
						return nil
					end
					me.replicationService.remotes.act:FireClient(v, action, player.Character, cf)
				end
				-- ▼ ReadonlyArray.forEach ▼
				for _k, _v in ipairs(_exp) do
					_arg0(_v, _k - 1, _exp)
				end
				-- ▲ ReadonlyArray.forEach ▲
			else
				local last = me.replChar:getLast(player)
				me.replicationService.remotes.act:FireClient(player, action, player.Character, last)
			end
		end,
		setCamera = function(me, player, action, v3)
			local c1 = verifyTypes({ {
				expected = "Vector3",
				value = v3,
			} })
			if not c1 then
				return nil
			end
			local characterbox = env.characterHitboxes["player:" .. tostring(player.UserId) .. ":hitbox"]
			characterbox:headTo(v3)
			me.replicationService.remotes.act:FireAllClients(action, player.Character, v3)
		end,
		equip = function(me, player, action, weaponName, weaponSkin)
			local c1 = verifyTypes({ {
				expected = "string",
				value = weaponName,
			}, {
				expected = "string",
				value = weaponSkin,
			} })
			if not c1 then
				return nil
			end
			local characterbox = env.characterHitboxes["player:" .. tostring(player.UserId) .. ":hitbox"]
			characterbox:equip(weaponName, weaponSkin)
			me.replicationService.remotes.act:FireAllClients(action, player.Character, weaponName, weaponSkin)
		end,
	}
	_container.serverReplicationFunctions = serverReplicationFunctions
end
return serverReplication
