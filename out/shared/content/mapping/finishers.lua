-- Compiled with roblox-ts v1.2.3
local TS = require(game:GetService("ReplicatedStorage"):WaitForChild("rbxts_include"):WaitForChild("RuntimeLib"))
local mechanica = TS.import(script, game:GetService("ReplicatedStorage"), "TS", "content", "finishers", "mechanica").default
local finishers = {
	mechanica = mechanica,
}
return {
	finishers = finishers,
}
