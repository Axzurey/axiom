-- Compiled with roblox-ts v1.2.3
local TS = require(game:GetService("ReplicatedStorage"):WaitForChild("rbxts_include"):WaitForChild("RuntimeLib"))
local _services = TS.import(script, TS.getModule(script, "@rbxts", "services"))
local ReplicatedStorage = _services.ReplicatedStorage
local RunService = _services.RunService
local remoteloader = TS.import(script, game:GetService("ReplicatedStorage"), "TS", "sohk", "connections", "remotes")
local directory = ReplicatedStorage
local function load_all_files()
	if RunService:IsClient() then
		return nil
	end
	local main = Instance.new("Folder")
	main.Parent = directory
	main.Name = "sohk"
	local remotesdirectory = Instance.new("Folder")
	remotesdirectory.Name = "remotes"
	remotesdirectory.Parent = main
	for name, remote in pairs(remoteloader) do
		remote.Name = name
		remote.Parent = remotesdirectory
	end
end
return {
	default = load_all_files,
}
