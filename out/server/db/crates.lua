-- Compiled with roblox-ts v1.2.3
local TS = require(game:GetService("ReplicatedStorage"):WaitForChild("rbxts_include"):WaitForChild("RuntimeLib"))
local skinIndex = TS.import(script, game:GetService("ServerScriptService"), "TS", "db", "skinIndex")
local crates = {}
do
	local _container = crates
	local plasmaCrate = { skinIndex.skins.mpx.blue }
	_container.plasmaCrate = plasmaCrate
	local function rollPlasmaCrate(g)
		local t = {}
		for _, v in pairs(plasmaCrate) do
			do
				local i = 0
				local _shouldIncrement = false
				while true do
					if _shouldIncrement then
						i += 1
					else
						_shouldIncrement = true
					end
					if not (i < v.weight) then
						break
					end
					-- ▼ Array.push ▼
					t[#t + 1] = v
					-- ▲ Array.push ▲
				end
			end
		end
		local selection = t[math.random(0, #t - 1) + 1]
		return selection
	end
	_container.rollPlasmaCrate = rollPlasmaCrate
end
return crates
