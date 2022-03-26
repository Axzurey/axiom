-- Compiled with roblox-ts v1.2.3
local TS = require(game:GetService("ReplicatedStorage"):WaitForChild("rbxts_include"):WaitForChild("RuntimeLib"))
local projectile = TS.import(script, game:GetService("ReplicatedStorage"), "TS", "classes", "projectile").default
local path = TS.import(script, game:GetService("ReplicatedStorage"), "TS", "phyx", "path").default
local Workspace = TS.import(script, TS.getModule(script, "@rbxts", "services")).Workspace
local projectile_protocol_create = TS.import(script, game:GetService("ReplicatedStorage"), "TS", "protocols", "projectile_protocol_create")
local projectile_protocol_freeze = TS.import(script, game:GetService("ReplicatedStorage"), "TS", "protocols", "projectile_protocol_freeze")
local projectile_handler
do
	projectile_handler = setmetatable({}, {
		__tostring = function()
			return "projectile_handler"
		end,
	})
	projectile_handler.__index = projectile_handler
	function projectile_handler.new(...)
		local self = setmetatable({}, projectile_handler)
		return self:constructor(...) or self
	end
	function projectile_handler:constructor()
		self.projectiles = {}
		projectile_protocol_create:connectClient(function(instanceId, instancePath, origin, direction, gravity, velocity, lifeTime)
			self:newProjectile(instanceId, instancePath, origin, direction, gravity, velocity, lifeTime)
		end)
		projectile_protocol_freeze:connectClient(function(instanceId, at)
			self:freezeProjectile(instanceId, at)
		end)
	end
	function projectile_handler:newProjectile(instanceId, instancePath, origin, direction, gravity, velocity, lifeTime)
		local inst = path:pathToInstance(instancePath):Clone()
		inst.Parent = Workspace
		local proj = projectile.new({
			origin = origin,
			direction = direction,
			gravity = gravity,
			velocity = velocity,
			lifeTime = lifeTime,
			instance = inst,
			ignoreInstances = {},
			ignoreEverything = true,
			onHit = function() end,
			onTerminated = function() end,
		})
		self.projectiles[instanceId] = {
			path = proj,
			instance = inst,
		}
	end
	function projectile_handler:freezeProjectile(instanceId, at)
		local proj = self.projectiles[instanceId]
		if not proj then
			print("no proj")
			return nil
		end
		proj.path:terminate()
		local _exp = proj.instance:GetChildren()
		local _arg0 = function(v)
			if v:IsA("BasePart") then
				v.Anchored = true
			end
		end
		-- ▼ ReadonlyArray.forEach ▼
		for _k, _v in ipairs(_exp) do
			_arg0(_v, _k - 1, _exp)
		end
		-- ▲ ReadonlyArray.forEach ▲
		task.wait(.1)
		proj.instance:SetPrimaryPartCFrame(at)
		print("set")
	end
	function projectile_handler:terminateProjectile(instanceId)
	end
end
return {
	default = projectile_handler,
}
