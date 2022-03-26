-- Compiled with roblox-ts v1.2.3
local TS = require(game:GetService("ReplicatedStorage"):WaitForChild("rbxts_include"):WaitForChild("RuntimeLib"))
local abilities = TS.import(script, game:GetService("ReplicatedStorage"), "TS", "config", "gameplay", "abilities")
local operatorInfo = {
	athena = {
		role = "defender",
		primaryAbility = abilities.all_seeing_eye,
		secondaryAbility = { abilities.c4 },
		visualName = "Athena",
		icon = "",
	},
	tau = {
		role = "attacker",
		primaryAbility = "",
		secondaryAbility = {},
		visualName = "Tau",
		icon = "",
	},
}
return operatorInfo
