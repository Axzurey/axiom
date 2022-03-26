-- Compiled with roblox-ts v1.2.3
local TS = require(game:GetService("ReplicatedStorage"):WaitForChild("rbxts_include"):WaitForChild("RuntimeLib"))
local _services = TS.import(script, TS.getModule(script, "@rbxts", "services"))
local ReplicatedStorage = _services.ReplicatedStorage
local TweenService = _services.TweenService
local Workspace = _services.Workspace
local replicatedWeapons = TS.import(script, game:GetService("ReplicatedStorage"), "TS", "config", "replication", "replicatedWeapons")
local datatypes = TS.import(script, game:GetService("ReplicatedStorage"), "TS", "types", "datatypes")
local replicatedGeneral = TS.import(script, game:GetService("ReplicatedStorage"), "TS", "config", "replication", "replicatedGeneral")
local replication = {}
do
	local _container = replication
	local stateCache = {}
	local characterCache = {}
	local characterLeanCache = {}
	local rappelInfo = {}
	local function replicate(t, action, ...)
		local args = { ... }
		t.replicationService.remotes.act:FireServer(action, unpack(args))
	end
	_container.replicate = replicate
	local function addCharacterTracks(character, tracks)
		local cache = characterCache[character]
		if cache ~= 0 and cache == cache and cache ~= "" and cache then
			for i, v in pairs(tracks) do
				cache[i] = v
			end
		else
			cache = tracks
		end
		local _cache = cache
		-- ▼ Map.set ▼
		characterCache[character] = _cache
		-- ▲ Map.set ▲
	end
	local function getCharacterTracks(character)
		local _condition = characterCache[character]
		if not (_condition ~= 0 and _condition == _condition and _condition ~= "" and _condition) then
			_condition = {}
		end
		return _condition
	end
	local function modifyCharacterTracks(character, tracks)
		local cache = characterCache[character]
		if not (cache ~= 0 and cache == cache and cache ~= "" and cache) then
			-- ▼ Map.set ▼
			characterCache[character] = {}
			-- ▲ Map.set ▲
			return nil
		end
		for i, v in pairs(tracks) do
			if cache[i] then
				if cache[i].IsPlaying and v == 1 then
					continue
				end
				local _result
				if v == 0 then
					_result = cache[i]:Stop()
				else
					_result = cache[i]:Play()
				end
			end
		end
	end
	local replicationFunctions
	replicationFunctions = {
		updateRappelRope = function(character, position)
			local l = rappelInfo[character]
			if not l then
				return nil
			end
			l.ropeContainer.a1.WorldPosition = character:GetPrimaryPartCFrame().Position
			l.ropeContainer.a2.WorldPosition = position
		end,
		toggleRappelling = function(character, t)
			if t then
				local p1 = Instance.new("Part")
				p1.Size = Vector3.new()
				p1.Anchored = true
				p1.Transparency = 1
				p1.CanCollide = false
				p1.Parent = Workspace:FindFirstChild("ignore")
				local a1 = Instance.new("Attachment")
				a1.Name = "a1"
				a1.Parent = p1
				local a2 = Instance.new("Attachment")
				a2.Name = "a2"
				a2.Parent = p1
				local rope = Instance.new("RopeConstraint")
				rope.Name = "rope"
				rope.Length = 0
				rope.Visible = true
				rope.Attachment0 = a1
				rope.Attachment1 = a2
				rope.Parent = p1
				local _arg1 = {
					ropeContainer = p1,
				}
				-- ▼ Map.set ▼
				rappelInfo[character] = _arg1
				-- ▲ Map.set ▲
			else
				local l = rappelInfo[character]
				if not l then
					return nil
				end
				l.ropeContainer:Destroy()
			end
		end,
		toggleLean = function(character, leanDirection)
			local c = characterLeanCache[character]
			if not c then
				c = {
					value = Instance.new("NumberValue"),
				}
				local _c = c
				-- ▼ Map.set ▼
				characterLeanCache[character] = _c
				-- ▲ Map.set ▲
			end
			local t = TweenService:Create(c.value, TweenInfo.new(.25), {
				Value = leanDirection,
			})
			t:Play()
		end,
		updateMovementState = function(character, state)
			local cycleId = replicatedGeneral.state_walk_cycle.animation
			local cycle2Id = replicatedGeneral.state_run_cycle.animation
			local tracks = getCharacterTracks(character)
			local toModify = {
				stateWalkCycle = state == datatypes.movementState.walking and 1 or 0,
				stateRunCycle = state == datatypes.movementState.sprinting and 1 or 0,
			}
			if not tracks.stateWalkCycle then
				local animation = Instance.new("Animation")
				animation.AnimationId = cycleId
				animation.Parent = Workspace
				local animator = character:WaitForChild("Humanoid"):WaitForChild("Animator")
				local track = animator:LoadAnimation(animation)
				animation:Destroy()
				addCharacterTracks(character, {
					stateWalkCycle = track,
				})
			end
			if not tracks.stateRunCycle then
				local animation = Instance.new("Animation")
				animation.AnimationId = cycle2Id
				animation.Parent = Workspace
				local animator = character:WaitForChild("Humanoid"):WaitForChild("Animator")
				local track = animator:LoadAnimation(animation)
				animation:Destroy()
				addCharacterTracks(character, {
					stateRunCycle = track,
				})
			end
			modifyCharacterTracks(character, toModify)
		end,
		equip = function(character, weaponName, weaponSkin)
			replicationFunctions.unequip(character)
			local _result = ReplicatedStorage:FindFirstChild("guns")
			if _result ~= nil then
				_result = _result:FindFirstChild(weaponName)
				if _result ~= nil then
					_result = _result:FindFirstChild(weaponName .. "_" .. weaponSkin)
				end
			end
			local weapon = _result
			if not weapon then
				error("weapon of name " .. weaponName .. " and skin " .. weaponSkin .. " can not be found")
			end
			weapon = weapon:Clone()
			local handle = Instance.new("Motor6D")
			handle.Part0 = character:FindFirstChild("UpperTorso")
			handle.Part1 = weapon:FindFirstChild("aimpart")
			handle.Parent = character
			weapon.Name = "weapon"
			weapon.Parent = character
			local initialAnimationIndex = replicatedWeapons[weaponName]
			local secondAnimationIndex = initialAnimationIndex[weaponSkin]
			local animations = secondAnimationIndex.animations
			local idle_anim_id = animations.idle
			local map = getCharacterTracks(character)
			if not map["idle:" .. weaponName .. ":" .. weaponSkin] then
				local animator = character:WaitForChild("Humanoid"):WaitForChild("Animator")
				local ainstance = Instance.new("Animation")
				ainstance.Parent = character
				ainstance.AnimationId = idle_anim_id
				local anim = animator:LoadAnimation(ainstance)
				ainstance:Destroy()
				addCharacterTracks(character, {
					["idle:" .. weaponName .. ":" .. weaponSkin] = anim,
				})
				anim:Play()
			else
				map["idle:" .. weaponName .. ":" .. weaponSkin]:Play()
			end
		end,
		unequip = function(character)
			local weapon = character:FindFirstChild("weapon")
			local handle = character:FindFirstChild("handle")
			local map = getCharacterTracks(character)
			if map ~= 0 and map == map and map ~= "" and map then
				for i, v in pairs(map) do
					local f = { string.find(i, "idle") }
					local _value = f[1]
					if _value ~= 0 and _value == _value and _value then
						v:Stop()
					end
				end
			end
			if weapon then
				weapon:Destroy()
			end
			if handle then
				handle:Destroy()
			end
		end,
		setCFrame = function(character, cframe) end,
		setCamera = function(character, v3)
			local _result = character:FindFirstChild("Head")
			if _result ~= nil then
				_result = _result:FindFirstChild("Neck")
			end
			local neck = _result
			local info = characterLeanCache[character]
			local y = neck.C0.Y
			local _cFrame = CFrame.new(0, y, 0)
			local _arg0 = CFrame.Angles(0, -math.asin(v3.X), 0)
			local _arg0_1 = CFrame.Angles(math.asin(v3.Y), 0, 0)
			local set = _cFrame * _arg0 * _arg0_1
			neck.C0 = set
			local _result_1 = character:FindFirstChild("UpperTorso")
			if _result_1 ~= nil then
				_result_1 = _result_1:FindFirstChild("Waist")
			end
			local torso = _result_1
			local y2 = torso.C0.Y
			local _cFrame_1 = CFrame.new(0, y2, 0)
			local _arg0_2 = CFrame.Angles(0, 0, math.rad(-20) * (info and info.value.Value or 0))
			local _arg0_3 = CFrame.Angles(math.clamp(math.asin(v3.Y), math.rad(-45), math.rad(45)), 0, 0)
			local set2 = _cFrame_1 * _arg0_2 * _arg0_3
			torso.C0 = torso.C0:Lerp(set2, .2)
		end,
	}
	_container.replicationFunctions = replicationFunctions
	local function handleReplicate(action, ...)
		local args = { ... }
		local f = replicationFunctions[action]
		f(unpack(args))
	end
	_container.handleReplicate = handleReplicate
end
return replication
