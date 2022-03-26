-- Compiled with roblox-ts v1.2.3
local TS = require(game:GetService("ReplicatedStorage"):WaitForChild("rbxts_include"):WaitForChild("RuntimeLib"))
local holographic_sight = TS.import(script, game:GetService("ReplicatedStorage"), "TS", "content", "sights", "holographic").default
local sightsMapping = {
	holographic = holographic_sight,
}
return sightsMapping
