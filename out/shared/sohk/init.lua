-- Compiled with roblox-ts v1.2.3
local TS = require(game:GetService("ReplicatedStorage"):WaitForChild("rbxts_include"):WaitForChild("RuntimeLib"))
local _services = TS.import(script, TS.getModule(script, "@rbxts", "services"))
local ReplicatedStorage = _services.ReplicatedStorage
local RunService = _services.RunService
local load_all_files = TS.import(script, game:GetService("ReplicatedStorage"), "TS", "sohk", "connections", "loader").default
local tagservice = TS.import(script, game:GetService("ReplicatedStorage"), "TS", "sohk", "services", "tagservice")
local UISCONTROLLER = TS.import(script, game:GetService("ReplicatedStorage"), "TS", "sohk", "services", "userinputservice").default
local replicationService = TS.import(script, game:GetService("ReplicatedStorage"), "TS", "sohk", "services", "replicationService").default
local hitScanService = TS.import(script, game:GetService("ReplicatedStorage"), "TS", "sohk", "services", "hitscanService").default
local itemService = TS.import(script, game:GetService("ReplicatedStorage"), "TS", "sohk", "services", "itemservice").default
local cameraService = TS.import(script, game:GetService("ReplicatedStorage"), "TS", "sohk", "services", "cameraService")
local renderService = TS.import(script, game:GetService("ReplicatedStorage"), "TS", "sohk", "services", "renderService")
local csgService = TS.import(script, game:GetService("ReplicatedStorage"), "TS", "sohk", "services", "csgService").default
local graphService = TS.import(script, game:GetService("ReplicatedStorage"), "TS", "sohk", "services", "graphService")
local loaded = false
local defaultSohk
do
	defaultSohk = {}
	function defaultSohk:constructor()
		self.itemService = itemService
		self.hitscanService = hitScanService
		self.replicationService = replicationService
		self.uisController = UISCONTROLLER.new()
		self.tagService = tagservice
		self.cameraService = cameraService
		self.renderService = renderService
		self.csgService = csgService
		self.graphService = graphService
	end
end
local sohkComponent
do
	local super = defaultSohk
	sohkComponent = setmetatable({}, {
		__tostring = function()
			return "sohkComponent"
		end,
		__index = super,
	})
	sohkComponent.__index = sohkComponent
	function sohkComponent:constructor()
		super.constructor(self)
		local dump = ReplicatedStorage:FindFirstChild("$sohk.dump")
		if not dump then
			dump = Instance.new("Folder")
			dump.Name = "$sohk.dump"
			dump.Parent = ReplicatedStorage
		end
		self.dump = dump
	end
end
local sohkEntity
do
	local super = defaultSohk
	sohkEntity = setmetatable({}, {
		__tostring = function()
			return "sohkEntity"
		end,
		__index = super,
	})
	sohkEntity.__index = sohkEntity
	function sohkEntity:constructor()
		super.constructor(self)
		self.model = nil
	end
	function sohkEntity:isVectorInRange(v, range)
		if not self.model then
			error("model doesn't exist")
		end
		if not self.model.PrimaryPart then
			error("model doesn't have a primary part")
		end
		local _position = self.model:GetPrimaryPartCFrame().Position
		local distance = (v - _position).Magnitude
		return { distance <= range, distance }
	end
	function sohkEntity:moveTo(v)
		if not self.model then
			error("model doesn't exist")
		end
		if not self.model.PrimaryPart then
			error("model doesn't have a primary part")
		end
		local rx, ry, rz = self.model:GetPrimaryPartCFrame():ToOrientation()
		local _fn = self.model
		local _cFrame = CFrame.new(v)
		local _arg0 = CFrame.fromOrientation(rx, ry, rz)
		_fn:SetPrimaryPartCFrame(_cFrame * _arg0)
		return self
	end
	function sohkEntity:setInteraction()
	end
end
local sohk
do
	sohk = setmetatable({}, {
		__tostring = function()
			return "sohk"
		end,
	})
	sohk.__index = sohk
	function sohk.new(...)
		local self = setmetatable({}, sohk)
		return self:constructor(...) or self
	end
	function sohk:constructor()
		if RunService:IsServer() and not loaded then
			load_all_files()
			loaded = true
		end
	end
	sohk.sohkComponent = sohkComponent
	sohk.sohkEntity = sohkEntity
end
return {
	default = sohk,
}
