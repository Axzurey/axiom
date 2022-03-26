-- Compiled with roblox-ts v1.2.3
local TS = require(game:GetService("ReplicatedStorage"):WaitForChild("rbxts_include"):WaitForChild("RuntimeLib"))
local phyxRemoteProtocol = TS.import(script, game:GetService("ReplicatedStorage"), "TS", "phyx", "phyxRemoteProtocol").default
local camera_request_protocol = phyxRemoteProtocol.new("camera_request_protocol", "Function")
return camera_request_protocol
