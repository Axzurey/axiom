-- Compiled with roblox-ts v1.2.3
local TS = require(game:GetService("ReplicatedStorage"):WaitForChild("rbxts_include"):WaitForChild("RuntimeLib"))
local _services = TS.import(script, TS.getModule(script, "@rbxts", "services"))
local ReplicatedStorage = _services.ReplicatedStorage
local RunService = _services.RunService
if RunService:IsServer() then
	if not ReplicatedStorage:FindFirstChild("@connections.directory") then
		local d = Instance.new("Folder")
		d.Name = "@connections.directory"
		d.Parent = ReplicatedStorage
		local call = Instance.new("RemoteEvent")
		call.Name = "#connections"
		call.Parent = d
	end
end
local dir = ReplicatedStorage:WaitForChild("@connections.directory")
local remote = dir:WaitForChild("#connections")
local function connection()
	local connection
	do
		connection = {}
		function connection:constructor()
		end
		function connection:connect(callback)
			if not self.main then
				self.main = remote.OnClientEvent:Connect(function(name, ...)
					local args = { ... }
					if name == self.selfName then
						self:activate(unpack(args))
					end
				end)
			end
			local t
			t = {
				callback = callback,
				disconnect = function()
					local _connections = self.connections
					local _t = t
					local index = (table.find(_connections, _t) or 0) - 1
					if index ~= -1 then
						local _connections_1 = self.connections
						local _index = index
						table.remove(_connections_1, _index + 1)
					end
				end,
				wait = function()
					while not t.called do
						task.wait()
					end
					return t.passedArgs
				end,
				called = false,
				passedArgs = {},
			}
			local _connections = self.connections
			local _t = t
			-- ▼ Array.push ▼
			_connections[#_connections + 1] = _t
			-- ▲ Array.push ▲
			return t
		end
		function connection:activate(...)
			local args = { ... }
			if RunService:IsServer() then
				remote:FireAllClients(self.selfName, unpack(args))
				local _connections = self.connections
				local _arg0 = function(v)
					coroutine.wrap(function()
						v.passedArgs = args
						v.called = true
						v.callback(unpack(args))
					end)()
				end
				-- ▼ ReadonlyArray.forEach ▼
				for _k, _v in ipairs(_connections) do
					_arg0(_v, _k - 1, _connections)
				end
				-- ▲ ReadonlyArray.forEach ▲
			elseif RunService:IsClient() then
				local _connections = self.connections
				local _arg0 = function(v)
					coroutine.wrap(function()
						v.passedArgs = args
						v.called = true
						v.callback(unpack(args))
					end)()
				end
				-- ▼ ReadonlyArray.forEach ▼
				for _k, _v in ipairs(_connections) do
					_arg0(_v, _k - 1, _connections)
				end
				-- ▲ ReadonlyArray.forEach ▲
			end
		end
		function connection:activateForServerOnly(...)
			local args = { ... }
			local _connections = self.connections
			local _arg0 = function(v)
				coroutine.wrap(function()
					v.passedArgs = args
					v.called = true
					v.callback(unpack(args))
				end)()
			end
			-- ▼ ReadonlyArray.forEach ▼
			for _k, _v in ipairs(_connections) do
				_arg0(_v, _k - 1, _connections)
			end
			-- ▲ ReadonlyArray.forEach ▲
		end
		function connection:activateForSingleClient(client, ...)
			local args = { ... }
			if RunService:IsClient() then
				error("you can not use this method on the client")
			end
			remote:FireClient(client, unpack(args))
		end
		connection.connections = {}
		connection.selfName = "undefined"
	end
	return connection
end
return {
	default = connection,
}
