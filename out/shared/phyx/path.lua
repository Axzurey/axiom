-- Compiled with roblox-ts v1.2.3
-- syntax: service//nested1//nested2//nested3
local path
do
	path = {}
	function path:constructor()
	end
	function path:pathToInstance(path)
		local split = string.split(path, "//")
		local currentInstance = game
		for i, v in pairs(split) do
			local c = currentInstance:FindFirstChild(v)
			if c then
				currentInstance = c
			else
				error("path does not exist, " .. v .. " is not a valid member of " .. currentInstance:GetFullName())
			end
		end
		if currentInstance == game then
			error("[game] is not allowed as a sufficient path")
		end
		return currentInstance
	end
end
return {
	default = path,
}
