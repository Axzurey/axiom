-- Compiled with roblox-ts v1.2.3
local phyxConnection
do
	phyxConnection = setmetatable({}, {
		__tostring = function()
			return "phyxConnection"
		end,
	})
	phyxConnection.__index = phyxConnection
	function phyxConnection.new(...)
		local self = setmetatable({}, phyxConnection)
		return self:constructor(...) or self
	end
	function phyxConnection:constructor(passed)
		self.connections = {}
		passed[1] = function(...)
			local args = { ... }
			local _connections = self.connections
			local _arg0 = function(v, index)
				coroutine.wrap(function()
					v.passedArgs = args
					v.called = true
					if v.once then
						table.remove(self.connections, index + 1)
					end
					if v.callback then
						v.callback(unpack(args))
					end
				end)()
			end
			-- ▼ ReadonlyArray.forEach ▼
			for _k, _v in ipairs(_connections) do
				_arg0(_v, _k - 1, _connections)
			end
			-- ▲ ReadonlyArray.forEach ▲
		end
	end
	function phyxConnection:connect(callback, once)
		if once == nil then
			once = false
		end
		local m
		m = {
			callback = callback,
			disconnect = function()
				local _connections = self.connections
				local _m = m
				local index = (table.find(_connections, _m) or 0) - 1
				if index ~= -1 then
					local _connections_1 = self.connections
					local _index = index
					table.remove(_connections_1, _index + 1)
				end
			end,
			once = true,
			passedArgs = nil,
			called = false,
		}
		local _connections = self.connections
		local _m = m
		-- ▼ Array.push ▼
		_connections[#_connections + 1] = _m
		-- ▲ Array.push ▲
		return m
	end
	function phyxConnection:wait()
		local m
		m = {
			callback = nil,
			disconnect = function()
				local _connections = self.connections
				local _m = m
				local index = (table.find(_connections, _m) or 0) - 1
				if index ~= -1 then
					local _connections_1 = self.connections
					local _index = index
					table.remove(_connections_1, _index + 1)
				end
			end,
			once = true,
			passedArgs = nil,
			called = false,
		}
		local _connections = self.connections
		local _m = m
		-- ▼ Array.push ▼
		_connections[#_connections + 1] = _m
		-- ▲ Array.push ▲
		while not m.called do
			task.wait()
		end
		return m.passedArgs
	end
end
return {
	default = phyxConnection,
}
