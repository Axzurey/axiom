-- Compiled with roblox-ts v1.2.3
local TS = require(game:GetService("ReplicatedStorage"):WaitForChild("rbxts_include"):WaitForChild("RuntimeLib"))
local sohk = TS.import(script, game:GetService("ReplicatedStorage"), "TS", "sohk").default
local maxAllowedDifferenceX = 15
local maxAllowedDifferenceY = 10
local maxAllowedDifferenceZ = 15
local maxHeight = 100
local minHeight = -100
local characterReplicator
do
	local super = sohk.sohkComponent
	characterReplicator = setmetatable({}, {
		__tostring = function()
			return "characterReplicator"
		end,
		__index = super,
	})
	characterReplicator.__index = characterReplicator
	function characterReplicator.new(...)
		local self = setmetatable({}, characterReplicator)
		return self:constructor(...) or self
	end
	function characterReplicator:constructor()
		super.constructor(self)
		self.lastCFrames = {}
	end
	function characterReplicator:newPlayer(client)
		self.lastCFrames[client.UserId] = {
			cf = CFrame.new(-1, -1, -1),
			delta = tick(),
			pass = true,
		}
	end
	function characterReplicator:validateCFrame(client, cf)
		local position = cf.Position
		local rx, ry, rz = cf:ToOrientation()
		local dir = self.lastCFrames[client.UserId]
		local pass = dir.pass
		local last = dir.cf
		if pass then
			dir.pass = false
			return true
		end
		local differenceX = math.abs(last.Position.X - position.X)
		local differenceY = math.abs(last.Position.Y - position.Y)
		local differenceZ = math.abs(last.Position.Z - position.Z)
		local delta = tick() - dir.delta
		local ideal = 1 / 60
		local deltaoff = ideal - delta
		local ispos = deltaoff >= 0 and true or false
		deltaoff = math.abs(deltaoff)
		if differenceX > maxAllowedDifferenceX or differenceY > maxAllowedDifferenceY or differenceZ > maxAllowedDifferenceZ then
			print(dir.cf.Position, cf.Position, "not allowed")
			return false
		elseif position.Y > maxHeight or position.Y < minHeight then
			print("y not above max height")
			return false
		end
		return true
	end
	function characterReplicator:setCFrame(player, cf)
		local dir = self.lastCFrames[player.UserId]
		dir.cf = cf
		dir.delta = tick()
	end
	function characterReplicator:getLast(player)
		return self.lastCFrames[player.UserId].cf
	end
	function characterReplicator:givePass(player)
		self.lastCFrames[player.UserId].pass = true
	end
end
return {
	default = characterReplicator,
}
