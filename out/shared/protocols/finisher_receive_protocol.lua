-- Compiled with roblox-ts v1.2.3
local TS = require(game:GetService("ReplicatedStorage"):WaitForChild("rbxts_include"):WaitForChild("RuntimeLib"))
local phyxRemoteProtocol = TS.import(script, game:GetService("ReplicatedStorage"), "TS", "phyx", "phyxRemoteProtocol").default
local finisher_receive_protocol = phyxRemoteProtocol.new("finisher_receive_protocol", "Event")
return finisher_receive_protocol
