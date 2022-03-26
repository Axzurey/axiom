-- Compiled with roblox-ts v1.2.3
local TS = require(game:GetService("ReplicatedStorage"):WaitForChild("rbxts_include"):WaitForChild("RuntimeLib"))
local Workspace = TS.import(script, TS.getModule(script, "@rbxts", "services")).Workspace
local Raylib = TS.import(script, game:GetService("ReplicatedStorage"), "TS", "modules", "System").Raylib
local graphlua = TS.import(script, game:GetService("ReplicatedStorage"), "TS", "sohk", "services", "graphlua")
local graphService = {}
do
	local _container = graphService
	local graph
	do
		graph = setmetatable({}, {
			__tostring = function()
				return "graph"
			end,
		})
		graph.__index = graph
		function graph.new(...)
			local self = setmetatable({}, graph)
			return self:constructor(...) or self
		end
		function graph:constructor()
			self.vertexFolder = Instance.new("Folder")
			self.vertexFolder.Name = tostring(tick()) .. ":graph"
			self.vertexFolder.Parent = Workspace
		end
		function graph:addVertex(v1)
			v1.Parent = self.vertexFolder
		end
		function graph:addVertexGroup(vs)
			local _arg0 = function(v)
				v.Parent = self.vertexFolder
			end
			-- ▼ ReadonlyArray.forEach ▼
			for _k, _v in ipairs(vs) do
				_arg0(_v, _k - 1, vs)
			end
			-- ▲ ReadonlyArray.forEach ▲
		end
		function graph:calculate()
			local function drawroom(r)
				local _arg0 = function(v, i)
					local l = Raylib.DrawLine(v.Position, (i < #r and r[i + 1 + 1] or r[1]).Position)
					l:draw(Workspace)
				end
				-- ▼ ReadonlyArray.forEach ▼
				for _k, _v in ipairs(r) do
					_arg0(_v, _k - 1, r)
				end
				-- ▲ ReadonlyArray.forEach ▲
			end
			local rooms = graphlua.calculateEdges(self.vertexFolder)
			print("proc rooms")
			local _rooms = rooms
			local _arg0 = function(v)
				print(v, "room")
				drawroom(v)
			end
			-- ▼ ReadonlyArray.forEach ▼
			for _k, _v in ipairs(_rooms) do
				_arg0(_v, _k - 1, _rooms)
			end
			-- ▲ ReadonlyArray.forEach ▲
		end
	end
	_container.graph = graph
end
return graphService
