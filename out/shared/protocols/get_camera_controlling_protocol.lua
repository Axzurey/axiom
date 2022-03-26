-- Compiled with roblox-ts v1.2.3
local TS = require(game:GetService("ReplicatedStorage"):WaitForChild("rbxts_include"):WaitForChild("RuntimeLib"))
local phyxRemoteProtocol = TS.import(script, game:GetService("ReplicatedStorage"), "TS", "phyx", "phyxRemoteProtocol").default
local get_camera_controlling_protocol = phyxRemoteProtocol.new("get_camera_controlling_protocol", "Function")
return get_camera_controlling_protocol
