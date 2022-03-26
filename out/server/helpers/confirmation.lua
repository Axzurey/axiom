-- Compiled with roblox-ts v1.2.3
local TS = require(game:GetService("ReplicatedStorage"):WaitForChild("rbxts_include"):WaitForChild("RuntimeLib"))
local env = TS.import(script, game:GetService("ServerScriptService"), "TS", "dumps", "env")
local confirmation = {}
do
	local _container = confirmation
	--[[
		*
		*
		* @param impact
		* @returns [is a hitbox?, hitbox name, hitbox object]
	]]
	local function isACharacterHitbox(impact)
		-- todo
		local character = nil
		local name = nil
		for i, v in pairs(env.characterHitboxes) do
			if impact:IsDescendantOf(v.character) then
				character = v
				name = i
			end
		end
		return { character and true or false, name, character }
	end
	_container.isACharacterHitbox = isACharacterHitbox
end
return confirmation
-- try overlapping beams or trails
