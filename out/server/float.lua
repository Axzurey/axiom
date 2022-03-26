-- Compiled with roblox-ts v1.2.3
local TS = require(game:GetService("ReplicatedStorage"):WaitForChild("rbxts_include"):WaitForChild("RuntimeLib"))
local Workspace = TS.import(script, TS.getModule(script, "@rbxts", "services")).Workspace
local minerva = TS.import(script, game:GetService("ReplicatedStorage"), "TS", "minerva")
local float = {}
do
	local _container = float
	local gunTypes
	do
		local _inverse = {}
		gunTypes = setmetatable({}, {
			__index = _inverse,
		})
		gunTypes.primary = 0
		_inverse[0] = "primary"
		gunTypes.secondary = 1
		_inverse[1] = "secondary"
		gunTypes.melee = 2
		_inverse[2] = "melee"
	end
	_container.gunTypes = gunTypes
	local gunTypeMap = {
		[gunTypes.primary] = { "mpx" },
		[gunTypes.melee] = { "knife" },
	}
	_container.gunTypeMap = gunTypeMap
	local playerCharacterClasses = {}
	_container.playerCharacterClasses = playerCharacterClasses
	local function playerCanPerformAction(player, action)
		repeat
			local dir = playerCharacterClasses[player.UserId]
			if dir.alive and not dir:hasEffect("stun") then
				return true
			end
			break
		until true
		return false
	end
	_container.playerCanPerformAction = playerCanPerformAction
	local playerContacts
	do
		local _inverse = {}
		playerContacts = setmetatable({}, {
			__index = _inverse,
		})
		playerContacts.body = 0
		_inverse[0] = "body"
		playerContacts.limb = 1
		_inverse[1] = "limb"
		playerContacts.head = 2
		_inverse[2] = "head"
	end
	_container.playerContacts = playerContacts
	local contactMap = {
		Head = playerContacts.head,
		UpperTorso = playerContacts.body,
		LowerTorso = playerContacts.body,
		RightUpperleg = playerContacts.limb,
		RightLowerLeg = playerContacts.limb,
		RightFoot = playerContacts.limb,
		LeftUpperleg = playerContacts.limb,
		LeftLowerLeg = playerContacts.limb,
		LeftFoot = playerContacts.limb,
		RightUpperArm = playerContacts.limb,
		RightLowerArm = playerContacts.limb,
		RightHand = playerContacts.limb,
		LeftUpperArm = playerContacts.limb,
		LeftLowerArm = playerContacts.limb,
		LeftArm = playerContacts.limb,
	}
	local function contactFromHit(hitName)
		return contactMap[hitName]
	end
	_container.contactFromHit = contactFromHit
	local function processImpact(sender, hit, reciever)
		local impactType = contactFromHit(hit.Name)
		return {
			impactLocation = impactType,
		}
	end
	_container.processImpact = processImpact
	local function closestEnemyToPoint(point)
		local closestDistance = math.huge
		local closestModel = nil
		local _exp = Workspace:GetChildren()
		local _arg0 = function(v)
			local hrp = v:FindFirstChild("HumanoidRootPart")
			if hrp then
				local _position = hrp.Position
				local mag = (point - _position).Magnitude
				if mag < closestDistance then
					closestDistance = mag
					closestModel = v
				end
			end
		end
		-- ▼ ReadonlyArray.forEach ▼
		for _k, _v in ipairs(_exp) do
			_arg0(_v, _k - 1, _exp)
		end
		-- ▲ ReadonlyArray.forEach ▲
		return { closestModel, closestDistance }
	end
	_container.closestEnemyToPoint = closestEnemyToPoint
	local function dropBomb(position)
		-- clone the bomb and just drop it;
		task.wait(minerva.timeTillDroppedBombCanBePickedUp)
		return true
	end
	_container.dropBomb = dropBomb
end
return float
