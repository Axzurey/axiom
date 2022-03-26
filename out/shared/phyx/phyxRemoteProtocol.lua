-- Compiled with roblox-ts v1.2.3
local TS = require(game:GetService("ReplicatedStorage"):WaitForChild("rbxts_include"):WaitForChild("RuntimeLib"))
local RunService = TS.import(script, TS.getModule(script, "@rbxts", "services")).RunService
local phyxConfig = TS.import(script, game:GetService("ReplicatedStorage"), "TS", "phyx", "phyxConfig")
--[[
	*
	* S is args server sends, C is args client sends
]]
local phyxRemoteProtocol
do
	phyxRemoteProtocol = setmetatable({}, {
		__tostring = function()
			return "phyxRemoteProtocol"
		end,
	})
	phyxRemoteProtocol.__index = phyxRemoteProtocol
	function phyxRemoteProtocol.new(...)
		local self = setmetatable({}, phyxRemoteProtocol)
		return self:constructor(...) or self
	end
	function phyxRemoteProtocol:constructor(uniqueIdentifier, kind)
		self.connections = {}
		self.identifier = uniqueIdentifier
		if RunService:IsServer() then
			local remote = Instance.new("Remote" .. kind)
			remote.Name = uniqueIdentifier
			remote.Parent = phyxConfig.remotes
			self.remote = remote
		else
			local remote = phyxConfig.remotes:WaitForChild(uniqueIdentifier)
			self.remote = remote
		end
		if self.remote:IsA("RemoteEvent") then
			if RunService:IsServer() then
				self.remote.OnServerEvent:Connect(function(player, ...)
					local args = { ... }
					local _ptr = { player }
					local _length = #_ptr
					table.move(args, 1, #args, _length + 1, _ptr)
					local p = _ptr
					local _connections = self.connections
					local _arg0 = function(v)
						coroutine.wrap(function()
							v.callback(unpack(p))
						end)()
					end
					-- ▼ ReadonlyArray.forEach ▼
					for _k, _v in ipairs(_connections) do
						_arg0(_v, _k - 1, _connections)
					end
					-- ▲ ReadonlyArray.forEach ▲
				end)
			else
				self.remote.OnClientEvent:Connect(function(...)
					local args = { ... }
					local _ptr = {}
					local _length = #_ptr
					table.move(args, 1, #args, _length + 1, _ptr)
					local p = _ptr
					local _connections = self.connections
					local _arg0 = function(v)
						coroutine.wrap(function()
							v.callback(unpack(p))
						end)()
					end
					-- ▼ ReadonlyArray.forEach ▼
					for _k, _v in ipairs(_connections) do
						_arg0(_v, _k - 1, _connections)
					end
					-- ▲ ReadonlyArray.forEach ▲
				end)
			end
		else
			if RunService:IsServer() then
				self.remote.OnServerInvoke = function(player, ...)
					local args = { ... }
					local _ptr = { player }
					local _length = #_ptr
					table.move(args, 1, #args, _length + 1, _ptr)
					local p = _ptr
					if self.connections[1] then
						return self.connections[1].callback(unpack(p))
					end
				end
			else
				self.remote.OnClientInvoke = function(...)
					local args = { ... }
					local _ptr = {}
					local _length = #_ptr
					table.move(args, 1, #args, _length + 1, _ptr)
					local p = _ptr
					if self.connections[1] then
						return self.connections[1].callback(unpack(p))
					end
				end
			end
		end
	end
	function phyxRemoteProtocol:connectServer(callback)
		local r
		r = {
			disconnect = function()
				local _connections = self.connections
				local _r = r
				local index = (table.find(_connections, _r) or 0) - 1
				if index ~= -1 then
					local _connections_1 = self.connections
					local _index = index
					table.remove(_connections_1, _index + 1)
				end
			end,
			callback = callback,
		}
		local _connections = self.connections
		local _r = r
		-- ▼ Array.push ▼
		_connections[#_connections + 1] = _r
		-- ▲ Array.push ▲
		return r
	end
	function phyxRemoteProtocol:connectClient(callback)
		local r
		r = {
			disconnect = function()
				local _connections = self.connections
				local _r = r
				local index = (table.find(_connections, _r) or 0) - 1
				if index ~= -1 then
					local _connections_1 = self.connections
					local _index = index
					table.remove(_connections_1, _index + 1)
				end
			end,
			callback = callback,
		}
		local _connections = self.connections
		local _r = r
		-- ▼ Array.push ▼
		_connections[#_connections + 1] = _r
		-- ▲ Array.push ▲
		return r
	end
	function phyxRemoteProtocol:fireClient(client, ...)
		local args = { ... }
		if RunService:IsClient() then
			error("fireClient can only be called on the server!")
		end
		if self.remote:IsA("RemoteEvent") then
			self.remote:FireClient(client, unpack(args))
		else
			error("a remotefunction can not call fireclient")
		end
	end
	function phyxRemoteProtocol:queryClient(client, ...)
		local args = { ... }
		if RunService:IsClient() then
			error("fireClient can only be called on the server!")
		end
		if self.remote:IsA("RemoteFunction") then
			return self.remote:InvokeClient(client, unpack(args))
		else
			error("a remoteevent can not call queryClient")
		end
	end
	function phyxRemoteProtocol:fireServer(...)
		local args = { ... }
		if RunService:IsServer() then
			error("fireServer can not be called on the client!")
		end
		if self.remote:IsA("RemoteEvent") then
			self.remote:FireServer(unpack(args))
		else
			error("a remotefunction can not call queryfire")
		end
	end
	function phyxRemoteProtocol:queryServer(...)
		local args = { ... }
		if RunService:IsServer() then
			error("queryServer can not be called on the client!")
		end
		if self.remote:IsA("RemoteFunction") then
			return self.remote:InvokeServer(unpack(args))
		else
			error("a remoteevent can not call queryserver")
		end
	end
end
local p = phyxRemoteProtocol.new("hello", "Function")
p:connectServer(function() end)
return {
	default = phyxRemoteProtocol,
}
