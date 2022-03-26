-- Compiled with roblox-ts v1.2.3
local TS = require(game:GetService("ReplicatedStorage"):WaitForChild("rbxts_include"):WaitForChild("RuntimeLib"))
local Workspace = TS.import(script, TS.getModule(script, "@rbxts", "services")).Workspace
local hitScanService
do
	hitScanService = setmetatable({}, {
		__tostring = function()
			return "hitScanService"
		end,
	})
	hitScanService.__index = hitScanService
	function hitScanService.new(...)
		local self = setmetatable({}, hitScanService)
		return self:constructor(...) or self
	end
	function hitScanService:constructor()
	end
	function hitScanService:scanForHitAsync(config)
		--[[
			return new Promise<RaycastResult | undefined>((resolve, reject) => {
			try {
			let params = new RaycastParams();
			params.FilterDescendantsInstances = config.ignore || [];
			params.FilterType = config.filterType || Enum.RaycastFilterType.Blacklist;
			params.IgnoreWater = true;
			let result = Workspace.Raycast(config.position, config.direction.mul(config.distance), params);
			resolve(result);
			}
			catch(e) {
			reject(e);
			}
			})
		]]
		local params = RaycastParams.new()
		params.FilterDescendantsInstances = config.ignore or {}
		params.FilterType = config.filterType or Enum.RaycastFilterType.Blacklist
		params.IgnoreWater = true
		local _fn = Workspace
		local _exp = config.position
		local _direction = config.direction
		local _distance = config.distance
		local result = _fn:Raycast(_exp, _direction * _distance, params)
		return result
	end
end
return {
	default = hitScanService,
}
