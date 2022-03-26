-- Compiled with roblox-ts v1.2.3
local TS = require(game:GetService("ReplicatedStorage"):WaitForChild("rbxts_include"):WaitForChild("RuntimeLib"))
local phyxRemoteProtocol = TS.import(script, game:GetService("ReplicatedStorage"), "TS", "phyx", "phyxRemoteProtocol").default
local projectile_protocol_freeze = phyxRemoteProtocol.new("projectile_protocol_freeze", "Event")
return projectile_protocol_freeze
