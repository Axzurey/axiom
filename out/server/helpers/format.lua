-- Compiled with roblox-ts v1.2.3
local format = {}
do
	local _container = format
	local function level_and_rank_and_username(username, level, rank)
		return username .. "<" .. tostring(level) .. " : " .. rank .. ">"
	end
	_container.level_and_rank_and_username = level_and_rank_and_username
end
return format
