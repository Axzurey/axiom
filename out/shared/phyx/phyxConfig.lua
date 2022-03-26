-- Compiled with roblox-ts v1.2.3
local TS = require(game:GetService("ReplicatedStorage"):WaitForChild("rbxts_include"):WaitForChild("RuntimeLib"))
local _services = TS.import(script, TS.getModule(script, "@rbxts", "services"))
local ReplicatedStorage = _services.ReplicatedStorage
local RunService = _services.RunService
local phyxConfig = {}
do
	local _container = phyxConfig
	local function createDir()
		local f = ReplicatedStorage:FindFirstChild("phyx")
		if f then
			return f
		end
		local d = Instance.new("Folder")
		d.Name = "phyx"
		d.Parent = ReplicatedStorage
		local remotes = Instance.new("Folder")
		remotes.Name = "Remotes"
		remotes.Parent = d
		return d
	end
	local directory = RunService:IsServer() and createDir() or ReplicatedStorage:WaitForChild("phyx")
	_container.directory = directory
	local remotes = directory:WaitForChild("Remotes")
	_container.remotes = remotes
end
return phyxConfig
