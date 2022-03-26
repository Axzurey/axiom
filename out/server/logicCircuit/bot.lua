-- Compiled with roblox-ts v1.2.3
local TS = require(game:GetService("ReplicatedStorage"):WaitForChild("rbxts_include"):WaitForChild("RuntimeLib"))
local gameEntity = TS.import(script, game:GetService("ServerScriptService"), "TS", "quart", "gameEntity").default
local bot
do
	local super = gameEntity
	bot = setmetatable({}, {
		__tostring = function()
			return "bot"
		end,
		__index = super,
	})
	bot.__index = bot
	function bot.new(...)
		local self = setmetatable({}, bot)
		return self:constructor(...) or self
	end
	function bot:constructor(params)
		super.constructor(self, params)
	end
end
return {
	bot = bot,
}
