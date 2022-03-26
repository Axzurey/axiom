-- Compiled with roblox-ts v1.2.3
local TS = require(game:GetService("ReplicatedStorage"):WaitForChild("rbxts_include"):WaitForChild("RuntimeLib"))
local csgService
do
	csgService = setmetatable({}, {
		__tostring = function()
			return "csgService"
		end,
	})
	csgService.__index = csgService
	function csgService.new(...)
		local self = setmetatable({}, csgService)
		return self:constructor(...) or self
	end
	function csgService:constructor()
	end
	function csgService:negateFromAsync(base, negative, destroyBase)
		if destroyBase == nil then
			destroyBase = true
		end
		return TS.Promise.new(function(resolve, reject)
			TS.try(function()
				local p1 = base:SubtractAsync(negative)
				p1.Parent = base.Parent
				if destroyBase then
					base:Destroy()
				end
				resolve(p1)
			end, function()
				reject("an unknown error occured")
			end)
		end)
	end
end
return {
	default = csgService,
}
