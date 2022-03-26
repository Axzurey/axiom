-- Compiled with roblox-ts v1.2.3
local TS = require(game:GetService("ReplicatedStorage"):WaitForChild("rbxts_include"):WaitForChild("RuntimeLib"))
local animationsMap = TS.import(script, game:GetService("ReplicatedStorage"), "TS", "content", "mapping", "animations")
local replicatedWeapons = {
	mpx = {
		default = {
			animations = {
				idle = animationsMap.mpx_idle_3p,
			},
		},
	},
	glock18 = {
		fade = {
			animations = {
				idle = animationsMap.mpx_idle_3p,
			},
		},
	},
	knife = {
		default = {
			animations = {
				idle = animationsMap.mpx_idle_3p,
			},
		},
		saber = {
			animations = {
				idle = animationsMap.mpx_idle_3p,
			},
		},
	},
}
return replicatedWeapons
