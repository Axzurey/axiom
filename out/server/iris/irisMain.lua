-- Compiled with roblox-ts v1.2.3
local TS = require(game:GetService("ReplicatedStorage"):WaitForChild("rbxts_include"):WaitForChild("RuntimeLib"))
local crypto = TS.import(script, game:GetService("ServerScriptService"), "TS", "crypto")
local iris = {}
do
	--[[
		*
		* always check if the token already exists
	]]
	local function generateIrisToken()
		return crypto.token(256)
	end
end
return iris
