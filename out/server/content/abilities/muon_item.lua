-- Compiled with roblox-ts v1.2.3
local TS = require(game:GetService("ReplicatedStorage"):WaitForChild("rbxts_include"):WaitForChild("RuntimeLib"))
local weaponCore = TS.import(script, game:GetService("ServerScriptService"), "TS", "content", "weaponCore").default
local projectile = TS.import(script, game:GetService("ReplicatedStorage"), "TS", "classes", "projectile").default
local _services = TS.import(script, TS.getModule(script, "@rbxts", "services"))
local Players = _services.Players
local ReplicatedStorage = _services.ReplicatedStorage
local Workspace = _services.Workspace
local projectile_protocol_create = TS.import(script, game:GetService("ReplicatedStorage"), "TS", "protocols", "projectile_protocol_create")
local projectile_protocol_freeze = TS.import(script, game:GetService("ReplicatedStorage"), "TS", "protocols", "projectile_protocol_freeze")
local muon_item
do
	local super = weaponCore
	muon_item = setmetatable({}, {
		__tostring = function()
			return "muon_item"
		end,
		__index = super,
	})
	muon_item.__index = muon_item
	function muon_item.new(...)
		local self = setmetatable({}, muon_item)
		return self:constructor(...) or self
	end
	function muon_item:constructor(client, charclass)
		super.constructor(self, client, charclass)
		self.term = 0
	end
	function muon_item:reload()
	end
	function muon_item:fire(origin, look)
		self.term += 1
		local object = (ReplicatedStorage:WaitForChild("guns"):WaitForChild("muon"):WaitForChild("muon_blank")):Clone()
		local _exp = object:GetChildren()
		local _arg0 = function(v)
			if v:IsA("BasePart") then
				v.Transparency = 1
				v.Color = Color3.new(1, 0, 0)
				v.Anchored = true
			end
		end
		-- ▼ ReadonlyArray.forEach ▼
		for _k, _v in ipairs(_exp) do
			_arg0(_v, _k - 1, _exp)
		end
		-- ▲ ReadonlyArray.forEach ▲
		object:SetPrimaryPartCFrame(CFrame.new(origin))
		object.Parent = Workspace
		local objectPath = "ReplicatedStorage//guns//muon//muon_blank"
		local _exp_1 = Players:GetPlayers()
		local _arg0_1 = function(v)
			if v == self.client then
				return nil
			end
			projectile_protocol_create:fireClient(v, "$server_projectile:muon:" .. tostring(self.term), objectPath, origin, look, Vector3.new(0, -50, 0), 100, 50)
		end
		-- ▼ ReadonlyArray.forEach ▼
		for _k, _v in ipairs(_exp_1) do
			_arg0_1(_v, _k - 1, _exp_1)
		end
		-- ▲ ReadonlyArray.forEach ▲
		print("server", origin, look, Vector3.new(0, -50, 0), 100, 50)
		local p = projectile.new({
			origin = origin,
			direction = look,
			gravity = Vector3.new(0, -50, 0),
			ignoreInstances = { self.client.Character },
			lifeTime = 50,
			velocity = 100,
			onHit = function()
				projectile_protocol_freeze:fireClient(self.client, "$client_projectile:muon:" .. tostring(self.term), object:GetPrimaryPartCFrame())
				local _exp_2 = Players:GetPlayers()
				local _arg0_2 = function(v)
					if v == self.client then
						return nil
					end
					projectile_protocol_freeze:fireClient(v, "$server_projectile:muon:" .. tostring(self.term), object:GetPrimaryPartCFrame())
				end
				-- ▼ ReadonlyArray.forEach ▼
				for _k, _v in ipairs(_exp_2) do
					_arg0_2(_v, _k - 1, _exp_2)
				end
				-- ▲ ReadonlyArray.forEach ▲
			end,
			onTerminated = function() end,
			instance = object,
		})
	end
end
return {
	default = muon_item,
}
