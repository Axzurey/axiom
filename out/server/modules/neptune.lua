-- Compiled with roblox-ts v1.2.3
local TS = require(game:GetService("ReplicatedStorage"):WaitForChild("rbxts_include"):WaitForChild("RuntimeLib"))
local DataStoreService = TS.import(script, TS.getModule(script, "@rbxts", "services")).DataStoreService
local serF = {
	cframe = function(cf)
		local _ptr = { "cframe" }
		local _length = #_ptr
		local _array = { cf:GetComponents() }
		table.move(_array, 1, #_array, _length + 1, _ptr)
		return _ptr
	end,
	vector3 = function(v3)
		return { "vector3", v3.X, v3.Y, v3.Z }
	end,
	vector2 = function(v2)
		return { "vector2", v2.X, v2.Y }
	end,
	color3 = function(c3)
		return { "color3", c3.R, c3.G, c3.B }
	end,
	brickcolor = function(bc)
		return { "brickcolor", bc.Name }
	end,
	udim2 = function(u2)
		return { "udim2", u2.X.Scale, u2.X.Offset, u2.Y.Scale, u2.Y.Offset }
	end,
	udim = function(u)
		return { "udim", u.Scale, u.Offset }
	end,
	enum = function()
		return {}
	end,
}
local neptune = {}
do
	local _container = neptune
	local database
	do
		database = setmetatable({}, {
			__tostring = function()
				return "database"
			end,
		})
		database.__index = database
		function database.new(...)
			local self = setmetatable({}, database)
			return self:constructor(...) or self
		end
		function database:constructor(key)
			self.datastore = DataStoreService:GetDataStore(key)
		end
		function database:updateDataAsync(key, transform)
			return TS.Promise.new(function(resolve, reject)
				TS.try(function()
					self.datastore:UpdateAsync(key, transform)
					resolve({ true })
				end, function(e)
					reject({ false, tostring(e) })
				end)
			end)
		end
		function database:setDataAsync(key, data)
			return TS.Promise.new(function(resolve, reject)
				TS.try(function()
					self.datastore:SetAsync(key, data)
					resolve({ true })
				end, function(e)
					reject({ false, tostring(e) })
				end)
			end)
		end
		function database:getDataAsync(key)
			return TS.Promise.new(function(resolve, reject)
				TS.try(function()
					resolve({ self.datastore:GetAsync(key) })
				end, function(e)
					reject({ false, tostring(e) })
				end)
			end)
		end
		function database:deleteDataAsync(key)
			return TS.Promise.new(function(resolve, reject)
				TS.try(function()
					self.datastore:SetAsync(key, nil)
					resolve({ true })
				end, function(e)
					reject({ false, tostring(e) })
				end)
			end)
		end
	end
	_container.database = database
end
return neptune
